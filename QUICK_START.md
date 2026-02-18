# 🚀 Guide de Démarrage Rapide

## Installation Express (5 minutes)

### 1. Prérequis
- Node.js 16+ installé ([télécharger](https://nodejs.org))
- Compte GitHub ([créer un compte](https://github.com))
- Git installé

### 2. Commandes à exécuter

```bash
# Créer le projet React
npx create-react-app stage-werenode
cd stage-werenode

# Installer les dépendances
npm install lucide-react gh-pages

# Remplacer src/App.js par stage-werenode.jsx
# Remplacer public/index.html par le fichier fourni

# Lancer en local pour tester
npm start
```

### 3. Voir le site en local

Ouvrez http://localhost:3000 dans votre navigateur

### 4. Personnaliser

Dans `src/App.js`:
- Ligne 28-45: Vos missions
- Ligne 47-54: Vos compétences
- Ligne 56-60: Votre timeline
- Ligne 350-370: Vos liens de contact

### 5. Déployer sur GitHub Pages

```bash
# Initialiser git
git init
git add .
git commit -m "Initial commit"

# Créer un repo sur GitHub puis:
git remote add origin https://github.com/VOTRE-USERNAME/stage-werenode.git
git branch -M main
git push -u origin main

# Modifier package.json: remplacer VOTRE-USERNAME par votre vrai username

# Déployer
npm run deploy
```

✅ Votre site sera en ligne à: `https://VOTRE-USERNAME.github.io/stage-werenode`

## 🎨 Personnalisation Rapide

### Changer les couleurs
Remplacez dans le code:
- `emerald` → autre couleur Tailwind (blue, purple, red, etc.)
- `cyan` → autre couleur
- `purple` → autre couleur

### Ajouter une section
Copiez une section existante et modifiez le contenu.

### Modifier les animations
Changez les valeurs de `animation-delay` pour ajuster le timing.

## ❓ Problèmes Courants

**Le site ne se charge pas?**
- Vérifiez que Node.js est bien installé: `node --version`
- Supprimez `node_modules` et réinstallez: `rm -rf node_modules && npm install`

**GitHub Pages ne fonctionne pas?**
- Vérifiez que `homepage` dans package.json est correct
- Attendez 2-3 minutes après le déploiement
- Vérifiez les GitHub Pages settings dans votre repo

**Les icônes ne s'affichent pas?**
- Vérifiez que `lucide-react` est installé: `npm list lucide-react`

## 📞 Besoin d'aide?

- [Documentation React](https://react.dev/learn)
- [Guide GitHub Pages](https://docs.github.com/en/pages)
- [Tailwind Classes](https://tailwindcss.com/docs)

Bon courage! 🎉
