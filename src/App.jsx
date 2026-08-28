import React, { useState } from "react";
import {
    Routes,
    Route,
    Navigate,
    useNavigate
} from "react-router-dom";

import Background from "./components/background";
import Foreground from "./components/foreground";

import Login from "./pages/Login";
import Register from "./pages/Register";


function DocumentsPage({ user, setUser }) {

    const navigate = useNavigate();


    const handleLogout = () => {

        // Remove logged-in user
        localStorage.removeItem("user");

        // Clear React user state
        setUser(null);

        // Go back to login page
        navigate("/login");
    };


    return (
        <div className="relative w-full h-screen bg-zinc-800">

            <Background />

            <Foreground user={user} />

            {/* LOGOUT BUTTON */}
            <button
                onClick={handleLogout}
                className="
                    fixed
                    top-6
                    right-6
                    z-[50]

                    rounded-lg
                    bg-red-500
                    px-5
                    py-2.5

                    text-sm
                    font-semibold
                    text-white

                    shadow-lg
                    shadow-red-500/20

                    transition-all
                    duration-200

                    hover:bg-red-600
                    hover:scale-105

                    active:scale-95
                "
            >
                Logout
            </button>

        </div>
    );
}


function App() {

    // Restore logged-in user after refresh
    const [user, setUser] = useState(() => {

        const savedUser =
            localStorage.getItem("user");

        return savedUser
            ? JSON.parse(savedUser)
            : null;
    });


    return (

        <Routes>

            {/* LOGIN */}

            <Route
                path="/login"
                element={
                    <Login setUser={setUser} />
                }
            />


            {/* REGISTER */}

            <Route
                path="/register"
                element={
                    <Register />
                }
            />


            {/* DOCUMENTS */}

            <Route
                path="/documents"
                element={
                    user ? (

                        <DocumentsPage
                            user={user}
                            setUser={setUser}
                        />

                    ) : (

                        <Navigate
                            to="/login"
                            replace
                        />

                    )
                }
            />


            {/* DEFAULT */}

            <Route
                path="*"
                element={
                    <Navigate
                        to={
                            user
                                ? "/documents"
                                : "/login"
                        }
                        replace
                    />
                }
            />

        </Routes>
    );
}


export default App;