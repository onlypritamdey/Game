// Enable Fullscreen Mode on Start
const startButton = document.getElementById("start-button");

startButton.addEventListener("click", () => {
  const element = document.documentElement;

  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen(); // Safari
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen(); // IE11
  }

  // Proceed to the game
  startGame();
});

function startGame() {
  // Replace the start screen with the game
  document.getElementById("start-screen").innerHTML = "<h1>Loading Game...</h1>";
}
