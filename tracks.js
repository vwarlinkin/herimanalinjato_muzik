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
    lyrics: "`Intro
Yeah…
Loading…
NPC mode.

Couplet 1
L'univers c'est un jeu, frère
Écran noir, règles sévères
On spawn sans tuto
Sans choix du niveau

PNJ dans un monde géant
Scripts larges, très sophistiqués
On croit décider maintenant
Mais tout était déjà compilé

Riche, sage ou voyageur
Options dans le code source
On clique sur une direction
C'est juste un output de causes

Pré-refrain
Gènes + décor
Hasard qui s'amplifie
J'croyais tenir le pad
Mais le pad n'existe pas ici

Gènes + décor
Hasard qui s'amplifie
J'croyais tenir le pad
Mais le pad n'existe pas ici

Gènes + décor

Refrain
PNJ mais conscient du jeu
C'est ça qui rend l'truc dangereux
On croit choisir nos routes
Mais le système calcule tout

PNJ mais lucide dedans
Même la lucidité est programmée dedans
Auto-analyse dans le module
Pour pimenter la simu

Couplet 2
Le jeu est vicieux, il est fort
Il te montre les chemins d'abord
Science, philo, réflexion
Comme si t'avais une vraie option

On est codés pour imaginer
Des scénarios alternatifs
Mais même cette pensée
Est une ligne dans l'exécutif

Tu crois sortir du cadre
Mais le cadre s'étend
Le jeu te laisse penser
Que t'es différent

Pont
Pas de bug.
Pas de cheat.
Juste un système
Très bien fait.

Hasard qui s'amplifie
J'croyais tenir le pad
Mais le pad n'existe pas ici

Gènes + décor

Refrain
PNJ mais conscient du jeu
C'est ça qui rend l'truc dangereux
On croit choisir nos routes
Mais le système calcule tout

PNJ mais lucide dedans
Même la lucidité est programmée dedans
Auto-analyse dans le module
Pour pimenter la simu

Outro
C'est pas triste.
C'est stylé.
Un jeu
Qui sait qu'il est joué.

Refrain final
PNJ mais conscient du jeu
Illusion parfaite, niveau dieu
Même douter fait partie du plan
Même comprendre est prévu dedans

Même douter fait partie du plan
Même comprendre est prévu dedans`"
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
