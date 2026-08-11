import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard";
import TraineeDashboard from "./pages/TraineeDashboard";


// ==========================================
// PROTECTED ADMIN ROUTE
// ==========================================

function AdminRoute() {

    const token =
        localStorage.getItem("token");

    const userData =
        localStorage.getItem("user");

    if (!token || !userData) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }

    try {

        const user =
            JSON.parse(userData);

        if (user.role !== "admin") {

            return (
                <Navigate
                    to="/trainee"
                    replace
                />
            );

        }

        return <AdminDashboard />;

    } catch (error) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }

}


// ==========================================
// PROTECTED TRAINEE ROUTE
// ==========================================

function TraineeRoute() {

    const token =
        localStorage.getItem("token");

    const userData =
        localStorage.getItem("user");

    if (!token || !userData) {

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }

    try {

        const user =
            JSON.parse(userData);

        if (user.role !== "trainee") {

            return (
                <Navigate
                    to="/admin"
                    replace
                />
            );

        }

        return <TraineeDashboard />;

    } catch (error) {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }

}


// ==========================================
// APP
// ==========================================

function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* LOGIN */}

                <Route
                    path="/"
                    element={<LoginPage />}
                />


                {/* ADMIN */}

                <Route
                    path="/admin"
                    element={<AdminRoute />}
                />


                {/* TRAINEE */}

                <Route
                    path="/trainee"
                    element={<TraineeRoute />}
                />


                {/* UNKNOWN URL */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}

export default App;