/**
 * Module de gestion du champ d'étoiles
 */

class StarFieldManager {
    constructor() {
        this.stars = null;
    }

    /**
     * Crée le champ d'étoiles
     */
    create() {
        const starGeometry = new THREE.BufferGeometry();
        const starPositions = new Float32Array(CONFIG.STARS.COUNT * 3);
        
        // Génération des positions aléatoires des étoiles
        for (let i = 0; i < CONFIG.STARS.COUNT * 3; i += 3) {
            starPositions[i] = (Math.random() - 0.5) * CONFIG.STARS.SPREAD;
            starPositions[i + 1] = (Math.random() - 0.5) * CONFIG.STARS.SPREAD;
            starPositions[i + 2] = (Math.random() - 0.5) * CONFIG.STARS.SPREAD;
        }
        
        starGeometry.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
        
        const starMaterial = new THREE.PointsMaterial({
            color: CONFIG.STARS.COLOR,
            size: CONFIG.STARS.SIZE,
            sizeAttenuation: false
        });
        
        this.stars = new THREE.Points(starGeometry, starMaterial);
        
        return this.stars;
    }

    /**
     * Met à jour l'animation des étoiles (optionnel)
     */
    update() {
        // Animation des étoiles si nécessaire
        // Par exemple, rotation lente du champ d'étoiles
        if (this.stars) {
            this.stars.rotation.y += CONFIG.STARS.ROTATION_SPEED;
        }
    }

    /**
     * Retourne le champ d'étoiles
     */
    getStars() {
        return this.stars;
    }

    /**
     * Modifie le nombre d'étoiles
     */
    setStarCount(count) {
        CONFIG.STARS.COUNT = count;
    }

    /**
     * Modifie la couleur des étoiles
     */
    setStarColor(color) {
        if (this.stars && this.stars.material) {
            this.stars.material.color.setHex(color);
        }
    }

    /**
     * Modifie la taille des étoiles
     */
    setStarSize(size) {
        if (this.stars && this.stars.material) {
            this.stars.material.size = size;
        }
    }
}

// Export du module
window.StarFieldManager = StarFieldManager; 