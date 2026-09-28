import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Navbar from "./components/Navbar.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Incident from "./pages/Incident.jsx";
import Agent from "./pages/Agent.jsx";

function App() {
    return (
        <BrowserRouter>
            <Navbar />

            <Routes>
                <Route
                    path="/"
                    element={<Dashboard />}
                />

                <Route
                    path="/incident/:incidentId"
                    element={<Incident />}
                />

                <Route
                    path="/agent"
                    element={<Agent />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default App;