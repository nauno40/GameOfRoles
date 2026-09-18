# Game Of Roles — Suivi de visionnage

Outil personnel (pas de build, pas de backend) pour regarder *Game Of Roles*
(Fibretigre & Mister MV) dans l'ordre chronologique réel de la partie, et
reprendre automatiquement là où on s'est arrêté.

## Utilisation

Le lecteur YouTube embarqué a besoin d'être servi en HTTP (pas en `file://`).
Depuis ce dossier :

```bash
python3 -m http.server 8080
```

Puis ouvrir http://localhost:8080/ dans un navigateur.

Toute la progression (dernier épisode, position de lecture, épisodes
terminés) est stockée uniquement dans le `localStorage` du navigateur utilisé
— rien n'est envoyé nulle part. Changer de navigateur ou de machine = repartir
de zéro (l'export/import de progression est une amélioration possible listée
plus bas).

Pour un accès permanent (par ex. depuis son téléphone), le plus simple est de
déployer ce dossier tel quel sur GitHub Pages, Netlify ou Vercel (aucun build
requis, juste servir les fichiers statiques).

## Comment ça marche

- [`episodes.js`](episodes.js) contient la liste de tous les épisodes, dans
  l'ordre chronologique de diffusion, groupés par arc narratif (Aria, Le
  Continent du Phénix, Le Tribunal des Dragons, Justice, Galaxies, Valenthia,
  Sheol, Justice 1937, Odyssée...).
- [`app.js`](app.js) gère le lecteur (YouTube IFrame Player API), la
  sauvegarde automatique de la position toutes les 5 secondes, le marquage
  "terminé" à 95% de visionnage, et le bandeau de reprise en un clic.
- [`index.html`](index.html) / [`style.css`](style.css) : la page elle-même.

Aucune clé API YouTube n'est nécessaire : la liste des épisodes est
volontairement curatée à la main plutôt qu'interrogée en direct via la
YouTube Data API (plus simple, plus fiable, pas de quota à gérer pour un
usage personnel).

## Origine de la liste d'épisodes

141 épisodes (123 trame principale + 18 hors-série, 2018 → aujourd'hui),
sourcés et recoupés le 2026-09-18 depuis :

- La playlist officielle *"GAME OF ROLES : Jeu de rôle"* sur la chaîne
  YouTube **mistermv** (saisons 5 à 10 + Justice/Odyssée)
- Le wiki communautaire https://gameofroles.wiki (toutes les saisons,
  notamment Aria S1-S3 et Le Continent du Phénix, diffusées à l'origine sur
  la chaîne Madmoizelle)
- TheTVDB (https://thetvdb.com/series/game-of-roles) pour la structure des
  saisons et les dates

Chaque ID vidéo a été vérifié individuellement (titre + disponibilité) avant
intégration.

**Hors-série séparé** : les crossovers/spéciaux/récaps ponctuels (ex. *Game
of Roles x World of Warcraft*, *x Genshin Impact*, *x Django*...) sont dans
leur propre section "Hors-série" en bas de la liste (`bonus: true` dans
`episodes.js`) — pas mélangés à la trame principale puisqu'ils n'en font pas
partie, et pas comptés dans la progression globale ni dans le décompte
"X / Y terminés" du header, mais toujours suivables (case à cocher, lecture,
reprise) comme n'importe quel épisode.

### Maintenir la liste à jour

La partie continue (arc *Odyssée* en cours). Pour ajouter un nouvel épisode,
ouvrir [`episodes.js`](episodes.js) et ajouter une ligne à la fin du tableau
avec l'ID vidéo YouTube (la partie après `v=` ou `youtu.be/`), le code
d'épisode, le titre et la date — voir le format des entrées existantes.

## Roadmap / idées non implémentées

- Export/import de la progression (JSON) pour changer d'appareil
- Détection automatique de nouveaux épisodes (nécessiterait la YouTube Data
  API v3 + une clé)
