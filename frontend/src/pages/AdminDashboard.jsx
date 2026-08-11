import { useEffect, useState } from "react";
import apiClient from "../api/apiClient";
import "../styles/AdminDashboard.css";

function AdminDashboard() {

    const [trainees, setTrainees] = useState([]);

    const [stats, setStats] = useState({
        totalTrainees: 0,
        activeTrainees: 0,
        inactiveTrainees: 0,
        averageScore: 0
    });

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    // ==============================
    // ADD / EDIT FORM
    // ==============================

    const [showForm, setShowForm] = useState(false);

    const [editingId, setEditingId] = useState(null);

    const [formData, setFormData] = useState({
        username: "",
        password: "",
        full_name: "",
        email: "",
        department: "",
        joining_date: "",
        status: "active"
    });

    // ==============================
    // PERFORMANCE FORM
    // ==============================

    const [performanceData, setPerformanceData] = useState({
        trainee_id: "",
        task_name: "",
        score: "",
        feedback: ""
    });

    // ==============================
    // LOAD DASHBOARD
    // ==============================

    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const [traineeResponse, statsResponse] =
                await Promise.all([
                    apiClient.get("/api/admin/trainees"),
                    apiClient.get("/api/admin/stats")
                ]);

            setTrainees(
                traineeResponse.data.trainees || []
            );

            setStats(
                statsResponse.data.stats || {
                    totalTrainees: 0,
                    activeTrainees: 0,
                    inactiveTrainees: 0,
                    averageScore: 0
                }
            );

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to load dashboard"
            );

        } finally {

            setLoading(false);

        }
    };


    // ==============================
    // PAGE LOAD
    // ==============================

    useEffect(() => {

        loadDashboard();

    }, []);


    // ==============================
    // FORM INPUT
    // ==============================

    const handleInputChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // ==============================
    // PERFORMANCE INPUT
    // ==============================

    const handlePerformanceChange = (e) => {

        const {
            name,
            value
        } = e.target;

        setPerformanceData((previous) => ({
            ...previous,
            [name]: value
        }));

    };


    // ==============================
    // OPEN ADD FORM
    // ==============================

    const openAddForm = () => {

        setEditingId(null);

        setFormData({
            username: "",
            password: "",
            full_name: "",
            email: "",
            department: "",
            joining_date: "",
            status: "active"
        });

        setMessage("");
        setError("");

        setShowForm(true);
    };


    // ==============================
    // OPEN EDIT FORM
    // ==============================

    const openEditForm = (trainee) => {

        setEditingId(trainee.id);

        setFormData({
            username: trainee.username || "",
            password: "",
            full_name: trainee.full_name || "",
            email: trainee.email || "",
            department: trainee.department || "",
            joining_date:
                trainee.joining_date
                    ? trainee.joining_date
                        .toString()
                        .substring(0, 10)
                    : "",
            status: trainee.status || "active"
        });

        setMessage("");
        setError("");

        setShowForm(true);
    };


    // ==============================
    // CLOSE FORM
    // ==============================

    const closeForm = () => {

        setShowForm(false);
        setEditingId(null);

        setFormData({
            username: "",
            password: "",
            full_name: "",
            email: "",
            department: "",
            joining_date: "",
            status: "active"
        });

    };


    // ==============================
    // ADD / UPDATE TRAINEE
    // ==============================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setMessage("");
            setError("");

            if (editingId) {

                await apiClient.put(
                    `/api/admin/trainees/${editingId}`,
                    {
                        full_name:
                            formData.full_name,

                        email:
                            formData.email,

                        department:
                            formData.department,

                        joining_date:
                            formData.joining_date,

                        status:
                            formData.status
                    }
                );

                setMessage(
                    "Trainee updated successfully"
                );

            } else {

                await apiClient.post(
                    "/api/admin/trainees",
                    {
                        username:
                            formData.username,

                        password:
                            formData.password,

                        full_name:
                            formData.full_name,

                        email:
                            formData.email,

                        department:
                            formData.department,

                        joining_date:
                            formData.joining_date
                    }
                );

                setMessage(
                    "Trainee added successfully"
                );
            }

            closeForm();

            await loadDashboard();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Operation failed"
            );

        }

    };


    // ==============================
    // DELETE TRAINEE
    // ==============================

    const handleDelete = async (id) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this trainee?"
            );

        if (!confirmed) {
            return;
        }

        try {

            setMessage("");
            setError("");

            await apiClient.delete(
                `/api/admin/trainees/${id}`
            );

            setMessage(
                "Trainee deleted successfully"
            );

            await loadDashboard();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to delete trainee"
            );

        }

    };


    // ==============================
    // ADD PERFORMANCE
    // ==============================

    const handlePerformanceSubmit = async (e) => {

        e.preventDefault();

        try {

            setMessage("");
            setError("");

            await apiClient.post(
                "/api/admin/performance",
                {
                    trainee_id:
                        performanceData.trainee_id,

                    task_name:
                        performanceData.task_name,

                    score:
                        Number(performanceData.score),

                    feedback:
                        performanceData.feedback
                }
            );

            setMessage(
                "Performance grade submitted successfully"
            );

            setPerformanceData({
                trainee_id: "",
                task_name: "",
                score: "",
                feedback: ""
            });

            await loadDashboard();

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Unable to submit performance"
            );

        }

    };


    // ==============================
    // LOGOUT
    // ==============================

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        window.location.href = "/login";

    };


    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (
            <div className="dashboard-container">

                <h2>
                    Loading dashboard...
                </h2>

            </div>
        );

    }


    return (

        <div className="dashboard-container">

            {/* =========================
                HEADER
            ========================= */}

            <div className="dashboard-header">

                <div>

                    <h1>
                        Admin Dashboard
                    </h1>

                    <p>
                        Manage trainees and monitor performance
                    </p>

                </div>

                <button
                    onClick={handleLogout}
                    className="logout-button"
                >
                    Logout
                </button>

            </div>


            {/* =========================
                MESSAGES
            ========================= */}

            {message && (

                <div className="success-message">

                    {message}

                </div>

            )}


            {error && (

                <div className="error-message">

                    {error}

                </div>

            )}


            {/* =========================
                STATISTICS
            ========================= */}

            <div className="stats-container">

                <div className="stat-card">

                    <h3>
                        Total Trainees
                    </h3>

                    <h2>
                        {stats.totalTrainees}
                    </h2>

                </div>


                <div className="stat-card">

                    <h3>
                        Active Trainees
                    </h3>

                    <h2>
                        {stats.activeTrainees}
                    </h2>

                </div>


                <div className="stat-card">

                    <h3>
                        Inactive Trainees
                    </h3>

                    <h2>
                        {stats.inactiveTrainees}
                    </h2>

                </div>


                <div className="stat-card">

                    <h3>
                        Average Score
                    </h3>

                    <h2>
                        {Number(
                            stats.averageScore || 0
                        ).toFixed(2)}
                    </h2>

                </div>

            </div>


            {/* =========================
                TRAINEE SECTION
            ========================= */}

            <div className="section-header">

                <div>

                    <h2>
                        Trainees
                    </h2>

                    <p>
                        Manage all registered trainees
                    </p>

                </div>


                <button
                    onClick={openAddForm}
                    className="add-button"
                >
                    + Add Trainee
                </button>

            </div>


            {/* =========================
                ADD / EDIT FORM
            ========================= */}

            {showForm && (

                <div className="form-card">

                    <h2>

                        {editingId
                            ? "Edit Trainee"
                            : "Add New Trainee"}

                    </h2>


                    <form
                        onSubmit={handleSubmit}
                    >

                        {!editingId && (

                            <>
                                <label>
                                    Username
                                </label>

                                <input
                                    type="text"
                                    name="username"
                                    value={
                                        formData.username
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    required
                                />


                                <label>
                                    Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    value={
                                        formData.password
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                    required
                                />
                            </>

                        )}


                        <label>
                            Full Name
                        </label>

                        <input
                            type="text"
                            name="full_name"
                            value={
                                formData.full_name
                            }
                            onChange={
                                handleInputChange
                            }
                            required
                        />


                        <label>
                            Email
                        </label>

                        <input
                            type="email"
                            name="email"
                            value={
                                formData.email
                            }
                            onChange={
                                handleInputChange
                            }
                            required
                        />


                        <label>
                            Department
                        </label>

                        <input
                            type="text"
                            name="department"
                            value={
                                formData.department
                            }
                            onChange={
                                handleInputChange
                            }
                            required
                        />


                        <label>
                            Joining Date
                        </label>

                        <input
                            type="date"
                            name="joining_date"
                            value={
                                formData.joining_date
                            }
                            onChange={
                                handleInputChange
                            }
                            required
                        />


                        {editingId && (

                            <>
                                <label>
                                    Status
                                </label>

                                <select
                                    name="status"
                                    value={
                                        formData.status
                                    }
                                    onChange={
                                        handleInputChange
                                    }
                                >

                                    <option value="active">
                                        Active
                                    </option>

                                    <option value="inactive">
                                        Inactive
                                    </option>

                                </select>
                            </>

                        )}


                        <div className="form-buttons">

                            <button
                                type="submit"
                                className="save-button"
                            >

                                {editingId
                                    ? "Update Trainee"
                                    : "Add Trainee"}

                            </button>


                            <button
                                type="button"
                                onClick={closeForm}
                                className="cancel-button"
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            )}


            {/* =========================
                TRAINEE TABLE
            ========================= */}

            <div className="table-container">

                {trainees.length === 0 ? (

                    <div className="empty-state">

                        <h3>
                            No trainees found
                        </h3>

                        <p>
                            Add your first trainee
                            using the button above.
                        </p>

                    </div>

                ) : (

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    ID
                                </th>

                                <th>
                                    Username
                                </th>

                                <th>
                                    Full Name
                                </th>

                                <th>
                                    Email
                                </th>

                                <th>
                                    Department
                                </th>

                                <th>
                                    Joining Date
                                </th>

                                <th>
                                    Status
                                </th>

                                <th>
                                    Actions
                                </th>

                            </tr>

                        </thead>


                        <tbody>

                            {trainees.map(
                                (trainee) => (

                                    <tr
                                        key={
                                            trainee.id
                                        }
                                    >

                                        <td>
                                            {
                                                trainee.id
                                            }
                                        </td>

                                        <td>
                                            {
                                                trainee.username
                                            }
                                        </td>

                                        <td>
                                            {
                                                trainee.full_name
                                            }
                                        </td>

                                        <td>
                                            {
                                                trainee.email
                                            }
                                        </td>

                                        <td>
                                            {
                                                trainee.department
                                            }
                                        </td>

                                        <td>
                                            {
                                                trainee.joining_date
                                                    ? trainee.joining_date
                                                        .toString()
                                                        .substring(
                                                            0,
                                                            10
                                                        )
                                                    : "-"
                                            }
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    trainee.status ===
                                                    "active"
                                                        ? "status active-status"
                                                        : "status inactive-status"
                                                }
                                            >

                                                {
                                                    trainee.status
                                                }

                                            </span>

                                        </td>

                                        <td>

                                            <button
                                                onClick={() =>
                                                    openEditForm(
                                                        trainee
                                                    )
                                                }
                                                className="edit-button"
                                            >
                                                Edit
                                            </button>


                                            <button
                                                onClick={() =>
                                                    handleDelete(
                                                        trainee.id
                                                    )
                                                }
                                                className="delete-button"
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                )
                            )}

                        </tbody>

                    </table>

                )}

            </div>


            {/* =========================
                PERFORMANCE SECTION
            ========================= */}

            <div className="performance-section">

                <h2>
                    Add Performance
                </h2>

                <p>
                    Submit a task score and feedback
                    for a trainee.
                </p>


                <form
                    onSubmit={
                        handlePerformanceSubmit
                    }
                >

                    <label>
                        Select Trainee
                    </label>

                    <select
                        name="trainee_id"
                        value={
                            performanceData.trainee_id
                        }
                        onChange={
                            handlePerformanceChange
                        }
                        required
                    >

                        <option value="">
                            Select trainee
                        </option>

                        {trainees.map(
                            (trainee) => (

                                <option
                                    key={
                                        trainee.id
                                    }
                                    value={
                                        trainee.id
                                    }
                                >

                                    {
                                        trainee.full_name
                                    }

                                </option>

                            )
                        )}

                    </select>


                    <label>
                        Task Name
                    </label>

                    <input
                        type="text"
                        name="task_name"
                        placeholder="Example: React Project"
                        value={
                            performanceData.task_name
                        }
                        onChange={
                            handlePerformanceChange
                        }
                        required
                    />


                    <label>
                        Score
                    </label>

                    <input
                        type="number"
                        name="score"
                        min="0"
                        max="100"
                        placeholder="0 - 100"
                        value={
                            performanceData.score
                        }
                        onChange={
                            handlePerformanceChange
                        }
                        required
                    />


                    <label>
                        Feedback
                    </label>

                    <textarea
                        name="feedback"
                        placeholder="Enter feedback"
                        value={
                            performanceData.feedback
                        }
                        onChange={
                            handlePerformanceChange
                        }
                    />


                    <button
                        type="submit"
                        className="save-button"
                    >
                        Submit Grade
                    </button>

                </form>

            </div>

        </div>

    );

}

export default AdminDashboard;