import React from "react";
import { Link } from "react-router-dom";

function IncidentCard({ incident }) {
    return (
        <div className="card">
            <h2>
                {incident.title ||
                    incident.name ||
                    incident.incident_id}
            </h2>

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

            <Link
                to={`/incident/${encodeURIComponent(
                    incident.incident_id
                )}`}
            >
                <button>View Incident</button>
            </Link>
        </div>
    );
}

export default IncidentCard;