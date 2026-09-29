from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.incidents import router as incidents_router
from app.api.actions import router as actions_router
from app.api.logs import router as logs_router
from app.database.database import Base, engine
from app.database import models

Base.metadata.create_all(
    bind=engine
)


app = FastAPI(
    title="Incident Response Agent",
    description=(
        "AI agent for incident detection, "
        "investigation and response"
    ),
    version="1.0.0"
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://incident-response-agent-6x6i.onrender.com/",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    incidents_router
)
app.include_router(
    logs_router
)
app.include_router(
    actions_router
)


@app.get("/")
def root():

    return {
        "message": (
            "Incident Response Agent API is running"
        )
    }


@app.get("/health")
def health():

    return {
        "status": "healthy"
    }