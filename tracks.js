/**
 * ============================================================
 *  tracks.js — Tes morceaux
 * ============================================================
 *
 *  Pour les PAROLES → édite lyrics.js (beaucoup plus simple)
 *
 *  CHAMPS :
 *    id       → numéro unique (1, 2, 3…)
 *    title    → nom du morceau
 *    genre    → style musical affiché sous le titre
 *    src      → "musiques/nom-du-fichier.mp3"  ← sur UNE seule ligne !
 *    cover    → "pochettes/image.jpg"  ou  ""  si pas de pochette
 *    synopsis → courte description (1-2 phrases)
 *
 * ============================================================
 */

const TRACKS = [
  {
    id: 1,
    title: "PXP x ChatGPT_Suno - PNJ",
    genre: "Drill Hook Melodic - 140 BPM",
    src: "musiques/PXP x ChatGPT_Suno - PNJ.mp3",
    cover: "pochettes/pnjpoc.jpg",
    synopsis: "Personnage Non Joueur"
  },
{
  id: 2,
  title: "PXP feat Chatgpt_Suno - Sous la peau",
  genre: "Drill Sad 140BPM",
  src: "musiques/PXP feat Chatgpt_Suno - Sous la peau.mp3",
  cover: "",
  synopsis: ""
},

  // ── Ajoute tes morceaux ci-dessous ──────────────────────────
  // {
  //   id: 2,
  //   title: "Ton titre ici",
  //   genre: "Style musical",
  //   src: "musiques/nom-fichier.mp3",
  //   cover: "",
  //   synopsis: "Ta description ici."
  // },
];
