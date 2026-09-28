from app.agent.planner import create_plan
from app.agent.reasoning import build_reasoning
from app.agent.tools import (
    collect_incident_info,
    get_runbook,
    get_incident_logs
)

from app.api.actions import (
    check_database_health,
    restart_service,
    check_service_health
)


class IncidentResponseAgent:

    MAX_ACTIONS = 3

    def __init__(
        self,
        llm,
        memory
    ):
        self.llm = llm
        self.memory = memory

    def execute_action(
        self,
        next_action,
        service
    ):

        tool = next_action.get("tool")

        if tool == "database_health":
            return check_database_health()

        if tool == "restart_service":
            target_service = (
                next_action.get("service")
                or service
            )

            return restart_service(
                target_service
            )

        if tool == "service_health":
            target_service = (
                next_action.get("service")
                or service
            )

            return check_service_health(
                target_service
            )

        return {
            "action": "none",
            "status": "NOT_EXECUTED",
            "message": "No valid tool selected."
        }

    def investigate(
        self,
        incident,
        db
    ):

        # 1. Collect incident information
        incident_info = collect_incident_info(
            incident
        )

        # 2. Retrieve previous experience
        previous_incidents = self.memory.search(
            incident_info["description"],
            incident_info["service"]
        )

        # 3. Retrieve runbook
        runbook = get_runbook(
            incident_info["service"]
        )

        # 4. Retrieve logs
        logs = get_incident_logs(
            db,
            incident.incident_id
        )

        # 5. Initial analysis
        analysis = self.llm.analyze(
            incident_info,
            previous_incidents,
            logs,
            runbook
        )

        action_history = []

        # 6. Agent action loop
        for _ in range(self.MAX_ACTIONS):

            next_action = analysis.get(
                "next_action"
            )

            if not next_action:
                break

            tool = next_action.get("tool")

            if tool == "none":
                break

            action_result = self.execute_action(
                next_action,
                incident_info["service"]
            )

            action_history.append({
                "selected_action": next_action,
                "result": action_result
            })

            # Ask the LLM what should happen next
            analysis = self.llm.analyze_after_action(
                incident_info,
                logs,
                runbook,
                analysis,
                action_result,
                action_history
            )

            if analysis.get("next_action", {}).get(
                "tool"
            ) == "none":
                break

        # 7. Build final reasoning
        reasoning = build_reasoning(
            analysis,
            runbook
        )

        # 8. Create response plan
        plan = create_plan(
            analysis["probable_cause"],
            analysis["recommended_actions"]
        )

        # 9. Store experience
        self.memory.remember(
            incident_info,
            reasoning
        )

        return {
            "incident": incident_info,
            "analysis": reasoning,
            "previous_incidents": previous_incidents,            
            "response_plan": plan
        }