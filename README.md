# 🎵 NOS SONS — Guide de mise en ligne

## Structure du projet

```
mon-site/
│
├── index.html          ← page principale (ne pas modifier)
├── style.css           ← styles (ne pas modifier)
├── app.js              ← logique du lecteur (ne pas modifier)
├── tracks.js           ← ⭐ TU MODIFIES SEULEMENT CE FICHIER
│
├── musiques/           ← mets tes fichiers audio ici
│   ├── titre1.mp3
│   ├── titre2.mp3
│   └── ...
│
└── pochettes/          ← mets tes images de pochettes ici
    ├── cover1.jpg
    ├── cover2.jpg
    └── ...
```

---

## 1. Ajouter tes morceaux

Ouvre `tracks.js` et ajoute un bloc par morceau :

```js
{
  id: 4,                                  // numéro unique
  title: "Mon Super Titre",               // nom affiché
  genre: "Ambient",                       // catégorie (filtre)
  src: "musiques/mon-fichier.mp3",        // chemin vers le fichier
  cover: "pochettes/ma-pochette.jpg",     // "" si pas de pochette
  synopsis: "Une description courte.",    // affiché sous le titre
  lyrics: "Verse 1:\nParoles ici...",     // "" si instrumental
},
```

### Formats supportés
- **Audio** : MP3, OGG, WAV, FLAC, AAC
- **Pochettes** : JPG, PNG, WEBP

---

## 2. Héberger sur GitHub Pages

### Première fois

1. Crée un compte sur [github.com](https://github.com) si tu n'en as pas
2. Crée un nouveau **repository** (bouton vert "New")
   - Nom : `nos-sons` (ou ce que tu veux)
   - Visibilité : **Public** (requis pour GitHub Pages gratuit)
3. Upload tous les fichiers du projet
4. Va dans **Settings → Pages**
5. Source : `Deploy from a branch`  
   Branch : `main` / dossier `/ (root)`
6. Clique **Save**

Ton site sera accessible à :  
`https://TON-USERNAME.github.io/nos-sons/`

### Ajouter des morceaux plus tard

1. Va sur ton repo GitHub
2. Upload les fichiers audio dans le dossier `musiques/`
3. Modifie `tracks.js` pour ajouter les nouvelles entrées
4. Les changements sont en ligne en ~1 minute

---

## 3. Limite de taille GitHub

GitHub Pages accepte jusqu'à **1 GB** par repo.  
Chaque fichier doit faire moins de **100 MB**.

Si tes fichiers sont trop gros :
- Compresse les MP3 (128kbps suffit pour de la musique IA)
- Ou héberge les fichiers audio sur **Google Drive** et utilise un lien direct

---

## 4. Raccourcis clavier

| Touche | Action |
|--------|--------|
| `Espace` | Lecture / Pause |
| `→` | Avancer de 5 sec |
| `←` | Reculer de 5 sec |
| `↑` | Volume + |
| `↓` | Volume - |
| `N` | Morceau suivant |
| `P` | Morceau précédent |

---

## 5. Personnalisation rapide

### Changer le nom du site
Dans `index.html`, ligne 6 :
```html
<title>NOS SONS</title>  ← change ici
```
Et dans `index.html`, cherche `NOS<br>SONS` pour changer le logo.

### Changer les genres (filtres)
Dans `index.html`, modifie les boutons `.filter-btn`  
Dans `app.js`, mets à jour la logique de filtre si besoin

### Couleur d'accent
Dans `style.css`, ligne ~7 :
```css
--accent: #c8ff57;   /* vert-jaune → change la couleur principale */
--accent2: #57c8ff;  /* bleu → couleur secondaire */
```

---

Bon courage, et bonne musique ! 🎧
