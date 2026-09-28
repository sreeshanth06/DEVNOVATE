from fastapi import APIRouter


router = APIRouter(
    prefix="/actions",
    tags=["Actions"]
)


def check_database_health():
    return {
        "action": "database_health_check",
        "status": "HEALTHY",
        "message": (
            "Database connectivity check "
            "completed successfully."
        )
    }


def restart_service(service_name: str):
    return {
        "action": "restart_service",
        "service": service_name,
        "status": "COMPLETED",
        "message": (
            f"Simulated restart of "
            f"{service_name} completed successfully."
        )
    }


def check_service_health(service_name: str):
    return {
        "action": "service_health_check",
        "service": service_name,
        "status": "HEALTHY",
        "message": (
            f"{service_name} is responding normally."
        )
    }


@router.post("/database-health")
def database_health_endpoint():
    return check_database_health()


@router.post("/restart-service/{service_name}")
def restart_service_endpoint(
    service_name: str
):
    return restart_service(service_name)


@router.post("/service-health/{service_name}")
def service_health_endpoint(
    service_name: str
):
    return check_service_health(service_name)