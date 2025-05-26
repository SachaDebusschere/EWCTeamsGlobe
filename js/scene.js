/**
 * Module de gestion de la scène Three.js
 */

class SceneManager {
    constructor() {
        this.scene = null;
        this.renderer = null;
    }

    /**
     * Initialise la scène Three.js
     */
    init(canvas) {
        // Création de la scène
        this.scene = new THREE.Scene();
        
        // Configuration du renderer
        this.renderer = new THREE.WebGLRenderer({ 
            canvas: canvas,
            antialias: true,
            alpha: true 
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        
        // Configuration de l'éclairage
        this.setupLighting();
        
        return { scene: this.scene, renderer: this.renderer };
    }

    /**
     * Configure l'éclairage de la scène
     */
    setupLighting() {
        // Ajout d'un éclairage ambiant plus fort pour un éclairage uniforme
        const ambientLight = new THREE.AmbientLight(CONFIG.LIGHTING.AMBIENT.COLOR, CONFIG.LIGHTING.AMBIENT.INTENSITY);
        this.scene.add(ambientLight);
        
        // Ajout d'une lumière directionnelle douce pour donner du relief
        const directionalLight = new THREE.DirectionalLight(CONFIG.LIGHTING.DIRECTIONAL.COLOR, CONFIG.LIGHTING.DIRECTIONAL.INTENSITY);
        const pos = CONFIG.LIGHTING.DIRECTIONAL.POSITION;
        directionalLight.position.set(pos.x, pos.y, pos.z);
        this.scene.add(directionalLight);
    }

    /**
     * Ajoute un objet à la scène
     */
    add(object) {
        this.scene.add(object);
    }

    /**
     * Gère le redimensionnement de la fenêtre
     */
    onWindowResize() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    /**
     * Effectue le rendu de la scène
     */
    render(camera) {
        this.renderer.render(this.scene, camera);
    }
}

// Export du module
window.SceneManager = SceneManager; 