const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ==========================================
// LOGIN
// ==========================================

exports.login = (req, res) => {

    const {
        username,
        password,
        role
    } = req.body;


    // ==========================================
    // VALIDATE INPUT
    // ==========================================

    if (!username || !password || !role) {

        return res.status(400).json({

            success: false,

            message:
                "Username, Password and Role are required"

        });

    }


    // ==========================================
    // FIND USER WITH SELECTED ROLE
    // ==========================================

    const sql =
        "SELECT * FROM users WHERE username = ? AND role = ?";


    db.query(
        sql,
        [username, role],
        async (err, result) => {

            if (err) {

                console.error(
                    "Login database error:",
                    err
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Database Error"

                });

            }


            // ==========================================
            // USER DOESN'T EXIST
            // ==========================================

            if (result.length === 0) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid username or role"

                });

            }


            const user = result[0];


            // ==========================================
            // COMPARE PASSWORD
            // ==========================================

            try {

                const match =
                    await bcrypt.compare(
                        password,
                        user.password_hash
                    );


                if (!match) {

                    return res.status(401).json({

                        success: false,

                        message:
                            "Invalid Password"

                    });

                }


                // ==========================================
                // CREATE JWT
                // ==========================================

                const token =
                    jwt.sign(

                        {
                            id: user.id,
                            username: user.username,
                            role: user.role
                        },

                        process.env.JWT_SECRET,

                        {
                            expiresIn: "1d"
                        }

                    );


                // ==========================================
                // SEND RESPONSE
                // ==========================================

                return res.json({

                    success: true,

                    message:
                        "Login Successful",

                    token,

                    user: {

                        id: user.id,

                        username:
                            user.username,

                        role:
                            user.role

                    }

                });

            } catch (error) {

                console.error(
                    "Password verification error:",
                    error
                );

                return res.status(500).json({

                    success: false,

                    message:
                        "Authentication failed"

                });

            }

        }
    );

};