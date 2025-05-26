/**
 * Module de gestion de l'interface utilisateur
 */

class UIManager {
    constructor() {
        this.loadingElement = null;
        this.keyboardCallbacks = {};
    }

    /**
     * Initialise l'interface utilisateur
     */
    init() {
        this.loadingElement = document.getElementById('loading');
        this.setupKeyboardControls();
    }

    /**
     * Masque l'écran de chargement
     */
    hideLoading() {
        if (this.loadingElement) {
            this.loadingElement.classList.add('hidden');
        }
    }

    /**
     * Affiche l'écran de chargement
     */
    showLoading() {
        if (this.loadingElement) {
            this.loadingElement.classList.remove('hidden');
        }
    }

    /**
     * Configure les contrôles clavier
     */
    setupKeyboardControls() {
        document.addEventListener('keydown', (event) => {
            this.handleKeyDown(event);
        });
    }

    /**
     * Gère les événements clavier
     */
    handleKeyDown(event) {
        const callback = this.keyboardCallbacks[event.code];
        if (callback) {
            callback(event);
            event.preventDefault();
        }
    }

    /**
     * Enregistre un callback pour une touche
     */
    registerKeyCallback(keyCode, callback) {
        this.keyboardCallbacks[keyCode] = callback;
    }

    /**
     * Supprime un callback pour une touche
     */
    unregisterKeyCallback(keyCode) {
        delete this.keyboardCallbacks[keyCode];
    }

    /**
     * Affiche un message de notification
     */
    showNotification(message, duration = 3000) {
        // Créer un élément de notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 20px;
            border-radius: 10px;
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            z-index: 1000;
            font-size: 14px;
            transition: all 0.3s ease;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Supprimer la notification après la durée spécifiée
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    /**
     * Met à jour le pourcentage de chargement
     */
    updateLoadingProgress(percentage) {
        // Optionnel : ajouter une barre de progression
        console.log(`Chargement: ${percentage}%`);
    }

    /**
     * Gère les erreurs d'interface
     */
    handleError(error) {
        console.error('Erreur UI:', error);
        this.hideLoading();
        this.showNotification('Une erreur est survenue lors du chargement', 5000);
    }
}

// Export du module
window.UIManager = UIManager; 