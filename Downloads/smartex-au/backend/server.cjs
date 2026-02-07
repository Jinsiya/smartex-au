require("dotenv").config({ path: __dirname + "/.env" });
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
console.log("ENV CHECK:", process.env.DATABASE_URL);


// ---- DB ----
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL missing");
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false
});

// ---- GMAIL ----
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  },
  family: 4,
  connectionTimeout: 15000
});

transporter.verify((err) => {
  if (err) console.log("❌ Mail Error:", err.message);
  else console.log("📧 Gmail is ready to send codes");
});

// ---- REGISTER OTP ----
app.post("/api/auth/register-otp", async (req, res) => {
  const { identifier } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await pool.query(
      `INSERT INTO otp_codes (identifier, code)
       VALUES ($1, $2)
       ON CONFLICT (identifier)
       DO UPDATE SET code = $2`,
      [identifier, otp]
    );

    await transporter.sendMail({
      from: `"Smartex AU" <${process.env.GMAIL_USER}>`,
      to: identifier,
      subject: "Verification Code",
      html: `<h3>Your code is: <b style="color:#2563eb;">${otp}</b></h3>`
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "OTP failed" });
  }
});

// ---- LOGIN ----
app.post("/api/auth/login", async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const r = await pool.query(
      "SELECT * FROM users WHERE email = $1 OR full_name = $1",
      [identifier]
    );

    if (!r.rows.length) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, r.rows[0].password);
    if (!isMatch) return res.status(401).json({ error: "Wrong password" });

    const user = r.rows[0];
    delete user.password;

    res.json({ user });
  } catch {
    res.status(500).json({ error: "Login failed" });
  }
});

// ---- REGISTER FINAL ----
app.post("/api/auth/register-finalize", async (req, res) => {
  const { identifier, code, password, fullName } = req.body;

  try {
    const check = await pool.query(
      "SELECT * FROM otp_codes WHERE identifier=$1 AND code=$2",
      [identifier, code]
    );

    if (!check.rows.length)
      return res.status(400).json({ error: "Invalid OTP" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await pool.query(
      `INSERT INTO users (full_name, email, password, department, total_study_time)
       VALUES ($1,$2,$3,'AI & Data Science',0)
       RETURNING id, full_name, email, department`,
      [fullName, identifier, hashed]
    );

    res.json({ user: user.rows[0] });
  } catch {
    res.status(500).json({ error: "Registration failed" });
  }
});

// ---- SUBJECTS ----
app.get("/api/subjects/search", async (req, res) => {
  const r = await pool.query(
    "SELECT * FROM subjects WHERE title ILIKE $1 OR subject_code ILIKE $1",
    [`%${req.query.q}%`]
  );
  res.json(r.rows);
});

app.get("/api/subjects/:id/units", async (req, res) => {
  const r = await pool.query(
    "SELECT * FROM units WHERE subject_id=$1 ORDER BY unit_number",
    [req.params.id]
  );
  res.json(r.rows);
});

app.get("/api/subjects/semester/:sem", async (req, res) => {
  const r = await pool.query(
    "SELECT * FROM subjects WHERE semester=$1 ORDER BY title",
    [req.params.sem]
  );
  res.json(r.rows);
});

// ---- HISTORY ----
app.post("/api/history", async (req, res) => {
  await pool.query(
    `INSERT INTO user_history (user_id, subject_id, opened_at)
     VALUES ($1,$2,NOW())
     ON CONFLICT (user_id,subject_id)
     DO UPDATE SET opened_at=NOW()`,
    [req.body.userId, req.body.subjectId]
  );
  res.json({ success: true });
});

app.get("/api/history/:userId", async (req, res) => {
  const r = await pool.query(
    `SELECT s.*
     FROM subjects s
     JOIN user_history h ON s.id=h.subject_id
     WHERE h.user_id=$1
     ORDER BY h.opened_at DESC LIMIT 4`,
    [req.params.userId]
  );
  res.json(r.rows);
});

// ---- SERVER ----
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on port ${PORT}`)
);
