/**
 * Module de gestion du globe
 */

class GlobeManager {
    constructor() {
        this.globe = null;
        this.isLoading = true;
        this.onLoadCallback = null;
        this.camera = null; // Référence à la caméra
        
        // Variables pour le drag
        this.isDragging = false;
        this.previousMousePosition = {
            x: 0,
            y: 0
        };
        this.rotationSpeed = {
            x: 0,
            y: 0
        };
        this.targetRotation = {
            x: 0,
            y: 0
        };
        this.damping = 0.85; // Facteur d'amortissement réduit (était 0.95)
        this.autoRotate = CONFIG.CONTROLS.AUTO_ROTATE;
        this._lastNonZeroSpeed = null;
    }

    /**
     * Crée le globe avec la texture de la Terre
     */
    create(onLoadCallback) {
        this.onLoadCallback = onLoadCallback;
        
        // Essayer de récupérer la caméra dès la création
        if (window.globeApp && window.globeApp.getCameraManager) {
            this.camera = window.globeApp.getCameraManager().getCamera();
            console.log("Caméra stockée dans GlobeManager:", this.camera);
        }
        
        // Géométrie sphérique
        const geometry = new THREE.SphereGeometry(CONFIG.GLOBE.RADIUS, CONFIG.GLOBE.SEGMENTS, CONFIG.GLOBE.SEGMENTS);
        
        // Chargement de la texture
        const textureLoader = new THREE.TextureLoader();
        
        textureLoader.load(
            CONFIG.GLOBE.TEXTURE_PATH, // Chemin vers votre image
            (texture) => this.onTextureLoaded(texture, geometry),
            (progress) => this.onLoadProgress(progress),
            (error) => this.onLoadError(error, geometry)
        );
    }

    /**
     * Callback appelé quand la texture est chargée
     */
    onTextureLoaded(texture, geometry) {
        // Configuration de la texture
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        
        // Matériau avec la texture
        const material = new THREE.MeshPhongMaterial({
            map: texture,
            shininess: 0.1
        });
        
        // Création du mesh du globe
        this.globe = new THREE.Mesh(geometry, material);
        
        // Rotation initiale pour positionner correctement la carte
        this.globe.rotation.y = Math.PI;
        
        this.isLoading = false;
        
        // Initialisation des contrôles de drag
        this.initDragControls();
        
        // Initialiser l'affichage du zoom
        this.updateZoomDisplay(1);
        
        // Appeler le callback de fin de chargement
        if (this.onLoadCallback) {
            this.onLoadCallback(this.globe);
        }
    }

    /**
     * Initialise les contrôles de drag pour le globe
     * Cette méthode doit être appelée depuis l'extérieur après l'initialisation
     */
    initDragControls() {
        // Récupérer le canvas depuis la scène principale
        const canvas = document.getElementById('globe-canvas');
        
        if (!canvas) {
            console.error('Canvas #globe-canvas introuvable pour initialiser les contrôles de drag');
            return;
        }
        
        console.log('Initialisation des contrôles de drag sur', canvas);
        
        // Essayer de récupérer la caméra à nouveau
        if (!this.camera && window.globeApp && window.globeApp.getCameraManager) {
            this.camera = window.globeApp.getCameraManager().getCamera();
            console.log("Caméra stockée lors de l'initialisation des contrôles:", this.camera);
        }
        
        // Ajout des écouteurs d'événements
        canvas.addEventListener('mousedown', this.onMouseDown.bind(this));
        canvas.addEventListener('mousemove', this.onMouseMove.bind(this));
        canvas.addEventListener('mouseup', this.onMouseUp.bind(this));
        canvas.addEventListener('mouseleave', this.onMouseUp.bind(this));
        
        // Ajout de l'écouteur pour la molette de souris (zoom)
        canvas.addEventListener('wheel', this.onMouseWheel.bind(this));
        
        // Support tactile
        canvas.addEventListener('touchstart', this.onTouchStart.bind(this));
        canvas.addEventListener('touchmove', this.onTouchMove.bind(this));
        canvas.addEventListener('touchend', this.onTouchEnd.bind(this));
    }
    
