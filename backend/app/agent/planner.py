def create_plan(
    probable_cause,
    actions
):

    plan = [
        {
            "step": 1,
            "action": (
                "Investigate probable cause: "
                + probable_cause
            )
        }
    ]

    for index, action in enumerate(
        actions,
        start=2
    ):
        plan.append(
            {
                "step": index,
                "action": action
            }
        )

    plan.append(
        {
            "step": len(plan) + 1,
            "action": (
                "Verify service health "
                "after remediation."
            )
        }
    )

    return plan