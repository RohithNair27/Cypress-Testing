const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const db = require("../db");

/* ─── Helpers ───────────────────────────────────────────────── */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/* ─── POST /api/auth/login ──────────────────────────────────── */
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required." });
  }

  db.get(
    "SELECT * FROM users WHERE email = ?",
    [email.toLowerCase()],
    async (err, user) => {
      if (err) {
        console.error("[login] DB error:", err.message);
        return res.status(500).json({ error: "Internal server error." });
      }
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return res.status(401).json({ error: "Invalid email or password." });
      }

      return res.status(200).json({
        message: "Login successful.",
        user: { id: user.id, email: user.email, createdAt: user.created_at },
      });
    },
  );
});

module.exports = router;
