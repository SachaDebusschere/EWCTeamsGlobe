/**
 * Module de gestion des marqueurs pour les clubs esports
 * Utilise des sprites avec les logos des clubs
 */

class EsportsMarkersManager {
    constructor() {
        this.markers = [];
        this.markerGroup = null;
        this.globe = null;
        this.textureLoader = new THREE.TextureLoader();
        this.loadedTextures = {};
    }

    /**
     * Initialise le système de marqueurs
     * @param {THREE.Mesh} globe - Référence à l'objet globe
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
            if (this.markerGroup.parent) {
                this.markerGroup.parent.remove(this.markerGroup);
            }
            globe.add(this.markerGroup);
            this.globe = globe;
        }
    }

    /**
     * Précharge les textures des logos
     * @param {Object} logos - Dictionnaire des chemins de logos {id: path}
     * @param {Function} callback - Fonction à appeler quand tout est chargé
     */
    preloadTextures(logos, callback) {
        const totalLogos = Object.keys(logos).length;
        let loadedCount = 0;
        
        for (const [id, path] of Object.entries(logos)) {
            this.textureLoader.load(
                path,
                (texture) => {
                    this.loadedTextures[id] = texture;
                    loadedCount++;
                    
                    if (loadedCount === totalLogos && callback) {
                        callback();
                    }
                },
                undefined,
                (error) => {
                    console.error(`Erreur lors du chargement du logo ${id}:`, error);
                    loadedCount++;
                    
                    if (loadedCount === totalLogos && callback) {
                        callback();
                    }
                }
            );
        }
    }

    /**
     * Ajoute un marqueur de club esport
     * @param {string} clubId - Identifiant du club
     * @param {string} clubName - Nom du club
     * @param {number} lat - Latitude en degrés
     * @param {number} lon - Longitude en degrés
     * @param {Object} options - Options du marqueur
     */
    addClub(clubId, clubName, lat, lon, options = {}) {
        const marker = this.createClubMarker(clubId, clubName, lat, lon, options);
        if (marker) {
            this.markers.push(marker);
            this.markerGroup.add(marker.sprite);
        }
        return marker;
    }

    /**
     * Crée un marqueur pour un club esport
     */
    createClubMarker(clubId, clubName, lat, lon, options) {
        // Vérifier si la texture est chargée
        if (!this.loadedTextures[clubId]) {
            console.error(`Texture non chargée pour le club ${clubId}`);
            return null;
        }
        
        // Position 3D basée sur les coordonnées géographiques
        // Élever légèrement les marqueurs au-dessus de la surface
        const elevationOffset = 0.25; // Décalage pour éviter le z-fighting
        const position = this.geoToCartesian(lat, lon, CONFIG.GLOBE.RADIUS + elevationOffset);
        
        // Créer un sprite avec le logo
        const material = new THREE.SpriteMaterial({
            map: this.loadedTextures[clubId],
            transparent: true,
            opacity: options.opacity || 1.0,
            depthWrite: false,
            depthTest: true,
            sizeAttenuation: true // Ajuster la taille en fonction de la distance
        });
        
        const sprite = new THREE.Sprite(material);
        sprite.position.copy(position);
        sprite.renderOrder = 1; // Assurer que le sprite est rendu au-dessus du globe
        
        // Taille du sprite
        const scale = options.scale || 0.5;
        sprite.scale.set(scale, scale, 1);
        
        // Ajouter des métadonnées pour le debugging
        sprite.userData = {
            type: 'clubMarker',
            clubId: clubId,
            clubName: clubName,
            lat: lat,
            lon: lon
        };
        
        // Créer l'objet marqueur
        const marker = {
            sprite: sprite,
            clubId: clubId,
            clubName: clubName,
            lat: lat,
            lon: lon,
            options: options,
            scaleBase: scale,
            pulseSpeed: options.pulseSpeed || 0.01,
            pulseScale: 1
        };
        
        console.log(`Marqueur créé pour ${clubName} à la position: `, position);
        
        return marker;
    }

    /**
     * Convertit les coordonnées géographiques en position cartésienne
     * @param {number} lat - Latitude en degrés
     * @param {number} lon - Longitude en degrés
     * @param {number} radius - Rayon du globe
     * @returns {THREE.Vector3} - Position cartésienne
     */
    geoToCartesian(lat, lon, radius) {
        // Conversion en radians
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        
        // Calcul des coordonnées cartésiennes
        // Note: l'axe Z est vers le haut dans Three.js
        const x = -(radius * Math.sin(phi) * Math.cos(theta));
        const z = (radius * Math.sin(phi) * Math.sin(theta));
        const y = (radius * Math.cos(phi));
        
        // Vérification des coordonnées calculées
        console.log(`Conversion: lat=${lat}, lon=${lon} => x=${x.toFixed(2)}, y=${y.toFixed(2)}, z=${z.toFixed(2)}`);
        
        return new THREE.Vector3(x, y, z);
    }

