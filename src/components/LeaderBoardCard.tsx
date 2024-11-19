import { createSignal, onMount } from "solid-js";
import { getLeaderboard } from "~/api/server";
import "./LeaderBoardCard.css";

type ParamIdProps = {
    paramId: number;
};

const LeaderBoardCard = (props: ParamIdProps) => {
    const [leaderBoard, setLeaderBoard] = createSignal<{ username: string; score: number }[]>([]);
    const [loading, setLoading] = createSignal(true);

    onMount(async () => {
        try {
            const data = await getLeaderboard(props.paramId);
            setLeaderBoard(data);
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            setLoading(false);
        }
    });

    return (
        <div class="container">
            <h1 class="title">Leaderboard</h1>
            {loading() ? (
                <div>Loading...</div>
            ) : (
                <ul class="list">
                    {leaderBoard().map((user) => (
                        <li class="line">
                            {user.username} : {user.score}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LeaderBoardCard;
