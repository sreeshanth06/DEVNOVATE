import React from "react";


function AgentResponse({ result }) {

    if (!result) {
        return null;
    }

    const incident = result.incident || {};
    const analysis = result.analysis || {};

    const evidence = Array.isArray(
        analysis.evidence
    )
        ? analysis.evidence
        : [];

    const runbook = Array.isArray(
        analysis.runbook
    )
        ? analysis.runbook
        : [];

    const previousIncidents = Array.isArray(
        result.previous_incidents
    )
        ? result.previous_incidents
        : [];


    return (
        <div>

            <div className="card section">

                <h2>Incident Under Investigation</h2>

                <h3>
                    {incident.title ||
                        "Unknown Incident"}
                </h3>

                <p>
                    <strong>Incident ID:</strong>{" "}
                    {incident.id || "N/A"}
                </p>

                <p>
                    <strong>Service:</strong>{" "}
                    {incident.service || "N/A"}
                </p>

                <p>
                    <strong>Severity:</strong>{" "}
                    {incident.severity || "N/A"}
                </p>

                <p>
                    <strong>Status:</strong>{" "}
                    {incident.status || "N/A"}
                </p>

                <p>
                    <strong>Description:</strong>{" "}
                    {incident.description || "N/A"}
                </p>

                {incident.error_message && (
                    <p>
                        <strong>Error:</strong>{" "}
                        {incident.error_message}
                    </p>
                )}

            </div>


            <div
                className="card section"
                style={{
                    borderLeft:
                        "4px solid #4f46e5"
                }}
            >

                <h2>Agent Memory</h2>

                {previousIncidents.length > 0 ? (

                    <>
                        <p>
                            The agent found{" "}
                            <strong>
                                {previousIncidents.length}
                            </strong>{" "}
                            similar historical incident
                            {previousIncidents.length > 1
                                ? "s"
                                : ""}.
                        </p>

                        {previousIncidents.map(
                            (memory, index) => {

                                const memoryAnalysis =
                                    memory.analysis || {};

                                return (
                                    <div
                                        key={index}
                                        style={{
                                            marginTop: "15px",
                                            padding: "15px",
                                            border:
                                                "1px solid #ddd",
                                            borderRadius:
                                                "8px"
                                        }}
                                    >

                                        <h3>
                                            Previous Incident:{" "}
                                            {memory.incident_id}
                                        </h3>

                                        <p>
                                            <strong>
                                                Service:
                                            </strong>{" "}
                                            {memory.service}
                                        </p>

                                        <p>
                                            <strong>
                                                Incident:
                                            </strong>{" "}
                                            {memory.description}
                                        </p>

                                        <p>
                                            <strong>
                                                Previous Root Cause:
                                            </strong>{" "}
                                            {
                                                memoryAnalysis
                                                    .probable_cause ||
                                                "Not recorded"
                                            }
                                        </p>

                                        {Array.isArray(
                                            memoryAnalysis.evidence
                                        ) &&
                                        memoryAnalysis.evidence.length >
                                            0 && (

                                            <>
                                                <strong>
                                                    Previous Evidence:
                                                </strong>

                                                <ul>
                                                    {memoryAnalysis
                                                        .evidence
                                                        .map(
                                                            (
                                                                item,
                                                                evidenceIndex
                                                            ) => (
                                                                <li
                                                                    key={
                                                                        evidenceIndex
                                                                    }
                                                                >
                                                                    {item}
                                                                </li>
                                                            )
                                                        )}
                                                </ul>
                                            </>
                                        )}

                                        {Array.isArray(
                                            memoryAnalysis
                                                .recommended_actions
                                        ) &&
                                        memoryAnalysis
                                            .recommended_actions
                                            .length > 0 && (

                                            <>
                                                <strong>
                                                    Previous Recommended
                                                    Actions:
                                                </strong>

                                                <ul>
                                                    {memoryAnalysis
                                                        .recommended_actions
                                                        .map(
                                                            (
                                                                action,
                                                                actionIndex
                                                            ) => (
                                                                <li
                                                                    key={
                                                                        actionIndex
                                                                    }
                                                                >
                                                                    {action}
                                                                </li>
                                                            )
                                                        )}
                                                </ul>
                                            </>
                                        )}

                                    </div>
                                );
                            }
                        )}
                    </>

                ) : (

                    <p>
                        No similar historical incidents
                        were found.
                    </p>

                )}

            </div>


            <div className="card section">

                <h2>AI Investigation</h2>

                <h3>Summary</h3>

                <p>
                    {analysis.summary ||
                        "No summary provided."}
                </p>

                <h3>Probable Cause</h3>

                <p>
                    {analysis.probable_cause ||
                        "No probable cause provided."}
                </p>

                <h3>Confidence</h3>

                <p>
                    <strong>
                        {analysis.confidence ||
                            "Not provided"}
                    </strong>
                </p>

            </div>


            <div className="card section">

                <h2>Evidence Used</h2>

                {evidence.length > 0 ? (

                    <ul>
                        {evidence.map(
                            (item, index) => (
                                <li key={index}>
                                    {item}
                                </li>
                            )
                        )}
                    </ul>

                ) : (

                    <p>
                        No evidence was returned.
                    </p>

                )}

            </div>


            <div className="card section">

                <h2>Relevant Runbook</h2>

                {runbook.length > 0 ? (

                    <ol>
                        {runbook.map(
                            (step, index) => (
                                <li key={index}>
                                    {step}
                                </li>
                            )
                        )}
                    </ol>

                ) : (

                    <p>
                        No runbook information
                        was returned.
                    </p>

                )}

            </div>


            <div className="card section">

                <h2>AI Recommended Actions</h2>

                {Array.isArray(
                    analysis.recommended_actions
                ) &&
                analysis.recommended_actions.length > 0 ? (

                    <ol>
                        {analysis.recommended_actions.map(
                            (action, index) => (
                                <li key={index}>
                                    {action}
                                </li>
                            )
                        )}
                    </ol>

                ) : (

                    <p>
                        No recommended actions
                        were returned.
                    </p>

                )}

            </div>

        </div>
    );
}

export default AgentResponse;