    /**
     * Met à jour l'animation des marqueurs
     */
    update() {
        // Animation des marqueurs (ex: effet de pulsation)
        this.markers.forEach(marker => {
            marker.pulseScale += marker.pulseSpeed;
            
            if (marker.pulseScale > 1.3 || marker.pulseScale < 0.7) {
                marker.pulseSpeed *= -1;
            }
            
            const scale = marker.scaleBase * marker.pulseScale;
            marker.sprite.scale.set(scale, scale, 1);
        });
        
        // Assurez-vous que les sprites font toujours face à la caméra
        // Pas besoin de code supplémentaire car les sprites font toujours face à la caméra par défaut
    }

    /**
     * Supprime un marqueur de club
     */
    removeClub(marker) {
        const index = this.markers.indexOf(marker);
        if (index > -1) {
            this.markers.splice(index, 1);
            this.markerGroup.remove(marker.sprite);
        }
    }

    /**
     * Supprime tous les marqueurs
     */
    clearMarkers() {
        this.markers.forEach(marker => {
            this.markerGroup.remove(marker.sprite);
        });
        this.markers = [];
    }

    /**
     * Ajoute les clubs esports partenaires de l'EWC
     */
    addEWCPartners() {
        // Coordonnées précises des clubs (vérifiées et corrigées)
        const clubs = [
            { 
                id: 'karmine', 
                name: 'Karmine Corp', 
                lat: 48.8566, 
                lon: 2.3522,  // Paris exact
                scale: 0.6,
                opacity: 1.0
            },
            { 
                id: 't1', 
                name: 'T1', 
                lat: 37.5665, 
                lon: 126.9780,  // Séoul exact
                scale: 0.6,
                opacity: 1.0
            },
            { 
                id: 'falcons', 
                name: 'Team Falcons', 
                lat: 24.7136, 
                lon: 46.6753,  // Riyad exact
                scale: 0.6,
                opacity: 1.0
            },
            { 
                id: 'g2', 
                name: 'G2 Esports', 
                lat: 52.5200, 
                lon: 13.4050,  // Berlin exact
                scale: 0.6,
                opacity: 1.0
            },
            { 
                id: 'jdg', 
                name: 'JD Gaming', 
                lat: 31.2304, 
                lon: 121.4737,  // Shanghai exact
                scale: 0.6,
                opacity: 1.0
            },
            { 
                id: 'loud', 
                name: 'LOUD', 
                lat: -23.5505, 
                lon: -46.6333,  // São Paulo exact
                scale: 0.6,
                opacity: 1.0
            },
            { 
                id: 'sentinels', 
                name: 'Sentinels', 
                lat: 34.0522, 
                lon: -118.2437,  // Los Angeles exact
                scale: 0.6,
                opacity: 1.0
            }
        ];
        
        // Nettoyer d'abord tous les marqueurs existants
        this.clearMarkers();
        
        // Ajouter les nouveaux marqueurs
        clubs.forEach(club => {
            console.log(`Ajout du club ${club.name} à la position ${club.lat}, ${club.lon}`);
            
            this.addClub(
                club.id, 
                club.name, 
                club.lat, 
                club.lon, 
                {
                    scale: club.scale || 0.5,
                    opacity: club.opacity || 1.0,
                    pulseSpeed: 0.01
                }
            );
        });
        
        // Vérifier que les marqueurs ont été ajoutés
        console.log(`${this.markers.length} marqueurs ajoutés au total`);
    }

    /**
     * Retourne un marqueur lors d'un clic
     * @param {THREE.Raycaster} raycaster - Le raycaster pour la détection
     * @returns {Object|null} - Le marqueur cliqué ou null
     */
    getClickedMarker(raycaster) {
        const intersects = raycaster.intersectObjects(
            this.markers.map(marker => marker.sprite)
        );
        
        if (intersects.length > 0) {
            const clickedSprite = intersects[0].object;
            return this.markers.find(marker => marker.sprite === clickedSprite);
        }
        
        return null;
    }
}

// Export du module
window.EsportsMarkersManager = EsportsMarkersManager;

// Configuration pour les marqueurs d'esports
if (window.CONFIG) {
    window.CONFIG.ESPORTS_MARKERS = {
        LOGO_PATHS: {
            'karmine': './public/img/logos/logo_karmine.webp',
            't1': './public/img/logos/logo_t1.png',
            'falcons': './public/img/logos/logo_falcons.webp',
            'g2': './public/img/logos/G2_Esports_oldlogo.webp',
            'jdg': './public/img/logos/logo_jdg.png',
            'loud': './public/img/logos/logo_loud.png',
            'sentinels': './public/img/logos/logo_sentinels.png'
        },
        SCALE: 0.5,
        HOVER_SCALE: 0.7,
        PULSE_SPEED: 0.01
    };
} 