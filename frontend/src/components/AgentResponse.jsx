import React from "react";

function AgentResponse({ result }) {
    if (!result) {
        return null;
    }

    const analysis = result.analysis || result;

    const previousIncidents = Array.isArray(
        result.previous_incidents
    )
        ? result.previous_incidents
        : [];

    return (
        <>
            <div className="card section">
                <h2>Agent Response</h2>

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
                    {analysis.confidence ??
                        "Not provided."}
                </p>

                {Array.isArray(analysis.evidence) &&
                    analysis.evidence.length > 0 && (
                        <>
                            <h3>Evidence</h3>

                            <ul>
                                {analysis.evidence.map(
                                    (item, index) => (
                                        <li key={index}>
                                            {item}
                                        </li>
                                    )
                                )}
                            </ul>
                        </>
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
                                {
                                    previousIncidents.length
                                }
                            </strong>{" "}
                            similar historical incident
                            {previousIncidents.length > 1
                                ? "s"
                                : ""}.
                        </p>

                        {previousIncidents.map(
                            (memory, index) => {
                                const memoryAnalysis =
                                    memory.analysis ||
                                    {};

                                return (
                                    <div
                                        key={index}
                                    >
                                        <h3>
                                            Previous
                                            Incident:{" "}
                                            {
                                                memory.incident_id
                                            }
                                        </h3>

                                        <p>
                                            <strong>
                                                Service:
                                            </strong>{" "}
                                            {
                                                memory.service
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Incident:
                                            </strong>{" "}
                                            {
                                                memory.description
                                            }
                                        </p>

                                        <p>
                                            <strong>
                                                Previous
                                                Root Cause:
                                            </strong>{" "}
                                            {
                                                memoryAnalysis
                                                    .probable_cause ||
                                                "Not recorded"
                                            }
                                        </p>

                                        {Array.isArray(
                                            memoryAnalysis
                                                .recommended_actions
                                        ) &&
                                            memoryAnalysis
                                                .recommended_actions
                                                .length >
                                                0 && (
                                                <>
                                                    <strong>
                                                        Previous
                                                        Recommended
                                                        Actions:
                                                    </strong>

                                                    <ul>
                                                        {memoryAnalysis.recommended_actions.map(
                                                            (
                                                                action,
                                                                actionIndex
                                                            ) => (
                                                                <li
                                                                    key={
                                                                        actionIndex
                                                                    }
                                                                >
                                                                    {
                                                                        action
                                                                    }
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
        </>
    );
}

export default AgentResponse;