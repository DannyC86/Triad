  const APP_VERSION = 'v2.3.0';


  /* ════════════════ DATA ════════════════ */

  const TECHNIQUES = [
    {
      id: "physiological-sigh",
      appLevel: 1,
      locked: true,
      title: "Physiological Sigh",
      desc: "A double-inhale and long exhale — the fastest reset available, in about 15 seconds.",
      bestFor: "Stress reset",
      difficulty: "Beginner",
      duration: "1 breath cycle · ~15 sec",
      steps: [
        "Inhale fully through the nose, filling belly then chest.",
        "At the top, take a second sharp sniff through the nose (1–2 seconds).",
        "Exhale slowly and completely through the mouth — longer than the inhale.",
        "Return to normal breathing. Repeat 1–3 times if needed."
      ],
      benefits: [
        "Fastest evidence-based stress reduction of any voluntary technique.",
        "Reinflates collapsed alveoli, restoring efficient gas exchange.",
        "Rapidly offloads accumulated CO₂.",
        "Activates the vagal parasympathetic response."
      ],
      cautions: "Safe for all. No contraindications. Use freely throughout the day."
    },
    {
      id: "4-7-8-breathing",
      appLevel: 1,
      locked: true,
      title: "4-7-8 Breathing",
      desc: "Dr Andrew Weil's natural tranquiliser — a 4-second inhale, 7-second hold, 8-second exhale.",
      bestFor: "Sleep",
      difficulty: "Beginner",
      duration: "3–8 cycles · 2–5 min",
      steps: [
        "Exhale completely through the mouth with a soft whoosh.",
        "Close the mouth and inhale through the nose for a count of 4.",
        "Hold the breath for a count of 7.",
        "Exhale through the mouth for a count of 8.",
        "Repeat the cycle 3–4 times to start, building gradually to 8."
      ],
      benefits: [
        "Rapid parasympathetic activation.",
        "Reduces anxiety and panic response.",
        "Induces drowsiness — excellent for falling asleep.",
        "Interrupts thought loops by occupying working memory."
      ],
      cautions: "Avoid in the first trimester of pregnancy. Cardiovascular conditions need medical clearance. Use caution with asthma. Not for children under 12. Never practise near water."
    },
    {
      id: "box-breathing",
      appLevel: 1,
      locked: true,
      title: "Box Breathing",
      desc: "The Navy SEAL favourite — equal counts of 4 in, 4 hold, 4 out, 4 hold. Quiet, controlled, focused.",
      bestFor: "Focus",
      difficulty: "Beginner",
      duration: "4–6 minutes",
      steps: [
        "Exhale completely to empty the lungs.",
        "Inhale through the nose for 4 counts.",
        "Hold the breath in for 4 counts.",
        "Exhale through the nose for 4 counts.",
        "Hold the breath out for 4 counts. Repeat for the full duration."
      ],
      benefits: [
        "Restores prefrontal cortex function under stress.",
        "Stabilises heart rate and blood pressure.",
        "Enhances cognitive performance and decision-making.",
        "Reduces anxiety without inducing dissociation."
      ],
      cautions: "Breath retention is contraindicated with serious heart conditions. Pregnancy requires medical clearance. Avoid in water. Some anxiety disorders find holds triggering — back off if so."
    },
    {
      id: "buteyko-method",
      appLevel: 1,
      locked: true,
      title: "Buteyko Method",
      desc: "Restore tolerance to CO₂ through gentle nasal under-breathing — the antidote to chronic over-breathing.",
      bestFor: "Anxiety / Asthma",
      difficulty: "Beginner",
      duration: "3–5 min cycles × 3–4",
      steps: [
        "Sit comfortably with the mouth closed.",
        "Slightly reduce the depth of each nasal breath.",
        "Maintain a sensation of mild air hunger (never distress).",
        "Continue for 3–5 minutes with gentle, sustained focus.",
        "Rest and breathe normally for 2–3 minutes between cycles."
      ],
      benefits: [
        "Reduces the effects of chronic hyperventilation.",
        "Improves asthma symptoms and reduces reliever use.",
        "Enhances oxygen delivery via the Bohr effect.",
        "Restores normal CO₂ chemoreceptor sensitivity."
      ],
      cautions: "Avoid with severe respiratory disease. If trialling mouth taping for sleep, start gradually and never over-tighten."
    },
    {
      id: "wim-hof-method",
      appLevel: 2,
      locked: true,
      title: "The Wim Hof Method",
      desc: "Powerful breaths, deliberate retentions, and (optionally) cold — voluntary access to the autonomic nervous system.",
      bestFor: "Energy / Resilience",
      difficulty: "Intermediate",
      duration: "3–4 rounds · 10–15 min",
      steps: [
        "Sit or lie down somewhere safe — never near water.",
        "Take 30–40 powerful breaths through the mouth (full inhale, passive exhale).",
        "After the final exhale, hold the breath out (30 sec to 3+ min).",
        "Inhale fully, hold for 15 seconds, then release.",
        "Rest 1–2 minutes. Repeat for 3–4 rounds."
      ],
      benefits: [
        "Voluntary modulation of the innate immune response (Radboud studies).",
        "Adrenaline release and sympathetic activation.",
        "Improved cold tolerance via brown adipose tissue.",
        "Stress resilience and a measurable sense of vitality."
      ],
      cautions: "NEVER practise in water, while driving, or in any unsafe position. Pregnancy contraindicated. Cardiovascular conditions need clearance. Avoid with epilepsy or any history of fainting — risk of loss of consciousness."
    },
    {
      id: "nadi-shodhana",
      appLevel: 1,
      locked: true,
      title: "Nadi Shodhana",
      desc: "Alternate-nostril breathing — the yogi's tool for balancing nervous system and hemispheres.",
      bestFor: "Balance",
      difficulty: "Beginner",
      duration: "5–15 min · 6–12 cycles",
      steps: [
        "Sit upright. Form Vishnu Mudra (right hand, fold index and middle fingers).",
        "Close the right nostril with the thumb; inhale through the left for 4 counts.",
        "Close both nostrils; hold for 4–16 counts.",
        "Release the right nostril; exhale through the right for 8 counts.",
        "Inhale right, hold both, exhale left. That's one cycle — continue."
      ],
      benefits: [
        "Purifies and balances the energetic channels (nadis).",
        "Reduces cortisol and sympathetic arousal.",
        "Increases heart rate variability.",
        "Improves memory and cognitive function."
      ],
      cautions: "Generally safe. Avoid extended retentions during pregnancy."
    },
    {
      id: "kapalabhati",
      appLevel: 1,
      locked: true,
      title: "Kapalabhati",
      desc: "Skull-shining breath — sharp, rhythmic abdominal exhales that energise and clear the mind.",
      bestFor: "Energy",
      difficulty: "Beginner",
      duration: "3–5 min · 30–300+ reps",
      steps: [
        "Sit upright, hands resting on the knees.",
        "Take a normal inhale to begin.",
        "Sharply contract the abdomen to force a forceful exhale through the nose.",
        "Let the inhale happen passively as the abs release.",
        "Rhythm: one exhale per second for beginners; 2–3/sec for advanced."
      ],
      benefits: [
        "Stimulates alertness and mental energy.",
        "Massages the abdominal organs.",
        "Clears mucus from the respiratory tract.",
        "Strengthens the diaphragm."
      ],
      cautions: "Contraindicated with hypertension, hernia, pregnancy, recent abdominal surgery, or epilepsy."
    },
    {
      id: "bhramari",
      appLevel: 1,
      locked: true,
      title: "Bhramari",
      desc: "Humming bee breath — a soft hum on the exhale that floods the body with nitric oxide and calm.",
      bestFor: "Sleep / Anxiety",
      difficulty: "Beginner",
      duration: "5–10 minutes",
      steps: [
        "Sit comfortably, eyes closed.",
        "Place the index fingers gently over the ears (or use the thumbs to close the canals).",
        "Inhale fully through the nose.",
        "Exhale with a steady, continuous humming through the nose.",
        "Lips gently closed — let the sound resonate in the skull."
      ],
      benefits: [
        "Boosts nasal nitric oxide ~15× over silent breathing.",
        "Activates the vagus nerve via mechanoreceptor stimulation.",
        "Induces deep calm and parasympathetic dominance.",
        "Anecdotally helpful for tinnitus and tension headaches."
      ],
      cautions: "Safe for all. No significant contraindications."
    },
    {
      id: "ujjayi",
      appLevel: 1,
      locked: true,
      title: "Ujjayi",
      desc: "Ocean breath — a soft throat constriction creating an audible inner wave that anchors attention.",
      bestFor: "Focus / Yoga",
      difficulty: "Beginner",
      duration: "5–30 minutes",
      steps: [
        "Breathe through the nose with the mouth closed.",
        "Slightly constrict the back of the throat — as if gently fogging a mirror.",
        "Create a soft oceanic sound, like distant waves.",
        "Maintain the constriction on both inhale and exhale.",
        "Let the sound itself be the focal point for attention."
      ],
      benefits: [
        "Slows the breath naturally through resistance.",
        "Provides an internal auditory anchor for concentration.",
        "Generates internal heat (tapas).",
        "Improves gas exchange efficiency."
      ],
      cautions: "Safe for all. Most commonly paired with yoga asana practice."
    },
    {
      id: "kumbhaka",
      appLevel: 3,
      locked: true,
      title: "Kumbhaka",
      desc: "Deliberate breath retention — the advanced art of pausing prana to refine awareness.",
      bestFor: "Deep practice",
      difficulty: "Advanced",
      duration: "5 sec – 5+ min (varies)",
      steps: [
        "Build a strong foundation with simple breathing first.",
        "Begin with short 5–10 second retentions after a full inhale.",
        "Progress gradually over weeks and months — never force.",
        "Practise with effortlessness, not tension.",
        "Advanced: combine extended retentions with bandhas (muscular locks) under guidance."
      ],
      benefits: [
        "Accumulates CO₂, enabling vasodilation and the Bohr effect.",
        "Builds respiratory muscle strength.",
        "Stimulates mitochondrial adaptation.",
        "Opens access to deeper meditative states."
      ],
      cautions: "Contraindicated in pregnancy. Cardiovascular conditions require medical clearance. Build a strong foundation before attempting. Extended retentions should be supervised by a qualified teacher."
    },
    {
      id: "diaphragmatic-breathing",
      appLevel: 2,
      locked: true,
      title: "Diaphragmatic Breathing",
      desc: "Deep belly breathing designed to maximise oxygen exchange and lower cortisol.",
      bestFor: "Recovery",
      difficulty: "Intermediate",
      duration: "8–15 minutes",
      steps: [
        "Lie flat on your back with your knees slightly bent, or sit comfortably upright.",
        "Place one hand on your upper chest and the other on your abdomen just below the rib cage.",
        "Inhale slowly through your nose, ensuring the hand on your stomach rises while the hand on your chest remains still.",
        "Tighten your stomach muscles and let them fall inward as you exhale through pursed lips.",
        "Repeat, letting the diaphragm drive the entire breath movement."
      ],
      benefits: [
        "Activates the parasympathetic nervous system via vagal stimulation.",
        "Reduces accessory muscle tension in neck and shoulders.",
        "Improves oxygen-CO₂ exchange efficiency.",
        "The foundation for all advanced breathwork."
      ],
      cautions: "Safe for all. No contraindications. The most universally appropriate breath practice."
    },
    {
      id: "extended-exhale",
      appLevel: 3,
      locked: true,
      title: "Extended Exhale",
      desc: "A down-regulation protocol stretching the exhalation phase to trigger instant calm.",
      bestFor: "Down-regulation",
      difficulty: "Expert",
      duration: "10–20 minutes",
      steps: [
        "Sit comfortably upright with your back supported and drop your shoulders.",
        "Inhale deeply through your nose for a brief count of 4 seconds.",
        "Exhale slowly and completely through your mouth for an extended count of 8 seconds.",
        "Keep the exhalation stream steady, smooth, and fully unhurried.",
        "At the bottom of the breath, pause for 1 second before starting the next inhale."
      ],
      benefits: [
        "Activates the vagus nerve via the extended exhale phase.",
        "Lowers heart rate within minutes.",
        "Reduces anxiety and panic response.",
        "Safe and immediately effective at all levels."
      ],
      cautions: "Safe for all. Avoid forcing the exhale — it should feel natural, not strained."
    },
    {
      id: "resonant-breathing",
      appLevel: 0,
      locked: false,
      tier: "Apprentice",
      phases: [ { type: 'inhale', sec: 5 }, { type: 'exhale', sec: 5 } ],
      title: "Resonant Breathing",
      desc: "Equal-duration pacing to sync heart rate variability with respiratory patterns.",
      bestFor: "Balance",
      difficulty: "Beginner",
      duration: "5–20 minutes",
      steps: [
        "Sit tall: Adopt a comfortable, upright posture with a straight spine.",
        "Inhale: Breathe smoothly through your nose for a steady 5-second count.",
        "Exhale: Transition smoothly into a 5-second nasal exhale. No holding at the top.",
        "Loop it: Maintain this continuous, circular rhythm without pausing between breaths.",
        "Focus: Lock your awareness entirely on the steady flow of air."
      ],
      benefits: [
        "Maximises heart rate variability (HRV).",
        "Balances the sympathetic and parasympathetic systems.",
        "Reduces anxiety and improves emotional regulation.",
        "Research-backed for cardiovascular and mental health."
      ],
      cautions: "Safe for all. If 5 seconds feels too long, start with 4 and build gradually over days."
    },
    {
      id: "tummo",
      appLevel: 3,
      locked: true,
      title: "Tummo",
      desc: "Inner fire breathing from Tibetan Vajrayana tradition. Generates internal heat and altered states.",
      bestFor: "Heat / Energy",
      difficulty: "Advanced",
      duration: "20–40 minutes",
      steps: [
        "Sit in a stable meditation posture.",
        "Visualise a column of fire rising from the navel centre.",
        "Perform forceful rhythmic cycles of inhales and retentions.",
        "Apply Mula Bandha and Uddiyana Bandha on retention.",
        "Advanced: combine with cold exposure for full Tummo integration."
      ],
      benefits: [
        "Generates measurable increases in body temperature.",
        "Produces altered states and heightened awareness.",
        "Builds extraordinary heat and cold tolerance.",
        "Lineage predecessor to the Wim Hof Method."
      ],
      cautions: "Advanced practice. Seek qualified instruction. Contraindicated in pregnancy, cardiovascular conditions, and epilepsy. Never practise near water."
    },
    {
      id: "sama-vritti",
      appLevel: 1,
      locked: true,
      title: "Sama Vritti",
      desc: "Equal ratio breathing. Four counts in, four counts out. Balance through symmetry.",
      bestFor: "Balance",
      difficulty: "Beginner",
      duration: "5–15 minutes",
      steps: [
        "Sit comfortably with the spine upright.",
        "Inhale through the nose for 4 counts.",
        "Exhale through the nose for 4 counts.",
        "Keep both movements smooth and even — no pauses.",
        "Gradually increase to 6 or 8 counts as practice deepens."
      ],
      benefits: [
        "Balances the autonomic nervous system through symmetry.",
        "Develops breath awareness and conscious control.",
        "Calms and centres the mind.",
        "Safe foundation for all ratio-based pranayama."
      ],
      cautions: "Safe for all. The most gentle of the ratio pranayamas — an ideal starting point."
    },
    {
      id: "uddiyana-bandha",
      appLevel: 3,
      locked: true,
      title: "Uddiyana Bandha",
      desc: "Abdominal lock. Advanced pranayama combining breath retention with deep core engagement.",
      bestFor: "Core / Energy",
      difficulty: "Advanced",
      duration: "5–15 minutes",
      steps: [
        "Stand with feet hip-width, hands resting on the thighs.",
        "Exhale completely and hold the breath out.",
        "Draw the abdomen sharply inward and upward.",
        "Hold for 10–15 seconds, then slowly release.",
        "Inhale gently before repeating — 3 to 5 rounds."
      ],
      benefits: [
        "Massages and tones the abdominal organs.",
        "Stimulates the solar plexus and digestive fire.",
        "Builds diaphragmatic control and core strength.",
        "Energises and purifies the pranic body."
      ],
      cautions: "Contraindicated in pregnancy, hypertension, hernia, and post-abdominal surgery. Practise only on an empty stomach. Seek qualified instruction."
    },
    {
      id: "advanced-buteyko",
      appLevel: 3,
      locked: true,
      title: "Advanced Buteyko",
      desc: "Extended CO₂ tolerance training protocols for athletes and advanced practitioners.",
      bestFor: "Performance",
      difficulty: "Advanced",
      duration: "20–40 minutes",
      steps: [
        "Establish a baseline BOLT score (breath-hold after normal exhale).",
        "Perform sustained reduced-breathing exercises with mild air hunger for 10 minutes.",
        "Add walking breath holds — hold after exhale, walk until strong urge to breathe returns.",
        "Simulate altitude training with extended holds after exertion.",
        "Track BOLT score weekly — target above 40 seconds."
      ],
      benefits: [
        "Extends CO₂ tolerance significantly beyond basic Buteyko.",
        "Improves VO₂ max and endurance performance.",
        "Reduces over-breathing during sleep and sport.",
        "Delivers measurably higher BOLT scores within weeks."
      ],
      cautions: "Advanced. Only attempt after mastering foundational Buteyko. Cardiovascular conditions require medical clearance. Never practise alone."
    },
    {
      id: "holotropic-breathwork",
      appLevel: 3,
      locked: true,
      title: "Holotropic Breathwork",
      desc: "Stanislav Grof's transformative method using accelerated breathing to access non-ordinary states.",
      bestFor: "Deep healing",
      difficulty: "Advanced",
      duration: "2–3 hours",
      steps: [
        "Practise only in a qualified, supervised group setting.",
        "Lie down; a trained sitter is present throughout.",
        "Begin sustained accelerated breathing — faster and deeper than normal.",
        "Evocative music guides the inner journey; surrender to what arises.",
        "Integration circle and bodywork support after the session."
      ],
      benefits: [
        "Access to non-ordinary states of consciousness.",
        "Profound emotional release and psychological healing.",
        "Documented transpersonal and perinatal experiences.",
        "Grof's decades of session data demonstrate consistent healing effects."
      ],
      cautions: "Only practise with a trained Holotropic Breathwork facilitator. Contraindicated with psychosis, cardiovascular conditions, epilepsy, pregnancy, and recent surgery."
    }
  ];

  const MEDITATIONS = [
    {
      id: "mindfulness-of-breath",
      appLevel: 0,
      locked: false,
      title: "Mindfulness of Breath",
      desc: "Anapanasati — gentle attention to the natural breath, returning whenever the mind wanders.",
      bestFor: "Focus",
      difficulty: "Beginner",
      duration: "5–10 minutes daily",
      steps: [
        "Get Set: Sit in a stable, comfortable position with your eyes closed.",
        "Settle In: Take a few intentional breaths to drop your awareness into your body.",
        "Let Go: Release all control and let your breath flow completely naturally.",
        "Pick an Anchor: Choose one spot to watch — the tip of your nostrils, the rise of your chest, or the movement of your belly.",
        "Stay Present: Rest your full attention on that anchor. The moment you notice your mind wandering, gently bring it right back."
      ],
      benefits: [
        "Reduces amygdala reactivity over time.",
        "Strengthens prefrontal cortex function.",
        "Decreases rumination and anxiety.",
        "Builds sustained attention capacity."
      ],
      cautions: "None. Safe for all."
    },
    {
      id: "body-scan",
      appLevel: 1,
      locked: true,
      title: "Body Scan",
      desc: "Systematic head-to-toe attention to physical sensation — the gateway to interoception.",
      bestFor: "Pain / Sleep",
      difficulty: "Beginner",
      duration: "20–45 min (or 10-min short)",
      steps: [
        "Lie down or sit, eyes closed, body relaxed.",
        "Move attention slowly from the crown of the head downward.",
        "Notice each region's sensations without trying to change anything.",
        "Continue through the whole body to the soles of the feet.",
        "Rest in whole-body awareness, or repeat upward."
      ],
      benefits: [
        "Reduces chronic pain perception.",
        "Improves sleep quality.",
        "Decreases anxiety and tension.",
        "Strengthens interoceptive awareness."
      ],
      cautions: "Appropriate for all. Those with trauma may benefit from a teacher's guidance."
    },
    {
      id: "loving-kindness",
      appLevel: 2,
      locked: true,
      title: "Loving-Kindness (Metta)",
      desc: "Five-stage cultivation of benevolence — toward self, loved ones, strangers, the difficult, and all beings.",
      bestFor: "Compassion",
      difficulty: "Intermediate",
      duration: "20–30 minutes",
      steps: [
        "Sit comfortably and close the eyes.",
        "Phase 1 — Self: silently offer wishes for your own wellbeing.",
        "Phase 2 — Benefactor: extend the wishes to someone kind to you.",
        "Phase 3 — Neutral: extend to someone neutral in your life.",
        "Phase 4 — Difficult: extend to someone challenging.",
        "Phase 5 — All beings: expand the wishes outward to all life."
      ],
      benefits: [
        "Increases positive emotions and social connectedness.",
        "Reduces implicit bias and increases empathy.",
        "Improves vagal tone and lowers resting heart rate.",
        "Enhances sense of meaning and purpose."
      ],
      cautions: "For trauma survivors, the difficult-person phase may need a gentle, optional approach."
    },
    {
      id: "yoga-nidra",
      appLevel: 1,
      locked: true,
      title: "Yoga Nidra (NSDR)",
      desc: "Non-Sleep Deep Rest — guided descent into the hypnagogic state for profound restoration.",
      bestFor: "Recovery",
      difficulty: "Beginner",
      duration: "20–45 minutes",
      steps: [
        "Lie down comfortably — you will not move for the duration.",
        "Close the eyes and take 3–5 slow breaths.",
        "Rotate awareness through body parts in rapid succession.",
        "Visualise contrasts: heaviness/lightness, warmth/cool.",
        "Rest in open awareness or with guided imagery to close."
      ],
      benefits: [
        "Restores dopamine levels after sleep deprivation.",
        "Enhances neuroplasticity and learning.",
        "Rapid mental recovery without full sleep.",
        "Improves overall sleep quality."
      ],
      cautions: "Safe for all. Excellent for jet lag and stress recovery."
    },
    {
      id: "trataka",
      appLevel: 2,
      locked: true,
      title: "Trataka",
      desc: "Candle gazing — unwavering visual focus followed by inner visualisation. A classical concentration practice.",
      bestFor: "Concentration",
      difficulty: "Intermediate",
      duration: "5–20 minutes",
      steps: [
        "Place a candle at eye level, 2–3 feet away, in a darkened room.",
        "Sit stably and gaze at the flame without blinking.",
        "Allow the eyes to water naturally.",
        "When you must blink, close the eyes and visualise the afterimage.",
        "Open when the image fades and resume gazing."
      ],
      benefits: [
        "Develops single-pointed concentration (dharana).",
        "Reduces mind-wandering tendency.",
        "Strengthens the muscles of the eye.",
        "Prepares the mind for deeper meditation."
      ],
      cautions: "Avoid with serious eye conditions. Never force through dry-eye discomfort."
    },
    {
      id: "open-awareness",
      appLevel: 3,
      locked: true,
      title: "Open Awareness",
      desc: "Resting as awareness itself, without object — the non-dual practice of recognising what's already here.",
      bestFor: "Insight",
      difficulty: "Advanced",
      duration: "5–30+ minutes",
      steps: [
        "Sit comfortably and close the eyes.",
        "Release any impulse to focus on a specific object.",
        "Allow awareness to be present without an anchor.",
        "Let thoughts, sounds, and sensations arise and pass without engagement.",
        "Rest as the space in which all experience appears."
      ],
      benefits: [
        "Direct experiential access to awareness itself.",
        "Non-conceptual understanding of consciousness.",
        "Freedom from habitual mental patterns.",
        "Access to non-dual states of being."
      ],
      cautions: "Advanced. Best approached after a solid foundation in concentration practice. Some teachers advise starting with simpler techniques first."
    },
    {
      id: "gratitude-meditation",
      appLevel: 1,
      locked: true,
      title: "Gratitude Meditation",
      desc: "Active cognitive reframing targeting positive states and neurochemical rewires.",
      bestFor: "Heart",
      difficulty: "Beginner",
      duration: "10–15 minutes",
      steps: [
        "Sit comfortably upright, close your eyes, and settle your breathing.",
        "Bring to mind a specific person who has made a meaningful difference in your life.",
        "Silently visualise their face, holding onto the physical feeling of appreciation that arises.",
        "Transition your focus to a small, simple daily convenience or positive condition in your current environment.",
        "Sit directly within the physical sensations of that warmth and abundance without overanalysing it."
      ],
      benefits: [
        "Increases dopamine and serotonin through positive emotional focus.",
        "Reduces depression and anxiety symptoms.",
        "Strengthens social connection and empathy.",
        "Rewires attention toward positive aspects of experience."
      ],
      cautions: "Safe for all. If grief arises, allow it — gratitude and grief can coexist."
    },
    {
      id: "box-visualization",
      appLevel: 1,
      locked: true,
      title: "Box Visualization",
      desc: "A high-focus mental projection tracking a geometric anchor to lock down wandering thoughts.",
      bestFor: "Clarity",
      difficulty: "Beginner",
      duration: "5–15 minutes",
      steps: [
        "Sit with a straight, alert posture and gently close your eyes.",
        "Visualise a clean, glowing line drawing a path from left to right in your mind's eye.",
        "Track the line travelling down to form the right side of a box, keeping your focus tight on its path.",
        "Visualise the line drawing the bottom edge from right to left, matching your pacing.",
        "Follow the line as it runs back up to the starting corner, sealing a perfect square."
      ],
      benefits: [
        "Combines breathwork and visualisation for compound calming effect.",
        "Develops mental imagery capacity.",
        "Anchors breath practice with visual focus.",
        "Accessible entry point for beginners to combined practices."
      ],
      cautions: "Safe for all. A gentle bridge between breathwork and meditation."
    },
    {
      id: "soundscape-meditation",
      appLevel: 1,
      locked: true,
      title: "Soundscape Meditation",
      desc: "Using external auditory frequencies to anchor presence and clear background noise.",
      bestFor: "Awareness",
      difficulty: "Beginner",
      duration: "10–20 minutes",
      steps: [
        "Put on high-quality headphones and close your eyes in a resting seat.",
        "Let your ears reach out to find the furthest, most distant layer of background sound.",
        "Drop any desire to name or judge what is causing the sound; receive it as raw vibration.",
        "Shift your focus to the closest layer of sound — your own breath or the quiet inside the room.",
        "Expand your hearing to track all sounds simultaneously, letting them arise and fall like waves."
      ],
      benefits: [
        "Accessible anchor for those who struggle with breath focus.",
        "Develops non-reactive present-moment awareness.",
        "Can be practised anywhere without special conditions.",
        "Soothes the nervous system through auditory entrainment."
      ],
      cautions: "Safe for all. Particularly helpful for those with anxiety around body awareness."
    },
    {
      id: "visualization",
      appLevel: 2,
      locked: true,
      title: "Visualization",
      desc: "Directed mental imagery for performance, healing, and manifestation. Used by elite athletes worldwide.",
      bestFor: "Performance",
      difficulty: "Intermediate",
      duration: "10–20 minutes",
      steps: [
        "Settle into a comfortable seat, eyes closed.",
        "Choose a specific target: a performance, a healed state, a quality you seek.",
        "Build the scene from the inside — feel, hear, smell, see the experience.",
        "Run through it in real time, as vividly as possible.",
        "Anchor the image with a breath and a single word before opening the eyes."
      ],
      benefits: [
        "Activates the same neural pathways as physical rehearsal.",
        "Measurably improves athletic and musical performance.",
        "Accelerates motor learning and skill acquisition.",
        "Standard practice of Olympic athletes, surgeons, and musicians."
      ],
      cautions: "Safe for all. Best results come from specificity and regular daily practice."
    },
    {
      id: "mantra-japa",
      appLevel: 1,
      locked: true,
      title: "Mantra (Japa)",
      desc: "Sacred sound repetition from the Vedic tradition. The vibration of mantra settles the mind.",
      bestFor: "Depth / Tradition",
      difficulty: "Beginner",
      duration: "20–40 minutes",
      steps: [
        "Sit comfortably in a stable, upright position.",
        "Choose a mantra: Om, So Hum, a personal mantra, or a sacred phrase.",
        "Repeat the mantra silently or softly, coordinated with the breath.",
        "When the mind wanders, return to the mantra without judgement.",
        "Use a mala (108 beads) to track repetitions if desired."
      ],
      benefits: [
        "Settles mental activity through vibrational resonance.",
        "Aligns breath and mind through rhythmic repetition.",
        "Access to deeper states of concentration and stillness.",
        "Rooted in 5,000 years of living contemplative tradition."
      ],
      cautions: "Safe for all. Choose a mantra from an authentic tradition or with guidance if possible."
    },
    {
      id: "gap-watching",
      appLevel: 2,
      locked: true,
      title: "Gap Watching",
      desc: "Observing the space between thoughts. Eckhart Tolle's direct path to present-moment awareness.",
      bestFor: "Presence",
      difficulty: "Intermediate",
      duration: "10–30 minutes",
      steps: [
        "Sit quietly and close the eyes.",
        "Ask yourself: what will my next thought be?",
        "Wait in alert, open attention — notice the gap before thought arises.",
        "Each time a thought appears, notice the silence it arose from.",
        "Rest in the gaps, letting them lengthen naturally."
      ],
      benefits: [
        "Direct access to present-moment awareness.",
        "Disrupts habitual compulsive thinking.",
        "Reveals the stillness behind thought.",
        "Foundation of Eckhart Tolle's teaching on the Now."
      ],
      cautions: "Safe for all. Can be powerfully disorienting at first — allow the unfamiliarity."
    },
    {
      id: "self-inquiry",
      appLevel: 3,
      locked: true,
      title: "Self-Inquiry",
      desc: "Who am I? Ramana Maharshi's direct path to awareness through questioning the nature of self.",
      bestFor: "Liberation",
      difficulty: "Advanced",
      duration: "20–60 minutes",
      steps: [
        "Sit in stillness and ask: who is aware right now?",
        "Notice the 'I' that seems to be the observer.",
        "Ask: what is this 'I'? From where does it arise?",
        "Turn attention back on itself — toward its own source.",
        "Remain in the inquiry, not seeking an answer but resting in the question."
      ],
      benefits: [
        "Direct investigation of the nature of consciousness.",
        "Dissolves the sense of a separate, bounded self.",
        "Ramana Maharshi's most direct and powerful teaching.",
        "Access to the ground of pure awareness beneath thought."
      ],
      cautions: "Advanced. Best approached with a foundation in basic meditation. Teacher guidance is recommended."
    },
    {
      id: "chakra-visualization",
      appLevel: 2,
      locked: true,
      title: "Chakra Visualization",
      desc: "Energy centre activation through focused imagery. Bridges ancient yogic anatomy with modern bodywork.",
      bestFor: "Energy / Tradition",
      difficulty: "Intermediate",
      duration: "20–40 minutes",
      steps: [
        "Lie down or sit comfortably with the spine aligned.",
        "Begin at the root chakra (base of spine) — visualise a spinning red disc.",
        "Ascend through each centre: sacral (orange), solar plexus (yellow), heart (green), throat (blue), third eye (indigo), crown (violet).",
        "Spend 2–3 minutes with each centre, breathing into it.",
        "End by seeing all seven centres illuminated simultaneously."
      ],
      benefits: [
        "Deepens body awareness through internal imagery.",
        "Bridges traditional yogic anatomy with somatic experience.",
        "Balances and energises the pranic body.",
        "Integrates visualisation and breathwork traditions."
      ],
      cautions: "Safe for all. Best approached with an open, exploratory attitude."
    },
    {
      id: "void-meditation",
      appLevel: 3,
      locked: true,
      title: "Void Meditation (Shunyata)",
      desc: "Resting as pure emptiness. The Heart Sutra's teaching on the nature of reality.",
      bestFor: "Liberation",
      difficulty: "Advanced",
      duration: "20–60 minutes",
      steps: [
        "Settle into deep stillness — complete a preliminary concentration practice first.",
        "Relax any sense of boundary between self and space.",
        "Allow all objects of experience to dissolve into openness.",
        "Rest as the empty, luminous space in which experience appears.",
        "If thought arises, let it dissolve back into emptiness."
      ],
      benefits: [
        "Non-conceptual direct experience of emptiness (shunyata).",
        "Dissolves the illusion of a fixed, bounded self.",
        "The most advanced form of non-dual awareness practice.",
        "Foundation of Mahayana Buddhist contemplation."
      ],
      cautions: "Advanced. Requires stable grounding in concentration and open-awareness practices. Teacher guidance strongly recommended."
    }
  ];
  /* ════════════════ INIT ════════════════ */

  renderCardGrid(TECHNIQUES, 'techniques-grid', 'showTechniqueDetail');
  renderCardGrid(MEDITATIONS, 'meditate-grid', 'showMeditationDetail');
  renderLibrary();
  initPlanForm();
  _initMissionSessionObserver();
  _restoreMissionNotifications();
  renderHomeSummary();           // initial summary tile + streak badge
  setTimeout(cycleBreathLabel, 2000);

  // Sync theme toggle UI with saved preference
  updateThemeToggle();

  // Render version number on splash only
  const _splashVer = document.getElementById('intro-version');
  if (_splashVer) _splashVer.textContent = APP_VERSION;

  // Paint guest state immediately, then hydrate from /auth/me asynchronously
  updateAuthUi();
  fetchAuthState();

  // Open auth modal in reset-password mode if ?token= is present in URL
  (function checkResetToken() {
    const token = new URLSearchParams(window.location.search).get('token');
    if (!token) return;
    document.getElementById('auth-reset-view').hidden = false;
    document.querySelector('.auth-form').hidden = true;
    document.querySelector('.auth-tabs').hidden = true;
    const titleEl = document.getElementById('authModalTitle');
    if (titleEl) titleEl.textContent = 'Set new password';
    document.getElementById('authModal').classList.add('active');
  })();

  // Inject TRIAD_LOGO_SVG into all logo slots (intro, home, header)
  (function(){
    if (typeof TRIAD_LOGO_SVG === 'undefined') return;
    var introWrap = document.getElementById('intro-svg-wrap');
    if (introWrap) introWrap.innerHTML = TRIAD_LOGO_SVG;
    var homeLogo = document.querySelector('.home-logo');
    if (homeLogo) homeLogo.innerHTML = TRIAD_LOGO_SVG;
    var headerLogo = document.querySelector('.top-header-logo');
    if (headerLogo) headerLogo.innerHTML = TRIAD_LOGO_SVG;
    var completionLogo = document.getElementById('completion-logo-slot');
    if (completionLogo) completionLogo.innerHTML = TRIAD_LOGO_SVG;
    var scLogo = document.getElementById('sc-logo-slot');
    if (scLogo) scLogo.innerHTML = TRIAD_LOGO_SVG;
    var pacerLogo = document.getElementById('pacer-logo-slot');
    if (pacerLogo) pacerLogo.innerHTML = TRIAD_LOGO_SVG;
    var proLogo = document.getElementById('pro-logo-slot');
    if (proLogo) proLogo.innerHTML = TRIAD_LOGO_SVG;
    var mobLogo = document.getElementById('mob-logo-slot');
    if (mobLogo) mobLogo.innerHTML = TRIAD_LOGO_SVG;
    var proIntroLogo = document.getElementById('pro-intro-logo-slot');
    if (proIntroLogo) proIntroLogo.innerHTML = TRIAD_LOGO_SVG;
  })();

  // Intro animation — crossfade splash directly to guest homepage (no white flash)
  (function(){
    var intro = document.getElementById('intro-screen');
    if (!intro) return;
    _introPlayedThisSession = true;
    var home = document.getElementById('home');
    var homeContainer = document.querySelector('#home .home-container');
    if (homeContainer) homeContainer.style.pointerEvents = 'none';

    // Hide persistent header and nav while intro is visible
    document.querySelector('.top-header')?.style.setProperty('display', 'none');
    document.querySelector('.nav')?.style.setProperty('display', 'none');

    // Keep home invisible behind splash so nothing bleeds through during fade
    if (home) home.style.opacity = '0';

    // Cancel the CSS fade-out animation so JS drives the crossfade instead.
    // Children (#intro-svg-wrap, #intro-title, etc.) keep their own animations.
    intro.style.animation = 'none';

    // At 5.5s both transitions start simultaneously — 1.8s each, calm ease-in
    setTimeout(function() {
      intro.style.transition = 'opacity 1.8s ease-in';
      intro.style.opacity = '0';
      if (home) {
        home.style.transition = 'opacity 1.8s ease-in';
        home.style.opacity = '1';
      }
      setTimeout(function() {
        if (intro.parentNode) intro.remove();
        if (home) { home.style.transition = ''; home.style.opacity = ''; }
        if (homeContainer) homeContainer.style.pointerEvents = '';
        // Restore header and nav after intro is gone
        document.querySelector('.top-header')?.style.removeProperty('display');
        document.querySelector('.nav')?.style.removeProperty('display');
      }, 2100);
    }, 5500);
  })();

  /* ─── Mystery achievement tap-to-reveal ─── */
  function toggleMysteryAchievement(el) {
    const wasRevealed = el.classList.contains('revealed');
    document.querySelectorAll('.achievement--mystery.revealed').forEach(r => r.classList.remove('revealed'));
    if (!wasRevealed) el.classList.add('revealed');
  }

  /* ─── Unlocked achievement tap-to-show hint ─── */
  function toggleUnlockedAchievement(el) {
    const wasOpen = el.classList.contains('tooltip-open');
    document.querySelectorAll('.achievement.unlocked.tooltip-open').forEach(a => a.classList.remove('tooltip-open'));
    if (!wasOpen) el.classList.add('tooltip-open');
  }

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.achievement--mystery')) {
      document.querySelectorAll('.achievement--mystery.revealed').forEach(el => el.classList.remove('revealed'));
    }
    if (!e.target.closest('.achievement.unlocked')) {
      document.querySelectorAll('.achievement.unlocked.tooltip-open').forEach(el => el.classList.remove('tooltip-open'));
    }
  });
