from pydantic import BaseModel
from typing import Optional


class Incident(BaseModel):
    incident_id: str
    title: str
    severity: str
    service: str
    description: str
    status: str
    timestamp: str
    error_message: Optional[str] = None