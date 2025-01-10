const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Set up player and game variables
const player = {
  x: 0,
  y: 0,
  size: 40,
  speed: 3,
  dx: 0,
  dy: 0,
};

const bullets = [];
const enemies = [];
let isGameRunning = false;

// Joystick variables
let moveJoystickActive = false;
let fireJoystickActive = false;
let moveJoystickX = 0;
let moveJoystickY = 0;
let fireAngle = 0;

// DOM Elements
const moveJoystick = document.getElementById("joystick-move");
const moveJoystickContainer = document.getElementById("joystick-move-container");
const fireJoystick = document.getElementById("joystick-fire");
const fireJoystickContainer = document.getElementById("joystick-fire-container");

// Resize canvas to fit screen
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  if (window.innerWidth < window.innerHeight) {
    alert("Please rotate your device to landscape mode for the best experience.");
  }
}

// Start game
function startGame() {
  isGameRunning = true;
  resetGame();
  update();
}

// Reset game variables
function resetGame() {
  player.x = canvas.width / 2;
  player.y = canvas.height / 2;
  bullets.length = 0;
  enemies.length = 0;
}

// Spawn enemies
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

// Spawn enemies periodically
setInterval(spawnEnemy, 2000);

// Update the game loop
function update() {
  if (!isGameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Update player
  player.x += moveJoystickX;
  player.y += moveJoystickY;

  // Keep player within canvas bounds
  player.x = Math.max(player.size / 2, Math.min(canvas.width - player.size / 2, player.x));
  player.y = Math.max(player.size / 2, Math.min(canvas.height - player.size / 2, player.y));

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
      alert("Game Over! Refresh the page to restart.");
    }

    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.arc(enemy.x, enemy.y, enemy.size / 2, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(update);
}

// Resize canvas and start game
window.addEventListener("resize", resizeCanvas);
resizeCanvas();
startGame();
