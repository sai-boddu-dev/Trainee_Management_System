const express = require("express");

const router = express.Router();

const adminController =
    require("../controllers/adminController");


// ==========================================
// ADD TRAINEE
// POST /api/admin/trainees
// ==========================================

router.post(
    "/trainees",
    adminController.addTrainee
);


// ==========================================
// GET ALL TRAINEES
// GET /api/admin/trainees
// ==========================================

router.get(
    "/trainees",
    adminController.getTrainees
);


// ==========================================
// UPDATE TRAINEE
// PUT /api/admin/trainees/:id
// ==========================================

router.put(
    "/trainees/:id",
    adminController.updateTrainee
);


// ==========================================
// DELETE TRAINEE
// DELETE /api/admin/trainees/:id
// ==========================================

router.delete(
    "/trainees/:id",
    adminController.deleteTrainee
);


// ==========================================
// ADMIN DASHBOARD STATISTICS
// GET /api/admin/stats
// ==========================================

router.get(
    "/stats",
    adminController.getStats
);


// ==========================================
// ADD PERFORMANCE
// POST /api/admin/performance
// ==========================================

router.post(
    "/performance",
    adminController.addPerformance
);


module.exports = router;