import { Client } from "pg";

const args = process.argv.slice(2);
if (args.some((arg) => arg !== "--apply") || args.length > 1) {
  throw new Error("Usage: node backend/clean-duplicates.mjs [--apply]");
}

const applyChanges = args.includes("--apply");
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DIRECT_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL tidak ditemukan. Tambahkan ke file .env.local.");
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: true },
});

async function cleanDuplicates() {
  await client.connect();

  try {
    if (!applyChanges) {
      const { rows } = await client.query(`
        SELECT title, url, COUNT(*)::integer AS count
        FROM public.links
        GROUP BY title, url
        HAVING COUNT(*) > 1
        ORDER BY title, url
      `);

      console.log("Duplikat tautan yang ditemukan:", rows);
      console.log(
        "Mode pemeriksaan saja. Tinjau hasilnya; gunakan --apply untuk menghapus duplikat.",
      );
      return;
    }

    await client.query("BEGIN");
    await client.query(
      "LOCK TABLE public.links, public.traffic_logs IN SHARE ROW EXCLUSIVE MODE",
    );
    await client.query(`
      WITH ranked_links AS (
        SELECT
          id,
          FIRST_VALUE(id) OVER (
            PARTITION BY title, url
            ORDER BY created_at, id
          ) AS retained_id,
          ROW_NUMBER() OVER (
            PARTITION BY title, url
            ORDER BY created_at, id
          ) AS duplicate_number
        FROM public.links
      )
      UPDATE public.traffic_logs AS logs
      SET link_id = ranked_links.retained_id
      FROM ranked_links
      WHERE ranked_links.duplicate_number > 1
        AND logs.link_id = ranked_links.id
    `);

    const { rowCount } = await client.query(`
      WITH ranked_links AS (
        SELECT
          id,
          ROW_NUMBER() OVER (
            PARTITION BY title, url
            ORDER BY created_at, id
          ) AS duplicate_number
        FROM public.links
      )
      DELETE FROM public.links AS links
      USING ranked_links
      WHERE links.id = ranked_links.id
        AND ranked_links.duplicate_number > 1
    `);

    await client.query("COMMIT");
    console.log(`Duplikat tautan dihapus: ${rowCount}. Log tetap tertaut.`);
  } catch (error) {
    try {
      await client.query("ROLLBACK");
    } catch (rollbackError) {
      throw new AggregateError(
        [error, rollbackError],
        "Pembersihan duplikat gagal dan transaksi tidak dapat di-rollback.",
      );
    }
    throw error;
  } finally {
    await client.end();
  }
}

cleanDuplicates().catch((error) => {
  console.error("Pembersihan duplikat gagal:", error);
  process.exitCode = 1;
});
