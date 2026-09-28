from app.database.models import LogModel


def collect_incident_info(incident):
    return {
        "id": incident.incident_id,
        "title": incident.title,
        "severity": incident.severity,
        "service": incident.service,
        "description": incident.description,
        "status": incident.status,
        "timestamp": incident.timestamp.isoformat(),
        "error_message": incident.error_message
    }


def get_runbook(service):

    runbooks = {

        "payment-service": [
            "Check database connectivity.",
            "Check database connection pool.",
            "Review recent deployments.",
            "Check application logs.",
            "Check dependent services."
        ],

        "authentication-service": [
            "Check authentication logs.",
            "Check token service.",
            "Review recent deployments.",
            "Check database connectivity."
        ],

        "default": [
            "Check application logs.",
            "Check service health.",
            "Review recent deployments.",
            "Check dependent services."
        ]
    }

    return runbooks.get(
        service,
        runbooks["default"]
    )


def get_incident_logs(db, incident_id):

    logs = (
        db.query(LogModel)
        .filter(
            LogModel.incident_id == incident_id
        )
        .order_by(
            LogModel.timestamp.asc()
        )
        .all()
    )

    return [
        {
            "timestamp": log.timestamp.isoformat(),
            "service": log.service,
            "level": log.level,
            "message": log.message
        }
        for log in logs
    ]