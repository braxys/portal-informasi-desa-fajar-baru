import { Client } from "pg";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envLocalPath = path.join(__dirname, "..", ".env.local");
if (fs.existsSync(envLocalPath) && typeof process.loadEnvFile === "function") {
  process.loadEnvFile(envLocalPath);
}

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function clean() {
  await client.connect();

  const check = await client.query(
    "SELECT title, COUNT(*) as count FROM links GROUP BY title HAVING COUNT(*) > 1"
  );
  console.log("Data duplikat:", check.rows);

  const del = await client.query(
    `DELETE FROM links WHERE id IN (
      SELECT id FROM (
        SELECT id, ROW_NUMBER() OVER (PARTITION BY title, url ORDER BY created_at) as rn
        FROM links
      ) t WHERE t.rn > 1
    )`
  );
  console.log("Jumlah terhapus:", del.rowCount);

  const remaining = await client.query(
    "SELECT title, category, display_order FROM links ORDER BY display_order"
  );
  console.log("Sisa data:", remaining.rows);

  await client.end();
}

clean().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
