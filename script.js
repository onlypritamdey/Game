// Buttons
const playButton = document.getElementById("play-button");
const settingsButton = document.getElementById("settings-button");
const exitButton = document.getElementById("exit-button");

// Fullscreen Handler
function enableFullscreen() {
  const element = document.documentElement;

  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.webkitRequestFullscreen) {
    element.webkitRequestFullscreen(); // Safari
  } else if (element.msRequestFullscreen) {
    element.msRequestFullscreen(); // IE11
  }
}

// Play Button
playButton.addEventListener("click", () => {
  enableFullscreen();
  alert("Starting the Game... (Add navigation to the game screen here)");
});

// Settings Button
settingsButton.addEventListener("click", () => {
  alert("Open Settings... (Add your settings screen logic here)");
});

// Exit Button
exitButton.addEventListener("click", () => {
  alert("Exiting the Game... (Add your exit logic here)");
});
