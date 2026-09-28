const API_URL = "http://127.0.0.1:8000";

async function handleResponse(response) {
    const data =
        await response.json().catch(
            () => null
        );

    if (!response.ok) {
        const message =
            data?.detail ||
            "An error occurred.";

        throw new Error(message);
    }

    return data;
}

export async function getIncidents() {
    const response = await fetch(
        `${API_URL}/incidents/`
    );

    return handleResponse(response);
}

export async function getIncident(
    incidentId
) {
    const response = await fetch(
        `${API_URL}/incidents/${encodeURIComponent(
            incidentId
        )}`
    );

    return handleResponse(response);
}

export async function investigateIncident(
    incidentId
) {
    const response = await fetch(
        `${API_URL}/incidents/${encodeURIComponent(
            incidentId
        )}/investigate`,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json"
            }
        }
    );

    return handleResponse(response);
}