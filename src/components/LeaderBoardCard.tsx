import {getLeaderboard} from "~/api/server";

const leaderBoard = await getLeaderboard(1);

type paramIdProps = {
        paramId: number;
};

const LeaderBoardCard = ({paramId}: paramIdProps) => {
    return (
        <div>
            <h1>Leaderboard</h1>
            <ul>
                {leaderBoard.map((user) => (
                    <li>
                        {user.username} - {user.score}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default LeaderBoardCard;