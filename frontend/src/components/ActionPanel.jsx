import React from "react";

function ActionPanel({ responsePlan }) {
    if (!Array.isArray(responsePlan) || responsePlan.length === 0) {
        return null;
    }

    return (
        <div className="card section">

            <h2>Agent Response Plan</h2>

            <p>
                Ordered remediation steps generated from
                the incident investigation.
            </p>

            <div style={{ marginTop: "20px" }}>
                {responsePlan.map((step, index) => {

                    const action =
                        typeof step === "string"
                            ? step
                            : step.action ||
                              step.description ||
                              "No action specified.";

                    return (
                        <div
                            key={index}
                            style={{
                                display: "flex",
                                gap: "15px",
                                marginBottom: "16px",
                                padding: "14px",
                                border: "1px solid #ddd",
                                borderRadius: "8px"
                            }}
                        >
                            <strong>
                                {index + 1}
                            </strong>

                            <span>
                                {action}
                            </span>
                        </div>
                    );
                })}
            </div>

            <div
                style={{
                    marginTop: "25px",
                    padding: "16px",
                    borderRadius: "8px",
                    background: "#f5f5f5"
                }}
            >
                <h3>Learning Loop</h3>

                <p>
                    This investigation can become future
                    agent knowledge: the incident, evidence,
                    probable cause, recommended actions,
                    and response plan can be used as
                    experience for similar incidents.
                </p>
            </div>

        </div>
    );
}

export default ActionPanel;