/**
 * Module de gestion de la caméra et des contrôles
 */

class CameraManager {
    constructor() {
        this.camera = null;
        this.controls = null;
    }

    /**
     * Initialise la caméra
     */
    init(renderer) {
        // Configuration de la caméra
        this.camera = new THREE.PerspectiveCamera(
            CONFIG.CAMERA.FOV, 
            window.innerWidth / window.innerHeight, 
            CONFIG.CAMERA.NEAR, 
            CONFIG.CAMERA.FAR
        );
        this.camera.position.set(0, 0, CONFIG.CAMERA.INITIAL_DISTANCE);
        
        // Configuration des contrôles
        this.setupControls(renderer);
        
        return this.camera;
    }

    /**
     * Configure les contrôles de caméra
     */
    setupControls(renderer) {
        // Désactiver complètement les contrôles pour éviter toute interférence
        this.controls = null;
        return;

        /* Ancien code des contrôles
        this.controls = new THREE.OrbitControls(this.camera, renderer.domElement);
        
        // Configuration des contrôles
        this.controls.enableDamping = CONFIG.CONTROLS.ENABLE_DAMPING;
        this.controls.dampingFactor = CONFIG.CONTROLS.DAMPING_FACTOR;
        this.controls.enableZoom = true;
        this.controls.enablePan = false;
        this.controls.enableRotate = false;
        
        // Limites de zoom
        this.controls.minDistance = CONFIG.CAMERA.MIN_DISTANCE;
        this.controls.maxDistance = CONFIG.CAMERA.MAX_DISTANCE;
        
        // Limites de rotation verticale
        this.controls.maxPolarAngle = Math.PI;
        this.controls.minPolarAngle = 0;
        
        // Vitesse de rotation
        this.controls.rotateSpeed = CONFIG.CONTROLS.ROTATE_SPEED;
        this.controls.zoomSpeed = CONFIG.CONTROLS.ZOOM_SPEED;
        this.controls.panSpeed = CONFIG.CONTROLS.PAN_SPEED;
        
        // Auto-rotation désactivée
        this.controls.autoRotate = false;
        this.controls.autoRotateSpeed = CONFIG.CONTROLS.AUTO_ROTATE_SPEED;
        */
    }

    /**
     * Met à jour les contrôles
     */
    update() {
        if (this.controls) {
            this.controls.update();
        }
    }

    /**
     * Gère le redimensionnement de la fenêtre
     */
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    /**
     * Bascule l'auto-rotation
     */
    toggleAutoRotate() {
        if (this.controls) {
            this.controls.autoRotate = !this.controls.autoRotate;
        }
    }

    /**
     * Réinitialise la position de la caméra
     */
    reset() {
        if (this.controls) {
            this.controls.reset();
        } else if (this.camera) {
            // Réinitialisation manuelle de la position de la caméra
            this.camera.position.set(0, 0, CONFIG.CAMERA.INITIAL_DISTANCE);
            this.camera.updateProjectionMatrix();
            console.log("Position de la caméra réinitialisée à", this.camera.position.z);
        }
    }

    /**
     * Retourne la caméra
     */
    getCamera() {
        return this.camera;
    }
}

// Export du module
window.CameraManager = CameraManager; 