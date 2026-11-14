import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DIRECT_URL;

async function runMigration() {
  console.log("====================================================");
  console.log("   MIGRASI DATABASE SUPABASE: PORTAL FAJAR BARU     ");
  console.log("====================================================\n");

  if (!connectionString) {
    throw new Error("DATABASE_URL tidak ditemukan. Tambahkan ke file .env.local.");
  }

  let pgModule;
  try {
    pgModule = await import("pg");
  } catch (error) {
    throw new Error("Package 'pg' belum terinstal. Jalankan: npm install -D pg.", {
      cause: error,
    });
  }

  const { Client } = pgModule.default || pgModule;
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });
  let connected = false;

  try {
    console.log("⏳ Menghubungkan ke database Supabase...");
    await client.connect();
    connected = true;
    console.log("✅ Berhasil terhubung!\n");

    const migrationsDir = path.join(__dirname, "migrations");
    if (!fs.existsSync(migrationsDir)) {
      throw new Error(`Folder ${migrationsDir} tidak ditemukan.`);
    }

    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    if (migrationFiles.length === 0) {
      throw new Error("Tidak ada file SQL di folder migrations.");
    }

    console.log(`📋 Ditemukan ${migrationFiles.length} file migrasi:\n`);

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      console.log(`🚀 Menjalankan: ${file}...`);

      try {
        await client.query("BEGIN");
        await client.query(sql);
        await client.query("COMMIT");
        console.log("   ✅ Berhasil!\n");
      } catch (error) {
        try {
          await client.query("ROLLBACK");
        } catch (rollbackError) {
          throw new AggregateError(
            [error, rollbackError],
            `Migrasi ${file} gagal dan transaksi tidak dapat di-rollback.`,
          );
        }

        throw new Error(`Migrasi ${file} gagal.`, { cause: error });
      }
    }

    console.log("====================================================");
    console.log("🎉 SEMIGRASI SELESAI!");
    console.log("====================================================\n");
  } finally {
    if (connected) {
      await client.end();
    }
  }
}

runMigration().catch((error) => {
  console.error("\n❌ Migrasi gagal:", error);
  process.exitCode = 1;
});
