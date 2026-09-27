require("dotenv").config();

const express = require("express");
const cors = require("cors");
const session = require("express-session");

const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const taxRoutes = require("./routes/taxroutes");
const reportRoutes = require("./routes/reportRoutes");

const app = express();

const allowedOrigins = [
  "https://team3-tax-pal-personal-finance-tax-ruby.vercel.app"
];

app.use(cors({
  origin: function (origin, callback) {

    console.log("========== CORS CHECK ==========");
    console.log("Request Origin:", origin);
    console.log("Allowed Origins:", allowedOrigins);

    if (!origin) {
      console.log("CORS: No origin - ALLOWED");
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      console.log("CORS: Origin ALLOWED:", origin);
      return callback(null, true);
    } else {
      console.log("CORS: Origin BLOCKED:", origin);
      console.log("Expected one of:", allowedOrigins);
      return callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
    sameSite: "none",   
    secure: true        
  }
}));

app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/tax", taxRoutes);
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