/* ─── Guest gate: show "Take your First Breath" for brand-new visitors ─── */
(function(){
  var ONBOARD_KEY = 'triad:onboarded';

  function isOnboarded() {
    try {
      // Legacy key (old triangle-pacer flow) OR tour-complete key (new pacer flow)
      return localStorage.getItem(ONBOARD_KEY) === 'true'
          || localStorage.getItem('triad_pacer_tour_done') === '1';
    } catch(e) { return true; } // storage failure → never block the app
  }

  function showGate() {
    var g = document.getElementById('first-breath-gate');
    var c = document.querySelector('.home-cards');
    if (g) g.hidden = false;
    if (c) c.hidden = true;
    document.body.classList.add('first-breath-mode');
  }

  function hideGate() {
    var g = document.getElementById('first-breath-gate');
    var c = document.querySelector('.home-cards');
    if (g) g.hidden = true;
    if (c) c.hidden = false;
    document.body.classList.remove('first-breath-mode');
  }

  // Exposed so the pacer completion buttons can dismiss the gate
  window._hideGuestGate = hideGate;

  function init() {
    if (isOnboarded()) hideGate();
    else               showGate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

window.addEventListener('orientationchange', () => {
  setTimeout(() => { window.dispatchEvent(new Event('resize')); }, 150);
});
