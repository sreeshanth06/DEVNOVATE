import React from "react";

function IncidentTimeline({ incidents }) {
    if (!incidents || incidents.length === 0) {
        return null;
    }

    return (
        <div className="card">
            <h2>Incident Timeline</h2>

            <ol>
                {incidents.map((incident) => (
                    <li key={incident.incident_id}>
                        <strong>
                            {incident.incident_id}
                        </strong>

                        {" - "}

                        {incident.title ||
                            incident.name ||
                            "Incident"}

                        {incident.timestamp && (
                            <span>
                                {" "}
                                ({incident.timestamp})
                            </span>
                        )}
                    </li>
                ))}
            </ol>
        </div>
    );
}

export default IncidentTimeline;