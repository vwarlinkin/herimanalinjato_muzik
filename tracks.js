/**
 * ============================================================
 *  tracks.js — Ajoute tes morceaux ici
 * ============================================================
 *
 *  COMMENT AJOUTER UN MORCEAU :
 *  1. Mets ton fichier audio dans le dossier  /musiques/
 *  2. Mets ta pochette dans le dossier        /pochettes/
 *  3. Copie un bloc ci-dessous et remplis les champs
 *
 *  CHAMPS :
 *    id       → numéro unique (1, 2, 3…)
 *    title    → nom du morceau
 *    genre    → "Ambient" | "Electronic" | "Cinematic" | autre
 *    src      → chemin vers le fichier audio  (ex: "musiques/morceau.mp3")
 *    cover    → chemin vers la pochette       (ex: "pochettes/cover1.jpg")
 *              → laisser "" pour l'icône par défaut
 *    synopsis → courte description du morceau (1-2 phrases)
 *    lyrics   → paroles complètes, ou "" si instrumentale
 * ============================================================
 */

const TRACKS = [
  {
    id: 1,
    title: "Exemple — Aube Digitale",
    genre: "Ambient",
    src: "musique/PXP x ChatGPT_Suno - PNJ.mp3",
    cover: "",
    synopsis: "Un voyage contemplatif entre deux mondes. Les textures sonores se fondent dans un espace suspendu, hors du temps.",
    lyrics: ""
  },
  {
    id: 2,
    title: "Exemple — Nuit Électrique",
    genre: "Electronic",
    src: "musiques/exemple2.mp3",
    cover: "",
    synopsis: "Rythmes hypnotiques et basses profondes. Une nuit urbaine vue depuis les toits.",
    lyrics: "Verse 1:\nLes lumières de la ville brillent\nDans ce silence qui scintille\n\nChorus:\nNuit électrique, on s'envole\nLes sons dansent, l'âme console"
  },
  {
    id: 3,
    title: "Exemple — Horizons",
    genre: "Cinematic",
    src: "musiques/exemple3.mp3",
    cover: "",
    synopsis: "Orchestrations épiques pour des paysages imaginaires. Comme une scène de film que tu n'as jamais vu.",
    lyrics: ""
  }

  // ── Ajoute tes morceaux ci-dessous ──────────────────────────────────────
  // {
  //   id: 4,
  //   title: "Ton titre ici",
  //   genre: "Ambient",
  //   src: "musiques/ton-fichier.mp3",
  //   cover: "pochettes/ta-pochette.jpg",
  //   synopsis: "Ta description ici.",
  //   lyrics: "Tes paroles ici\nOu laisser vide: \"\""
  // },
];
