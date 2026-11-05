import { Client } from "pg";

const targetEmail = process.argv[2] || "admin@gmail.com";
const connectionString =
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.DIRECT_URL;

if (!connectionString) {
  console.error("❌ ERROR: DATABASE_URL tidak ditemukan di .env.local");
  process.exit(1);
}

const client = new Client({
  connectionString,
  ssl: { rejectUnauthorized: false },
});

async function setAdminRole() {
  console.log("====================================================");
  console.log(` Menetapkan role admin untuk: ${targetEmail}`);
  console.log("====================================================\n");

  await client.connect();

  try {
    const res = await client.query(
      `UPDATE auth.users 
       SET raw_app_meta_data = jsonb_set(coalesce(raw_app_meta_data, '{}'::jsonb), '{role}', '"admin"') 
       WHERE email = $1
       RETURNING id, email, raw_app_meta_data`,
      [targetEmail]
    );

    if (res.rowCount === 0) {
      console.warn(`⚠️ User dengan email '${targetEmail}' tidak ditemukan di tabel auth.users.`);
      console.log("Pastikan user sudah terdaftar di Supabase Auth terlebih dahulu.");
    } else {
      console.log(`✅ Berhasil! Akun '${targetEmail}' kini memiliki hak akses role: admin.`);
      console.log("Data user:", res.rows[0]);
    }
  } catch (err) {
    console.error("❌ Gagal memperbarui role admin:", err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

setAdminRole();
