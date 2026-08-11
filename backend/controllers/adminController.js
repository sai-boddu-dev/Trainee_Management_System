const db = require("../config/db");
const bcrypt = require("bcrypt");

const addTrainee = async (req, res) => {
    try {
        const {
            username,
            password,
            full_name,
            email,
            department,
            joining_date
        } = req.body;

        if (
            !username ||
            !password ||
            !full_name ||
            !email ||
            !department ||
            !joining_date
        ) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const checkUsernameSql =
            "SELECT id FROM users WHERE username = ?";

        db.query(
            checkUsernameSql,
            [username],
            async (err, usernameResult) => {

                if (err) {
                    return res.status(500).json({
                        success: false,
                        message: "Database error",
                        error: err.message
                    });
                }

                if (usernameResult.length > 0) {
                    return res.status(409).json({
                        success: false,
                        message: "Username already exists"
                    });
                }

                const checkEmailSql =
                    "SELECT id FROM trainees WHERE email = ?";

                db.query(
                    checkEmailSql,
                    [email],
                    async (err, emailResult) => {

                        if (err) {
                            return res.status(500).json({
                                success: false,
                                message: "Database error",
                                error: err.message
                            });
                        }

                        if (emailResult.length > 0) {
                            return res.status(409).json({
                                success: false,
                                message: "Email already exists"
                            });
                        }

                        const hashedPassword =
                            await bcrypt.hash(password, 10);

                        const userSql = `
                            INSERT INTO users
                            (username, password_hash, role)
                            VALUES (?, ?, 'trainee')
                        `;

                        db.query(
                            userSql,
                            [username, hashedPassword],
                            (err, userResult) => {

                                if (err) {
                                    return res.status(500).json({
                                        success: false,
                                        message: err.message
                                    });
                                }

                                const userId =
                                    userResult.insertId;

                                const traineeSql = `
                                    INSERT INTO trainees
                                    (
                                        user_id,
                                        full_name,
                                        email,
                                        department,
                                        joining_date,
                                        status
                                    )
                                    VALUES (?, ?, ?, ?, ?, 'active')
                                `;

                                db.query(
                                    traineeSql,
                                    [
                                        userId,
                                        full_name,
                                        email,
                                        department,
                                        joining_date
                                    ],
                                    (err, traineeResult) => {

                                        if (err) {
                                            return res.status(500).json({
                                                success: false,
                                                message: err.message
                                            });
                                        }

                                        return res.status(201).json({
                                            success: true,
                                            message: "Trainee added successfully",
                                            traineeId:
                                                traineeResult.insertId
                                        });
                                    }
                                );
                            }
                        );
                    }
                );
            }
        );

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


const getTrainees = (req, res) => {

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
        ORDER BY t.id DESC
    `;

    db.query(sql, (err, results) => {

        if (err) {
            console.error("Get trainees error:", err);

            return res.status(500).json({
                success: false,
                message: "Unable to load trainees",
                error: err.message
            });
        }

        return res.json({
            success: true,
            trainees: results
        });
    });
};


const updateTrainee = (req, res) => {

    const traineeId = req.params.id;

    const {
        full_name,
        email,
        department,
        joining_date,
        status
    } = req.body;

    if (
        !full_name ||
        !email ||
        !department ||
        !joining_date ||
        !status
    ) {
        return res.status(400).json({
            success: false,
            message: "All fields are required"
        });
    }

    const sql = `
        UPDATE trainees
        SET
            full_name = ?,
            email = ?,
            department = ?,
            joining_date = ?,
            status = ?
        WHERE id = ?
    `;

    db.query(
        sql,
        [
            full_name,
            email,
            department,
            joining_date,
            status,
            traineeId
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: "Failed to update trainee",
                    error: err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Trainee not found"
                });
            }

            return res.json({
                success: true,
                message: "Trainee updated successfully"
            });
        }
    );
};


const deleteTrainee = (req, res) => {

    const traineeId = req.params.id;

    const findSql = `
        SELECT user_id
        FROM trainees
        WHERE id = ?
    `;

    db.query(
        findSql,
        [traineeId],
        (err, results) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Trainee not found"
                });
            }

            const userId = results[0].user_id;

            const deletePerformanceSql = `
                DELETE FROM performance_logs
                WHERE trainee_id = ?
            `;

            db.query(
                deletePerformanceSql,
                [traineeId],
                (err) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Unable to delete performance records",
                            error: err.message
                        });
                    }

                    const deleteTraineeSql = `
                        DELETE FROM trainees
                        WHERE id = ?
                    `;

                    db.query(
                        deleteTraineeSql,
                        [traineeId],
                        (err) => {

                            if (err) {
                                return res.status(500).json({
                                    success: false,
                                    message: err.message
                                });
                            }

                            const deleteUserSql = `
                                DELETE FROM users
                                WHERE id = ?
                            `;

                            db.query(
                                deleteUserSql,
                                [userId],
                                (err) => {

                                    if (err) {
                                        return res.status(500).json({
                                            success: false,
                                            message: err.message
                                        });
                                    }

                                    return res.json({
                                        success: true,
                                        message: "Trainee deleted successfully"
                                    });
                                }
                            );
                        }
                    );
                }
            );
        }
    );
};


const getStats = (req, res) => {

    const sql = `
        SELECT
            (
                SELECT COUNT(*)
                FROM trainees
            ) AS totalTrainees,

            (
                SELECT COUNT(*)
                FROM trainees
                WHERE status = 'active'
            ) AS activeTrainees,

            (
                SELECT COUNT(*)
                FROM trainees
                WHERE status = 'inactive'
            ) AS inactiveTrainees,

            (
                SELECT COALESCE(AVG(score), 0)
                FROM performance_logs
            ) AS averageScore
    `;

    db.query(sql, (err, results) => {

        if (err) {
            return res.status(500).json({
                success: false,
                message: "Unable to load dashboard statistics",
                error: err.message
            });
        }

        return res.json({
            success: true,
            stats: results[0]
        });
    });
};


const addPerformance = (req, res) => {

    const {
        trainee_id,
        task_name,
        score,
        feedback
    } = req.body;

    if (
        !trainee_id ||
        !task_name ||
        score === undefined ||
        score === ""
    ) {
        return res.status(400).json({
            success: false,
            message: "Trainee, task name and score are required"
        });
    }

    const numericScore = Number(score);

    if (
        Number.isNaN(numericScore) ||
        numericScore < 0 ||
        numericScore > 100
    ) {
        return res.status(400).json({
            success: false,
            message: "Score must be between 0 and 100"
        });
    }

    const traineeSql = `
        SELECT id
        FROM trainees
        WHERE id = ?
    `;

    db.query(
        traineeSql,
        [trainee_id],
        (err, traineeResults) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    message: err.message
                });
            }

            if (traineeResults.length === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Trainee not found"
                });
            }

            const sql = `
                INSERT INTO performance_logs
                (
                    trainee_id,
                    task_name,
                    score,
                    feedback
                )
                VALUES (?, ?, ?, ?)
            `;

            db.query(
                sql,
                [
                    trainee_id,
                    task_name,
                    numericScore,
                    feedback || null
                ],
                (err, result) => {

                    if (err) {
                        return res.status(500).json({
                            success: false,
                            message: "Failed to save performance",
                            error: err.message
                        });
                    }

                    return res.status(201).json({
                        success: true,
                        message: "Performance grade submitted successfully",
                        performanceId: result.insertId
                    });
                }
            );
        }
    );
};


module.exports = {
    addTrainee,
    getTrainees,
    updateTrainee,
    deleteTrainee,
    getStats,
    addPerformance
};