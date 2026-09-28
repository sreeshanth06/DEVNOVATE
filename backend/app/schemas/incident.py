from pydantic import BaseModel
from typing import Optional


class Incident(BaseModel):
    id: str
    title: str
    severity: str
    service: str
    description: str
    status: str
    timestamp: str
    error_message: Optional[str] = None