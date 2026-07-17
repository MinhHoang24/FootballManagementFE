import { GoalTeam, IGoalInput, GoalType } from "../types/match";

export const getScore = (goals: IGoalInput[]) => {
    return goals.reduce(
        (acc, goal) => {
            if (goal.team === "OUR") {
                acc.our++;
            } else {
                acc.opponent++;
            }

            return acc;
        },
        {
            our: 0,
            opponent: 0,
        }
    );
};

export const isDisableScorer = (
    team: GoalTeam,
    type: GoalType
) => {
    return (
        team === "OPPONENT" ||
        type === "OWN_GOAL"
    );
};

export const isDisableAssist = (
    team: GoalTeam
) => {
    return team === "OPPONENT";
};

export const createEmptyGoal = (): IGoalInput => ({
    team: "OUR",
    type: "NORMAL",
    minute: null,
    scorerPlayerId: null,
    assistPlayerId: null,
    quantity: 1,
});

export const createGoal = (
    team: GoalTeam = "OUR",
    type: GoalType = "NORMAL"
): IGoalInput => ({
    team,
    type,
    minute: null,
    scorerPlayerId: null,
    assistPlayerId: null,
});