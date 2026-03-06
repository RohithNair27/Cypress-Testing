const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');

// Initialise DB (runs CREATE TABLE IF NOT EXISTS on startup)
require('./db');

const app = express();
const PORT = process.env.PORT || 4001;

/* ─── Middleware ────────────────────────────────────────────── */

app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174','http://localhost:5175'],
  methods: ['GET', 'POST'],
}));

app.use(express.json());

/* ─── Routes ────────────────────────────────────────────────── */

app.use('/api/auth', authRoutes);

// Health check
app.get('/api/health', (_, res) => res.json({ status: 'ok' }));

/* ─── Start ─────────────────────────────────────────────────── */

app.listen(PORT, () => {
  console.log(`🚀 Backend running at http://localhost:${PORT}`);
});
