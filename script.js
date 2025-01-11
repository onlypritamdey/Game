const startButton = document.getElementById("start-button");

// Enable Full-Screen Mode
startButton.addEventListener("click", () => {
  const element = document.documentElement;

  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen(); // Safari
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen(); // IE11
  }

  // Transition to game
  startGame();
});

function startGame() {
  // Replace the start screen with the game screen
  document.getElementById("start-screen").innerHTML = "<h1>Game is Starting...</h1>";
}
