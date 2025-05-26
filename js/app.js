/**
 * Application principale - Globe Interactif Three.js
 * Orchestre tous les modules pour créer l'expérience du globe
 */

class GlobeApp {
    constructor() {
        // Initialisation des managers
        this.sceneManager = new SceneManager();
        this.cameraManager = new CameraManager();
        this.globeManager = new GlobeManager();
        this.starFieldManager = new StarFieldManager();
        this.uiManager = new UIManager();
        
        // Variables de l'application
        this.isInitialized = false;
        this.animationId = null;
    }

    /**
     * Initialise l'application
     */
    async init() {
        try {
            // Initialisation de l'interface utilisateur
            this.uiManager.init();
            
            // Récupération du canvas
            const canvas = document.getElementById('globe-canvas');
            if (!canvas) {
                throw new Error('Canvas non trouvé');
            }
            
            // Initialisation de la scène
            const { scene, renderer } = this.sceneManager.init(canvas);
            
            // Initialisation de la caméra
            const camera = this.cameraManager.init(renderer);
            
            // Création du champ d'étoiles
            const stars = this.starFieldManager.create();
            this.sceneManager.add(stars);
            
            // Création du globe (asynchrone)
            this.globeManager.create((globe) => {
                this.sceneManager.add(globe);
                
                // Initialiser explicitement les contrôles de drag maintenant que le globe est chargé
                setTimeout(() => {
                    this.globeManager.initDragControls();
                    console.log('Contrôles de drag initialisés');
                }, 100);
                
                this.uiManager.hideLoading();
                this.uiManager.showNotification('Globe chargé avec succès !');
            });
            
            // Configuration des contrôles clavier
            this.setupKeyboardControls();
            
            // Configuration des événements de redimensionnement
            this.setupWindowEvents();
            
            // Démarrage de la boucle d'animation
            this.startAnimation();
            
            this.isInitialized = true;
            
        } catch (error) {
            console.error('Erreur lors de l\'initialisation:', error);
            this.uiManager.handleError(error);
        }
    }

    /**
     * Configure les contrôles clavier
     */
    setupKeyboardControls() {
        // Espace : Basculer l'auto-rotation
        this.uiManager.registerKeyCallback('Space', () => {
            const isAutoRotating = this.globeManager.toggleAutoRotate();
            this.uiManager.showNotification(
                isAutoRotating ? 'Auto-rotation activée' : 'Auto-rotation désactivée'
            );
        });
        
        // R : Réinitialiser la caméra et l'échelle du globe
        this.uiManager.registerKeyCallback('KeyR', () => {
            this.cameraManager.reset();
            this.globeManager.resetScale(); // Réinitialiser aussi l'échelle du globe
            this.uiManager.showNotification('Vue réinitialisée');
        });
    }

    /**
     * Configure les événements de fenêtre
     */
    setupWindowEvents() {
        window.addEventListener('resize', () => {
            this.onWindowResize();
        }, false);
        
        // Gestion des erreurs globales
        window.addEventListener('error', (e) => {
            this.uiManager.handleError(e.error);
        });
    }

    /**
     * Gère le redimensionnement de la fenêtre
     */
    onWindowResize() {
        this.cameraManager.onWindowResize();
        this.sceneManager.onWindowResize();
    }

    /**
     * Démarre la boucle d'animation
     */
    startAnimation() {
        this.animate();
    }

    /**
     * Arrête la boucle d'animation
     */
    stopAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    /**
     * Boucle d'animation principale
     */
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        // Mise à jour des différents managers
        this.cameraManager.update();
        this.globeManager.update();
        this.starFieldManager.update();
        
        // Rendu de la scène
        this.sceneManager.render(this.cameraManager.getCamera());
    }

    /**
     * Méthodes utilitaires pour accéder aux managers
     */
    getSceneManager() { return this.sceneManager; }
    getCameraManager() { return this.cameraManager; }
    getGlobeManager() { return this.globeManager; }
    getStarFieldManager() { return this.starFieldManager; }
    getUIManager() { return this.uiManager; }
}

// Instance globale de l'application
let globeApp;

// Démarrage de l'application quand le DOM est prêt
document.addEventListener('DOMContentLoaded', function() {
    globeApp = new GlobeApp();
    globeApp.init();
});

// Export pour utilisation externe
window.GlobeApp = GlobeApp;
window.globeApp = globeApp; 