    /**
     * Gestion des événements souris
     */
    onMouseDown(event) {
        console.log('Début du drag');
        this.isDragging = true;
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
        
        // Réinitialiser les variables liées à l'inertie
        this.rotationSpeed.x = 0;
        this.rotationSpeed.y = 0;
        this._lastNonZeroSpeed = null; // Réinitialiser la dernière vitesse connue
        
        // Stopper l'auto-rotation si elle est active
        if (this.autoRotate) {
            this._wasAutoRotating = true;
            this.autoRotate = false;
        }
        
        // Empêcher le comportement par défaut et la propagation
        event.preventDefault();
        event.stopPropagation();
    }
    
    onMouseMove(event) {
        if (!this.isDragging || !this.globe) return;
        
        const deltaMove = {
            x: event.clientX - this.previousMousePosition.x,
            y: event.clientY - this.previousMousePosition.y
        };
        
        // Log pour le débogage
        if (Math.abs(deltaMove.x) > 5 || Math.abs(deltaMove.y) > 5) {
            console.log('Mouvement détecté:', deltaMove);
        }
        
        // Rotation horizontale (axe Y) - sensibilité réduite
        this.globe.rotation.y += deltaMove.x * 0.0025;
        
        // Rotation verticale (axe X) avec limites - sensibilité réduite
        this.globe.rotation.x += deltaMove.y * 0.0025;
        this.globe.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.globe.rotation.x));
        
        // Mettre à jour la vitesse de rotation - sensibilité réduite
        this.rotationSpeed.x = deltaMove.y * 0.0005;
        this.rotationSpeed.y = deltaMove.x * 0.0005;
        
        // Sauvegarder la dernière vitesse non nulle si significative
        if (Math.abs(deltaMove.x) > 3 || Math.abs(deltaMove.y) > 3) {
            this._lastNonZeroSpeed = {
                x: this.rotationSpeed.x,
                y: this.rotationSpeed.y
            };
            console.log('Vitesse sauvegardée:', this._lastNonZeroSpeed);
        }
        
        this.previousMousePosition = {
            x: event.clientX,
            y: event.clientY
        };
        
        // Empêcher le comportement par défaut et la propagation
        event.preventDefault();
        event.stopPropagation();
    }
    
    onMouseUp(event) {
        console.log('Fin du drag, vitesse de rotation:', this.rotationSpeed);
        
        // Utiliser directement la dernière vitesse non nulle connue
        if (this._lastNonZeroSpeed) {
            console.log('Application de la dernière vitesse non nulle:', this._lastNonZeroSpeed);
            this.rotationSpeed.x = this._lastNonZeroSpeed.x;
            this.rotationSpeed.y = this._lastNonZeroSpeed.y;
        } else {
            // Si aucune vitesse n'a été enregistrée mais qu'un drag a bien eu lieu,
            // appliquer une inertie minimale dans la direction du dernier mouvement
            const dirX = Math.sign(event.clientX - this.previousMousePosition.x);
            const dirY = Math.sign(event.clientY - this.previousMousePosition.y);
            
            if (dirX !== 0 || dirY !== 0) {
                this.applyMinimalInertia(dirX, dirY);
            }
        }
        
        this.isDragging = false;
    }
    
    /**
     * Gestion des événements tactiles
     */
    onTouchStart(event) {
        if (event.touches.length === 1) {
            this.isDragging = true;
            this.previousMousePosition = {
                x: event.touches[0].clientX,
                y: event.touches[0].clientY
            };
            
            // Arrêter l'auto-rotation pendant le drag
            this.rotationSpeed.x = 0;
            this.rotationSpeed.y = 0;
        }
    }
    
    onTouchMove(event) {
        if (!this.isDragging || !this.globe || event.touches.length !== 1) return;
        
        const deltaMove = {
            x: event.touches[0].clientX - this.previousMousePosition.x,
            y: event.touches[0].clientY - this.previousMousePosition.y
        };
        
        // Rotation horizontale (axe Y) - sensibilité réduite
        this.globe.rotation.y += deltaMove.x * 0.0025;
        
        // Rotation verticale (axe X) avec limites - sensibilité réduite
        this.globe.rotation.x += deltaMove.y * 0.0025;
        this.globe.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.globe.rotation.x));
        
        // Mettre à jour la vitesse de rotation - sensibilité réduite
        this.rotationSpeed.x = deltaMove.y * 0.0005;
        this.rotationSpeed.y = deltaMove.x * 0.0005;
        
        // Sauvegarder la dernière vitesse non nulle si significative
        if (Math.abs(deltaMove.x) > 3 || Math.abs(deltaMove.y) > 3) {
            this._lastNonZeroSpeed = {
                x: this.rotationSpeed.x,
                y: this.rotationSpeed.y
            };
            console.log('Vitesse tactile sauvegardée:', this._lastNonZeroSpeed);
        }
        
        this.previousMousePosition = {
            x: event.touches[0].clientX,
            y: event.touches[0].clientY
        };
        
        // Empêcher le comportement par défaut
        event.preventDefault();
    }
    
    onTouchEnd(event) {
        console.log('Fin du touch, vitesse de rotation:', this.rotationSpeed);
        
        // Utiliser directement la dernière vitesse non nulle connue
        if (this._lastNonZeroSpeed) {
            console.log('Application de la dernière vitesse tactile:', this._lastNonZeroSpeed);
            this.rotationSpeed.x = this._lastNonZeroSpeed.x;
            this.rotationSpeed.y = this._lastNonZeroSpeed.y;
        } else if (this.previousMousePosition) {
            // Appliquer une inertie minimale par défaut pour les petits mouvements tactiles
            this.applyMinimalInertia(1, 0); // Inertie horizontale par défaut
        }
        
        this.isDragging = false;
    }

    /**
     * Callback de progression du chargement
     */
    onLoadProgress(progress) {
        const percentage = (progress.loaded / progress.total * 100);
        console.log('Chargement: ' + percentage + '%');
    }

    /**
     * Callback d'erreur de chargement
     */
    onLoadError(error, geometry) {
        console.error('Erreur lors du chargement de la texture:', error);
        // Créer un globe basique en cas d'erreur
        this.createBasicGlobe(geometry);
    }

    /**
     * Création d'un globe basique en cas d'erreur de chargement
     */
    createBasicGlobe(geometry) {
        const material = new THREE.MeshPhongMaterial({
            color: 0x2194ce,
            shininess: 0.1,
            wireframe: false
        });
        
        this.globe = new THREE.Mesh(geometry, material);
        this.isLoading = false;
        
        // Initialisation des contrôles de drag
        this.initDragControls();
        
        // Appeler le callback de fin de chargement
        if (this.onLoadCallback) {
            this.onLoadCallback(this.globe);
        }
    }

    /**
     * Bascule l'auto-rotation
     */
    toggleAutoRotate() {
        this.autoRotate = !this.autoRotate;
        return this.autoRotate;
    }

    /**
     * Met à jour l'animation du globe
     */
    update() {
        if (!this.globe || this.isLoading) return;
        
        if (!this.isDragging) {
            // Auto-rotation si activée
            if (this.autoRotate) {
                this.globe.rotation.y += CONFIG.GLOBE.ROTATION_SPEED;
            }
            
            // Appliquer l'inertie si le globe a été drag
            if (Math.abs(this.rotationSpeed.x) > 0.0001 || Math.abs(this.rotationSpeed.y) > 0.0001) {
                console.log('Inertie appliquée:', this.rotationSpeed);
                
                this.globe.rotation.x += this.rotationSpeed.x;
                this.globe.rotation.y += this.rotationSpeed.y;
                
                // Limiter la rotation verticale
                this.globe.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.globe.rotation.x));
                
                // Appliquer l'amortissement
                this.rotationSpeed.x *= this.damping;
                this.rotationSpeed.y *= this.damping;
                
                // Réinitialiser les vitesses très faibles pour éviter des calculs inutiles
                if (Math.abs(this.rotationSpeed.x) < 0.00001) this.rotationSpeed.x = 0;
                if (Math.abs(this.rotationSpeed.y) < 0.00001) this.rotationSpeed.y = 0;
            }
        }
    }

    /**
     * Applique une inertie minimale dans une direction donnée
     * Utile pour les petits drags
     */
    applyMinimalInertia(directionX, directionY, speed = 0.002) {
        // Appliquer une vitesse minimale dans la direction donnée
        this.rotationSpeed.x = directionY * speed;
        this.rotationSpeed.y = directionX * speed;
        
        // Sauvegarder comme dernière vitesse non nulle
        this._lastNonZeroSpeed = {
            x: this.rotationSpeed.x,
            y: this.rotationSpeed.y
        };
        
        console.log('Inertie minimale appliquée:', this.rotationSpeed);
    }

    /**
     * Retourne le globe
     */
    getGlobe() {
        return this.globe;
    }

    /**
     * Vérifie si le globe est en cours de chargement
     */
    isLoadingGlobe() {
        return this.isLoading;
    }

    /**
     * Met à jour l'affichage du niveau de zoom dans l'interface
     */
    updateZoomDisplay(scale) {
        const zoomLevelElement = document.getElementById('zoom-level');
        if (zoomLevelElement) {
            // Convertir l'échelle en pourcentage (1 = 100%)
            const zoomPercentage = Math.round(scale * 100);
            zoomLevelElement.textContent = `${zoomPercentage}%`;
            
            // Mettre en évidence le changement avec une animation subtile
            zoomLevelElement.style.transition = 'color 0.2s ease';
            zoomLevelElement.style.color = scale > 1 ? '#00d4ff' : (scale < 1 ? '#ff9900' : '#ffffff');
            
            // Revenir à la couleur normale après un court délai
            setTimeout(() => {
                zoomLevelElement.style.color = '#ffffff';
            }, 500);
        }
    }

    /**
     * Gestion du zoom avec la molette de souris
     */
    onMouseWheel(event) {
        // Empêcher le comportement par défaut (scroll de page)
        event.preventDefault();
        
        // Vérifier que le globe existe
        if (!this.globe) {
            console.error("Le globe n'est pas encore chargé pour le zoom");
            return;
        }
        
        // Définir la vitesse de zoom
        const zoomSpeed = 0.1;
        
        // Déterminer la direction du zoom (deltaY positif = zoom arrière, négatif = zoom avant)
        const delta = Math.sign(event.deltaY);
        const zoomFactor = delta > 0 ? -1 : 1; // Inversé pour que le défilement vers le haut agrandisse
        
        console.log("Zoom détecté:", zoomFactor, "delta:", event.deltaY);
        
        // Obtenir l'échelle actuelle du globe
        const currentScale = this.globe.scale.x; // Toutes les échelles sont identiques (x, y, z)
        
        // Calculer la nouvelle échelle avec un effet fluide
        let newScale = currentScale * (1 + zoomFactor * zoomSpeed);
        
        // Limiter la plage de zoom (ajuster ces valeurs selon vos besoins)
        const minScale = 0.5;  // zoom arrière maximum
        const maxScale = 2.0;  // zoom avant maximum
        
        // Appliquer les limites
        newScale = Math.max(minScale, Math.min(maxScale, newScale));
        
        // Appliquer la nouvelle échelle uniformément sur tous les axes
        this.globe.scale.set(newScale, newScale, newScale);
        
        // Mettre à jour l'affichage du niveau de zoom
        this.updateZoomDisplay(newScale);
        
        console.log("Nouvelle échelle du globe:", newScale);
    }
    
    /**
     * Réinitialise l'échelle du globe à sa valeur par défaut
     */
    resetScale() {
        if (this.globe) {
            // Réinitialiser l'échelle à 1
            this.globe.scale.set(1, 1, 1);
            
            // Mettre à jour l'affichage du niveau de zoom
            this.updateZoomDisplay(1);
            
            console.log("Échelle du globe réinitialisée");
        }
    }
}

// Export du module
window.GlobeManager = GlobeManager; 