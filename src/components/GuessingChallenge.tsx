import { createSignal, createEffect, onCleanup } from "solid-js";

const GuessTheNumber = () => {
  const [randomNumber, setRandomNumber] = createSignal(Math.floor(Math.random() * 100) + 1);
  const [userGuess, setUserGuess] = createSignal("");
  const [feedback, setFeedback] = createSignal("");
  const [score, setScore] = createSignal(0);
  const [timeLeft, setTimeLeft] = createSignal(30);
  const [gameOver, setGameOver] = createSignal(false);
  const [isStarted, setIsStarted] = createSignal(false);
  const [countdown, setCountdown] = createSignal(5);

  const handleSubmitGuess = () => {
    const guess = parseInt(userGuess(), 10);
    if (guess < 1 || guess > 100 || isNaN(guess)) {
      setFeedback("Please enter a number between 1 and 100.");
      return;
    }

    setScore(score() + 1);

    if (guess < randomNumber()) {
      setFeedback("Too low! Try again.");
    } else if (guess > randomNumber()) {
      setFeedback("Too high! Try again.");
    } else {
      setFeedback(`Congratulations! You guessed the number ${randomNumber()} in ${score()} attempts!`);
      setGameOver(true);
    }
  };

  createEffect(() => {
    if (!isStarted()) {
      const countdownInterval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setIsStarted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      onCleanup(() => {
        clearInterval(countdownInterval);
      });
    }
  });

  createEffect(() => {
    if (isStarted() && !gameOver()) {
      const timerInterval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setGameOver(true);
            clearInterval(timerInterval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      onCleanup(() => {
        clearInterval(timerInterval);
      });
    }
  });

  return (
    <div>
      {isStarted() ? (
        <div class="game-container">
          {!gameOver() ? (
            <>
              <div class="score-card">
                <p>Score: {score()}</p>
                <p>Time Left: {timeLeft()}s</p>
              </div>
              <div class="game-area">
                <input
                  type="number"
                  placeholder="Enter your guess"
                  value={userGuess()}
                  onInput={(e) => setUserGuess(e.target.value)}
                />
                <button onClick={handleSubmitGuess}>Submit</button>
                <p class="feedback">{feedback()}</p>
              </div>
            </>
          ) : (
            <div class="result">
              <h2>Game Over! Your Score: {score()}</h2>
              <button onClick={() => window.location.reload()}>Play Again</button>
            </div>
          )}
        </div>
      ) : (
        <div class="intro-container">
          <h1>Get Ready!</h1>
          <h2>Starting in: {countdown()}</h2>
        </div>
      )}
    </div>
  );
};

export default GuessTheNumber;
