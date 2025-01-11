function startGame() {
    // Request full screen
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    } else if (document.documentElement.mozRequestFullScreen) { // Firefox
        document.documentElement.mozRequestFullScreen();
    } else if (document.documentElement.webkitRequestFullscreen) { // Chrome, Safari, Opera
        document.documentElement.webkitRequestFullscreen();
    } else if (document.documentElement.msRequestFullscreen) { // IE/Edge
        document.documentElement.msRequestFullscreen();
    }

    // Proceed with the game start
    alert("Game Starting...");
    // Redirect to the game screen or load the game
    // Example: window.location.href = "game.html";
}

function openSettings() {
    alert("Settings screen");
    // Open settings page or modal
}

function openMultiplayer() {
    alert("Multiplayer screen");
    // Open multiplayer page or options
}

function openInstructions() {
    alert("How to Play");
    // Open instructions/tutorial page
}
