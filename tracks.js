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
    title: "PXP x ChatGPT_Suno - PNJ",
    genre: "Drill Hook Melodic - 140 BPM",
    src: "musiques/PXP x ChatGPT_Suno - PNJ.mp3",
    cover: "pochettes/pnjpoc.jpg",
    synopsis: "Personnage Non Joueur",
    lyrics: ""
  },
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
