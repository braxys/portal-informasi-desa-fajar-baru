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
    console.log("\nSilakan tambahkan DATABASE_URL pada file .env.local Anda:");
    console.log("DATABASE_URL=postgresql://postgres.jizgjyviioeojbbdngnv:[PASSWORD_ANDA]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres\n");
    console.log("💡 Tips: Password adalah kata sandi yang Anda tentukan saat membuat project Supabase.");
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
    console.log("⏳ Menghubungkan ke database Supabase (Frankfurt)...");
    await client.connect();
    console.log("✅ Berhasil terhubung!\n");

    const schemaPath = path.join(__dirname, "schema.sql");
    if (!fs.existsSync(schemaPath)) {
      console.error(`❌ File ${schemaPath} tidak ditemukan!`);
      process.exit(1);
    }

    console.log("🚀 Menjalankan eksekusi skema database (backend/schema.sql)...");
    const sql = fs.readFileSync(schemaPath, "utf-8");

    await client.query(sql);
    console.log("✅ Berhasil mengeksekusi schema.sql!");

    console.log("\n====================================================");
    console.log("🎉 SEMUA TABEL, RLS, & DATA AWAL BERHASIL DIBUAT!");
    console.log("====================================================\n");
  } catch (err) {
    console.error("\n❌ Terjadi kesalahan saat migrasi:", err.message);
    if (err.message?.includes("password authentication failed")) {
      console.log("👉 Pastikan password database di DATABASE_URL sudah benar.");
    }
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
