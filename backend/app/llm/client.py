import json

from groq import Groq

from app.config import GROQ_API_KEY, LLM_MODEL


class LLMClient:

    def __init__(self):
        if not GROQ_API_KEY:
            raise ValueError(
                "GROQ_API_KEY is missing from .env"
            )

        self.client = Groq(
            api_key=GROQ_API_KEY
        )

    def analyze(
        self,
        incident_info,
        previous_incidents,
        logs,
        runbook
    ):

        prompt = f"""
You are an Incident Response Agent.

Investigate this production incident.

INCIDENT:
{json.dumps(incident_info, indent=2)}

PREVIOUS INCIDENT EXPERIENCE:
{json.dumps(previous_incidents, indent=2)}

Use previous incident experience when it is relevant to
the current incident.

Rules for historical experience:
- Compare previous incidents with the current incident.
- Use matching historical root causes as supporting evidence,
  not as proof by themselves.
- Consider previous recommended actions when creating the
  current response plan.
- Do not blindly copy a previous diagnosis.
- Current incident logs and current evidence have priority.
- If no previous incident is relevant, investigate normally.

LOGS:
{json.dumps(logs, indent=2)}

RUNBOOK:
{json.dumps(runbook, indent=2)}

Available tools:

1. database_health
   Checks database connectivity.

2. restart_service
   Simulates restarting the affected service.

3. service_health
   Checks whether the affected service is healthy.

Choose the most appropriate NEXT tool based on
the evidence.

Return ONLY valid JSON:

{{
    "summary": "...",
    "probable_cause": "...",
    "evidence": [
        "...",
        "..."
    ],
    "recommended_actions": [
        "...",
        "..."
    ],
    "confidence": "LOW/MEDIUM/HIGH",
    "next_action": {{
        "tool": "database_health",
        "service": null,
        "reason": "..."
    }}
}}

Rules:

- Base conclusions only on provided evidence.
- Do not invent evidence.
- If there is insufficient evidence, say so.
- Choose only one next_action.
- The tool must be one of:
  database_health,
  restart_service,
  service_health.
- Use restart_service only when restarting the service
  is justified by the evidence.
- Do not include markdown.
"""

        response = self.client.chat.completions.create(
            model=LLM_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a production incident "
                        "response engineer."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1
        )

        content = response.choices[0].message.content

        return json.loads(content)

    def analyze_after_action(
        self,
        incident_info,
        logs,
        runbook,
        previous_analysis,
        action_result,
        action_history
    ):
        prompt = f"""
You are an Incident Response Agent.

You previously investigated an incident
and executed an action.

Now examine the action result and decide
whether another action is required.

INCIDENT:
{json.dumps(incident_info, indent=2)}

LOGS:
{json.dumps(logs, indent=2)}

RUNBOOK:
{json.dumps(runbook, indent=2)}

PREVIOUS ANALYSIS:
{json.dumps(previous_analysis, indent=2)}

ACTION HISTORY:
{json.dumps(action_history, indent=2)}

LATEST ACTION RESULT:
{json.dumps(action_result, indent=2)}

Available tools:

1. database_health
2. restart_service
3. service_health
4. none

Return ONLY valid JSON:

{{
    "summary": "...",
    "probable_cause": "...",
    "evidence": [
        "...",
        "..."
    ],
    "recommended_actions": [
        "...",
        "..."
    ],
    "confidence": "LOW/MEDIUM/HIGH",
    "next_action": {{
        "tool": "none",
        "service": null,
        "reason": "..."
    }}
}}

Rules:

- Examine the latest action result.
- Do not invent evidence.
- Use another tool only when it is justified.
- Use "none" when enough investigation has been completed.
- Never choose more than one next action.
- Do not include markdown.
"""

        response = self.client.chat.completions.create(
            model=LLM_MODEL,
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are a production incident "
                        "response engineer."
                    )
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.1
        )

        content = response.choices[0].message.content

        return json.loads(content)