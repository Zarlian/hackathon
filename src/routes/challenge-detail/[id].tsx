import { A } from "@solidjs/router";
import { useParams } from "@solidjs/router";
import { createResource, Show } from "solid-js";
import ChallengeDetailCard from "~/components/ChallengeDetailCard";
import { getChallenge } from "~/api/server";
import NavBar from "~/components/NavBar";
import Container from "~/components/Container";
import LeaderBoardCard from "~/components/LeaderBoardCard";

export default function ChallengeDetail() {
  const params = useParams();

  console.log('param' , params);
  const [challengeDetail] = createResource(() => getChallenge(Number(params.id)));
  console.log('param' , params.id);
  const paramId = parseInt(params.id);
  return (
    <Show when={challengeDetail()} fallback={"Loading Challenge Details..."}>
      {challengeDetail() ? (
        <>
        <NavBar />
        <Container>
          <ChallengeDetailCard challengeDetail={challengeDetail()!}  />
          <LeaderBoardCard paramId= {paramId}/>

          <div id='button-container'>

            <A href={`/`}>
            <button>back</button>
            </A>

            <A href={`/reaction-speed-challenge`}>
            <button>Start Challenge</button>
            </A>
            </div>
          </Container>
</>
      ) : (
        <p>Challenge not found</p>
      )}
    </Show>
  );
}