import { InferSelectModel } from "drizzle-orm";
import { Challenges } from "../../drizzle/schema";
import "./ChallengeDetailCard.css";
type ChallengeDetailCardProps = {
  challengeDetail: {
    challengeId: number;
    challengeName: string;
    challengeDescription: string;
    userChallengeId?: number | null;
    score?: number | null;
  };
};
const ChallengeDetailCard = ({ challengeDetail }: ChallengeDetailCardProps) => {
  return (
    <div class="challengeDetailCard">
      <h3 id="detail-title">{challengeDetail.challengeName}</h3>{" "}
      <p>{challengeDetail.challengeDescription}</p>{" "}
      {challengeDetail.score != null && (
        <p class="your-score">Your Best Score: {challengeDetail.score}</p>
      )}
    </div>
  );
};
export default ChallengeDetailCard;
