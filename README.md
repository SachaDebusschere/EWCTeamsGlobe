# Globe Interactif Three.js 🌍

Un globe terrestre interactif créé avec Three.js et WebGL, utilisant une texture de la Terre de nuit.

## Fonctionnalités

- **Globe 3D interactif** avec texture de la Terre de nuit
- **Contrôles de caméra fluides** :
  - Rotation avec clic gauche + glisser
  - Zoom avec la molette
  - Panoramique avec clic droit + glisser
- **Auto-rotation** du globe
- **Éclairage réaliste** avec ombres
- **Champ d'étoiles** en arrière-plan
- **Interface responsive** et moderne
- **Écran de chargement** animé

## Structure du projet

```
Globe/
├── index.html          # Page principale
├── styles.css          # Styles CSS
├── js/                 # Modules JavaScript
│   ├── config.js      # Configuration centralisée
│   ├── app.js         # Application principale
│   ├── scene.js       # Gestion de la scène Three.js
│   ├── camera.js      # Gestion de la caméra et contrôles
│   ├── globe.js       # Gestion du globe et textures
│   ├── starfield.js   # Gestion du champ d'étoiles
│   └── ui.js          # Gestion de l'interface utilisateur
├── public/             # Ressources publiques
│   └── img/           # Images et textures
│       └── night_world_mpa.jpg # Texture de la Terre de nuit
├── server.py          # Serveur de développement
└── README.md          # Documentation
```

## Installation et utilisation

### Méthode 1 : Serveur local simple

1. Ouvrez un terminal dans le dossier du projet
2. Lancez un serveur HTTP local :

**Avec Python 3 :**
```bash
python -m http.server 8000
```

**Avec Node.js (si installé) :**
```bash
npx http-server -p 8000
```

**Avec PHP (si installé) :**
```bash
php -S localhost:8000
```

3. Ouvrez votre navigateur et allez à `http://localhost:8000`

### Méthode 2 : Extension VS Code

Si vous utilisez VS Code, installez l'extension "Live Server" et cliquez droit sur `index.html` → "Open with Live Server"

## Contrôles

- **🖱️ Clic gauche + glisser** : Rotation du globe
- **🖱️ Molette** : Zoom avant/arrière
- **🖱️ Clic droit + glisser** : Panoramique
- **⌨️ Espace** : Activer/désactiver l'auto-rotation
- **⌨️ R** : Réinitialiser la position de la caméra

## Technologies utilisées

- **Three.js** - Bibliothèque 3D JavaScript
- **WebGL** - Rendu 3D dans le navigateur
- **OrbitControls** - Contrôles de caméra
- **HTML5 Canvas** - Élément de rendu
- **CSS3** - Styles et animations

## Personnalisation

### Modifier la texture
Remplacez `night_world_mpa.jpg` par votre propre texture de globe.

### Ajuster les paramètres
Dans `js/config.js`, vous pouvez modifier facilement :
- `CONFIG.GLOBE.RADIUS` : Taille du globe
- `CONFIG.CAMERA.INITIAL_DISTANCE` : Distance initiale de la caméra
- `CONFIG.CONTROLS.*` : Vitesses de rotation et zoom
- `CONFIG.STARS.*` : Paramètres du champ d'étoiles
- `CONFIG.LIGHTING.*` : Configuration de l'éclairage

### Ajouter des interactions
Le code est structuré pour faciliter l'ajout de :
- Zones cliquables
- Marqueurs géographiques
- Animations personnalisées
- Effets visuels supplémentaires

## Prochaines étapes

- [ ] Ajouter des zones cliquables
- [ ] Implémenter des marqueurs géographiques
- [ ] Ajouter des informations contextuelles
- [ ] Créer des animations de transition
- [ ] Optimiser les performances

## Compatibilité

- Navigateurs modernes supportant WebGL
- Chrome, Firefox, Safari, Edge (versions récentes)
- Fonctionne sur desktop et mobile

## Licence

Projet éducatif - Libre d'utilisation 