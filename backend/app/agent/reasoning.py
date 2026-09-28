def build_reasoning(
    analysis,
    runbook
):

    return {
        "summary": analysis["summary"],
        "probable_cause": analysis["probable_cause"],
        "evidence": analysis["evidence"],
        "recommended_actions": analysis[
            "recommended_actions"
        ],
        "runbook": runbook,
        "confidence": analysis["confidence"]
    }