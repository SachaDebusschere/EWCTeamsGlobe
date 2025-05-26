/**
 * Module exemple - Gestion des marqueurs géographiques
 * Démontre comment étendre l'application avec de nouvelles fonctionnalités
 */

class MarkersManager {
    constructor() {
        this.markers = [];
        this.markerGroup = null;
        this.globe = null;
    }

    /**
     * Initialise le système de marqueurs
     * @param {THREE.Mesh} globe - Référence à l'objet globe (optionnel)
     */
    init(globe) {
        this.markerGroup = new THREE.Group();
        if (globe) {
            this.attachToGlobe(globe);
        }
        return this.markerGroup;
    }
    
    /**
     * Attache le groupe de marqueurs au globe
     * @param {THREE.Mesh} globe - L'objet globe
     */
    attachToGlobe(globe) {
        if (globe) {
            // Détacher d'abord du parent actuel si nécessaire
            if (this.markerGroup.parent) {
                this.markerGroup.parent.remove(this.markerGroup);
            }
            
            // Attacher au globe
            globe.add(this.markerGroup);
            this.globe = globe;
        }
    }

    /**
     * Ajoute un marqueur à une position géographique
     * @param {number} lat - Latitude en degrés
     * @param {number} lon - Longitude en degrés
     * @param {Object} options - Options du marqueur (couleur, taille, etc.)
     */
    addMarker(lat, lon, options = {}) {
        const marker = this.createMarker(lat, lon, options);
        this.markers.push(marker);
        this.markerGroup.add(marker.mesh);
        return marker;
    }

    /**
     * Crée un marqueur 3D
     */
    createMarker(lat, lon, options) {
        // Conversion coordonnées géographiques vers position 3D
        const position = this.geoToCartesian(lat, lon, CONFIG.GLOBE.RADIUS + 0.1);
        
        // Géométrie du marqueur (sphère par défaut)
        const geometry = new THREE.SphereGeometry(options.size || 0.05, 8, 8);
        const material = new THREE.MeshBasicMaterial({
            color: options.color || 0xff0000,
            transparent: true,
            opacity: options.opacity || 0.8
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.copy(position);
        
        // Animation de pulsation
        const marker = {
            mesh: mesh,
            lat: lat,
            lon: lon,
            options: options,
            scale: 1,
            pulseSpeed: options.pulseSpeed || 0.02
        };
        
        return marker;
    }

    /**
     * Convertit les coordonnées géographiques en position cartésienne
     */
    geoToCartesian(lat, lon, radius) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = (radius * Math.sin(phi) * Math.sin(theta));
        const y = (radius * Math.cos(phi));
        
        return new THREE.Vector3(x, y, z);
    }

    /**
     * Met à jour l'animation des marqueurs
     */
    update() {
        this.markers.forEach(marker => {
            // Animation de pulsation
            marker.scale += marker.pulseSpeed;
            if (marker.scale > 1.5 || marker.scale < 0.8) {
                marker.pulseSpeed *= -1;
            }
            marker.mesh.scale.setScalar(marker.scale);
        });
    }

    /**
     * Supprime un marqueur
     */
    removeMarker(marker) {
        const index = this.markers.indexOf(marker);
        if (index > -1) {
            this.markers.splice(index, 1);
            this.markerGroup.remove(marker.mesh);
        }
    }

    /**
     * Supprime tous les marqueurs
     */
    clearMarkers() {
        this.markers.forEach(marker => {
            this.markerGroup.remove(marker.mesh);
        });
        this.markers = [];
    }

    /**
     * Ajoute des marqueurs de villes importantes (exemple)
     */
    addWorldCities() {
        const cities = [
            { name: 'Paris', lat: 48.8566, lon: 2.3522, color: 0x0066cc },
            { name: 'New York', lat: 40.7128, lon: -74.0060, color: 0x00cc66 },
            { name: 'Tokyo', lat: 35.6762, lon: 139.6503, color: 0xcc6600 },
            { name: 'Sydney', lat: -33.8688, lon: 151.2093, color: 0xcc0066 },
            { name: 'Londres', lat: 51.5074, lon: -0.1278, color: 0x6600cc }
        ];

        cities.forEach(city => {
            this.addMarker(city.lat, city.lon, {
                color: city.color,
                size: 0.08,
                opacity: 0.9,
                pulseSpeed: 0.01
            });
        });
    }
}

// Export du module
window.MarkersManager = MarkersManager;

// Configuration pour les marqueurs
if (window.CONFIG) {
    window.CONFIG.MARKERS = {
        DEFAULT_SIZE: 0.05,
        DEFAULT_COLOR: 0xff0000,
        DEFAULT_OPACITY: 0.8,
        PULSE_SPEED: 0.02
    };
} 