import { useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";

function LoginPage() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    // NEW: Role state
    const [role, setRole] = useState("trainee");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);


    // ==========================================
    // LOGIN
    // ==========================================

    const handleLogin = async (e) => {

        e.preventDefault();

        setMessage("");


        if (!username.trim() || !password.trim()) {

            setMessage(
                "Please enter username and password"
            );

            return;
        }


        try {

            setLoading(true);


         const response = await apiClient.post(
    "/api/auth/login",
    {
        username: username.trim(),
        password: password,
        role: role
    }
);

            if (response.data.success) {

                const user =
                    response.data.user;

                const token =
                    response.data.token;


                // ==========================================
                // SAVE LOGIN INFORMATION
                // ==========================================

                localStorage.setItem(
                    "token",
                    token
                );

                localStorage.setItem(
                    "user",
                    JSON.stringify(user)
                );


                console.log(
                    "Login successful:",
                    user
                );


                setMessage(
                    "Login Successful!"
                );


                // ==========================================
                // ROLE-BASED REDIRECT
                // ==========================================

                if (user.role === "admin") {

                    navigate("/admin");

                } else if (
                    user.role === "trainee"
                ) {

                    navigate("/trainee");

                } else {

                    setMessage(
                        "Invalid user role"
                    );

                    localStorage.removeItem(
                        "token"
                    );

                    localStorage.removeItem(
                        "user"
                    );

                }

            } else {

                setMessage(
                    response.data.message ||
                    "Login failed"
                );

            }

        } catch (error) {

            console.error(
                "Login error:",
                error
            );


            if (error.response) {

                setMessage(
                    error.response.data?.message ||
                    "Invalid username or password"
                );

            } else if (error.request) {

                setMessage(
                    "Cannot connect to backend. Please make sure the server is running."
                );

            } else {

                setMessage(
                    "Login failed. Please try again."
                );

            }

        } finally {

            setLoading(false);

        }

    };


    return (

        <div className="login-page">

            <div className="login-container">


                {/* ==========================================
                    LOGO
                ========================================== */}

                <div className="logo">
                    TM
                </div>


                {/* ==========================================
                    TITLE
                ========================================== */}

                <h1>
                    Trainee Management System
                </h1>


                <p className="subtitle">
                    Sign in to access your dashboard
                </p>


                {/* ==========================================
                    LOGIN FORM
                ========================================== */}

                <form
                    onSubmit={handleLogin}
                >


                    {/* ==========================================
                        USERNAME
                    ========================================== */}

                    <label htmlFor="username">
                        Username
                    </label>

                    <input
                        id="username"
                        type="text"
                        placeholder="Enter your username"
                        value={username}
                        onChange={(e) =>
                            setUsername(e.target.value)
                        }
                        autoComplete="username"
                        disabled={loading}
                    />


                    {/* ==========================================
                        PASSWORD
                    ========================================== */}

                    <label htmlFor="password">
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) =>
                            setPassword(e.target.value)
                        }
                        autoComplete="current-password"
                        disabled={loading}
                    />


                    {/* ==========================================
                        LOGIN AS
                    ========================================== */}

                    <label htmlFor="role">
                        Login as
                    </label>

                    <select
                        id="role"
                        value={role}
                        onChange={(e) =>
                            setRole(e.target.value)
                        }
                        disabled={loading}
                    >

                        <option value="trainee">
                            Trainee
                        </option>

                        <option value="admin">
                            Admin
                        </option>

                    </select>


                    {/* ==========================================
                        LOGIN BUTTON
                    ========================================== */}

                    <button
                        type="submit"
                        disabled={loading}
                    >

                        {loading
                            ? "Signing In..."
                            : "Sign In"
                        }

                    </button>

                </form>


                {/* ==========================================
                    MESSAGE
                ========================================== */}

                {message && (

                    <p className="message">
                        {message}
                    </p>

                )}


                {/* ==========================================
                    FOOTER
                ========================================== */}

                <p className="footer-text">
                    Contact your administrator if you
                    need account access.
                </p>

            </div>

        </div>

    );

}

export default LoginPage;