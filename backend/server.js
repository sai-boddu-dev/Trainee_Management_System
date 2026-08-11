console.log("Server file started");

require("dotenv").config({
    path: __dirname + "/.env"
});

console.log("DB_HOST:", process.env.DB_HOST);
console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASSWORD:", process.env.DB_PASSWORD ? "Loaded" : "Not Loaded");
console.log("DB_NAME:", process.env.DB_NAME);

const express = require("express");
const cors = require("cors");

const db = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const traineeRoutes =
    require("./routes/traineeRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use(
    "/api/trainee",
    traineeRoutes
);

// Home Route
app.get("/", (req, res) => {
    res.send("Trainee Management System Backend Running...");
});

// Database Test Route
app.get("/db-test", (req, res) => {

    db.query("SELECT 1", (err) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Database Connection Failed"
            });
        }

        res.json({
            success: true,
            message: "Database Connected Successfully"
        });

    });

});

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});