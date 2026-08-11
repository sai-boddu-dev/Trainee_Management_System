const express = require("express");

const router = express.Router();

const traineeController = require("../controllers/traineeController");

const authenticateToken = require("../middleware/authMiddleware");


// ==========================================
// TRAINEE PROFILE
// GET /api/trainee/profile
// ==========================================

router.get(
    "/profile",
    authenticateToken,
    traineeController.getProfile
);


// ==========================================
// TRAINEE PERFORMANCE
// GET /api/trainee/performance
// ==========================================

router.get(
    "/performance",
    authenticateToken,
    traineeController.getPerformance
);


// ==========================================
// TRAINEE STATISTICS
// GET /api/trainee/stats
// ==========================================

router.get(
    "/stats",
    authenticateToken,
    traineeController.getStats
);


module.exports = router;