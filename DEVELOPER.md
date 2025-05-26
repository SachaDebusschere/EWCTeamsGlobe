# Documentation Développeur - Globe Interactif Three.js

## Architecture Modulaire

Le projet a été restructuré en modules séparés pour améliorer la maintenabilité, la lisibilité et la réutilisabilité du code.

## Structure des Modules

### 📁 `js/config.js` - Configuration Centralisée
Contient toutes les constantes et paramètres de l'application dans un objet `CONFIG` global.

**Sections principales :**
- `GLOBE` : Paramètres du globe (rayon, texture, vitesse de rotation)
- `CAMERA` : Configuration de la caméra (FOV, distances min/max)
- `CONTROLS` : Paramètres des contrôles utilisateur
- `LIGHTING` : Configuration de l'éclairage
- `STARS` : Paramètres du champ d'étoiles
- `UI` : Paramètres de l'interface utilisateur
- `PERFORMANCE` : Options de performance

### 📁 `js/scene.js` - SceneManager
Gère la scène Three.js et le rendu.

**Responsabilités :**
- Initialisation de la scène Three.js
- Configuration du renderer WebGL
- Gestion de l'éclairage
- Ajout d'objets à la scène
- Rendu de la scène

**Méthodes principales :**
```javascript
init(canvas)           // Initialise la scène
setupLighting()        // Configure l'éclairage
add(object)           // Ajoute un objet
render(camera)        // Effectue le rendu
onWindowResize()      // Gère le redimensionnement
```

### 📁 `js/camera.js` - CameraManager
Gère la caméra et les contrôles utilisateur.

**Responsabilités :**
- Configuration de la caméra perspective
- Initialisation des contrôles OrbitControls
- Gestion des interactions utilisateur
- Auto-rotation

**Méthodes principales :**
```javascript
init(renderer)        // Initialise la caméra
setupControls()       // Configure les contrôles
update()             // Met à jour les contrôles
toggleAutoRotate()   // Bascule l'auto-rotation
reset()              // Réinitialise la position
```

### 📁 `js/globe.js` - GlobeManager
Gère la création et l'animation du globe terrestre.

**Responsabilités :**
- Chargement de la texture de la Terre
- Création de la géométrie sphérique
- Gestion des erreurs de chargement
- Animation de rotation

**Méthodes principales :**
```javascript
create(callback)      // Crée le globe avec texture
onTextureLoaded()     // Callback de chargement réussi
onLoadError()         // Callback d'erreur
createBasicGlobe()    // Globe de fallback
update()             // Animation du globe
```

### 📁 `js/starfield.js` - StarFieldManager
Gère le champ d'étoiles en arrière-plan.

**Responsabilités :**
- Génération aléatoire des positions d'étoiles
- Création du matériau des étoiles
- Animation optionnelle du champ d'étoiles

**Méthodes principales :**
```javascript
create()             // Crée le champ d'étoiles
update()             // Animation des étoiles
setStarCount()       // Modifie le nombre d'étoiles
setStarColor()       // Change la couleur
setStarSize()        // Modifie la taille
```

### 📁 `js/ui.js` - UIManager
Gère l'interface utilisateur et les interactions.

**Responsabilités :**
- Gestion de l'écran de chargement
- Système de notifications
- Contrôles clavier
- Gestion des erreurs UI

**Méthodes principales :**
```javascript
init()                    // Initialise l'UI
hideLoading()            // Masque l'écran de chargement
showNotification()       // Affiche une notification
registerKeyCallback()    // Enregistre un raccourci clavier
handleError()           // Gère les erreurs
```

### 📁 `js/app.js` - GlobeApp (Orchestrateur Principal)
Coordonne tous les modules et gère le cycle de vie de l'application.

**Responsabilités :**
- Initialisation de tous les managers
- Coordination entre les modules
- Boucle d'animation principale
- Gestion des événements globaux

**Méthodes principales :**
```javascript
init()                   // Initialise l'application
setupKeyboardControls() // Configure les raccourcis
setupWindowEvents()     // Gère les événements fenêtre
animate()               // Boucle d'animation
startAnimation()        // Démarre l'animation
stopAnimation()         // Arrête l'animation
```

## Flux d'Exécution

1. **Chargement** : Le DOM charge tous les modules dans l'ordre
2. **Initialisation** : `GlobeApp` est instancié et `init()` est appelé
3. **Configuration** : Chaque manager est initialisé avec ses paramètres
4. **Chargement Asynchrone** : La texture du globe est chargée en arrière-plan
5. **Animation** : La boucle d'animation démarre et met à jour tous les modules

## Communication Entre Modules

- **Configuration** : Tous les modules utilisent l'objet `CONFIG` global
- **Callbacks** : Les opérations asynchrones utilisent des callbacks
- **Méthodes Publiques** : Chaque manager expose des méthodes pour l'interaction
- **Événements** : Les interactions utilisateur sont gérées via le système d'événements

## Ajout de Nouvelles Fonctionnalités

### Créer un Nouveau Module

1. Créer un fichier `js/nouveau-module.js`
2. Définir une classe avec les méthodes nécessaires
3. Exporter via `window.NouveauModule = NouveauModule`
4. Ajouter le script dans `index.html`
5. Instancier dans `GlobeApp`

### Exemple de Nouveau Module

```javascript
/**
 * Module exemple
 */
class ExempleManager {
    constructor() {
        this.data = null;
    }

    init() {
        // Initialisation
    }

    update() {
        // Mise à jour dans la boucle d'animation
    }
}

window.ExempleManager = ExempleManager;
```

### Ajouter une Configuration

Dans `config.js`, ajouter une nouvelle section :

```javascript
const CONFIG = {
    // ... autres configurations
    NOUVEAU_MODULE: {
        PARAMETRE_1: 'valeur',
        PARAMETRE_2: 42
    }
};
```

## Bonnes Pratiques

### Code
- **Commentaires JSDoc** pour toutes les méthodes publiques
- **Noms explicites** pour les variables et méthodes
- **Séparation des responsabilités** entre modules
- **Gestion d'erreurs** appropriée

### Performance
- **Réutilisation d'objets** Three.js quand possible
- **Limitation du nombre d'objets** créés dans la boucle d'animation
- **Configuration centralisée** pour éviter les valeurs magiques

### Maintenance
- **Tests** des fonctionnalités critiques
- **Documentation** à jour
- **Versioning** des changements de configuration
- **Fallbacks** pour les erreurs de chargement

## Débogage

### Console du Navigateur
- Accès à `window.globeApp` pour inspecter l'état
- Accès aux managers individuels via `globeApp.getXXXManager()`
- Modification en temps réel de `CONFIG`

### Outils de Développement
- **Three.js Inspector** pour déboguer la scène 3D
- **Performance Monitor** pour surveiller les FPS
- **Network Tab** pour vérifier le chargement des textures

## Extensions Futures

### Fonctionnalités Prévues
- **Zones cliquables** sur le globe
- **Marqueurs géographiques** interactifs
- **Système de données** pour afficher des informations
- **Animations** de transition entre vues
- **Mode VR/AR** pour l'immersion

### Architecture Évolutive
L'architecture modulaire permet d'ajouter facilement :
- Nouveaux types de géométries
- Systèmes de particules
- Effets post-processing
- Intégration avec des APIs externes
- Modes d'interaction avancés 