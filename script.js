// script.js
const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set canvas dimensions to fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Player setup
const player = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  size: 40,
  speed: 3,
  dx: 0,
  dy: 0,
};

// Bullets
const bullets = [];

// Enemies
const enemies = [];

// Game states
let isGameRunning = false;
let moveJoystickActive = false;
let fireJoystickActive = false;
let moveJoystickX = 0;
let moveJoystickY = 0;
let fireAngle = 0;

// DOM elements
const moveJoystick = document.getElementById("joystick-move");
const moveJoystickContainer = document.getElementById("joystick-move-container");
const fireJoystick = document.getElementById("joystick-fire");
const fireJoystickContainer = document.getElementById("joystick-fire-container");

// Add a start button dynamically
const startButton = document.createElement("button");
startButton.textContent = "Start Game";
startButton.style.position = "absolute";
startButton.style.top = "50%";
startButton.style.left = "50%";
startButton.style.transform = "translate(-50%, -50%)";
startButton.style.padding = "10px 20px";
startButton.style.fontSize = "20px";
startButton.style.cursor = "pointer";
document.body.appendChild(startButton);

// Start game function
function startGame() {
  isGameRunning = true;
  startButton.style.display = "none";
  resetGame();
  update();
}

// Restart game function
function resetGame() {
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
  bullets.length = 0;
  enemies.length = 0;
}

// Movement joystick
moveJoystickContainer.addEventListener("touchstart", () => {
  if (!isGameRunning) return;
  moveJoystickActive = true;
});

moveJoystickContainer.addEventListener("touchmove", (e) => {
  if (!isGameRunning || !moveJoystickActive) return;
  const touch = e.touches[0];
  const rect = moveJoystickContainer.getBoundingClientRect();
  const offsetX = touch.clientX - rect.left - rect.width / 2;
  const offsetY = touch.clientY - rect.top - rect.height / 2;

  const angle = Math.atan2(offsetY, offsetX);
  moveJoystickX = Math.cos(angle) * player.speed;
  moveJoystickY = Math.sin(angle) * player.speed;

  moveJoystick.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
});

moveJoystickContainer.addEventListener("touchend", () => {
  moveJoystickActive = false;
  moveJoystickX = 0;
  moveJoystickY = 0;
  moveJoystick.style.transform = "translate(0px, 0px)";
});

// Fire joystick
fireJoystickContainer.addEventListener("touchstart", () => {
  if (!isGameRunning) return;
  fireJoystickActive = true;
});

fireJoystickContainer.addEventListener("touchmove", (e) => {
  if (!isGameRunning || !fireJoystickActive) return;
  const touch = e.touches[0];
  const rect = fireJoystickContainer.getBoundingClientRect();
  const offsetX = touch.clientX - rect.left - rect.width / 2;
  const offsetY = touch.clientY - rect.top - rect.height / 2;

  fireAngle = Math.atan2(offsetY, offsetX);

  fireJoystick.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
});

fireJoystickContainer.addEventListener("touchend", () => {
  fireJoystickActive = false;
  fireJoystick.style.transform = "translate(0px, 0px)";
});

// Spawn enemies randomly
function spawnEnemy() {
  if (!isGameRunning) return;
  const size = Math.random() * 30 + 20;
  const side = Math.floor(Math.random() * 4);

  let x, y;
  if (side === 0) {
    x = Math.random() * canvas.width;
    y = -size;
  } else if (side === 1) {
    x = canvas.width + size;
    y = Math.random() * canvas.height;
  } else if (side === 2) {
    x = Math.random() * canvas.width;
    y = canvas.height + size;
  } else {
    x = -size;
    y = Math.random() * canvas.height;
  }

  enemies.push({ x, y, size, speed: Math.random() * 2 + 1 });
}

// Spawn enemies every 2 seconds
setInterval(spawnEnemy, 2000);

// Game loop
function update() {
  if (!isGameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update player
  player.x += moveJoystickX;
  player.y += moveJoystickY;

  // Prevent player from moving off-screen
  player.x = Math.max(0, Math.min(canvas.width, player.x));
  player.y = Math.max(0, Math.min(canvas.height, player.y));

  // Draw player
  ctx.fillStyle = "blue";
  ctx.fillRect(player.x - player.size / 2, player.y - player.size / 2, player.size, player.size);

  // Fire bullets
  if (fireJoystickActive) {
    bullets.push({
      x: player.x,
      y: player.y,
      dx: Math.cos(fireAngle) * 10,
      dy: Math.sin(fireAngle) * 10,
    });
  }

  // Update and draw bullets
  bullets.forEach((bullet, index) => {
    bullet.x += bullet.dx;
    bullet.y += bullet.dy;

    if (
      bullet.x < 0 ||
      bullet.x > canvas.width ||
      bullet.y < 0 ||
      bullet.y > canvas.height
    ) {
      bullets.splice(index, 1);
    }

    ctx.fillStyle = "red";
    ctx.fillRect(bullet.x, bullet.y, 5, 5);
  });

  // Update and draw enemies
  enemies.forEach((enemy, index) => {
    const angle = Math.atan2(player.y - enemy.y, player.x - enemy.x);
    enemy.x += Math.cos(angle) * enemy.speed;
    enemy.y += Math.sin(angle) * enemy.speed;

    // Check collision with player
    if (
      Math.hypot(player.x - enemy.x, player.y - enemy.y) <
      player.size / 2 + enemy.size / 2
    ) {
      isGameRunning = false;
      alert("Game Over! Click OK to restart.");
      startButton.textContent = "Restart Game";
      startButton.style.display = "block";
    }

    // Check collision with bullets
    bullets.forEach((bullet, bulletIndex) => {
      if (
        bullet.x > enemy.x - enemy.size / 2 &&
        bullet.x < enemy.x + enemy.size / 2 &&
        bullet.y > enemy.y - enemy.size / 2 &&
        bullet.y < enemy.y + enemy.size / 2
      ) {
        enemies.splice(index, 1);
        bullets.splice(bulletIndex, 1);
      }
    });

    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.size / 2, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(update);
}

// Attach the start button event listener
startButton.addEventListener("click", startGame);
