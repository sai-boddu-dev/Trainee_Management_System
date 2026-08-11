const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");


// Test Route
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Auth Route Working"
    });
});

// Login Route
router.post("/login", authController.login);

module.exports = router;