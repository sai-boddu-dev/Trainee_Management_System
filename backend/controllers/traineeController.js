const db = require("../config/db");


// ==========================================
// GET LOGGED-IN TRAINEE PROFILE
// ==========================================

const getProfile = (req, res) => {

    const userId = req.user.id;

    const sql = `
        SELECT
            t.id,
            t.user_id,
            t.full_name,
            t.email,
            t.department,
            t.joining_date,
            t.status,
            t.created_at,
            u.username
        FROM trainees t
        INNER JOIN users u
            ON t.user_id = u.id
        WHERE t.user_id = ?
    `;

    db.query(
        sql,
        [userId],
        (err, results) => {

            if (err) {

                console.error(
                    "Get profile error:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Unable to load profile",

                    error:
                        err.message

                });

            }


            if (results.length === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Trainee profile not found"

                });

            }


            return res.json({

                success: true,

                trainee: results[0]

            });

        }
    );

};


// ==========================================
// GET LOGGED-IN TRAINEE PERFORMANCE
// ==========================================

const getPerformance = (req, res) => {

    const userId = req.user.id;


    // First find trainee ID
    const traineeSql = `
        SELECT id
        FROM trainees
        WHERE user_id = ?
    `;


    db.query(
        traineeSql,
        [userId],
        (err, traineeResults) => {

            if (err) {

                console.error(
                    "Find trainee error:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Database error",

                    error:
                        err.message

                });

            }


            if (traineeResults.length === 0) {

                return res.status(404).json({

                    success: false,

                    message:
                        "Trainee not found"

                });

            }


            const traineeId =
                traineeResults[0].id;


            // Get performance records
            const performanceSql = `
                SELECT
                    id,
                    task_name,
                    score,
                    feedback,
                    date
                FROM performance_logs
                WHERE trainee_id = ?
                ORDER BY date DESC, id DESC
            `;


            db.query(
                performanceSql,
                [traineeId],
                (err, results) => {

                    if (err) {

                        console.error(
                            "Get performance error:",
                            err
                        );

                        return res.status(500).json({

                            success: false,

                            message:
                                "Failed to fetch performance",

                            error:
                                err.message

                        });

                    }


                    return res.json({

                        success: true,

                        performance: results

                    });

                }
            );

        }
    );

};


// ==========================================
// GET TRAINEE STATISTICS
// ==========================================

const getStats = (req, res) => {

    const userId = req.user.id;


    const sql = `
        SELECT
            COUNT(p.id) AS totalTasks,
            COALESCE(AVG(p.score), 0) AS averageScore,
            COALESCE(MAX(p.score), 0) AS highestScore
        FROM trainees t
        LEFT JOIN performance_logs p
            ON t.id = p.trainee_id
        WHERE t.user_id = ?
    `;


    db.query(
        sql,
        [userId],
        (err, results) => {

            if (err) {

                console.error(
                    "Get trainee stats error:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Failed to fetch statistics",

                    error:
                        err.message

                });

            }


            return res.json({

                success: true,

                stats: {

                    totalTasks:
                        Number(
                            results[0].totalTasks
                        ),

                    averageScore:
                        Number(
                            results[0].averageScore
                        ),

                    highestScore:
                        Number(
                            results[0].highestScore
                        )

                }

            });

        }
    );

};


// ==========================================
// EXPORT
// ==========================================

module.exports = {

    getProfile,
    getPerformance,
    getStats

};