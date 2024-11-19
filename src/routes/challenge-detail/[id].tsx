import { A } from "@solidjs/router";
import { useParams } from "@solidjs/router";
import { createResource, onCleanup, onMount, Show } from "solid-js";
import ChallengeDetailCard from "~/components/ChallengeDetailCard";
import { getChallenge } from "~/api/server";
import NavBar from "~/components/NavBar";
import Container from "~/components/Container";
import LeaderBoardCard from "~/components/LeaderBoardCard";
import "./id.css";
export default function ChallengeDetail() {
  const params = useParams();
  const [challengeDetail, { refetch }] = createResource(() =>
    getChallenge(Number(params.id))
  );
  const paramId = parseInt(params.id);
  onMount(() => {
    refetch();
  });
  return (
    <Show
      when={challengeDetail.loading === false && challengeDetail()}
      fallback={"Loading Challenge Details..."}
    >
      {challengeDetail()
        ? (
          <>
            <NavBar />{" "}
            <Container>
              <div class="detail-container">
                <ChallengeDetailCard challengeDetail={challengeDetail()!} />
                {" "}
                <LeaderBoardCard paramId={paramId} />
              </div>{" "}
              <div id="button-container">
                <A href={`/`}>
                  <button class="button">Back</button>
                </A>{" "}
                <A href={`/reaction-speed-challenge`}>
                  <button class="button">Start Challenge</button>
                </A>
              </div>
            </Container>
          </>
        )
        : <p>Challenge not found</p>}
    </Show>
  );
}
