import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <Link
                    to="/"
                    className="navbar-brand"
                >
                    Devnovate
                </Link>

                <div className="navbar-links">
                    <Link to="/">
                        Dashboard
                    </Link>

                    <Link to="/agent">
                        AI Agent
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;