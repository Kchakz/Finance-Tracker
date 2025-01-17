const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

// Initialize app and database
const app = express();
const db = new Database("finance.db", { verbose: console.log });

// Middleware
app.use(cors());
app.use(express.json()); // Parse JSON body

// Initialize database table
db.prepare(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT,
    description TEXT,
    amount REAL
  )
`).run();

// Seed sample data (only if the table is empty)
const count = db.prepare("SELECT COUNT(*) AS count FROM transactions").get().count;
if (count === 0) {
  db.prepare(`
    INSERT INTO transactions (date, description, amount)
    VALUES
    ('2024-12-01', 'Salary', 2500),
    ('2024-12-03', 'Groceries', -150),
    ('2024-12-05', 'Car Repair', -400)`
  ).run();
}

// API Endpoints
app.get("/finance-data", (req, res) => {
  const transactions = db.prepare("SELECT * FROM transactions").all();
  const totalBalance = transactions.reduce((acc, t) => acc + t.amount, 0);
  const totalIncome = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + Math.abs(t.amount), 0);
  const totalSavings = totalIncome - totalExpenses;

  res.json({
    totalBalance: totalBalance.toFixed(2),
    totalIncome: totalIncome.toFixed(2),
    totalExpenses: totalExpenses.toFixed(2),
    totalSavings: totalSavings.toFixed(2),
    recentTransactions: transactions.slice(-5)
  });
});

app.post("/add-transaction", (req, res) => {
  const { date, description, amount } = req.body;
  if (!date || !description || !amount) {
    return res.status(400).json({ error: "All fields are required" });
  }

  db.prepare("INSERT INTO transactions (date, description, amount) VALUES (?, ?, ?)").run(date, description, amount);
  res.json({ success: true, message: "Transaction added successfully" });
});

// Update transaction endpoint
app.put("/update-transaction/:id", (req, res) => {
  const { id } = req.params;
  const { date, description, amount } = req.body;

  if (!date || !description || !amount) {
      return res.status(400).json({ error: "All fields are required" });
  }

  const result = db.prepare(`
      UPDATE transactions 
      SET date = ?, description = ?, amount = ? 
      WHERE id = ?
  `).run(date, description, amount, id);

  if (result.changes > 0) {
      res.json({ success: true, message: "Transaction updated successfully" });
  } else {
      res.status(404).json({ error: "Transaction not found" });
  }
});


// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
