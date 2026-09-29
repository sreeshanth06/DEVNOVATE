from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.agent.incident_agent import IncidentResponseAgent
from app.database.database import get_db
from app.database.models import IncidentModel
from app.llm.client import LLMClient
from app.memory.hindsight_memory import HindsightMemory
from app.schemas.incident import Incident


router = APIRouter(
    prefix="/incidents",
    tags=["Incidents"]
)


llm = LLMClient()
memory = HindsightMemory()

incident_agent = IncidentResponseAgent(
    llm=llm,
    memory=memory
)


@router.post("/")
def create_incident(
    incident: Incident,
    db: Session = Depends(get_db)
):
    existing = (
        db.query(IncidentModel)
        .filter(
            IncidentModel.incident_id == incident.incident_id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Incident already exists"
        )

    db_incident = IncidentModel(
        incident_id=incident.incident_id,
        title=incident.title,
        severity=incident.severity,
        service=incident.service,
        description=incident.description,
        status=incident.status,
        timestamp=incident.timestamp,
        error_message=incident.error_message
    )

    db.add(db_incident)
    db.commit()
    db.refresh(db_incident)

    return {
        "message": "Incident created successfully",
        "incident": db_incident
    }


@router.get("/")
def get_incidents(
    db: Session = Depends(get_db)
):
    return db.query(IncidentModel).all()


@router.get("/{incident_id}")
def get_incident(
    incident_id: str,
    db: Session = Depends(get_db)
):
    incident = (
        db.query(IncidentModel)
        .filter(
            IncidentModel.incident_id == incident_id
        )
        .first()
    )

    if incident is None:
        raise HTTPException(
            status_code=404,
            detail="Incident not found"
        )

    return incident


@router.post("/{incident_id}/investigate")
def investigate_incident(
    incident_id: str,
    db: Session = Depends(get_db)
):
    incident = (
        db.query(IncidentModel)
        .filter(
            IncidentModel.incident_id == incident_id
        )
        .first()
    )

    if incident is None:
        raise HTTPException(
            status_code=404,
            detail=f"Incident '{incident_id}' not found"
        )

    result = incident_agent.investigate(
        incident,
        db
    )

    analysis = result["analysis"]

    incident.analysis = analysis["summary"]
    incident.probable_cause = analysis["probable_cause"]

    incident.recommended_actions = "\n".join(
        analysis["recommended_actions"]
    )

    db.commit()
    db.refresh(incident)

    return result