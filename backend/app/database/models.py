from datetime import datetime

from sqlalchemy import Column, DateTime, Integer, String, Text

from app.database.database import Base


class IncidentModel(Base):
    __tablename__ = "incidents"

    id = Column(Integer, primary_key=True, index=True)

    incident_id = Column(
        String(50),
        unique=True,
        nullable=False,
        index=True
    )

    title = Column(String(200), nullable=False)

    severity = Column(String(20), nullable=False)

    service = Column(String(100), nullable=False)

    description = Column(Text, nullable=False)

    status = Column(
        String(30),
        nullable=False,
        default="OPEN"
    )

    timestamp = Column(
        DateTime,
        default=datetime.utcnow
    )

    error_message = Column(Text, nullable=True)

    analysis = Column(Text, nullable=True)

    probable_cause = Column(Text, nullable=True)

    recommended_actions = Column(Text, nullable=True)


class LogModel(Base):
    __tablename__ = "logs"

    id = Column(Integer, primary_key=True, index=True)

    incident_id = Column(
        String(50),
        nullable=False,
        index=True
    )

    service = Column(
        String(100),
        nullable=False
    )

    level = Column(
        String(20),
        nullable=False
    )

    message = Column(
        Text,
        nullable=False
    )

    timestamp = Column(
        DateTime,
        default=datetime.utcnow
    )