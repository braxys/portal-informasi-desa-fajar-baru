import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

<<<<<<< HEAD
// 1. Muat environment variable dari .env.local
const envLocalPath = path.join(projectRoot, ".env.local");
if (fs.existsSync(envLocalPath) && typeof process.loadEnvFile === "function") {
  try {
    process.loadEnvFile(envLocalPath);
  } catch (err) {
    console.warn("Peringatan saat membaca .env.local:", err.message);
  }
}

=======
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DIRECT_URL;

async function runMigration() {
  console.log("====================================================");
  console.log("   MIGRASI DATABASE SUPABASE: PORTAL FAJAR BARU     ");
  console.log("====================================================\n");

  if (!connectionString) {
<<<<<<< HEAD
    console.error("❌ ERROR: DATABASE_URL tidak ditemukan!");
    console.log("\nSilakan tambahkan DATABASE_URL pada file .env.local Anda.");
    process.exit(1);
=======
    throw new Error("DATABASE_URL tidak ditemukan. Tambahkan ke file .env.local.");
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
  }

  let pgModule;
  try {
    pgModule = await import("pg");
<<<<<<< HEAD
  } catch {
    console.error("❌ Package 'pg' belum terinstal.");
    console.log("Jalankan: npm install -D pg");
    process.exit(1);
=======
  } catch (error) {
    throw new Error("Package 'pg' belum terinstal. Jalankan: npm install -D pg.", {
      cause: error,
    });
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
  }

  const { Client } = pgModule.default || pgModule;
  const client = new Client({
    connectionString,
<<<<<<< HEAD
    ssl: { rejectUnauthorized: false },
  });
=======
    ssl: { rejectUnauthorized: true },
  });
  let connected = false;
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692

  try {
    console.log("⏳ Menghubungkan ke database Supabase...");
    await client.connect();
<<<<<<< HEAD
    console.log("✅ Berhasil terhubung!\n");

    // Baca semua file SQL dari folder migrations
    const migrationsDir = path.join(__dirname, "migrations");
    if (!fs.existsSync(migrationsDir)) {
      console.error(`❌ Folder ${migrationsDir} tidak ditemukan!`);
      process.exit(1);
=======
    connected = true;
    console.log("✅ Berhasil terhubung!\n");

    const migrationsDir = path.join(__dirname, "migrations");
    if (!fs.existsSync(migrationsDir)) {
      throw new Error(`Folder ${migrationsDir} tidak ditemukan.`);
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
    }

    const migrationFiles = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
<<<<<<< HEAD
      .sort(); // Urutkan berdasarkan nama (001, 002, dst)

    if (migrationFiles.length === 0) {
      console.error("❌ Tidak ada file SQL di folder migrations!");
      process.exit(1);
=======
      .sort();

    if (migrationFiles.length === 0) {
      throw new Error("Tidak ada file SQL di folder migrations.");
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
    }

    console.log(`📋 Ditemukan ${migrationFiles.length} file migrasi:\n`);

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf-8");

      console.log(`🚀 Menjalankan: ${file}...`);

      try {
<<<<<<< HEAD
        await client.query(sql);
        console.log(`   ✅ Berhasil!\n`);
      } catch (err) {
        console.error(`   ❌ Gagal: ${err.message}\n`);
        // Lanjut ke file berikutnya (beberapa error mungkin karena sudah ada)
=======
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
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
      }
    }

    console.log("====================================================");
    console.log("🎉 SEMIGRASI SELESAI!");
    console.log("====================================================\n");
<<<<<<< HEAD
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
=======
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
>>>>>>> 637b5e9a5f8666de6ef3342f5e11b6f08d3ff692
