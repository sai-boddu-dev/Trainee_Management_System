const db = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// ==========================================
// LOGIN
// ==========================================

exports.login = (req, res) => {

    const {
        username,
        password
    } = req.body;


    // Validate input
    if (!username || !password) {

        return res.status(400).json({

            success: false,

            message:
                "Username and Password are required"

        });

    }


    // Find user
    const sql =
        "SELECT * FROM users WHERE username = ?";


    db.query(
        sql,
        [username],
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


            // User doesn't exist
            if (result.length === 0) {

                return res.status(401).json({

                    success: false,

                    message:
                        "Invalid Username"

                });

            }


            const user = result[0];


            // Compare password
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


                // Create JWT
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


                // Send response
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