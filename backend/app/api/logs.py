from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.database.models import LogModel


router = APIRouter(
    prefix="/logs",
    tags=["Logs"]
)


@router.post("/")
def create_log(
    incident_id: str,
    service: str,
    level: str,
    message: str,
    db: Session = Depends(get_db)
):
    log = LogModel(
        incident_id=incident_id,
        service=service,
        level=level,
        message=message
    )

    db.add(log)
    db.commit()
    db.refresh(log)

    return log


@router.get("/{incident_id}")
def get_incident_logs(
    incident_id: str,
    db: Session = Depends(get_db)
):
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

    if not logs:
        raise HTTPException(
            status_code=404,
            detail=(
                f"No logs found for "
                f"incident '{incident_id}'"
            )
        )

    return logs