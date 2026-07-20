import type { Messages } from "./types";
import { exerciseNamesFr } from "./exercises/fr";
import { exerciseGuidesFr } from "./guides/fr";

export const fr: Messages = {
  appTitle: "Générateur d'entraînement maison",
  appDescription: "Générez et suivez vos entraînements à domicile",
  locale: {
    label: "Langue",
  },
  groups: {
    cardio: "Cardio",
    lower: "Bas du corps",
    upper: "Haut du corps",
    core: "Abdominaux",
    finisher: "Finishers full-body",
  },
  exercises: exerciseNamesFr,
  guides: exerciseGuidesFr,
  guide: {
    viewGuide: "Comment faire cet exercice",
    howTo: "Comment faire",
    close: "Fermer",
    viewGifDemos: "Voir des GIFs sur Google Images",
  },
  editor: {
    title: "Construire votre circuit",
    subtitle: "Générez un entraînement équilibré en un clic, ou créez le vôtre.",
    exerciseSets: "Exercices",
    addExercise: "+ Ajouter un exercice",
    rounds: "Nombre de tours",
    restBetweenRounds: "Repos entre les tours (optionnel)",
    startCircuit: "Démarrer le circuit",
  },
  nav: {
    build: "Créer",
    history: "Historique",
  },
  generator: {
    title: "Circuit rapide",
    copy: "Des entraînements full-body équilibrés, différents à chaque fois.",
    duration: "Durée",
    intensity: "Intensité",
    light: "Léger",
    balanced: "Modéré",
    intense: "Intense",
    generate: "Générer un circuit",
    regenerate: "Régénérer le circuit",
    durationMin: "{minutes} min",
    howItWorksLink: "Comment ça marche",
  },
  howItWorks: {
    title: "Comment ça marche",
    subtitle: "Le détail de la façon dont Circuit rapide construit un entraînement équilibré.",
    back: "← Retour à l'éditeur",
    introTitle: "L'idée",
    introBody:
      "Le générateur ne tire pas une liste d'exercices au hasard. Il remplit une séquence fixe d'emplacements (types de mouvement), puis choisit un exercice adapté à chacun. La durée et l'intensité déterminent les exercices autorisés, le rythme du cardio et le nombre de tours.",
    choicesTitle: "Vos choix",
    choicesBody:
      "Vous réglez deux paramètres : la durée (15, 20 ou 30 minutes) et l'intensité (Léger, Modéré ou Intense). Tout le reste — ordre des emplacements, tours, repos et exercices disponibles — en découle.",
    slotsTitle: "Emplacements par type de mouvement",
    slotsBody:
      "Chaque durée a un ordre d'emplacements prévu. Un exercice est choisi par emplacement : les séances courtes couvrent l'essentiel, les plus longues ajoutent charnière, tirage, gainage dynamique ou un exercice final.",
    slots15: "15 min — cardio → bas du corps → poussée → tirage → gainage statique (5 exercices)",
    slots20:
      "20 min — cardio → bas du corps → charnière → poussée → gainage statique → gainage dynamique (6 exercices)",
    slots30:
      "30 min — cardio → bas du corps → charnière → poussée → tirage → gainage dynamique → exercice final (7 exercices)",
    slotsLightNote:
      "En séance Léger de 30 minutes, l'emplacement d'exercice final est remplacé par du gainage statique pour garder la séance accessible.",
    roundsTitle: "Tours et repos",
    roundsBody:
      "La durée fixe aussi le nombre de tours et le repos entre les tours. Vous pouvez encore les modifier ensuite.",
    rounds15: "15 min — 3 tours, 30 secondes de repos",
    rounds20: "20 min — 3 tours, 45 secondes de repos",
    rounds30: "30 min — 4 tours, 60 secondes de repos",
    filterTitle: "Quels exercices peuvent apparaître",
    filterBody:
      "Chaque exercice du catalogue a une plage d'intensité, un niveau d'impact et parfois des règles optionnelles. Pour chaque emplacement, seuls les candidats adaptés à la séance sont gardés.",
    filterIntensity:
      "Plage d'intensité — un exercice n'apparaît que si votre intensité est entre son minimum et son maximum.",
    filterImpact:
      "Impact — Léger n'inclut jamais les mouvements à fort impact. En Modéré, les exercices finaux à fort impact ne sont autorisés que parfois.",
    filterCaps:
      "Plafonds de durée — quelques mouvements débutants (comme les pompes murales) sont limités aux séances plus courtes ou aux intensités plus basses.",
    filterCardio:
      "Dynamisme cardio — en Intense, le cardio trop doux (marche sur place, touches de pointe, etc.) est exclu pour garder une ouverture dynamique.",
    constraintsTitle: "Règles d'équilibre",
    constraintsBody:
      "Une fois les candidats filtrés, des règles souples évitent un circuit répétitif ou gênant à enchaîner.",
    constraintsUnique:
      "Préférer des exercices non encore utilisés pour éviter le même mouvement deux fois dans le circuit.",
    constraintsStatic:
      "Au plus deux maintiens isométriques (planches, chaise murale, etc.) par circuit.",
    constraintsConsecutive:
      "Éviter deux maintiens isométriques d'affilée, et éviter deux exercices unilatéraux (un côté) d'affilée.",
    constraintsFallback:
      "Si une règle ne laisse plus de candidats, elle est assouplie étape par étape pour pouvoir quand même construire un circuit.",
    weightsTitle: "Tirage pondéré",
    weightsBody:
      "Parmi les candidats restants, le choix est aléatoire mais pondéré. Les exercices qui collent bien à l'intensité sont favorisés. Les mouvements accessoires ont moins de chances d'être tirés. En cardio Intense, les options plus dynamiques sont bien plus probables ; en Léger, le cardio plus doux est privilégié.",
    quantitiesTitle: "Répétitions et durées",
    quantitiesBody:
      "Chaque exercice a des bases de répétitions ou de temps de maintien pour Léger, Modéré et Intense. Le générateur ajoute un petit aléatoire, puis arrondit à des nombres propres (pairs ou multiples de 5 pour les répétitions ; multiples de 5 secondes pour les maintiens chronométrés).",
    shuffleTitle: "Mélanger un exercice",
    shuffleBody:
      "Le bouton mélanger sur un exercice ne change que cet emplacement. Il garde le même type de mouvement, respecte le reste du circuit, et évite de reprendre l'exercice que vous venez d'écarter.",
    editTitle: "Vous gardez le contrôle",
    editBody:
      "Après la génération, vous pouvez changer n'importe quel exercice, modifier les quantités, ajouter ou retirer des exercices, et ajuster tours ou repos. La génération est un bon point de départ — pas un programme figé.",
  },
  set: {
    shuffle: "Mélanger l'exercice",
    remove: "Supprimer l'exercice",
    exercise: "Exercice",
    reps: "Répétitions",
    duration: "Durée",
    repsPerSide: "Rép. / côté",
    durationPerSide: "Durée / côté",
    perSideTooltip: "Faites cette quantité complète de chaque côté — gauche, puis droite.",
    repetitions: "Répétitions",
    durationHint: "Durée (mm:ss ou secondes)",
    durationHintPerSide: "Par côté (mm:ss ou secondes)",
  },
  runner: {
    round: "Tour {current} / {total}",
    restNextRound: "Repos · Tour {round} suivant",
    overview: "Aperçu du circuit",
    recovery: "Récupération",
    restBetweenRounds: "Repos entre les tours",
    restComplete: "Repos terminé !",
    restHint: "Récupérez avant le prochain tour.",
    startNextRound: "Commencer le tour suivant",
    currentExercise: "Exercice en cours",
    timesUp: "C'est fini !",
    startTimer: "Lancer le chrono",
    continue: "Continuer",
    switchSide: "Changer de côté",
    markDone: "Marquer comme fait",
    finishCircuit: "Terminer le circuit",
    finishCircuitConfirmTitle: "Terminer le circuit ?",
    finishCircuitConfirmMessage:
      "Votre progression sera enregistrée, mais le circuit s'arrêtera avant la fin de tous les tours.",
    finishCircuitConfirmAction: "Oui, terminer",
    finishCircuitCancel: "Continuer",
    backToEditor: "← Retour à l'éditeur",
  },
  sides: {
    left: "Gauche",
    right: "Droite",
    sideOf: "Côté {current} sur {total}",
  },
  completion: {
    finishedTitle: "Circuit terminé !",
    completeTitle: "Circuit complété !",
    finishedSubtitle: "Bon travail — voici votre récapitulatif.",
    completeSubtitle: "Bravo — vous avez terminé tous les tours.",
    totalTime: "Temps total",
    roundsCompleted: "Tours complétés",
    exercisesPerRound: "Exercices par tour",
    restBetweenRounds: "Repos entre les tours",
    stoppedAt: "Arrêté à",
    stoppedAtValue: "Tour {round}, {exercise}",
    recap: "Récapitulatif",
    round: "{count} tour",
    rounds: "{count} tours",
    buildNew: "Créer un nouveau circuit",
    roundsOf: "{completed} sur {total}",
  },
  history: {
    title: "Circuits passés",
    subtitle: "Vos entraînements terminés, du plus récent au plus ancien.",
    empty: "Vos circuits terminés apparaîtront ici.",
    completed: "Complet",
    finishedEarly: "Terminé avant la fin",
    back: "← Circuits passés",
    delete: "Supprimer",
    deleteConfirmTitle: "Supprimer ce circuit ?",
    deleteConfirmMessage: "Ce circuit sera définitivement retiré de votre historique.",
    deleteConfirmAction: "Oui, supprimer",
    deleteConfirmCancel: "Annuler",
    redoInEditor: "Refaire ce circuit",
    summary: "{duration} · {rounds}",
    detailTitle: "Circuit passé",
    detailSubtitle: "Terminé le {date}",
    detailSubtitleEarly: "Arrêté le {date}",
    effort: "{score}/10",
    effortLabel: "Score d'effort",
    effortTooltip:
      "Estime la difficulté selon la durée de la séance et l'intensité des exercices, sur une échelle de 1 (léger) à 10 (intense).",
    listDateLabel: "Date",
    listSessionLabel: "Séance",
    listMeta: "{duration} · {rounds}",
    effortChartTitle: "Effort dans le temps",
    regularityTitle: "Régularité",
    chartNeedsMore: "Terminez plus de circuits pour voir la tendance.",
    weekStreak: "{count} semaine d'affilée",
    weekStreaks: "{count} semaines d'affilée",
    weeklyAverage: "{count} / sem. en moy.",
  },
  quantity: {
    reps: "{count} rép.",
    repsSides: "{count} rép. × {sides}",
    durationSides: "{duration} × {sides}",
  },
  elapsed: {
    seconds: "{seconds} s",
    minutes: "{minutes} min {seconds} s",
  },
};
