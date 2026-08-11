const jwt = require("jsonwebtoken");


// ==========================================
// AUTHENTICATE JWT TOKEN
// ==========================================

const authenticateToken = (req, res, next) => {

    const authHeader =
        req.headers.authorization;


    // Check Authorization header
    if (!authHeader) {

        return res.status(401).json({

            success: false,

            message:
                "Access token required"

        });

    }


    // Expected format:
    // Bearer TOKEN

    const parts =
        authHeader.split(" ");


    if (
        parts.length !== 2 ||
        parts[0] !== "Bearer"
    ) {

        return res.status(401).json({

            success: false,

            message:
                "Invalid authorization format"

        });

    }


    const token = parts[1];


    if (!token) {

        return res.status(401).json({

            success: false,

            message:
                "Invalid token"

        });

    }


    try {

        // Verify JWT
        const decoded =
            jwt.verify(
                token,
                process.env.JWT_SECRET
            );


        // Store decoded user information
        // so controllers can access req.user
        req.user = decoded;


        // Continue to requested route
        next();

    } catch (error) {

        console.error(
            "JWT verification error:",
            error.message
        );


        return res.status(401).json({

            success: false,

            message:
                "Invalid or expired token"

        });

    }

};


module.exports = authenticateToken;