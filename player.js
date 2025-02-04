export class Player {
    constructor(camera, walls, crates) {
        this.camera = camera;
        this.walls = walls;
        this.crates = crates;
        
        // Player's movement & camera variables
        this.moveX = 0;
        this.moveZ = 0;
        this.yaw = 0;
        this.pitch = 0;
        this.sensitivity = 0.005;
        this.speed = 0.1;
        
        // Joystick input tracking
        this.joystickContainer = document.getElementById("joystick-container");
        this.joystick = document.getElementById("joystick");
        this.joystickActive = false;
        this.joystickStartX = 0;
        this.joystickStartY = 0;

        // Look input tracking
        this.lookArea = document.getElementById('look-area');
        this.lookActive = false;
        this.lookStartX = 0;
        this.lookStartY = 0;

        // Initialize joystick and look controls
        this.initControls();
    }

    initControls() {
        // Joystick controls
        this.joystickContainer.addEventListener("touchstart", (event) => {
            for (let touch of event.touches) {
                if (touch.target === this.joystick || this.joystick.contains(touch.target)) {
                    this.joystickActive = true;
                    this.joystickStartX = touch.clientX;
                    this.joystickStartY = touch.clientY;
                }
            }
        });

        this.joystickContainer.addEventListener("touchmove", (event) => {
            if (!this.joystickActive) return;

            for (let touch of event.touches) {
                if (touch.target === this.joystick || this.joystick.contains(touch.target)) {
                    let dx = touch.clientX - this.joystickStartX;
                    let dy = touch.clientY - this.joystickStartY;

                    this.moveX = dx / 50;
                    this.moveZ = dy / 50;

                    this.joystick.style.transform = `translate(${dx * 0.5}px, ${dy * 0.5}px)`;
                }
            }
        });

        this.joystickContainer.addEventListener("touchend", (event) => {
            if (event.touches.length === 0) {
                this.joystickActive = false;
                this.moveX = 0;
                this.moveZ = 0;
                this.joystick.style.transform = "translate(0px, 0px)";
            }
        });

        // Look controls
        this.lookArea.addEventListener("touchstart", (event) => {
            for (let touch of event.touches) {
                if (touch.target === this.lookArea) {
                    this.lookActive = true;
                    this.lookStartX = touch.clientX;
                    this.lookStartY = touch.clientY;
                }
            }
        });

        this.lookArea.addEventListener("touchmove", (event) => {
            if (!this.lookActive) return;

            for (let touch of event.touches) {
                if (touch.target === this.lookArea) {
                    let dx = touch.clientX - this.lookStartX;
                    let dy = touch.clientY - this.lookStartY;

                    this.yaw -= dx * this.sensitivity;
                    this.pitch -= dy * this.sensitivity;

                    this.pitch = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, this.pitch));

                    this.lookStartX = touch.clientX;
                    this.lookStartY = touch.clientY;
                }
            }
        });

        this.lookArea.addEventListener("touchend", (event) => {
            if (event.touches.length === 0) {
                this.lookActive = false;
            }
        });
    }

    // Collision Detection
    checkCollision(newPosition) {
        const cameraBox = new THREE.Box3().setFromCenterAndSize(newPosition, new THREE.Vector3(0.5, 1.8, 0.5)); // camera bounds
        for (let wall of this.walls) {
            const wallBox = new THREE.Box3().setFromObject(wall);
            if (cameraBox.intersectsBox(wallBox)) {
                return true; // Collision detected
            }
        }
        for (let crate of this.crates) {
            const crateBox = new THREE.Box3().setFromObject(crate);
            if (cameraBox.intersectsBox(crateBox)) {
                return true; // Collision detected
            }
        }
        return false; // No collision
    }

    // Update player movement and camera rotation
    update() {
        let newPosition = this.camera.position.clone();

        // Player movement direction
        let direction = new THREE.Vector3();
        this.camera.getWorldDirection(direction);
        direction.y = 0; // Keep the movement on the horizontal plane

        let right = new THREE.Vector3().crossVectors(direction, new THREE.Vector3(0, 1, 0)).normalize();

        // Calculate the new position based on movement input
        let moveDirection = new THREE.Vector3();
        moveDirection.addScaledVector(direction, -this.moveZ * this.speed);
        moveDirection.addScaledVector(right, this.moveX * this.speed);

        // Update the new position
        newPosition.add(moveDirection);

        // Check if the new position collides with any walls or crates
        if (!this.checkCollision(newPosition)) {
            // Apply the movement if no collision
            this.camera.position.add(moveDirection);
        }

        // Apply camera rotation
        this.camera.rotation.order = "YXZ";
        this.camera.rotation.y = this.yaw;
        this.camera.rotation.x = this.pitch;
    }
}
