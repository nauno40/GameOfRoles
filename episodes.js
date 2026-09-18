/**
 * Liste des épisodes de Game Of Roles (Fibretigre & Mister MV), dans l'ordre
 * chronologique réel de la partie (ordre de diffusion, toutes chaînes confondues).
 *
 * Sources croisées le 2026-09-18 :
 * - Playlist officielle "GAME OF ROLES : Jeu de rôle" sur la chaîne YouTube mistermv
 *   (https://www.youtube.com/playlist?list=PLcsmUX5-E9ydXkzlbLfjJWcU63kjxtgFV)
 * - Wiki communautaire https://gameofroles.wiki (page "Liste des épisodes")
 * - TheTVDB (https://thetvdb.com/series/game-of-roles)
 * Chaque ID vidéo a été vérifié individuellement contre YouTube.
 *
 * Pour ajouter un épisode : pousser un objet {id, code, title, date} à la fin
 * du tableau du bon arc (ou créer un nouvel arc). `id` est l'ID vidéo YouTube
 * (la partie après `v=` ou `youtu.be/`).
 */

const GOR_EPISODES = [
  // ---- Aria — Saison 1 (2018) ----
  { arc: "Aria — Saison 1", id: "uLOWzZI1vV0", code: "S01E01", title: "Le début d'une grande aventure", date: "2018-02-18" },
  { arc: "Aria — Saison 1", id: "Oc8yhPN-Jzs", code: "S01E02", title: "À travers la plus grande forêt du monde", date: "2018-03-04" },
  { arc: "Aria — Saison 1", id: "VtzosCAn5z4", code: "S01E03", title: "Aria, capitale du monde", date: "2018-03-11" },
  { arc: "Aria — Saison 1", id: "Ugfzszc7Smo", code: "S01E04", title: "La guilde des voleurs et la boîte de Musa", date: "2018-03-25" },
  { arc: "Aria — Saison 1", id: "b-4m9vAnh8U", code: "S01E05", title: "Aventures sur la mer de la Morsure", date: "2018-04-22" },
  { arc: "Aria — Saison 1", id: "HNBxeY9wl4Y", code: "S01E06", title: "Marine marchande et enfants perdus", date: "2018-05-13" },
  { arc: "Aria — Saison 1", id: "Ucw21ljtTO8", code: "S01E07", title: "Aventures financières et meurtrières à Altabianca", date: "2018-07-01" },
  { arc: "Aria — Saison 1", id: "0p3KkK4Q6cY", code: "S01E08", title: "Le kidnapping de la princesse et du jeune noble", date: "2018-07-08" },
  { arc: "Aria — Saison 1", id: "mDHjFUlwzFI", code: "S01E09", title: "Cap sur Esperanza, l'île des pirates !", date: "2018-07-22" },

  // ---- Aria — Saison 2 (2018-2019) ----
  { arc: "Aria — Saison 2", id: "QHwDEiOoMYA", code: "S02E01", title: "Corbeau Noir, Seigneur des Pirates", date: "2018-09-12" },
  { arc: "Aria — Saison 2", id: "WiL6MyhesUI", code: "S02E02", title: "Panique totale sur l'île des pirates", date: "2018-09-26" },
  { arc: "Aria — Saison 2", id: "h-l4F-G_Wek", code: "S02E03", title: "Condamnés un jour, princes un autre", date: "2018-10-17" },
  { arc: "Aria — Saison 2", id: "R3VhkYoDGPk", code: "S02E04", title: "Les enfants disparus — spécial Halloween", date: "2018-10-31" },
  { arc: "Aria — Saison 2", id: "ygB1J9iqK6A", code: "S02E05", title: "Les mystères d'Aqabah", date: "2018-11-14" },
  { arc: "Aria — Saison 2", id: "P8iRy8CW3xo", code: "S02E06", title: "Clodomir achète un cochon nommé Vladimir", date: "2018-11-28" },
  { arc: "Aria — Saison 2", id: "Y9PQ8p0BTZ8", code: "S02E07", title: "La boîte, le Sultan, et son labyrinthe", date: "2018-12-12" },
  { arc: "Aria — Saison 2", id: "Dz-PtqWKrWU", code: "S02E08-09", title: "Il faut sauver Clodomir", date: "2019-01-23" },
  { arc: "Aria — Saison 2", id: "zJ9um0zDPqg", code: "S02E10", title: "Le labyrinthe des fantômes", date: "2019-02-06" },
  { arc: "Aria — Saison 2", id: "6T1kWRAb5dw", code: "S02E11", title: "Irem, la cité perdue", date: "2019-02-20" },
  { arc: "Aria — Saison 2", id: "YqhT6uvGXiM", code: "S02E12", title: "Le grand mariage (pas très enthousiaste) de notre héros", date: "2019-03-06" },
  { arc: "Aria — Saison 2", id: "LBYY_IO7e7I", code: "S02E13", title: "L'Académie Noire", date: "2019-03-28" },
  { arc: "Aria — Saison 2", id: "nsN_bQT5Z3U", code: "S02E14", title: "Le porc de l'angoisse", date: "2019-04-04" },
  { arc: "Aria — Saison 2", id: "FmBS_cSaGT4", code: "S02E15", title: "La révolte des gens de petite taille", date: "2019-04-17" },
  { arc: "Aria — Saison 2", id: "glhLYn-DPWk", code: "S02E16", title: "Le destin d'un cochon trop libre (grand final)", date: "2019-05-15" },

  // ---- Aria — Saison 3 (2019-2020) ----
  { arc: "Aria — Saison 3", id: "eRDuHl6dUUE", code: "S03E01", title: "Une nouvelle aventure", date: "2019-06-02" },
  { arc: "Aria — Saison 3", id: "PKboLkeA0Rk", code: "S03E02", title: "Le meilleur Kebab du monde", date: "2019-06-30" },
  { arc: "Aria — Saison 3", id: "kJtIvQWJu64", code: "S03E03", title: "La Dague, la mariée, et l'œuf de dragon", date: "2019-09-29" },
  { arc: "Aria — Saison 3", id: "MPYseqCAXIg", code: "S03E04", title: "Le kidnapping de la mariée", date: "2019-10-13" },
  { arc: "Aria — Saison 3", id: "Q5GrpZssvXY", code: "S03E05", title: "Voyages dans le temps", date: "2019-11-17" },
  { arc: "Aria — Saison 3", id: "NrHWOLySDuA", code: "S03E06", title: "Aventures dans la jungle", date: "2019-11-24" },
  { arc: "Aria — Saison 3", id: "nrZNPxwYvbQ", code: "S03E07", title: "Les deux dragons", date: "2020-01-12" },
  { arc: "Aria — Saison 3", id: "qxpQmp1wSns", code: "S03E08", title: "La Reine des Rois", date: "2020-01-26" },
  { arc: "Aria — Saison 3", id: "9kz6NbNYi1c", code: "S03E09", title: "Le Festin de Délicieuse", date: "2020-02-09" },
  { arc: "Aria — Saison 3", id: "E_RKf_yBiIs", code: "S03E10", title: "La potion oursifiante", date: "2020-03-08" },
  { arc: "Aria — Saison 3", id: "2902_-kkf4A", code: "S03E11", title: "Le Jenga des Sorciers", date: "2020-05-14" },
  { arc: "Aria — Saison 3", id: "FZ5IM_XDero", code: "S03E12", title: "Le retour du Corbeau Noir !", date: "2020-06-18" },
  { arc: "Aria — Saison 3", id: "fnGM_Jrxcq0", code: "S03E13", title: "La ville engloutie", date: "2020-06-25" },
  { arc: "Aria — Saison 3", id: "0JIJttlJn_s", code: "S03E14", title: "Les Masques Magiques", date: "2020-07-02" },
  { arc: "Aria — Saison 3", id: "V3eNC-agfDY", code: "S03E15", title: "Le Grand Final de la saison 3", date: "2020-10-16" },

  // ---- Le Continent du Phénix — Saison 4 (2020) ----
  { arc: "Le Continent du Phénix", id: "0cB8xtBuVro", code: "S04E01", title: "Une nouvelle aventure !", date: "2020-09-04" },
  { arc: "Le Continent du Phénix", id: "dBTVZIAURRQ", code: "S04E02", title: "Une grande fête", date: "2020-09-11" },
  { arc: "Le Continent du Phénix", id: "o7jmBNmrYQE", code: "S04E03", title: "4 flics et un stagiaire à Mont Royal", date: "2020-09-18" },
  { arc: "Le Continent du Phénix", id: "Fi3sEq4FqUI", code: "S04E04", title: "Le commando fantôme", date: "2020-09-25" },
  { arc: "Le Continent du Phénix", id: "U6EH7rjFV_g", code: "S04E05", title: "Le vieil homme et l'enfant sauvage", date: "2020-10-02" },
  { arc: "Le Continent du Phénix", id: "XEFr7St7Wlk", code: "S04E06", title: "Very bad trip feat. un match de catch !", date: "2020-10-09" },
  { arc: "Le Continent du Phénix", id: "nlrfCyn41Cs", code: "S04E07", title: "Jo-An's Bizarre Adventure", date: "2020-10-30" },

  // ---- Le Tribunal des Dragons — Saison 5 (2021) ----
  { arc: "Le Tribunal des Dragons — Saison 5", id: "8ty5nBqEhog", code: "S05E01", title: "L'Île du Roi Sorcier Dragon", date: "2021-02-10" },
  { arc: "Le Tribunal des Dragons — Saison 5", id: "wIoansR4aT8", code: "S05E02", title: "Les deux rois", date: "2021-02-24" },
  { arc: "Le Tribunal des Dragons — Saison 5", id: "RQfOYXF-G7Y", code: "S05E03", title: "Aventures à Nol, la cité des cloches", date: "2021-03-11" },
  { arc: "Le Tribunal des Dragons — Saison 5", id: "WTQ9CNCqolw", code: "S05E04", title: "Les 4 petits fans de Raoul", date: "2021-03-24" },
  { arc: "Le Tribunal des Dragons — Saison 5", id: "XlBrNJS3_p0", code: "S05E05", title: "Bébé surprise et crise économique", date: "2021-04-07" },
  { arc: "Le Tribunal des Dragons — Saison 5", id: "W791uQOs4mA", code: "S05E06", title: "Le dragon et la mallette", date: "2021-04-21" },
  { arc: "Le Tribunal des Dragons — Saison 5", id: "XCIP6GeRQ88", code: "S05E07", title: "Le retour du Roi Clémovitch (ft. Clément Viktorovitch)", date: "2021-05-05" },
  { arc: "Le Tribunal des Dragons — Saison 5", id: "o4C9Dob5xSU", code: "S05E08", title: "Le tribunal des dragons", date: "2021-05-19" },
  { arc: "Le Tribunal des Dragons — Saison 5", id: "xGTCgFs_Sbc", code: "S05E09", title: "Evy et ses démons", date: "2021-06-02" },
  { arc: "Le Tribunal des Dragons — Saison 5", id: "lFMAMPscH4A", code: "S05E10", title: "Pacte avec le diable", date: "2021-06-16" },
  { arc: "Le Tribunal des Dragons — Saison 5", id: "TVgDifiYdz8", code: "S05E11", title: "Le temple du destin (avec MADOXR)", date: "2021-06-30" },

  // ---- Le Tribunal des Dragons — Saison 6 (2021-2022) ----
  { arc: "Le Tribunal des Dragons — Saison 6", id: "V3NDS4OG9W0", code: "S06E01", title: "Raoul prend le pouvoir", date: "2021-09-02" },
  { arc: "Le Tribunal des Dragons — Saison 6", id: "f5qbBHa4nqs", code: "S06E02", title: "Evy, briseuse d'étoile", date: "2021-09-16" },
  { arc: "Le Tribunal des Dragons — Saison 6", id: "PMF3M-mdy_Q", code: "S06E03", title: "Amours et tatouages", date: "2021-09-29" },
  { arc: "Le Tribunal des Dragons — Saison 6", id: "dAOlMw0feQ4", code: "S06E04", title: "Ola, mes braves", date: "2021-10-06" },
  { arc: "Le Tribunal des Dragons — Saison 6", id: "QM_qv5Dpb7o", code: "S06E05", title: "Bienvenue sur l'île du paradis", date: "2021-10-20" },
  { arc: "Le Tribunal des Dragons — Saison 6", id: "CIJY88Pwdpo", code: "S06E06", title: "La prophétie disparue", date: "2021-11-09" },
  { arc: "Le Tribunal des Dragons — Saison 6", id: "ClVXnEKxomE", code: "S06E07", title: "Le romantisme pour les nuls", date: "2021-11-25" },
  { arc: "Le Tribunal des Dragons — Saison 6", id: "9wSoWcT1s90", code: "S06E08", title: "Le jeu des perles de verre", date: "2021-12-09" },
  { arc: "Le Tribunal des Dragons — Saison 6", id: "v9mLbZxmKGo", code: "S06E09", title: "Pharaon contre pharaon", date: "2022-01-13" },
  { arc: "Le Tribunal des Dragons — Saison 6", id: "N_8BkPbmz40", code: "S06E10", title: "Good versus Evyl", date: "2022-01-25" },

  // ---- Justice (mini-série, 2022) ----
  { arc: "Justice", id: "jZ8YnxPZkV8", code: "EP01", title: "Le braquage", date: "2022-04-20" },
  { arc: "Justice", id: "qwpDdc6whyo", code: "EP02", title: "Mariage mafieux", date: "2022-05-11" },
  { arc: "Justice", id: "YAPmouVbwaA", code: "EP03", title: "Héros et corrompus", date: "2022-05-25" },
  { arc: "Justice", id: "fa3rQowOei4", code: "EP04", title: "Au tribunal (ft. JDG, Clémovitch, Deriv)", date: "2022-06-30" },

  // ---- Le Tribunal des Dragons — Saison 7 (2022-2023) ----
  { arc: "Le Tribunal des Dragons — Saison 7", id: "pLdv_QKyMpY", code: "S07E01", title: "Science contre magie", date: "2022-10-06" },
  { arc: "Le Tribunal des Dragons — Saison 7", id: "LXzKeztq2_0", code: "S07E02", title: "Meurtres sur le Awan Dawu", date: "2022-10-20" },
  { arc: "Le Tribunal des Dragons — Saison 7", id: "lcUw1ReWx30", code: "S07E03", title: "Le roi de l'Archi-Pelle", date: "2022-10-27" },
  { arc: "Le Tribunal des Dragons — Saison 7", id: "1KMvuMUyVyM", code: "S07E04", title: "La reine de Xanadu", date: "2022-11-17" },
  { arc: "Le Tribunal des Dragons — Saison 7", id: "x4MEBdelmt4", code: "S07E05", title: "L'épreuve du labyrinthe", date: "2022-12-01" },
  { arc: "Le Tribunal des Dragons — Saison 7", id: "5-71re4MZhg", code: "S07E06", title: "Adieu mon roi", date: "2022-12-15" },
  { arc: "Le Tribunal des Dragons — Saison 7", id: "U-Kmpa_ZF7U", code: "S07E07", title: "Le pays des dragons", date: "2023-01-12" },
  { arc: "Le Tribunal des Dragons — Saison 7", id: "Jq1g_nUdFFc", code: "S07E08", title: "La déesse de la nuit (fin)", date: "2023-01-26" },
  { arc: "Le Tribunal des Dragons — Saison 7", id: "83QEWRb90eg", code: "S07E09", title: "Le débrief (retour sur S5 S6 S7, ft. Clémovitch)", date: "2023-02-09" },

  // ---- Galaxies (2023) ----
  { arc: "Galaxies", id: "owjGsAYoH7U", code: "S01E01", title: "La nouvelle Terre", date: "2023-09-07" },
  { arc: "Galaxies", id: "apsuTwT3aP4", code: "S01E02", title: "La ligue des planètes extérieures (ft. AlphaCast)", date: "2023-09-21" },
  { arc: "Galaxies", id: "_HMSQ_vzqeQ", code: "S01E03", title: "Gagner sa vie sur Ibizion", date: "2023-10-05" },
  { arc: "Galaxies", id: "CR3brkqjPxY", code: "S01E04", title: "Le secret d'Antoine Daniel (ft. Pandrezz)", date: "2023-10-19" },
  { arc: "Galaxies", id: "c_zZtgZuXLE", code: "S01E05", title: "La nouvelle Babylone", date: "2023-10-26" },
  { arc: "Galaxies", id: "0cBdDnTMaL4", code: "S01E06", title: "La base secrète (ft. Natoo)", date: "2023-11-09" },
  { arc: "Galaxies", id: "KBaTicT84pI", code: "S01E07", title: "Voyage dans l'After", date: "2023-11-16" },
  { arc: "Galaxies", id: "QXqaf3KG2YI", code: "S01E08", title: "La planète ordinateur (ft. Mynthos)", date: "2023-11-30" },
  { arc: "Galaxies", id: "3uOuXnqIz5E", code: "S01E09", title: "La simulation (ft. Clémovitch)", date: "2023-12-14" },
  { arc: "Galaxies", id: "mmO3egWoiXk", code: "S01E10", title: "Le retour du soleil (ft. Adrien Ménielle, fin)", date: "2023-12-21" },

  // ---- Valenthia (2024) ----
  { arc: "Valenthia", id: "CjsnoqxgyKI", code: "S01E01", title: "Bienvenue à Valenthia", date: "2024-03-29" },
  { arc: "Valenthia", id: "Uo6OMJiFv9Q", code: "S01E02", title: "Le restaurant disparu (ft. Baghera Jones)", date: "2024-04-14" },
  { arc: "Valenthia", id: "cLkvr87E1nI", code: "S01E03", title: "La fête de la lune", date: "2024-09-28" },
  { arc: "Valenthia", id: "EYFfobMyccc", code: "S01E04", title: "La province heureuse", date: "2024-10-10" },
  { arc: "Valenthia", id: "WpUDxfYKXsg", code: "S01E05", title: "Le dernier des grands hommes", date: "2024-11-07" },
  { arc: "Valenthia", id: "5v6UCzVBjq4", code: "S01E06", title: "L'agent secret d'Aria", date: "2024-11-28" },
  { arc: "Valenthia", id: "jKT4nubrXqU", code: "S01E07", title: "Retour à Valenthia (fin)", date: "2024-12-12" },

  // ---- Sheol (2025-2026) ----
  { arc: "Sheol", id: "Ff58isdKAFc", code: "EP01", title: "De l'autre côté du miroir", date: "2025-02-05" },
  { arc: "Sheol", id: "x0kh9Nnb2Rw", code: "EP02", title: "La dinde à deux têtes", date: "2025-02-19" },
  { arc: "Sheol", id: "nV5A9k2Azkg", code: "EP03", title: "Beaucoup d'amour", date: "2025-03-05" },
  { arc: "Sheol", id: "D0H3Ja_Y4vE", code: "EP04", title: "Longue nuit au grand hôtel", date: "2025-03-19" },
  { arc: "Sheol", id: "IC1esOY3uAQ", code: "EP05", title: "La disparition", date: "2025-04-02" },
  { arc: "Sheol", id: "FI9bF0MKmNQ", code: "EP06", title: "La magicienne stagiaire", date: "2025-04-26" },
  { arc: "Sheol", id: "ompnQ6XXNJk", code: "EP07", title: "Embrouille postale", date: "2025-04-30" },
  { arc: "Sheol", id: "64J1z-59AXs", code: "EP08", title: "Itinéraire gourmand", date: "2025-05-14" },
  { arc: "Sheol", id: "Uo-UziRmyho", code: "EP09", title: "Adoption et botanique", date: "2025-05-28" },
  { arc: "Sheol", id: "zxOF464Ub_4", code: "EP10", title: "Le poulet de jadis", date: "2025-06-11" },
  { arc: "Sheol", id: "WMztw18LGPg", code: "EP11", title: "Le titan du temps", date: "2025-06-25" },
  { arc: "Sheol", id: "1t7RsKHyvaQ", code: "EP12", title: "Massage funeste", date: "2025-09-03" },
  { arc: "Sheol", id: "QLRI0iJTrkM", code: "EP13", title: "Enquête et échec", date: "2025-09-17" },
  { arc: "Sheol", id: "QImyBoHpFos", code: "EP14", title: "Le prince de la night", date: "2025-10-08" },
  { arc: "Sheol", id: "H_eKztZa3qc", code: "EP15", title: "L'île mystérieuse", date: "2025-10-22" },
  { arc: "Sheol", id: "VsHEzYUJInM", code: "EP16", title: "Retour vers Aria", date: "2025-11-05" },
  { arc: "Sheol", id: "Vbd-YYj4oSg", code: "EP17", title: "Aux frontières du réel", date: "2025-11-12" },
  { arc: "Sheol", id: "4TA3sTWfXc0", code: "EP18", title: "Il était une fois la vie", date: "2025-12-03" },
  { arc: "Sheol", id: "BroZCA-JhGw", code: "EP19", title: "Assieds-toi faut que j'te parle", date: "2026-01-07" },
  { arc: "Sheol", id: "Q7onBFgtswY", code: "EP20", title: "Jugez-moi", date: "2026-01-21" },
  { arc: "Sheol", id: "be8k9zRFuVQ", code: "EP21", title: "Justice ou saucisse ? (ft. Joueur du Grenier)", date: "2026-02-18" },
  { arc: "Sheol", id: "8O9mK_U0vhg", code: "EP22", title: "En direct du Frames Festival (ft. Clémovitch)", date: "2026-04-12" },

  // ---- Justice 1937 (mini-série, 2026) ----
  { arc: "Justice 1937", id: "eM23IxDypmE", code: "EP01", title: "Épisode 01", date: "2026-06-10" },
  { arc: "Justice 1937", id: "FkmtU1vFT5w", code: "EP02", title: "Épisode 02", date: "2026-06-17" },
  { arc: "Justice 1937", id: "sjImhSsMuvc", code: "EP03", title: "Épisode 03", date: "2026-07-01" },

  // ---- Odyssée (en cours — 2026) ----
  { arc: "Odyssée", id: "jKtBmDHAJa8", code: "EP01", title: "L'Ascension", date: "2026-09-16" },
];
