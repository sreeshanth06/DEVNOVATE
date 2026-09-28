import React, {
    useEffect,
    useState
} from "react";

import {
    Link,
    useParams
} from "react-router-dom";

import {
    getIncident,
    investigateIncident
} from "../services/api.js";

import AgentResponse from "../components/AgentResponse.jsx";
import ActionPanel from "../components/ActionPanel.jsx";

function Incident() {
    const { incidentId } = useParams();

    const [incident, setIncident] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [investigating, setInvestigating] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function loadIncident() {
            try {
                const data = await getIncident(incidentId);
                setIncident(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        loadIncident();
    }, [incidentId]);

    async function handleInvestigate() {
        setInvestigating(true);
        setError("");

        try {
            const data = await investigateIncident(incidentId);
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setInvestigating(false);
        }
    }

    if (loading) {
        return (
            <main className="page">
                <p>Loading incident...</p>
            </main>
        );
    }

    if (error) {
        return (
            <main className="page">
                <p className="error">{error}</p>
            </main>
        );
    }

    if (!incident) {
        return (
            <main className="page">
                <h1>Incident not found</h1>
            </main>
        );
    }

    return (
        <main className="page">
            <Link to="/">← Back to Dashboard</Link>

            <div className="card section">
                <h1>
                    {incident.title ||
                        incident.name ||
                        incident.incident_id}
                </h1>

                <p>
                    <strong>Incident ID:</strong>{" "}
                    {incident.incident_id}
                </p>

                <p>
                    <strong>Service:</strong>{" "}
                    {incident.service}
                </p>

                <p>
                    <strong>Severity:</strong>{" "}
                    {incident.severity}
                </p>

                <p>
                    <strong>Status:</strong>{" "}
                    {incident.status}
                </p>

                {incident.description && (
                    <p>
                        <strong>Description:</strong>{" "}
                        {incident.description}
                    </p>
                )}

                {incident.error_message && (
                    <p>
                        <strong>Error:</strong>{" "}
                        {incident.error_message}
                    </p>
                )}

                <button
                    onClick={handleInvestigate}
                    disabled={investigating}
                >
                    {investigating
                        ? "Investigating..."
                        : "Investigate Incident"}
                </button>
            </div>

            {result && (
                <>
                    <AgentResponse result={result} />

                    <ActionPanel
                        responsePlan={
                            result.response_plan
                        }
                    />
                </>
            )}
        </main>
    );
}

export default Incident;