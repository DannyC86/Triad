  const MISSIONS = [
    {
      missionId: "4a7b9c1d-e2f3-4a5b-6c7d-8e9f0a1b2c3d",
      title: "The Nasal Gateway",
      subtitle: "Mouth Breathing Reset",
      description: "Permanently re-route your default breathing pathway from your mouth to your nose to optimise sleep, stamina, and respiratory chemistry.",
      durationDays: 21,
      diagnosticConfig: {
        type: "TIMED_HOLD",
        durationSeconds: 60,
        instructions: "Sit comfortably. Take a normal breath in, a normal breath out, and pinch your nose closed. Start the timer. Hold your breath until you experience the very first clear physical urge to breathe. Release your nose and save your score."
      },
      activeSessionId: "buteyko-method",
      passiveTriggers: [{
        templateText: "Airway Check: Are your lips sealed right now? Put your tongue flat against the roof of your mouth.",
        defaultIntervalMinutes: 120
      }]
    },
    {
      missionId: "8f3e2d1c-b4a5-6e7f-8a9b-0c1d2e3f4a5b",
      title: "The Screen Apnea Circuit",
      subtitle: "Desk Breathing Reset",
      description: "Intercept and eliminate subconscious breath-holding or shallow breathing patterns during deep computer desk work.",
      durationDays: 21,
      diagnosticConfig: {
        type: "SURVEY",
        durationSeconds: 30,
        instructions: "Sit at your workstation in your typical typing position. Breathe normally for 30 seconds. On a scale of 1-10, rate the level of physical tension in your chest and throat."
      },
      activeSessionId: "physiological-sigh",
      passiveTriggers: [{
        templateText: "Desk Check: Drop your shoulders, unclamp your teeth, and take a smooth, full diaphragmatic breath.",
        defaultIntervalMinutes: 60
      }]
    }
  ];
