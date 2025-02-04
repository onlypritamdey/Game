import * as THREE from 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.min.js';
import { Player } from './player.js';

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

// Walls
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

// Crates
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

// Initialize Player
const player = new Player(camera, walls, crates);

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

// ** Game Loop with Player Update **
function animate() {
    requestAnimationFrame(animate);

    // Update player movement and look
    player.update();

    // Render the scene
    renderer.render(scene, camera);
}

animate();
