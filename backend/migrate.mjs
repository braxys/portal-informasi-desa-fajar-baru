import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// 1. Muat environment variable dari .env.local
const envLocalPath = path.join(projectRoot, ".env.local");
if (fs.existsSync(envLocalPath) && typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(envLocalPath);
  } catch (err) {
    console.warn("Peringatan saat membaca .env.local:", err.message);
  }
}

const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DIRECT_URL;

async function runMigration() {
  console.log("====================================================");
  console.log("   MIGRASI DATABASE SUPABASE: PORTAL FAJAR BARU     ");
  console.log("====================================================\n");

  if (!connectionString) {
    console.error("❌ ERROR: DATABASE_URL tidak ditemukan!");
    console.log("\nSilakan tambahkan DATABASE_URL pada file .env.local Anda.");
    process.exit(1);
  }

  let pgModule;
  try {
    pgModule = await import("pg");
  } catch {
    console.error("❌ Package 'pg' belum terinstal.");
    console.log("Jalankan: npm install -D pg");
    process.exit(1);
  }

  const { Client } = pgModule.default || pgModule;
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    console.log("⏳ Menghubungkan ke database Supabase...");
    await client.connect();
    console.log("✅ Berhasil terhubung!\n");

    // Baca semua file SQL dari folder migrations
    const migrationsDir = path.join(__dirname, "migrations");
    if (!fs.existsSync(migrationsDir)) {
      console.error(`❌ Folder ${migrationsDir} tidak ditemukan!`);
      process.exit(1);
    }

    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort(); // Urutkan berdasarkan nama (001, 002, dst)

    if (migrationFiles.length === 0) {
      console.error("❌ Tidak ada file SQL di folder migrations!");
      process.exit(1);
    }

    console.log(`📋 Ditemukan ${migrationFiles.length} file migrasi:\n`);

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      console.log(`🚀 Menjalankan: ${file}...`);

      try {
        await client.query(sql);
        console.log(`   ✅ Berhasil!\n`);
      } catch (err) {
        console.error(`   ❌ Gagal: ${err.message}\n`);
        // Lanjut ke file berikutnya (beberapa error mungkin karena sudah ada)
      }
    }

    console.log("====================================================");
    console.log("🎉 SEMIGRASI SELESAI!");
    console.log("====================================================\n");
  } catch (err) {
    console.error("\n❌ Terjadi kesalahan:", err.message);
    if (err.message?.includes("password authentication failed")) {
      console.log("👉 Pastikan password database di DATABASE_URL sudah benar.");
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
