import { createSignal, onMount } from "solid-js";
import { getLeaderboard } from "~/api/server";

type ParamIdProps = {
    paramId: number;
};

const LeaderBoardCard = (props: ParamIdProps) => {
    const [leaderBoard, setLeaderBoard] = createSignal<{ username: string; score: number }[]>([]);
    const [loading, setLoading] = createSignal(true);

    onMount(async () => {
        try {
            const data = await getLeaderboard(props.paramId);
            setLeaderBoard(data); // Set the fetched leaderboard
        } catch (error) {
            console.error("Error fetching leaderboard:", error);
        } finally {
            setLoading(false); // Hide the loader
        }
    });

    return (
        <div>
            <h1>Leaderboard</h1>
            {loading() ? (
                <div>Loading...</div>
            ) : (
                <ul>
                    {leaderBoard().map((user) => (
                        <li>
                            {user.username} : {user.score}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default LeaderBoardCard;
