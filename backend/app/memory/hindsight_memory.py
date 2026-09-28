class HindsightMemory:

    def __init__(self):
        self.memories = [
            {
                "incident_id": "HIST-001",
                "service": "payment-service",
                "description": (
                    "Payment API failures caused by "
                    "database connection timeout"
                ),
                "analysis": {
                    "summary": (
                        "Previous payment-service incident "
                        "caused by database connection pool "
                        "exhaustion."
                    ),
                    "probable_cause": (
                        "Database connection pool exhaustion "
                        "caused by slow database responses."
                    ),
                    "evidence": [
                        "Database connection timeout",
                        "Connection pool exhausted",
                        "Increased database response time"
                    ],
                    "recommended_actions": [
                        "Check database connectivity.",
                        "Inspect database connection pool.",
                        "Review recent deployments.",
                        "Verify service health."
                    ],
                    "runbook": [
                        "Check database connectivity.",
                        "Check database connection pool.",
                        "Review recent deployments."
                    ],
                    "confidence": "HIGH"
                }
            }
        ]

    def search(self, description, service=None):
        description_words = set(
            description.lower().split()
        )

        results = []

        for memory in self.memories:

            if service and memory.get("service") != service:
                continue

            memory_words = set(
                memory["description"].lower().split()
            )

            common_words = (
                description_words & memory_words
            )

            if len(common_words) >= 2:
                results.append(memory)

        return results

    def remember(self, incident_info, analysis):

        self.memories.append(
            {
                "incident_id": incident_info["id"],
                "service": incident_info["service"],
                "description": incident_info["description"],
                "analysis": analysis
            }
        )