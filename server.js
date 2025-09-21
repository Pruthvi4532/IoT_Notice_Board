// server.js
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_daQFEZW10mlg@ep-morning-cake-adfw9brb-pooler.c-2.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    // First, check if username exists
    const userResult = await pool.query(
      'SELECT * FROM "Credential" WHERE username = $1',
      [username]
    );
    if (userResult.rows.length === 0) {
      return res.json({ success: false, message: 'Username not found' });
    }
    // Now check if password matches
    const passResult = await pool.query(
      'SELECT * FROM "Credential" WHERE username = $1 AND password = $2',
      [username, password]
    );
    if (passResult.rows.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Incorrect password' });
    }
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

async function login() {
  let user = document.getElementById("username").value;
  let pass = document.getElementById("password").value;
  const response = await fetch('http://localhost:3001/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: user, password: pass })
  });
  const data = await response.json();
  if (data.success) {
    document.getElementById("loginCard").classList.add("hidden");
    document.getElementById("noticeCard").classList.remove("hidden");
    loadHistory(false);
  } else {
    alert(data.message || "Invalid Credentials!");
  }
}