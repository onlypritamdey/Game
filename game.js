import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';

// Setup scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Sky color
scene.background = new THREE.Color(0x87CEEB); // Light blue sky

// Lighting
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x404040, 1.5));

// Ground
const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(50, 50),
    new THREE.MeshStandardMaterial({ color: 0x228B22 }) // Green ground
);
ground.rotation.x = -Math.PI / 2;
scene.add(ground);

// Walls and Crates Setup (Using previous code)
const wallMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
const wallGeometry = new THREE.BoxGeometry(10, 3, 1);

const walls = [
    new THREE.Mesh(wallGeometry, wallMaterial), // Front
    new THREE.Mesh(wallGeometry, wallMaterial), // Back
    new THREE.Mesh(wallGeometry, wallMaterial), // Left
    new THREE.Mesh(wallGeometry, wallMaterial)  // Right
];

walls[0].position.set(0, 1.5, -10);
walls[1].position.set(0, 1.5, 10);
walls[2].rotation.y = Math.PI / 2;
walls[2].position.set(-10, 1.5, 0);
walls[3].rotation.y = Math.PI / 2;
walls[3].position.set(10, 1.5, 0);

walls.forEach(wall => scene.add(wall));

const crateGeometry = new THREE.BoxGeometry(2, 2, 2);
const crateMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 });

const crates = [
    new THREE.Mesh(crateGeometry, crateMaterial),
    new THREE.Mesh(crateGeometry, crateMaterial),
    new THREE.Mesh(crateGeometry, crateMaterial)
];

crates[0].position.set(-3, 1, -5);
crates[1].position.set(5, 1, 3);
crates[2].position.set(-7, 1, 7);

crates.forEach(crate => scene.add(crate));

// ** Gun Setup **
const gunGeometry = new THREE.BoxGeometry(0.5, 0.2, 1.5); // Simple box as gun
const gunMaterial = new THREE.MeshStandardMaterial({ color: 0x888888 });
const gun = new THREE.Mesh(gunGeometry, gunMaterial);

// Position the gun in front of the camera
gun.position.set(0, -0.5, -2);
camera.add(gun);  // Add gun as a child of the camera

// Camera positioning
camera.position.set(0, 1.6, 0);

// Movement & Look variables
let moveX = 0, moveZ = 0;
let yaw = 0, pitch = 0;
const sensitivity = 0.005;
const speed = 0.1;

// ** Joystick Setup **
const joystickContainer = document.getElementById("joystick-container");
const joystick = document.getElementById("joystick");
let joystickActive = false, joystickStartX = 0, joystickStartY = 0;

joystickContainer.addEventListener("touchstart", (event) => {
    for (let touch of event.touches) {
        if (touch.target === joystick || joystick.contains(touch.target)) {
            joystickActive = true;
            joystickStartX = touch.clientX;
            joystickStartY = touch.clientY;
        }
    }
});

joystickContainer.addEventListener("touchmove", (event) => {
    if (!joystickActive) return;

    for (let touch of event.touches) {
        if (touch.target === joystick || joystick.contains(touch.target)) {
            let dx = touch.clientX - joystickStartX;
            let dy = touch.clientY - joystickStartY;

            moveX = dx / 50;
            moveZ = dy / 50;

            joystick.style.transform = `translate(${dx * 0.5}px, ${dy * 0.5}px)`;
        }
    }
});

joystickContainer.addEventListener("touchend", (event) => {
    if (event.touches.length === 0) {
        joystickActive = false;
        moveX = 0;
        moveZ = 0;
        joystick.style.transform = "translate(0px, 0px)";
    }
});

// ** Look Area Setup **
const lookArea = document.getElementById('look-area');
let lookActive = false, lookStartX = 0, lookStartY = 0;

lookArea.addEventListener("touchstart", (event) => {
    for (let touch of event.touches) {
        if (touch.target === lookArea) {
            lookActive = true;
            lookStartX = touch.clientX;
            lookStartY = touch.clientY;
        }
    }
});

lookArea.addEventListener("touchmove", (event) => {
    if (!lookActive) return;

    for (let touch of event.touches) {
        if (touch.target === lookArea) {
            let dx = touch.clientX - lookStartX;
            let dy = touch.clientY - lookStartY;

            yaw -= dx * sensitivity;
            pitch -= dy * sensitivity;

            pitch = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, pitch));

            lookStartX = touch.clientX;
            lookStartY = touch.clientY;
        }
    }
});

lookArea.addEventListener("touchend", (event) => {
    if (event.touches.length === 0) {
        lookActive = false;
    }
});

// ** Gun Fire (Simple Raycast)**
const bullets = [];

function fireBullet() {
    const bulletGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const bulletMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
    const bullet = new THREE.Mesh(bulletGeometry, bulletMaterial);

    // Position bullet at gun muzzle
    bullet.position.set(gun.position.x, gun.position.y, gun.position.z);
    scene.add(bullet);
    
    // Direction of the bullet
    const direction = new THREE.Vector3();
    camera.getWorldDirection(direction);

    // Velocity and movement
    const velocity = direction.multiplyScalar(0.5);  // Speed of bullet
    bullet.userData = { velocity: velocity };  // Store velocity in userData for updates

    bullets.push(bullet);
}

// ** Joystick Setup for Fire (right button)**
document.addEventListener('touchstart', (event) => {
    // Detect the firing action (right side area tap)
    if (event.touches.length > 0 && event.touches[0].clientX > window.innerWidth / 2) {
        fireBullet();
    }
});

// ** Bullet Update**
function updateBullets() {
    for (let i = 0; i < bullets.length; i++) {
        const bullet = bullets[i];
        bullet.position.add(bullet.userData.velocity);
        
        // Simple collision check (could be expanded)
        if (bullet.position.length() > 50) {
            scene.remove(bullet);  // Remove bullet after it moves out of range
            bullets.splice(i, 1);
            i--;
        }
    }
}

// ** Adjust Orientation & Aspect Ratio on Screen Rotate **
function adjustOrientation() {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.fov = aspect > 1 ? 75 : 90;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

window.addEventListener("resize", adjustOrientation);
adjustOrientation();

// ** Game Loop with Collision Detection and Bullet Update**
function animate() {
    requestAnimationFrame(animate);

    // Player movement and camera rotation logic (same as before)
    let direction = new THREE.Vector3();
    camera.getWorldDirection(direction);
    direction.y = 0;

    let right = new THREE.Vector3().crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize();
    let moveDirection = new THREE.Vector3();
    moveDirection.addScaledVector(direction, -moveZ * speed);
    moveDirection.addScaledVector(right, moveX * speed);

    // Update position
    let newPosition = camera.position.clone().add(moveDirection);
    if (!checkCollision(newPosition)) {
        camera.position.add(moveDirection);
    }

    // Apply camera rotation
    camera.rotation.order = "YXZ";
    camera.rotation.y = yaw;
    camera.rotation.x = pitch;

    // Bullet update
    updateBullets();

    // Render scene
    renderer.render(scene, camera);
}

animate();
