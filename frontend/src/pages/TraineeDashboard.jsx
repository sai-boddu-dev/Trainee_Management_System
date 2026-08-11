import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import apiClient from "../api/apiClient";


function TraineeDashboard() {

    const navigate = useNavigate();


    const [trainee, setTrainee] =
        useState(null);

    const [performance, setPerformance] =
        useState([]);

    const [stats, setStats] = useState({
        totalTasks: 0,
        averageScore: 0,
        highestScore: 0
    });

    const [loading, setLoading] =
        useState(true);


    // =====================================
    // GET PROFILE
    // =====================================

    const fetchProfile = async () => {

        try {

            const response =
                await apiClient.get(
                    "/api/trainee/profile",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );


            if (response.data.success) {

                setTrainee(
                    response.data.trainee
                );

            }

        } catch (error) {

            console.error(
                "Profile error:",
                error
            );


            if (
                error.response?.status === 401
            ) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                navigate("/");

            }

        }

    };


    // =====================================
    // GET PERFORMANCE
    // =====================================

    const fetchPerformance = async () => {

        try {

            const response =
                await apiClient.get(
                    "/api/trainee/performance",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );


            if (response.data.success) {

                setPerformance(
                    response.data.performance
                );

            }

        } catch (error) {

            console.error(
                "Performance error:",
                error
            );

        }

    };


    // =====================================
    // GET STATS
    // =====================================

    const fetchStats = async () => {

        try {

            const response =
                await apiClient.get(
                    "/api/trainee/stats",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );


            if (response.data.success) {

                setStats(
                    response.data.stats
                );

            }

        } catch (error) {

            console.error(
                "Stats error:",
                error
            );

        }

    };


    // =====================================
    // LOAD EVERYTHING
    // =====================================

    const loadDashboard = async () => {

        setLoading(true);


        await Promise.all([
            fetchProfile(),
            fetchPerformance(),
            fetchStats()
        ]);


        setLoading(false);

    };


    useEffect(() => {

        loadDashboard();

    }, []);


    // =====================================
    // LOGOUT
    // =====================================

    const handleLogout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        navigate("/");

    };


    // =====================================
    // LOADING
    // =====================================

    if (loading) {

        return (
            <div style={{
                padding: "50px",
                textAlign: "center",
                fontFamily: "Arial"
            }}>

                Loading your dashboard...

            </div>
        );

    }


    // =====================================
    // NO PROFILE
    // =====================================

    if (!trainee) {

        return (
            <div style={{
                padding: "50px",
                textAlign: "center"
            }}>

                Trainee profile not found.

            </div>
        );

    }


    // =====================================
    // DASHBOARD
    // =====================================

    return (

        <div style={{
            minHeight: "100vh",
            background: "#f5f7fb",
            fontFamily: "Arial"
        }}>


            {/* ================= HEADER ================= */}

            <header style={{
                background: "#ffffff",
                padding: "18px 40px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: "1px solid #e5e7eb"
            }}>


                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px"
                }}>

                    <div style={{
                        width: "45px",
                        height: "45px",
                        borderRadius: "12px",
                        background: "#6c5ce7",
                        color: "white",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold"
                    }}>
                        TM
                    </div>


                    <div>

                        <h2 style={{
                            margin: 0
                        }}>
                            Trainee Management
                        </h2>

                        <span style={{
                            color: "#777"
                        }}>
                            System
                        </span>

                    </div>

                </div>


                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "15px"
                }}>


                    <div style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "50%",
                        background: "#6c5ce7",
                        color: "white",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        fontWeight: "bold"
                    }}>

                        {
                            trainee.full_name
                                .charAt(0)
                                .toUpperCase()
                        }

                    </div>


                    <div>

                        <strong>
                            {trainee.full_name}
                        </strong>

                        <div style={{
                            color: "#777",
                            fontSize: "13px"
                        }}>
                            Trainee
                        </div>

                    </div>


                    <button
                        onClick={handleLogout}
                        style={{
                            marginLeft: "15px",
                            padding: "9px 16px",
                            border: "none",
                            borderRadius: "7px",
                            cursor: "pointer",
                            background: "#ef4444",
                            color: "white"
                        }}
                    >
                        Logout
                    </button>

                </div>

            </header>


            {/* ================= CONTENT ================= */}

            <main style={{
                padding: "35px 40px",
                maxWidth: "1400px",
                margin: "auto"
            }}>


                {/* WELCOME */}

                <div style={{
                    marginBottom: "30px"
                }}>

                    <h1 style={{
                        marginBottom: "8px"
                    }}>
                        Welcome, {trainee.full_name}! 👋
                    </h1>

                    <p style={{
                        color: "#666"
                    }}>
                        Here's your training progress
                        and performance overview.
                    </p>

                </div>


                {/* ================= STAT CARDS ================= */}

                <div style={{
                    display: "grid",
                    gridTemplateColumns:
                        "repeat(3, 1fr)",
                    gap: "20px",
                    marginBottom: "30px"
                }}>


                    {/* TOTAL TASKS */}

                    <div style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.05)"
                    }}>

                        <p style={{
                            color: "#777",
                            margin: 0
                        }}>
                            Total Tasks
                        </p>

                        <h2 style={{
                            fontSize: "30px",
                            margin: "10px 0"
                        }}>
                            {stats.totalTasks}
                        </h2>

                    </div>


                    {/* AVERAGE */}

                    <div style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.05)"
                    }}>

                        <p style={{
                            color: "#777",
                            margin: 0
                        }}>
                            Average Score
                        </p>

                        <h2 style={{
                            fontSize: "30px",
                            margin: "10px 0"
                        }}>
                            {
                                Number(
                                    stats.averageScore
                                ).toFixed(2)
                            }
                        </h2>

                    </div>


                    {/* HIGHEST */}

                    <div style={{
                        background: "white",
                        padding: "25px",
                        borderRadius: "12px",
                        boxShadow:
                            "0 2px 10px rgba(0,0,0,0.05)"
                    }}>

                        <p style={{
                            color: "#777",
                            margin: 0
                        }}>
                            Highest Score
                        </p>

                        <h2 style={{
                            fontSize: "30px",
                            margin: "10px 0"
                        }}>
                            {
                                Number(
                                    stats.highestScore
                                ).toFixed(2)
                            }
                        </h2>

                    </div>

                </div>


                {/* ================= PROFILE ================= */}

                <section style={{
                    background: "white",
                    padding: "30px",
                    borderRadius: "12px",
                    marginBottom: "30px",
                    boxShadow:
                        "0 2px 10px rgba(0,0,0,0.05)"
                }}>

                    <h2>
                        My Profile
                    </h2>


                    <div style={{
                        display: "grid",
                        gridTemplateColumns:
                            "repeat(2, 1fr)",
                        gap: "25px",
                        marginTop: "20px"
                    }}>


                        <div>
                            <strong>
                                Full Name
                            </strong>

                            <p>
                                {trainee.full_name}
                            </p>
                        </div>


                        <div>
                            <strong>
                                Username
                            </strong>

                            <p>
                                {trainee.username}
                            </p>
                        </div>


                        <div>
                            <strong>
                                Email
                            </strong>

                            <p>
                                {trainee.email}
                            </p>
                        </div>


                        <div>
                            <strong>
                                Department
                            </strong>

                            <p>
                                {trainee.department}
                            </p>
                        </div>


                        <div>
                            <strong>
                                Joining Date
                            </strong>

                            <p>
                                {
                                    new Date(
                                        trainee.joining_date
                                    ).toLocaleDateString(
                                        "en-US",
                                        {
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric"
                                        }
                                    )
                                }
                            </p>
                        </div>


                        <div>
                            <strong>
                                Status
                            </strong>

                            <p style={{
                                color:
                                    trainee.status ===
                                    "active"
                                        ? "green"
                                        : "red",
                                fontWeight: "bold"
                            }}>
                                {
                                    trainee.status
                                }
                            </p>
                        </div>

                    </div>

                </section>


                {/* ================= PERFORMANCE ================= */}

                <section style={{
                    background: "white",
                    padding: "30px",
                    borderRadius: "12px",
                    boxShadow:
                        "0 2px 10px rgba(0,0,0,0.05)"
                }}>

                    <h2>
                        My Performance
                    </h2>


                    <div style={{
                        overflowX: "auto",
                        marginTop: "20px"
                    }}>

                        <table style={{
                            width: "100%",
                            borderCollapse:
                                "collapse"
                        }}>

                            <thead>

                                <tr>

                                    <th style={{
                                        textAlign: "left",
                                        padding: "14px",
                                        borderBottom:
                                            "1px solid #ddd"
                                    }}>
                                        TASK
                                    </th>

                                    <th style={{
                                        textAlign: "left",
                                        padding: "14px",
                                        borderBottom:
                                            "1px solid #ddd"
                                    }}>
                                        SCORE
                                    </th>

                                    <th style={{
                                        textAlign: "left",
                                        padding: "14px",
                                        borderBottom:
                                            "1px solid #ddd"
                                    }}>
                                        FEEDBACK
                                    </th>

                                    <th style={{
                                        textAlign: "left",
                                        padding: "14px",
                                        borderBottom:
                                            "1px solid #ddd"
                                    }}>
                                        DATE
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {performance.length === 0 ? (

                                    <tr>

                                        <td
                                            colSpan="4"
                                            style={{
                                                textAlign:
                                                    "center",
                                                padding: "30px",
                                                color: "#777"
                                            }}
                                        >
                                            No performance
                                            records yet.
                                        </td>

                                    </tr>

                                ) : (

                                    performance.map(
                                        (item) => (

                                            <tr
                                                key={
                                                    item.id
                                                }
                                            >

                                                <td style={{
                                                    padding: "14px",
                                                    borderBottom:
                                                        "1px solid #eee"
                                                }}>
                                                    {
                                                        item.task_name
                                                    }
                                                </td>


                                                <td style={{
                                                    padding: "14px",
                                                    borderBottom:
                                                        "1px solid #eee",
                                                    fontWeight:
                                                        "bold"
                                                }}>
                                                    {
                                                        item.score
                                                    }
                                                </td>


                                                <td style={{
                                                    padding: "14px",
                                                    borderBottom:
                                                        "1px solid #eee"
                                                }}>
                                                    {
                                                        item.feedback ||
                                                        "-"
                                                    }
                                                </td>


                                                <td style={{
                                                    padding: "14px",
                                                    borderBottom:
                                                        "1px solid #eee"
                                                }}>
                                                    {
                                                        new Date(
                                                            item.date
                                                        ).toLocaleDateString(
                                                            "en-US",
                                                            {
                                                                day: "2-digit",
                                                                month: "short",
                                                                year: "numeric"
                                                            }
                                                        )
                                                    }
                                                </td>

                                            </tr>

                                        )
                                    )

                                )}

                            </tbody>

                        </table>

                    </div>

                </section>


            </main>

        </div>

    );

}


export default TraineeDashboard;