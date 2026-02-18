# Stage Werenode - Site Portfolio

Site web React présentant mon stage de développeur Full-Stack chez Werenode, spécialisé dans les solutions de recharge intelligente pour véhicules électriques.

## 🚀 Déploiement sur GitHub Pages

### Étape 1: Créer le repository GitHub

1. Créez un nouveau repository sur GitHub
2. Nommez-le `stage-werenode` (ou le nom de votre choix)
3. Initialisez-le avec ce README

### Étape 2: Préparer le projet

```bash
# Cloner le repository
git clone https://github.com/VOTRE-USERNAME/stage-werenode.git
cd stage-werenode

# Créer une app React
npx create-react-app .

# Installer les dépendances nécessaires
npm install lucide-react gh-pages --save
```

### Étape 3: Remplacer les fichiers

1. Remplacez le contenu de `src/App.js` par le code de `stage-werenode.jsx`
2. Mettez à jour `src/App.css` avec le fichier fourni
3. Modifiez `public/index.html` avec le titre approprié

### Étape 4: Configuration pour GitHub Pages

Ajoutez dans `package.json`:

```json
{
  "homepage": "https://VOTRE-USERNAME.github.io/stage-werenode",
  "scripts": {
    "predeploy": "npm run build",
    "deploy": "gh-pages -d build",
    // ... autres scripts existants
  }
}
```

### Étape 5: Déployer

```bash
# Build et déploiement
npm run deploy
```

Votre site sera accessible à: `https://VOTRE-USERNAME.github.io/stage-werenode`

## 🎨 Personnalisation

### Modifier les informations

Dans `src/App.js`, personnalisez:
- Les missions et projets
- Les compétences et niveaux
- Les liens de contact (GitHub, LinkedIn, Email)
- La timeline du stage

### Changer les couleurs

Les couleurs principales utilisent Tailwind CSS:
- `emerald-400/500` - Vert principal
- `cyan-400/500` - Bleu secondaire
- `purple-400/500` - Accent violet

Remplacez ces classes par d'autres couleurs Tailwind si souhaité.

## 📱 Fonctionnalités

- ✅ Design moderne et responsive
- ✅ Animations fluides et micro-interactions
- ✅ Sections: Hero, Missions, Timeline, Compétences, Contact
- ✅ Effets de parallaxe sur le background
- ✅ Navigation smooth scroll
- ✅ Optimisé mobile et desktop

## 🛠️ Technologies

- React 18
- Tailwind CSS (via classes)
- Lucide React (icônes)
- CSS Animations

## 📄 Structure

```
src/
├── App.js          # Composant principal
├── App.css         # Styles Tailwind
└── index.js        # Point d'entrée
```

## 🔗 Liens utiles

- [Documentation React](https://react.dev)
- [GitHub Pages](https://pages.github.com)
- [Lucide Icons](https://lucide.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

Fait avec ❤️ pour présenter mon stage chez Werenode
