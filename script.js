const startButton = document.getElementById("start-button");
const orientationWarning = document.getElementById("orientation-warning");

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

  // Start the game
  startGame();
});

// Check Orientation
function checkOrientation() {
  if (window.innerWidth < window.innerHeight) {
    // Show warning for portrait mode
    orientationWarning.style.display = "flex";
  } else {
    // Hide warning for landscape mode
    orientationWarning.style.display = "none";
  }
}

// Monitor orientation changes
window.addEventListener("resize", checkOrientation);
window.addEventListener("orientationchange", checkOrientation);

// Initial orientation check
checkOrientation();

function startGame() {
  document.getElementById("start-screen").innerHTML = "<h1>Game Loading...</h1>";
}
