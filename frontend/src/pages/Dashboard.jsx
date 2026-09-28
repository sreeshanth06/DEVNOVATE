import React, { useEffect, useState } from "react";

import { getIncidents } from "../services/api.js";
import IncidentCard from "../components/IncidentCard.jsx";
import IncidentTimeline from "../components/IncidentTimeline.jsx";

function Dashboard() {
    const [incidents, setIncidents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadIncidents() {
            try {
                const data = await getIncidents();

                setIncidents(
                    Array.isArray(data) ? data : []
                );
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadIncidents();
    }, []);

    return (
        <main className="page">
            <div className="page-title">
                <h1>Incident Response Dashboard</h1>

                <p>
                    Monitor and investigate system incidents.
                </p>
            </div>

            {loading && <p>Loading incidents...</p>}

            {error && (
                <p className="error">
                    {error}
                </p>
            )}

            {!loading &&
                !error &&
                incidents.length === 0 && (
                    <div className="card">
                        <h2>No incidents found</h2>

                        <p>
                            There are currently no incidents
                            in the database.
                        </p>
                    </div>
                )}

            {incidents.map((incident) => (
                <IncidentCard
                    key={incident.incident_id}
                    incident={incident}
                />
            ))}

            <IncidentTimeline incidents={incidents} />
        </main>
    );
}

export default Dashboard;