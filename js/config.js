/**
 * Configuration centralisée de l'application Globe
 */

const CONFIG = {
    // Paramètres du globe
    GLOBE: {
        RADIUS: 5,
        TEXTURE_PATH: './img/night_world_mpa.jpg',
        ROTATION_SPEED: 0.001,
        SEGMENTS: 64
    },

    // Paramètres de la caméra
    CAMERA: {
        FOV: 75,
        NEAR: 0.1,
        FAR: 1000,
        INITIAL_DISTANCE: 15,
        MIN_DISTANCE: 8,
        MAX_DISTANCE: 30
    },

    // Paramètres des contrôles
    CONTROLS: {
        ENABLE_DAMPING: true,
        DAMPING_FACTOR: 0.05,
        ROTATE_SPEED: 0.5,
        ZOOM_SPEED: 1.2,
        PAN_SPEED: 0.8,
        AUTO_ROTATE: true,
        AUTO_ROTATE_SPEED: 0.5
    },

    // Paramètres de l'éclairage
    LIGHTING: {
        AMBIENT: {
            COLOR: 0xffffff,
            INTENSITY: 0.8
        },
        DIRECTIONAL: {
            COLOR: 0xffffff,
            INTENSITY: 0.3,
            POSITION: { x: 5, y: 5, z: 5 }
        }
    },

    // Paramètres du champ d'étoiles
    STARS: {
        COUNT: 10000,
        COLOR: 0xffffff,
        SIZE: 2,
        SPREAD: 2000,
        ROTATION_SPEED: 0.0001
    },

    // Paramètres de l'interface utilisateur
    UI: {
        NOTIFICATION_DURATION: 3000,
        LOADING_FADE_DURATION: 300
    },

    // Paramètres de performance
    PERFORMANCE: {
        ENABLE_SHADOWS: false,
        ENABLE_ANTIALIASING: true,
        PIXEL_RATIO_LIMIT: 2
    }
};

// Export de la configuration
window.CONFIG = CONFIG;
export default CONFIG; 