
  /* ════════════════ RICH TECHNIQUE DETAILS (5-tab payload) ════════════════ */
  // Each entry adds Overview / History / How-To / Science / Learn content plus Related links.
  // Sourced from the docs knowledge base + canonical teachers.

  const TECHNIQUE_DETAILS = {

    'physiological-sigh': {
      overview: {
        what: "A double-inhale through the nose followed by an extended exhale through the mouth — a single deliberate cycle of the body's natural reset reflex. Humans sigh spontaneously every ~5 minutes; this is that same circuit, deployed on demand.",
        keyBenefits: [
          "The fastest evidence-based stress reduction of any voluntary technique — measurable shift in seconds.",
          "Fully reinflates collapsed alveoli, restoring efficient gas exchange.",
          "Rapidly offloads accumulated CO₂.",
          "Activates the vagal parasympathetic response via the extended exhale."
        ],
        whenToUse: [
          "Acute stress, anxiety spikes, or panic — at the moment.",
          "Before a difficult conversation, performance, or decision.",
          "Between tasks as a reset throughout the day.",
          "Whenever breathing has become shallow."
        ],
        whoFor: "Everyone. No contraindications. Safe in pregnancy, with cardiovascular conditions, and for children — it's just a deliberate version of what the body already does."
      },
      history: {
        origins: "Sighing as a respiratory reset has been observed in mammals since the 1930s, but the precise neural circuit was characterised by neuroscientist Jack Feldman at UCLA over decades of brainstem research. Feldman's lab identified the pre-Bötzinger complex — a small cluster of neurons that generates breathing rhythm — and within it the specific neurons that fire the sigh.",
        evolution: "The voluntary use of the sigh as a stress tool was popularised by Stanford's Andrew Huberman, who synthesised Feldman's circuit research with respiratory physiology into a practical protocol. The Balban et al. 2023 study at Huberman's lab compared cyclic sighing against box breathing and mindfulness — the sigh won on both mood and physiological arousal.",
        figures: [
          { name: "Jack Feldman",      credit: "UCLA neuroscientist who identified the pre-Bötzinger complex and the sigh circuit." },
          { name: "Andrew Huberman",   credit: "Stanford neurobiologist who brought voluntary use of the sigh to mainstream practice." },
          { name: "Mark Krasnow",      credit: "Stanford molecular biologist; co-discovered the neurons that drive the sigh reflex." }
        ],
        ancient: "Sighing as emotional release is universal — the yogic traditions describe involuntary sighing as the body shedding stagnant prana, the Taoists as releasing stuck chi. Unlike pranayama, this technique is not tradition-bound. It's an ancient mammalian reflex being consciously deployed."
      },
      howTo: {
        progressions: [
          { level: "Beginner",     detail: "One or two cycles when stressed. Notice the shift in your body before deciding if you need another." },
          { level: "Intermediate", detail: "Five minutes of cyclic sighing daily — one breath every ~10 seconds. Research-backed dose." },
          { level: "Advanced",     detail: "Use throughout the day as a between-task reset. Pair with brief eye relaxation for compound effect." }
        ],
        tips: [
          "Make the second inhale a sharp small sniff — not another full breath.",
          "Let the exhale be longer than the combined inhales. The exhale is where the calming happens.",
          "Both inhales through the nose; the exhale through the mouth.",
          "Don't strain. The reset is in the pattern, not the force."
        ]
      },
      science: {
        physiology: "Alveoli — 300 million per lung — progressively collapse during shallow breathing. A single deep breath can't fully re-expand them; the sharp second inhale provides the extra pressure to pop the most collapsed ones open. The long exhale then dumps the accumulated CO₂ from those newly-reinflated alveoli.",
        neuroscience: "The extended exhale activates the vagus nerve via baroreceptor and stretch receptor pathways, triggering parasympathetic dominance. Brain-stem chemoreceptors detect the rapid CO₂ drop and signal 'safe' to the limbic system. The cycle bypasses cortical processing — the calm arrives before you can think about it.",
        research: [
          "Balban et al. (2023, Cell Reports Medicine) — 5 min/day cyclic sighing outperformed box breathing and mindfulness for mood improvement and reduced respiratory rate.",
          "Feldman et al. — characterisation of the pre-Bötzinger complex as the breathing rhythm generator.",
          "Krasnow et al. (Nature 2016) — identified the specific neurons that trigger sighs in mice."
        ],
        tags: ["CO₂ offload", "Vagus nerve", "Alveolar recruitment", "Parasympathetic shift"]
      },
      learn: {
        animation: "sigh",
        video: {
          title: "Reduce Stress & Anxiety With the Physiological Sigh",
          teacher: "Andrew Huberman",
          youtubeId: "rBdhqBGqiMc"
        }
      },
      related: {
        people:     ["Andrew Huberman", "Dr. Stephen Porges"],
        books:      ["Breath: The New Science of a Lost Art", "The Healing Power of the Breath"],
        techniques: ["4-7-8-breathing", "box-breathing", "buteyko-method"]
      }
    },

    '4-7-8-breathing': {
      overview: {
        what: "A 4-second nasal inhale, 7-second hold, and 8-second exhale through pursed lips — Dr Andrew Weil's adaptation of classical yogic ratio breathing. The ratio matters more than the exact counts.",
        keyBenefits: [
          "Rapid parasympathetic activation through the long exhale.",
          "Reduces anxiety and panic response within a few cycles.",
          "Induces drowsiness — one of the best techniques for falling asleep.",
          "Occupies working memory with counting, interrupting rumination loops."
        ],
        whenToUse: [
          "Falling asleep or returning to sleep at 3am.",
          "Anxiety spikes or panic episodes.",
          "Before bed as a nightly wind-down.",
          "Whenever the mind is racing and won't settle."
        ],
        whoFor: "Adults and adolescents seeking a deep calming tool. Pregnant women in the first trimester should skip the long hold. Those with severe cardiovascular conditions should consult a physician."
      },
      history: {
        origins: "Adapted by Dr Andrew Weil from classical pranayama in the 1970s–80s. The 1:1.75:2 inhale-hold-exhale ratio echoes the 1:4:2 ratio described in the Hatha Yoga Pradipika and Patanjali's Yoga Sutras — long-exhale breathing has been a yogic calming technique for millennia.",
        evolution: "Weil — Harvard-trained physician and founder of the Arizona Center for Integrative Medicine — taught the technique to thousands of medical residents and patients from the 1990s onward, then made it mainstream through his books and online presence. It exploded in popularity through YouTube tutorials in the 2010s.",
        figures: [
          { name: "Dr. Andrew Weil",        credit: "Adapted and named the 4-7-8 protocol; brought it to Western medical and lay audiences." },
          { name: "B.K.S. Iyengar",         credit: "Modern systematiser of pranayama ratio breathing in Light on Pranayama." },
          { name: "Paramahansa Yogananda",  credit: "Brought yogic breathing — including ratio practices — to Western audiences in the 20th century." }
        ],
        ancient: "Sama Vritti (equal ratio) and Visama Vritti (uneven ratio) pranayamas are described in classical Hatha texts. The principle that a longer exhale shifts the nervous system parasympathetic is one of the oldest physiological insights in yoga — formalised in writing by the 15th century but practised much earlier."
      },
      howTo: {
        progressions: [
          { level: "Beginner",     detail: "3–4 cycles, twice a day. Don't worry about exact seconds if the 8-count exhale feels too long; preserve the 4:7:8 proportion at shorter values." },
          { level: "Intermediate", detail: "4–8 cycles immediately before bed, with full counts." },
          { level: "Advanced",     detail: "Multiple sessions throughout the day; use during anxiety; build to comfortable 8 cycles." }
        ],
        tips: [
          "Place the tongue tip against the ridge behind the upper front teeth throughout.",
          "Exhale through pursed lips with a soft 'whoosh' sound.",
          "If you feel light-headed, shorten the proportions. Drop to 2-3.5-4.",
          "The ratio (1:1.75:2) is the active ingredient — not the absolute counts."
        ]
      },
      science: {
        physiology: "The extended exhale (twice the inhale length) is the engine — it activates vagal afferents that signal 'safe.' The 7-second hold raises CO₂ slightly, producing mild vasodilation via the Bohr effect, which improves oxygen delivery to tissues.",
        neuroscience: "Counting the breath engages the prefrontal cortex, occupying working memory and disrupting the default-mode network's anxious loops. Combined with the parasympathetic shift, this creates a top-down (cognitive) plus bottom-up (vagal) calming effect.",
        research: [
          "Weil's clinical reports over 30+ years with thousands of patients.",
          "Small RCTs show reduced anxiety scores after consistent practice.",
          "Pranayama ratio-breathing research broadly supports long-exhale techniques (Brown & Gerbarg, multiple studies)."
        ],
        tags: ["Vagus nerve", "Long exhale", "CO₂ modulation", "Cognitive disruption"]
      },
      learn: {
        animation: "478",
        video: {
          title: "Dr. Andrew Weil — Breathing Exercises: 4-7-8 Breath",
          teacher: "Andrew Weil, M.D.",
          youtubeId: "gz4G31LGyog"
        }
      },
      related: {
        people:     ["Dr. Andrew Weil", "B.K.S. Iyengar", "Paramahansa Yogananda"],
        books:      ["Light on Pranayama", "Breath: The New Science of a Lost Art", "Just Breathe"],
        techniques: ["box-breathing", "nadi-shodhana", "physiological-sigh"]
      }
    },

    'box-breathing': {
      overview: {
        what: "Equal counts of 4 in, 4 hold, 4 out, 4 hold — a square. Tactical calm: controlled, alert, and balanced, without the drowsiness of 4-7-8.",
        keyBenefits: [
          "Restores prefrontal cortex function under acute stress.",
          "Stabilises heart rate, blood pressure, and arousal.",
          "Sharpens cognitive performance — calm without sedation.",
          "Reduces anxiety without inducing dissociation."
        ],
        whenToUse: [
          "Before performance — speaking, competition, exam, decision.",
          "Between meetings or high-cognitive-load tasks.",
          "During stress when you need to stay sharp, not sleepy.",
          "As a 5-minute daily nervous-system tune-up."
        ],
        whoFor: "Performers, athletes, operators, and anyone who needs controlled calm. Skip the holds if you have severe cardiovascular conditions or find them anxiety-triggering."
      },
      history: {
        origins: "Direct descendant of yogic Sama Vritti (equal-ratio) pranayama, described in classical Hatha texts. The contemporary 'box' form was popularised in the US military, particularly through Navy SEAL training and Mark Divine's SEALFIT program.",
        evolution: "Originally a yogic balancing practice. Reformulated for tactical use by military psychologists after research into how breathing affects performance under stress. Reached mainstream awareness through Mark Divine's books, Tim Ferriss's podcast, and law-enforcement / first-responder training programs.",
        figures: [
          { name: "Mark Divine",       credit: "Former Navy SEAL commander; founded SEALFIT and popularised box breathing as a tactical resilience tool." },
          { name: "B.K.S. Iyengar",    credit: "Modern systematiser of Sama Vritti pranayama from which box breathing is derived." },
          { name: "Andrew Huberman",   credit: "Neuroscience communicator who has covered slow-paced breathing protocols on his podcast." }
        ],
        ancient: "Sama Vritti — 'equal fluctuations' — is one of the oldest deliberate breathing practices. Patanjali describes equalised breath as preparation for meditation. The yogis discovered millennia ago what the SEALs rediscovered: that equal in–hold–out–hold breathing produces controlled, lucid calm."
      },
      howTo: {
        progressions: [
          { level: "Beginner",     detail: "5 minutes daily at 4-4-4-4. Notice that the holds become natural with practice." },
          { level: "Intermediate", detail: "4-6-4-6 or 5-5-5-5. Same square principle, longer dwell." },
          { level: "Advanced",     detail: "6-6-6-6 or 8-8-8-8 — only with a solid foundation. Never strain the holds." }
        ],
        tips: [
          "Soft mental count — don't grip it. The rhythm is more important than precision.",
          "Holds are pauses, not locks. The breath rests; nothing is forced.",
          "Sit with a relaxed spine. The breath travels easier in an open body.",
          "If the holds feel triggering (anxiety, panic history), drop them and breathe 4 in / 4 out only."
        ]
      },
      science: {
        physiology: "Equal in/out maintains CO₂ stability. The holds train CO₂ tolerance gently. Slow rate (≈3-4 breaths/min at standard 4-count) approaches the 'resonance frequency' (~6 breaths/min) where HRV peaks.",
        neuroscience: "Equal-ratio breathing measurably increases HRV and reduces amygdala reactivity over weeks of practice. The cognitive engagement of counting routes activity through the prefrontal cortex, supporting executive function under stress.",
        research: [
          "Brown & Gerbarg — clinical work on slow-paced breathing for anxiety, PTSD, and depression.",
          "Multiple HRV studies on slow breathing protocols (~6 breaths/min) showing parasympathetic dominance.",
          "Used in PTSD treatment protocols, military performance research, and first-responder training."
        ],
        tags: ["HRV", "Resonance breathing", "Vagal tone", "Autonomic balance"]
      },
      learn: {
        animation: "box",
        video: {
          title: "Box Breathing — Mark Divine on Unbeatable Mind",
          teacher: "Mark Divine (former Navy SEAL)",
          youtubeId: "tEmt1Znux58"
        }
      },
      related: {
        people:     ["Mark Divine", "Dr. Stephen Porges", "B.K.S. Iyengar"],
        books:      ["The Oxygen Advantage", "Light on Pranayama", "The Healing Power of the Breath"],
        techniques: ["4-7-8-breathing", "nadi-shodhana", "ujjayi"]
      }
    },

    'buteyko-method': {
      overview: {
        what: "Gentle nasal under-breathing — deliberately reducing breath volume to restore tolerance for carbon dioxide. The opposite of 'take a big breath.'",
        keyBenefits: [
          "Substantially reduces asthma symptoms and reliever-medication use (RCT evidence).",
          "Reduces chronic anxiety driven by over-breathing.",
          "Improves sleep quality, particularly when combined with mouth-taping.",
          "Enhances oxygen delivery to tissues via restored CO₂ chemistry."
        ],
        whenToUse: [
          "Daily training, 5–20 minutes.",
          "Asthma management as taught by a Buteyko practitioner.",
          "Switching from mouth-breathing to nasal-breathing.",
          "Anxiety driven by chronic hyperventilation."
        ],
        whoFor: "Asthmatics, anxious breathers, mouth-breathers, chronic over-breathers. Avoid with severe respiratory disease without medical supervision."
      },
      history: {
        origins: "Developed by Konstantin Buteyko in 1952 at the First Moscow Institute of Medicine. While monitoring chronically ill patients, he noticed that the sickest were the heaviest breathers — and that reducing breath volume paradoxically improved their condition. He named over-breathing 'the deep breathing disease.'",
        evolution: "Largely suppressed in Soviet medicine through Buteyko's career. Survived through small Soviet clinics treating asthmatic children. Brought to the West in the 1990s via Australian and Irish practitioners; Patrick McKeown — who reversed his own severe asthma through the method — became its leading global teacher and developed the BOLT (Body Oxygen Level Test).",
        figures: [
          { name: "Konstantin Buteyko",  credit: "Ukrainian-born Soviet physician (1923–2003) who developed the method; suppressed in his lifetime." },
          { name: "Patrick McKeown",     credit: "Irish breathing instructor; modern voice of Buteyko; author of The Oxygen Advantage." },
          { name: "James Nestor",        credit: "Brought the method to global mainstream awareness through Breath." }
        ],
        ancient: "Buteyko independently rediscovered the same principle as classical pranayama — that slow, light, nasal breathing is health-promoting; that the appetite for air is calibrated by CO₂ tolerance. The yogis called the air-hunger of training 'tapas,' the heat of practice. Buteyko reached the same conclusion through Soviet physiology."
      },
      howTo: {
        progressions: [
          { level: "Beginner",     detail: "Measure your BOLT score (exhale, pinch nose, count seconds until first definite air-hunger). Aim for slow nasal breathing 5 min/day." },
          { level: "Intermediate", detail: "Mouth-taping at night with surgical tape; walking with reduced volume; brief breath-holds." },
          { level: "Advanced",     detail: "Breath holds while walking; exercise with reduced volume; advanced 'control pause' protocols." }
        ],
        tips: [
          "Air hunger is the goal — mild, sustained. Never distress.",
          "Practice on an empty stomach.",
          "Nasal breathing 24/7, day and night, is the foundational lifestyle change.",
          "BOLT score above 25 seconds is the target; above 40 is excellent."
        ]
      },
      science: {
        physiology: "Chronic over-breathing washes out CO₂, causing vasoconstriction and the Bohr effect to work against you — haemoglobin holds onto oxygen rather than releasing it to tissues. Buteyko restores the CO₂ set-point so blood vessels dilate and oxygen unloads efficiently.",
        neuroscience: "Restored CO₂ reduces sympathetic arousal and respiratory rate. Nasal breathing also produces nitric oxide in the sinuses — a bronchodilator and vasodilator — which mouth-breathing bypasses entirely.",
        research: [
          "Bowler et al. (1998) — Australian RCT; Buteyko reduced asthma reliever use by 90%.",
          "McHugh et al. (2003) — New Zealand RCT confirming asthma benefits.",
          "Nitric oxide research (Lundberg lab) — nasal NO is a key bronchodilator absent in mouth breathing."
        ],
        tags: ["CO₂ tolerance", "Bohr effect", "Nitric oxide", "Nasal breathing"]
      },
      learn: {
        animation: "reduce",
        video: {
          title: "How to Breathe Less — The Buteyko Method",
          teacher: "Patrick McKeown",
          youtubeId: "EUKMNX8jeMA"
        }
      },
      related: {
        people:     ["Patrick McKeown", "Konstantin Buteyko", "James Nestor"],
        books:      ["The Oxygen Advantage", "Breath: The New Science of a Lost Art", "The Breathing Book"],
        techniques: ["nadi-shodhana", "kumbhaka", "ujjayi"]
      }
    },

    'wim-hof-method': {
      overview: {
        what: "30–40 powerful breaths through the mouth with passive exhales, followed by an exhale-hold (often minutes long), followed by a brief recovery inhale-hold. Usually 3–4 rounds. Frequently paired with cold exposure.",
        keyBenefits: [
          "Voluntary modulation of the innate immune response — proven in peer-reviewed research.",
          "Adrenaline release and sympathetic activation on demand.",
          "Cold tolerance through brown adipose tissue activation.",
          "Measurable stress resilience and a felt sense of vitality."
        ],
        whenToUse: [
          "Morning practice — energising, not for evening.",
          "Before cold exposure as the breathing preparation.",
          "Resilience training; immune-modulation protocols.",
          "Never near water, while driving, or in any position where a faint would be dangerous."
        ],
        whoFor: "Healthy adults. Strictly contraindicated in pregnancy, epilepsy, cardiovascular disease, or any condition where loss of consciousness is dangerous."
      },
      history: {
        origins: "Wim Hof — 'The Iceman' — developed the method through the 1980s and 90s in the Netherlands after personal tragedy and immersion in cold environments. He drew on Tibetan Tummo (inner-heat) practice, which he encountered through Buddhist sources, and systematised a simplified, accessible Western version.",
        evolution: "Hof set 26 Guinness World Records including barefoot half-marathon on ice and climbing past 7000m in shorts. The pivotal moment came in 2014 when Matthijs Kox at Radboud University Medical Center published a study showing Hof and trained practitioners could voluntarily suppress the inflammatory response to endotoxin — overturning the assumption that the autonomic nervous system was beyond conscious control.",
        figures: [
          { name: "Wim Hof",         credit: "Developer of the method; subject of the foundational scientific studies." },
          { name: "Matthijs Kox",    credit: "Radboud researcher; lead author of the landmark 2014 PNAS immune-modulation study." },
          { name: "Andrew Huberman", credit: "Neuroscientist who has explored WHM physiology and cold exposure mechanisms on his podcast." }
        ],
        ancient: "A direct simplification of Tibetan Tummo, the inner-heat practice of Vajrayana Buddhism. Tummo masters can raise body temperature enough to dry wet sheets on themselves in freezing caves. Hof's contribution was making a watered-down Tummo accessible to Western practitioners without 20 years of monastic training."
      },
      howTo: {
        progressions: [
          { level: "Beginner",     detail: "1–2 rounds, short holds (30–60s). Always lying down, never near water." },
          { level: "Intermediate", detail: "3–4 rounds, holds extending to 1–2 minutes. Begin pairing with cold showers." },
          { level: "Advanced",     detail: "Multiple rounds with long retention; integrated cold immersion; daily practice." }
        ],
        tips: [
          "NEVER practice in water, while driving, swimming, or where a faint could harm you.",
          "Inhale fully, let the exhale fall passively — don't push the exhale.",
          "The dizziness, tingling, and lightheadedness are normal and part of the response.",
          "The hold is on the EMPTY lungs after the final exhale, not on a full breath."
        ]
      },
      science: {
        physiology: "Forced hyperventilation drops blood CO₂ dramatically, producing respiratory alkalosis. The retention then allows oxygen demand to rise before the CO₂-driven 'breathe!' signal returns. The adrenaline release is real and substantial — comparable to first-bungee-jump levels.",
        neuroscience: "Sympathetic activation releases catecholamines (adrenaline, noradrenaline) voluntarily. fMRI shows activation of the periaqueductal gray and brown adipose tissue under WHM + cold. Voluntary control of normally-involuntary systems is the central scientific finding.",
        research: [
          "Kox et al. (2014, PNAS) — landmark immune modulation study; WHM practitioners suppressed inflammatory markers to injected endotoxin.",
          "Muzik et al. (2018) — fMRI under cold exposure; periaqueductal gray activation suggests top-down pain modulation.",
          "Multiple follow-up studies on inflammation, mood, and stress resilience."
        ],
        tags: ["Sympathetic activation", "CO₂ manipulation", "Adrenaline", "Immune modulation"]
      },
      learn: {
        animation: "wim",
        video: {
          title: "Guided Wim Hof Method Breathing",
          teacher: "Wim Hof",
          youtubeId: "tybOi4hjZFQ"
        }
      },
      related: {
        people:     ["Wim Hof", "Andrew Huberman", "Dr. Stephen Porges"],
        books:      ["The Wim Hof Method", "Stealing Fire", "Breath: The New Science of a Lost Art"],
        techniques: ["kapalabhati", "kumbhaka", "buteyko-method"]
      }
    },

    'nadi-shodhana': {
      overview: {
        what: "Alternate-nostril breathing using one hand to gently close one nostril at a time — the yogi's tool for balancing the nervous system and the brain's hemispheres.",
        keyBenefits: [
          "Reduces cortisol and sympathetic arousal.",
          "Improves heart-rate variability and vagal tone.",
          "Balances the autonomic nervous system.",
          "Excellent preparation for meditation — clears the channels."
        ],
        whenToUse: [
          "Before meditation as a settling practice.",
          "In the morning to start the day balanced.",
          "When feeling scattered, frazzled, or one-sided (over-energised or sluggish).",
          "As a 5–15 minute daily practice."
        ],
        whoFor: "Everyone. No major contraindications. Skip extended retentions during pregnancy."
      },
      history: {
        origins: "One of the oldest documented pranayamas, described in the Hatha Yoga Pradipika (15th century) and earlier yogic texts. Foundational practice across virtually every traditional lineage — Sivananda, Iyengar, Krishnamacharya, Bihar School.",
        evolution: "Carried forward unbroken through Hatha yoga lineages for centuries. Brought to the West by Paramahansa Yogananda (Self-Realization Fellowship, 1920s), then systematised technically by B.K.S. Iyengar in Light on Pranayama (1981). Today taught in nearly every yoga studio worldwide.",
        figures: [
          { name: "B.K.S. Iyengar",        credit: "Most influential modern systematiser of pranayama in Light on Pranayama." },
          { name: "Paramahansa Yogananda", credit: "Brought yogic breathing — including Nadi Shodhana — to permanent Western residence." },
          { name: "Swami Rama",            credit: "Demonstrated voluntary autonomic control in lab settings (Menninger Foundation, 1970s)." }
        ],
        ancient: "Based on the concept of nadis (energy channels): Ida (left, lunar, cooling) and Pingala (right, solar, heating). Balancing them awakens Sushumna — the central channel — through which Kundalini rises in classical accounts. Beyond metaphysics, modern physiology has confirmed the 'nasal cycle' (Hasegawa & Kern 1977) — one nostril is dominant for ~90 minutes alternating, which the yogis observed by direct attention millennia before lab equipment."
      },
      howTo: {
        progressions: [
          { level: "Beginner",     detail: "5 minutes daily. Equal 4-count in and out, no retentions. Use Vishnu Mudra (fold index + middle; use thumb and ring)." },
          { level: "Intermediate", detail: "Add brief 4-count retentions. 10–15 minutes. Notice the nasal cycle." },
          { level: "Advanced",     detail: "Classical 1:4:2 ratio (4 in, 16 hold, 8 out). Only after a solid foundation; learn under a teacher." }
        ],
        tips: [
          "Keep the spine erect — let the breath travel freely.",
          "The breath should be quiet enough that someone next to you wouldn't hear it.",
          "Let the right hand stay relaxed; no gripping the face.",
          "If one nostril is fully blocked, breathe on the dominant side until it clears."
        ]
      },
      science: {
        physiology: "The nasal cycle — confirmed biological reality — alternates dominance roughly every 90 minutes. Each nostril preferentially activates the contralateral cerebral hemisphere. Conscious alternation appears to balance autonomic activity and brain-hemisphere arousal.",
        neuroscience: "EEG studies show right-nostril breathing tends to activate left-hemisphere (verbal/logical) and sympathetic activity; left-nostril breathing the opposite. Alternation produces measurable improvement in heart-rate variability and cognitive measures.",
        research: [
          "Telles et al. (2013) — Nadi Shodhana reduces cortisol and salivary alpha-amylase.",
          "Hasegawa & Kern (1977) — confirmed the spontaneous nasal cycle in normal subjects.",
          "Multiple HRV studies showing improvement after consistent practice."
        ],
        tags: ["HRV", "Hemispheric balance", "Nasal cycle", "Vagal tone"]
      },
      learn: {
        animation: "alternate",
        video: {
          title: "Nadi Shodhana — Alternate Nostril Breathing",
          teacher: "Sadhguru / Isha Foundation",
          youtubeId: "8VwufJrUhic"
        }
      },
      related: {
        people:     ["B.K.S. Iyengar", "Paramahansa Yogananda", "James Nestor"],
        books:      ["Light on Pranayama", "Science of Breath", "Breath: The New Science of a Lost Art"],
        techniques: ["bhramari", "ujjayi", "4-7-8-breathing"]
      }
    },

    'kapalabhati': {
      overview: {
        what: "'Skull-shining breath' — rapid, forceful exhales driven by sharp abdominal contractions, with passive inhales. Energising; one of the classical yogic cleansing practices.",
        keyBenefits: [
          "Strong alertness and energy without caffeine.",
          "Massages the abdominal organs.",
          "Clears mucus from the respiratory tract.",
          "Strengthens the diaphragm and core."
        ],
        whenToUse: [
          "Morning practice — energising, not for evening.",
          "When sluggish, foggy, or low on energy.",
          "Before meditation in some traditions (Sivananda especially).",
          "As a respiratory and abdominal kriya (cleansing)."
        ],
        whoFor: "Healthy adults. Contraindicated with hypertension, hernia, pregnancy, recent abdominal surgery, glaucoma, or epilepsy."
      },
      history: {
        origins: "One of the shatkarmas — the six cleansing practices — described in the Hatha Yoga Pradipika (2.35–37, 15th century). Considered a kriya (cleansing technique) rather than a pranayama proper, though commonly grouped with the breath practices.",
        evolution: "Continued unbroken through classical Hatha lineages. Popularised in the West through Sivananda, Iyengar, and Kundalini yoga (where it's foundational). Found mainstream awareness through modern yoga studios.",
        figures: [
          { name: "B.K.S. Iyengar",      credit: "Modern systematiser; included Kapalabhati in Light on Pranayama with detailed contraindications." },
          { name: "Swami Sivananda",     credit: "Founded the Divine Life Society; brought Kapalabhati to broad Western yoga audiences." },
          { name: "Yogi Bhajan",         credit: "Kundalini Yoga master; made variants of forceful breathing central to his lineage." }
        ],
        ancient: "The name 'Kapalabhati' means 'skull-shining' — the practice was believed to polish the skull and brighten the face, both metaphorically (mental clarity) and literally (increased circulation). Classified alongside neti (nasal cleansing) and dhauti (gastric cleansing) as a practice that prepares the body for deeper pranayama and meditation."
      },
      howTo: {
        progressions: [
          { level: "Beginner",     detail: "30 sharp exhales at 1/second, 1–2 rounds. Rest 30s between rounds." },
          { level: "Intermediate", detail: "60–100 exhales per round, 3 rounds. Faster pace (2/sec) acceptable." },
          { level: "Advanced",     detail: "300+ exhales at fast pace; combine with bandhas (root and abdominal locks); practice with a teacher." }
        ],
        tips: [
          "The force is on the EXHALE only — the inhale happens passively as the abdomen releases.",
          "Sit upright with a stable spine.",
          "Hands resting on knees; shoulders relaxed; chest still.",
          "Stop immediately if dizzy. Sit and breathe normally."
        ]
      },
      science: {
        physiology: "Forceful abdominal contractions engage the diaphragm and core; rhythmic exhalations modulate CO₂ similarly to controlled hyperventilation. Sympathetic activation produces the energising effect.",
        neuroscience: "Preliminary EEG studies show increased alertness and shifts in cortical arousal. The combination of physical engagement and breath modulation produces a measurable activation state.",
        research: [
          "Limited large-scale RCTs — most evidence is small-sample EEG and cognitive studies.",
          "Studies from Telles' lab (India) show improvements in attention and reaction time after Kapalabhati.",
          "Indirect support from broader yoga research on sympathetic activation."
        ],
        tags: ["Sympathetic activation", "Diaphragmatic strength", "CO₂ modulation", "Alertness"]
      },
      learn: {
        animation: "rapid",
        video: {
          title: "Kapalabhati Breathing — Step by Step",
          teacher: "Iyengar Yoga / Yoga With Adriene lineage demo",
          youtubeId: "OxLnJ85ZxKQ"
        }
      },
      related: {
        people:     ["B.K.S. Iyengar", "Paramahansa Yogananda", "Wim Hof"],
        books:      ["Light on Pranayama", "Science of Breath", "Autobiography of a Yogi"],
        techniques: ["wim-hof-method", "kumbhaka", "nadi-shodhana"]
      }
    },

    'bhramari': {
      overview: {
        what: "'Humming bee breath' — a soft, steady hum on the exhale through closed lips, often with ears gently covered. The vibration is the practice.",
        keyBenefits: [
          "Powerfully calming via vagus-nerve stimulation.",
          "Boosts nasal nitric oxide ~15× over silent breathing.",
          "Anecdotally helpful for tinnitus and tension headaches.",
          "Excellent preparation for sleep or meditation."
        ],
        whenToUse: [
          "Before sleep — one of the gentlest wind-downs.",
          "During acute anxiety.",
          "With tinnitus to retrain auditory processing.",
          "As a 5–10 minute daily practice."
        ],
        whoFor: "Everyone — one of the safest pranayamas. No significant contraindications."
      },
      history: {
        origins: "Classical Hatha pranayama, named for the bhramara — the black Indian bee whose hum the practice imitates. Documented in the Hatha Yoga Pradipika (2.68) and Gheranda Samhita.",
        evolution: "Preserved through yoga lineages. Has had a strong scientific resurgence following the 2002 discovery (Weitzberg & Lundberg) that humming dramatically increases nasal nitric oxide — a finding that connected ancient practice to modern molecular biology.",
        figures: [
          { name: "B.K.S. Iyengar",         credit: "Systematised the practice in Light on Pranayama with detailed instruction." },
          { name: "Eddie Weitzberg",        credit: "Karolinska researcher; co-discovered the humming–nitric-oxide effect in 2002." },
          { name: "Patrick McKeown",        credit: "Has championed Bhramari for nasal NO and vagal stimulation." }
        ],
        ancient: "The hum was understood as a connection to inner sound — nada — the seed of meditative absorption. Sustained resonance practices appear across cultures: Tibetan chant, Sufi dhikr, Gregorian chant, Pythagorean musical philosophy. All recognised that vibration is a portal to inwardness."
      },
      howTo: {
        progressions: [
          { level: "Beginner",     detail: "5–10 humming exhales, normal volume. Notice the resonance in the skull." },
          { level: "Intermediate", detail: "10–15 minutes with focused attention on the vibration." },
          { level: "Advanced",     detail: "Combine with Shanmukhi Mudra (closing ears with thumbs, eyes with fingers) and with kumbhaka." }
        ],
        tips: [
          "Lips gently closed; tongue resting on the floor of the mouth.",
          "Let the sound be even — same volume throughout the exhale.",
          "Feel the vibration in the bones of the skull and the chest.",
          "Closing the ears with thumbs (Shanmukhi Mudra) deepens the internal sound."
        ]
      },
      science: {
        physiology: "Humming produces dramatic nasal nitric-oxide release — 15× silent breathing. NO is a bronchodilator, vasodilator, and antimicrobial; it improves oxygen uptake in the lungs and is essential to gas-exchange physiology.",
        neuroscience: "Vibration of the larynx and pharynx stimulates the vagus nerve via mechanoreceptors. The sustained tone provides an auditory anchor for attention, deepening parasympathetic activation.",
        research: [
          "Weitzberg & Lundberg (2002, AJRCCM) — landmark; humming raises nasal NO 15-fold.",
          "Studies on Bhramari for hypertension, sleep quality, and tinnitus with modest but consistent positive findings.",
          "Vagal-stimulation research supports laryngeal-vibration as an intervention."
        ],
        tags: ["Nitric oxide", "Vagus nerve", "Mechanoreceptors", "Resonance"]
      },
      learn: {
        animation: "hum",
        video: {
          title: "Bhramari Pranayama — The Humming Bee Breath",
          teacher: "Iyengar / Sivananda tradition demo",
          youtubeId: "m9XKBoYbeAo"
        }
      },
      related: {
        people:     ["B.K.S. Iyengar", "Patrick McKeown", "James Nestor"],
        books:      ["Light on Pranayama", "Breath: The New Science of a Lost Art", "Science of Breath"],
        techniques: ["ujjayi", "nadi-shodhana", "4-7-8-breathing"]
      }
    },

    'ujjayi': {
      overview: {
        what: "'Victorious breath' — a slight constriction at the back of the throat creating a soft audible ocean-like sound, sustained throughout the breath. The yogi's running breath.",
        keyBenefits: [
          "Sustained focus through an internal auditory anchor.",
          "Naturally slows breath rate via mild airflow resistance.",
          "Generates internal heat (tapas).",
          "Improves vagal tone over time."
        ],
        whenToUse: [
          "Throughout a yoga asana practice (Ashtanga in particular).",
          "During long-form meditation.",
          "During endurance running or athletic effort.",
          "Any sustained task requiring inner focus."
        ],
        whoFor: "Most people. The throat constriction may feel intense at first; ease into it."
      },
      history: {
        origins: "Among the most ancient pranayamas, documented throughout the classical Hatha texts. The Sanskrit name 'Ujjayi' means 'victorious' — the breath that conquers the wandering mind.",
        evolution: "Central practice in Krishnamacharya's modern yoga (early 20th century), inherited by his students Pattabhi Jois (Ashtanga) and B.K.S. Iyengar. Spread globally through these two streams — Ujjayi is the default breath in most contemporary vinyasa and Ashtanga practice.",
        figures: [
          { name: "Krishnamacharya",       credit: "The 'grandfather of modern yoga'; restored Ujjayi to centre of practice." },
          { name: "Pattabhi Jois",         credit: "Founded Ashtanga Yoga; made Ujjayi the breath of the practice." },
          { name: "B.K.S. Iyengar",        credit: "Detailed instruction in Light on Pranayama." }
        ],
        ancient: "Considered the breath of tapas — internal heat that purifies. Ancient yogis used it for endurance and inner focus across millennia. The internal sound (nada) is connected to meditative practice — sustained attention on subtle sound deepens absorption."
      },
      howTo: {
        progressions: [
          { level: "Beginner",     detail: "5 minutes seated, no asana. Find the constriction; feel the sound." },
          { level: "Intermediate", detail: "Maintain throughout yoga practice. Notice how the breath self-regulates." },
          { level: "Advanced",     detail: "Sustain through long meditation or athletic effort; combine with kumbhaka." }
        ],
        tips: [
          "Imagine fogging glasses with your breath — that's the constriction, but with the mouth closed.",
          "The sound should be soft — like distant ocean, not a roar.",
          "Use the sound as your anchor for attention.",
          "If the throat tires, soften the constriction."
        ]
      },
      science: {
        physiology: "Slight glottal narrowing produces airflow resistance, slowing the breath naturally. Slow breath rates approach the resonance frequency (~6 bpm) where HRV peaks. Mild increase in intrathoracic pressure modulates vagal tone.",
        neuroscience: "The auditory anchor reduces mind-wandering (default-mode network activity). Combined with slow breath rate, this engages parasympathetic dominance while maintaining alertness.",
        research: [
          "Studies on slow yogic breathing (which includes Ujjayi) consistently show HRV improvement.",
          "Contemplative neuroscience supports the role of internal-sound focus in reducing mind-wandering.",
          "Used in clinical breathing-retraining protocols for anxiety and asthma."
        ],
        tags: ["HRV", "Vagal tone", "Attentional anchor", "Airflow resistance"]
      },
      learn: {
        animation: "slow-wave",
        video: {
          title: "Ujjayi Pranayama — The Ocean Breath",
          teacher: "Ashtanga / Iyengar tradition demo",
          youtubeId: "qd2wQDB6Zf8"
        }
      },
      related: {
        people:     ["B.K.S. Iyengar", "Paramahansa Yogananda"],
        books:      ["Light on Pranayama", "Science of Breath"],
        techniques: ["bhramari", "kumbhaka", "nadi-shodhana"]
      }
    },

    'kumbhaka': {
      overview: {
        what: "Deliberate breath retention — either after an inhale (Antara Kumbhaka) or after an exhale (Bahya Kumbhaka). Considered by classical teachers the heart of pranayama.",
        keyBenefits: [
          "Builds CO₂ tolerance and respiratory muscle strength.",
          "Stimulates mitochondrial adaptation.",
          "Access to deep meditative states.",
          "Refines voluntary control of autonomic function."
        ],
        whenToUse: [
          "Within a sustained pranayama practice — never casually.",
          "After establishing a foundation in simpler practices (months of consistent training).",
          "With direct guidance from a qualified teacher for advanced ratios."
        ],
        whoFor: "Experienced practitioners only. Contraindicated in pregnancy, cardiovascular conditions, hypertension, glaucoma, or epilepsy."
      },
      history: {
        origins: "Patanjali's Yoga Sutras (~2nd century BCE) define pranayama in three movements: inhale, exhale, and the suspension between (kumbhaka). The Hatha Yoga Pradipika (15th century) elaborates extensively. Considered the heart of pranayama in classical texts.",
        evolution: "Preserved with great care across lineages because of its power and risk. Iyengar wrote that kumbhaka is 'the most important aspect of pranayama, and the most difficult.' Many traditions consider it the gateway to meditative depth — kumbhaka quietens the autonomic system enough for samadhi (absorption) to arise.",
        figures: [
          { name: "Patanjali",            credit: "Defined pranayama and kumbhaka in the Yoga Sutras (classical era)." },
          { name: "B.K.S. Iyengar",       credit: "Most detailed modern technical instruction in Light on Pranayama." },
          { name: "T.K.V. Desikachar",    credit: "Krishnamacharya's son; brought sophisticated ratio breathing including kumbhaka to Western audiences." }
        ],
        ancient: "The pause between breaths was understood as the place where prana settles and consciousness can rest. The Yoga Sutras describe it as a bridge to dharana (concentration) and dhyana (meditation). The ancient insight: breath is the bridge to consciousness, and the pause is where the bridge is steadiest."
      },
      howTo: {
        progressions: [
          { level: "Beginner",     detail: "5–10 second holds on full inhale only, with full ease. Build over weeks." },
          { level: "Intermediate", detail: "Longer holds with bandhas (root, abdominal, throat locks). Approach 30s." },
          { level: "Advanced",     detail: "Extended retentions (1+ min) within a structured practice. Classical 1:4:2 ratios. Always with a teacher." }
        ],
        tips: [
          "Never force. If the hold takes strain to maintain, it's already too long.",
          "Build over months, not weeks.",
          "Inhale-hold and exhale-hold are distinct practices with different effects.",
          "The bandhas (locks) become essential at advanced levels — learn them under guidance."
        ]
      },
      science: {
        physiology: "CO₂ rises during retention, producing vasodilation (Bohr effect) and shifting blood-gas chemistry. Diaphragmatic stillness during hold reduces vagal afferent firing, with measurable HRV changes.",
        neuroscience: "EEG studies of advanced practitioners show brainwave shifts toward alpha and theta during kumbhaka. Voluntary control of normally-autonomic systems strengthens prefrontal–autonomic neural pathways.",
        research: [
          "Brown & Gerbarg — Sudarshan Kriya research includes kumbhaka components.",
          "EEG studies of advanced yogis showing altered cortical states during retention.",
          "CO₂ physiology and the Bohr effect are well-established in respiratory medicine."
        ],
        tags: ["CO₂ elevation", "Bohr effect", "Vagal modulation", "Neural plasticity"]
      },
      learn: {
        animation: "expand-hold",
        video: {
          title: "Kumbhaka — Breath Retention in Pranayama",
          teacher: "Iyengar Yoga tradition demo",
          youtubeId: "5n2NMTaWRwM"
        }
      },
      related: {
        people:     ["B.K.S. Iyengar", "Wim Hof", "Patrick McKeown"],
        books:      ["Light on Pranayama", "Science of Breath", "The Wim Hof Method"],
        techniques: ["wim-hof-method", "buteyko-method", "ujjayi"]
      }
    },

    'diaphragmatic-breathing': {
      overview: {
        what: "Natural breathing using the diaphragm as the primary respiratory muscle. The way humans are designed to breathe — and the foundation from which all other breathwork is built.",
        keyBenefits: [
          "Activates the parasympathetic nervous system via vagal stimulation.",
          "Reduces tension in accessory breathing muscles (neck, shoulders).",
          "Improves oxygen-CO₂ exchange efficiency by 70–80% over chest breathing.",
          "The baseline from which all advanced breathwork techniques are built."
        ],
        whenToUse: [
          "Daily — as a foundational practice or when stress is sensed.",
          "Before any other breathwork session.",
          "When anxious, tense, or breathing shallowly.",
          "As a standing reset throughout the day."
        ],
        whoFor: "Everyone without exception. The most universally appropriate breath practice. Suitable for all ages, conditions, and starting points."
      },
      history: {
        origins: "Diaphragmatic breathing is the natural respiration pattern of infants — observable in any sleeping baby. Over time, stress, poor posture, and sedentary habits shift most adults into shallow chest breathing. The instruction to 'breathe from the belly' appears in virtually every contemplative tradition.",
        evolution: "20th-century respiratory physiology confirmed that the diaphragm is responsible for 70–80% of normal breath volume in healthy breathing. Physiotherapists, singers, voice coaches, yogis, and military trainers all teach versions of it. The Buteyko Method, Box Breathing, and the Wim Hof Method all assume diaphragmatic breathing as a prerequisite.",
        figures: [
          { name: "Dr. Stephen Porges", credit: "Polyvagal Theory establishes the vagal-parasympathetic basis for diaphragmatic breathing and its role in safety signalling." },
          { name: "B.K.S. Iyengar", credit: "Systematised diaphragmatic breathing in Light on Pranayama as the foundation of all pranayama practice." }
        ],
        ancient: "In the Taoist tradition, abdominal breathing is called 'embryonic breath' — the way we breathed before birth and the way we return to wholeness. Indian yoga names it the foundation of all pranayama. The ancient yogis observed that animals with slow, diaphragmatic breath patterns live longest."
      },
      howTo: {
        progressions: [
          { level: "Beginner", detail: "Lie on your back with one hand on chest, one on belly. Breathe so only the lower hand rises. 5 minutes daily." },
          { level: "Intermediate", detail: "Practise while walking, sitting at a desk, in conversation — make it the default mode of breathing." },
          { level: "Advanced", detail: "Combine with extended exhale (2:1 ratio) and nasal breathing for maximum parasympathetic effect." }
        ],
        tips: [
          "Feel the belly expand outward on the inhale — the chest stays relatively still.",
          "Let the exhale be passive and slightly longer than the inhale.",
          "Practise lying down first — gravity assists the belly rise.",
          "This should feel effortless. Any strain means you are forcing."
        ]
      },
      science: {
        physiology: "The diaphragm is a dome-shaped muscle at the base of the ribcage. When it contracts and descends, thoracic volume increases and air is drawn into the lower lobes of the lungs — where the greatest density of pulmonary blood vessels lies. It also massages the abdominal organs and stimulates the abdominal vagus nerve branches.",
        neuroscience: "Diaphragmatic breathing engages the myelinated ventral vagal circuit (Porges Polyvagal Theory), reducing sympathetic tone and activating the social engagement system. Brain imaging studies show reduced amygdala activation within minutes of belly breathing, with corresponding reductions in cortisol.",
        research: [
          "Gerritsen & Band (2018, Frontiers in Psychology) — review of slow diaphragmatic breathing effects on autonomic function and health.",
          "Porges Polyvagal Theory — myelinated vagus and the role of breath in nervous system regulation.",
          "US Army Research Laboratory — integration of diaphragmatic breathing into combat stress protocols."
        ],
        tags: ["Parasympathetic", "Vagus nerve", "Diaphragm", "Foundation", "Beginners"]
      },
      learn: { animation: "default" },
      related: {
        people: ["Dr. Stephen Porges", "B.K.S. Iyengar", "Patrick McKeown"],
        books: ["Breath: The New Science of a Lost Art", "The Breathing Book", "Science of Breath"],
        techniques: ["4-7-8-breathing", "box-breathing", "extended-exhale"]
      },
      product: {
        title: "Weighted Calming Vest",
        price: "£45.00",
        badge: "Special buy",
        desc: "Provides proprioceptive grounding to enhance deep diaphragmatic engagement.",
        url: "https://www.amazon.co.uk/s?k=weighted+calming+vest",
        ctaLabel: "Buy on Amazon"
      }
    },

    'extended-exhale': {
      overview: {
        what: "Deliberately lengthening the exhale beyond the inhale — typically a 4:6 or 4:8 ratio — to activate the vagus nerve and shift the nervous system toward calm.",
        keyBenefits: [
          "Activates the parasympathetic nervous system via vagal stimulation on the long exhale.",
          "Lowers heart rate within 2–3 breathing cycles.",
          "Reduces anxiety and interrupts panic response.",
          "Simpler than 4-7-8 — no hold required, making it the most accessible calming technique."
        ],
        whenToUse: [
          "Acute anxiety or stress — the simplest on-the-spot tool.",
          "Before sleep or during wakeful periods at night.",
          "Before a difficult conversation or performance situation.",
          "Whenever breathing has become fast or shallow."
        ],
        whoFor: "Everyone. No contraindications. One of the most universally safe and effective calming tools available."
      },
      history: {
        origins: "The principle that a longer exhale calms the nervous system has been embedded in yoga for millennia. Classical Hatha texts teach extended exhale ratios (1:2 inhale-to-exhale) as the foundation of calming pranayama. Modern respiratory physiology explains the mechanism: the exhale phase is when vagal tone is highest.",
        evolution: "Research from the Huberman Lab and the HeartMath Institute confirmed that the exhale phase of breathing drives parasympathetic activity via baroreceptors and stretch receptors in the heart and lungs. The 2023 Balban et al. cyclic-sighing study demonstrated extended-exhale breathing as the highest-performing voluntary stress reduction technique.",
        figures: [
          { name: "Andrew Huberman", credit: "Stanford neuroscientist who synthesised the research on extended-exhale breathing and popularised it for practical use." },
          { name: "B.K.S. Iyengar", credit: "Systematised extended-exhale ratio breathing (Visama Vritti) as a classical yogic calming tool." }
        ],
        ancient: "Visama Vritti pranayama — unequal ratio breathing with extended exhale — is described in the Hatha Yoga Pradipika and taught across all classical pranayama lineages. The extended exhale is also the key element of 4-7-8 breathing and the physiological sigh."
      },
      howTo: {
        progressions: [
          { level: "Beginner", detail: "Inhale 4, exhale 6. No hold required. 5 minutes as needed." },
          { level: "Intermediate", detail: "Inhale 4, exhale 8. Add a moment of stillness after the exhale before the next inhale." },
          { level: "Advanced", detail: "Build toward a 1:2 ratio at comfortable counts (5:10 or 6:12). Pair with nasal-only breathing for maximum effect." }
        ],
        tips: [
          "The exhale is where the calming happens — give it the time it needs.",
          "Let the exhale be smooth and even, not rushed at the end.",
          "Breathe through the nose for maximum vagal engagement.",
          "No need to count precisely — just ensure the exhale is clearly longer."
        ]
      },
      science: {
        physiology: "During the exhale phase, the heart rate naturally slows as the lungs deflate — a phenomenon called respiratory sinus arrhythmia. Deliberately extending the exhale amplifies this heart-rate drop by keeping the parasympathetic brake engaged for longer.",
        neuroscience: "Baroreceptors in the aortic arch and carotid sinus detect the blood pressure changes that accompany the extended exhale and signal the brainstem to reduce sympathetic output. This is the physiological basis of the vagal brake — and it operates below conscious processing.",
        research: [
          "Balban et al. (2023) — cyclic sighing (extended exhale) outperformed box breathing and mindfulness for real-time stress reduction.",
          "Thayer & Lane (2009) — cardiac vagal tone and the parasympathetic function of the exhale phase.",
          "HeartMath Institute research on HRV and the exhale-driven parasympathetic shift."
        ],
        tags: ["Vagus nerve", "Exhale", "Parasympathetic", "Heart rate", "Anxiety"]
      },
      learn: { animation: "default" },
      related: {
        people: ["Andrew Huberman", "Dr. Stephen Porges"],
        books: ["The Healing Power of the Breath", "Breath: The New Science of a Lost Art"],
        techniques: ["4-7-8-breathing", "physiological-sigh", "resonant-breathing"]
      },
      product: {
        title: "Premium Flaxseed Eye Pillow",
        price: "£16.50",
        badge: "Relaxation pick",
        desc: "Weighted lavender eye pillow to boost the vagal response during down-regulation.",
        url: "https://www.amazon.co.uk/s?k=lavender+eye+pillow",
        ctaLabel: "Buy on Amazon"
      }
    },

    'resonant-breathing': {
      overview: {
        what: "The art of breathing in and out for the exact same count. By turning your breath into a perfect, steady loop, you sync your breathing rhythm directly with your heartbeat. This triggers a biological state called coherence — instantly throwing the brakes on stress, balancing your nervous system, and delivering clean, calm focus to your brain.",
        tldr: "Breathe in for 5 seconds, out for 5 seconds. Continuously. This single rhythm triggers the highest measurable state of nervous system balance available.",
        keyBenefits: [
          "Maxes out HRV — up to 400% amplification of heart rate variability",
          "Instant balance between fight-or-flight and rest-and-digest",
          "Clinically proven to reduce anxiety, lower blood pressure, improve focus",
          "Used by doctors and therapists for elite heart health and mental clarity"
        ],
        whenToUse: [
          "Daily tune-up: 10–20 minutes a day to permanently lower background stress",
          "Before something big: 10 minutes before a tough meeting resets your nerves",
          "Post-workout reset: helps body recover faster after hard training",
          "Bedtime wind-down: quiets the mind and turns off the day"
        ],
        whoFor: "Almost everyone. Perfect for adults and teenagers. If you have a serious heart condition, check with your doctor before longer sessions."
      },
      history: {
        origins: "The term resonant frequency breathing was coined by scientists in the 1980s and 90s studying heart rate biofeedback. Researchers from the HeartMath Institute discovered that most adults have a natural biological sweet spot at around 5–6 breaths per minute — the exact point where heart and lungs sync perfectly.",
        evolution: "In the 1990s, modern laboratory research collided with ancient history. Scientists realised that traditional yogic breathing (Pranayama) had been teaching people to breathe at this exact same slow pace for thousands of years. Over decades, doctors and tech pioneers brought these clinical protocols out of the labs and into everyday life.",
        figures: [
          { name: "Stephen Elliott", credit: "Pioneer of coherent breathing research who mapped the exact 5-second rhythm protocol." },
          { name: "HeartMath Institute", credit: "Built the Quick Coherence technique and biofeedback tools to measure coherent states in real time." }
        ],
        ancient: "Ancient yogis practiced Sama Vritti (equal ratio breathing) at a slow, deliberate pace long before modern heart monitors existed. When researchers put monitors on meditating yogis, they discovered their bodies were naturally settling at exactly 5–6 breaths per minute. The Hatha Yoga Pradipika explicitly describes this style as the master tool for balancing mind and body."
      },
      howTo: {
        progressions: [
          { level: "Beginner", detail: "Hit a steady 5 seconds in, 5 seconds out. Use a timer or metronome app. Aim for 10 minutes minimum." },
          { level: "Intermediate", detail: "Build to 20 minutes daily. Add heart focus — imagine breath flowing in and out of your chest." },
          { level: "Advanced", detail: "Use a heart rate tracker to prove you're in coherence. Stretch sessions to 30 minutes." }
        ],
        tips: [
          "Find Your Rhythm: The 5-second count is a starting point. Use a heart rate tracker to map your unique personal rhythm.",
          "Keep It Smooth: Always breathe through your nose. Make the switch between inhale and exhale completely seamless.",
          "Don't Force It: If 5 seconds feels too long, drop to 3–4 seconds and slowly build up.",
          "Tune Into Your Heart: Shift some attention to your chest. Imagining breath flowing in and out of your heart supercharges the calming effect."
        ]
      },
      science: {
        physiology: "When you drop your pace to about 6 breaths per minute, your breathing perfectly matches the natural rhythmic wave of your cardiovascular system. This alignment creates a physical resonance that amplifies HRV by up to 400% — the highest boost achievable from any breathing technique.",
        neuroscience: "Inside your body, the baroreflex constantly monitors and regulates blood pressure, naturally resetting every 10 seconds. By taking a full 10 seconds per breath cycle (5 in, 5 out), you perfectly sync with this reflex — tricking your nervous system into instantly balancing fight-or-flight and rest-and-digest.",
        keyMechanisms: [
          "HRV Coherence: Heart rate smoothly accelerates on inhale and decelerates on exhale, creating a perfect wave",
          "Cardiovascular Resonance: Heart, lungs and blood pressure loops lock into the same frequency",
          "Parasympathetic Activation: Brain recognises this rhythm as a signal of total safety"
        ],
        research: [
          { title: "McCraty & Shaffer (2015)", finding: "Comprehensive review proving direct link between HRV coherence and brain self-regulation", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC8924557/" },
          { title: "Brown & Gerbarg", finding: "Clinical trials showing coherent breathing reduces anxiety, depression and PTSD symptoms", url: "https://academic.oup.com" },
          { title: "Elliott & Edmonson (2005)", finding: "Foundational research mapping the 5-second rhythm protocol for maximum cardiovascular balance", url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC" }
        ]
      },
      learn: { animation: "slow-wave" },
      quiz: true,
      related: {
        people: ["Stephen Elliott", "HeartMath Institute"],
        books: ["Coherent Breathing", "The Healing Power of the Breath", "Breath: The New Science of a Lost Art"],
        techniques: ["box-breathing", "extended-exhale", "sama-vritti"]
      },
      product: {
        title: "Pulse Oximeter & HRV Tracker",
        price: "£34.99",
        badge: "Coherence pick",
        desc: "Track real-time heart rate variability improvements during resonant breathing.",
        url: "https://www.amazon.co.uk/s?k=pulse+oximeter+hrv+tracker",
        ctaLabel: "Buy on Amazon"
      }
    },

    'tummo': {
      overview: {
        what: "Tibetan Vajrayana inner-fire practice combining visualisation, breath retention, and muscular locks to generate extreme body heat and altered states of consciousness.",
        keyBenefits: [
          "Generates measurable and extreme increases in core body temperature.",
          "Produces non-ordinary states of clarity and altered consciousness.",
          "Builds extraordinary cold and heat tolerance.",
          "The Tibetan lineage that informed the Wim Hof Method."
        ],
        whenToUse: [
          "As a dedicated advanced practice under qualified Vajrayana instruction.",
          "In preparation for cold exposure or extended retreat.",
          "As a deeper investigation of the Wim Hof Method's roots.",
          "When working with an advanced tantric teacher in a retreat context."
        ],
        whoFor: "Advanced practitioners only. Requires a solid foundation in meditation and pranayama, and ideally direct teacher transmission in the Vajrayana tradition."
      },
      history: {
        origins: "Tummo (Tibetan: gtum-mo, 'fierce woman') is a Vajrayana Buddhist practice within the Six Yogas of Naropa — a set of advanced tantric practices compiled by the Indian mahasiddha Naropa in the 11th century. It has been transmitted through the Kagyu and Gelug schools of Tibetan Buddhism.",
        evolution: "Western scientific attention arrived in the 1980s when Harvard researcher Herbert Benson filmed Tibetan monks drying wet sheets with their body heat in freezing temperatures. More recently, studies of the Wim Hof Method — which Hof traces partly to Tummo lineage — have provided measurable evidence of voluntary thermoregulation.",
        figures: [
          { name: "Wim Hof", credit: "Developed a modern Tummo-inspired protocol accessible to the general public, with the backing of scientific studies." },
          { name: "Paramahansa Yogananda", credit: "Described Tummo-adjacent practices in Autobiography of a Yogi as demonstrable yogic control of body heat." }
        ],
        ancient: "In the Naropa tradition, Tummo is considered the most fundamental of the six yogas — the root from which the other five grow. It is described as 'the inner fire that burns the obscurations of the mind.' Milarepa, Tibet's most revered yogi, spent years in cave retreat wearing only a thin cotton cloth through Himalayan winters."
      },
      howTo: {
        progressions: [
          { level: "Beginner", detail: "Learn the Wim Hof Method first — it shares the physiological foundation. Do not attempt advanced Tummo without teacher guidance." },
          { level: "Intermediate", detail: "Study the visualisation element: navel fire rising through the central channel. Combine with retained breath and bandhas." },
          { level: "Advanced", detail: "Full Tummo requires Vajrayana transmission. Work with a qualified Tibetan Buddhist teacher in a structured retreat setting." }
        ],
        tips: [
          "Never practise advanced breath retention without a competent teacher present.",
          "The visualisation is as important as the breath — spend time developing vivid internal imagery.",
          "Cold exposure is the traditional testing ground — begin with brief cold water exposure.",
          "Respect the tradition: Tummo is not just a physiological technique but a path of liberation."
        ]
      },
      science: {
        physiology: "Tummo generates heat through a combination of metabolic activation (brown adipose tissue stimulation via cold exposure and sympathetic activation from hyperventilation) and physical heat production from muscular contractions during breath retention with locks applied.",
        neuroscience: "The voluntary hyperventilation phase produces alkalosis and adrenaline release. Breath retention during the hold phase creates CO₂ accumulation and metabolic changes. The visualisation activates the same neural circuits as physical heat experience — a well-documented property of mental imagery.",
        research: [
          "Benson et al. (1982) — filmed Tibetan monks drying wet sheets, demonstrating voluntary thermoregulation.",
          "Kox et al. (2014) — Wim Hof Method (Tummo-derived) demonstrated voluntary immune modulation.",
          "Muzik et al. (2018) — Brain over body study on WHM and brown adipose tissue activation."
        ],
        tags: ["Thermoregulation", "Tantric", "Tibetan", "Altered states", "Cold exposure"]
      },
      learn: { animation: "default" },
      related: {
        people: ["Wim Hof", "Paramahansa Yogananda"],
        books: ["The Wim Hof Method", "Way of the Iceman", "Autobiography of a Yogi"],
        techniques: ["wim-hof-method", "kumbhaka", "kapalabhati"]
      }
    },

    'sama-vritti': {
      overview: {
        what: "Equal ratio pranayama — inhale and exhale for identical counts, typically 4:4 or higher. The simplest classical ratio breathing and the foundation for all more complex ratio practices.",
        keyBenefits: [
          "Balances the autonomic nervous system through symmetrical breathing.",
          "Develops breath awareness and conscious respiratory control.",
          "Calms and centres without the alertness-reduction of extended-exhale practices.",
          "The safest and most universally applicable ratio pranayama."
        ],
        whenToUse: [
          "As a daily grounding practice — morning or midday.",
          "Before any more advanced pranayama session.",
          "When seeking balance rather than deep sedation.",
          "As a portable practice usable in any setting."
        ],
        whoFor: "Everyone. The most beginner-appropriate ratio pranayama — the ideal starting point for those new to counted breathing."
      },
      history: {
        origins: "Sama Vritti (Sanskrit: sama = equal, vritti = fluctuation/movement) is described in classical Hatha Yoga texts as the foundation of ratio breathing. Patanjali's Yoga Sutras (c. 400 CE) establish the principle of rhythmic breath as the basis of pranayama practice.",
        evolution: "Equal ratio breathing was embedded in yogic teaching long before the modern interest in box breathing. When box breathing (the military version with added holds) became popular in the 2010s, it was in effect a variant of Sama Vritti — adding retention phases to the equal inhale-exhale structure.",
        figures: [
          { name: "B.K.S. Iyengar", credit: "Systematised Sama Vritti in Light on Pranayama as the foundation of all ratio pranayama." },
          { name: "Paramahansa Yogananda", credit: "Taught equal ratio breathing as the basis of Kriya Yoga preparation." }
        ],
        ancient: "Sama Vritti is mentioned in the Hatha Yoga Pradipika and Ghreanda Samhita as a preparatory practice. The texts describe building from 4:4 to higher counts over years of practice — 16:16 is considered an advanced practitioner count in some lineages."
      },
      howTo: {
        progressions: [
          { level: "Beginner", detail: "4 counts in, 4 counts out. No holds. 5–10 minutes. Build familiarity over days before increasing counts." },
          { level: "Intermediate", detail: "6:6 or 8:8 counts. Notice the natural stillness at the transition points." },
          { level: "Advanced", detail: "Extend to 10:10 or 12:12. Add brief natural holds between inhale and exhale once the rhythm is completely comfortable." }
        ],
        tips: [
          "The counts should feel comfortable throughout — never strained.",
          "Breathe through the nose for full yogic effect.",
          "The equal rhythm is itself the practice — let it become meditative.",
          "Box breathing is the next step if you want to add holds."
        ]
      },
      science: {
        physiology: "Equal ratio breathing at 4:4 produces approximately 7.5 breaths per minute — slightly above the 5–6 bpm resonant frequency, making it mildly activating rather than deeply sedating. At 5:5 it approaches resonant frequency and produces HRV effects.",
        neuroscience: "The equal ratio engages both the sympathetic (inhale) and parasympathetic (exhale) phases symmetrically, producing balanced autonomic tone. This makes it suitable for focus as well as calm — unlike extended-exhale techniques, which tend toward relaxation.",
        research: [
          "Pal et al. (2014) — equal ratio pranayama effects on autonomic function and HRV.",
          "Jerath et al. (2006) — physiological effects of slow breathing practices including equal ratio.",
          "HeartMath Institute data on slow, even breathing and coherence effects."
        ],
        tags: ["Equal ratio", "Pranayama", "Balance", "Foundation", "Yogic"]
      },
      learn: { animation: "default" },
      related: {
        people: ["B.K.S. Iyengar", "Paramahansa Yogananda"],
        books: ["Light on Pranayama", "Science of Breath", "Breath: The New Science of a Lost Art"],
        techniques: ["box-breathing", "resonant-breathing", "4-7-8-breathing"]
      }
    },

    'uddiyana-bandha': {
      overview: {
        what: "Abdominal lock pranayama — a sharp inward and upward contraction of the abdomen on a held exhale. One of the three major bandhas (locks) in classical Hatha Yoga.",
        keyBenefits: [
          "Massages and tones the abdominal organs and stimulates digestion.",
          "Stimulates the solar plexus (Manipura chakra) and metabolic fire.",
          "Builds extraordinary diaphragmatic control and core awareness.",
          "Energises and uplifts the pranic body."
        ],
        whenToUse: [
          "Morning practice on an empty stomach.",
          "As part of a classical Hatha pranayama sequence.",
          "Advanced practice: before deeper meditation to energise.",
          "Under teacher guidance in a structured yogic curriculum."
        ],
        whoFor: "Advanced practitioners with a solid pranayama foundation. Not appropriate for beginners. Must be practised on an empty stomach only."
      },
      history: {
        origins: "Uddiyana Bandha (Sanskrit: uddiyana = to fly up) is described in the Hatha Yoga Pradipika (15th century) as one of the three great bandhas, alongside Mula Bandha (root lock) and Jalandhara Bandha (throat lock). The text says it 'makes the lion conquer the elephant of death.'",
        evolution: "Iyengar's Light on Pranayama provides detailed technical instruction that made Uddiyana Bandha accessible to serious Western students. The practice has been central to Ashtanga Vinyasa tradition through Pattabhi Jois and to Iyengar Yoga through B.K.S. Iyengar.",
        figures: [
          { name: "B.K.S. Iyengar", credit: "Provided the most detailed modern technical description of Uddiyana Bandha in Light on Pranayama." },
          { name: "Paramahansa Yogananda", credit: "Described the kriya yoga use of bandhas including Uddiyana in the context of pranayama and meditation." }
        ],
        ancient: "The Hatha Yoga Pradipika states: 'Uddiyana is so called by the Yogis because through its practice the Prana flies upward in the Sushumna.' It is considered one of the most powerful practices in all of Hatha Yoga for awakening the kundalini energy."
      },
      howTo: {
        progressions: [
          { level: "Beginner", detail: "Learn to isolate the abdomen first through basic diaphragmatic breathing. Do not attempt the lock until the breath awareness is established." },
          { level: "Intermediate", detail: "Standing position, exhale fully, hold the breath out, and draw the abdomen in and up. Hold 5–10 seconds. 3–5 rounds." },
          { level: "Advanced", detail: "Combine with Mula Bandha and Jalandhara Bandha (the three bandhas simultaneously) under teacher guidance." }
        ],
        tips: [
          "Only ever practise on a completely empty stomach — 3–4 hours after any meal.",
          "The lock should feel like an upward suction, not a push.",
          "Never force. The hold duration should be comfortable.",
          "Do not practise if you feel any discomfort — back off immediately."
        ]
      },
      science: {
        physiology: "Uddiyana Bandha creates a negative pressure in the thoracic cavity on the held exhale, which causes the abdominal organs to be drawn upward. This stretches and massages the organs, stimulates peristalsis, and activates the solar plexus nerve plexus.",
        neuroscience: "The internal pressure changes during bandha practice activate vagal stretch receptors in the abdominal organs, producing parasympathetic signalling. The practice also activates the abdominal branches of the vagus nerve directly.",
        research: [
          "Iyengar, B.K.S. (1981) — detailed physiological description in Light on Pranayama.",
          "Emerging yoga physiology research on the effects of bandhas on intrathoracic pressure.",
          "Telles et al. — studies on yoga practices including bandhas and their autonomic effects."
        ],
        tags: ["Bandha", "Advanced", "Abdominal", "Pranic", "Hatha Yoga"]
      },
      learn: { animation: "default" },
      related: {
        people: ["B.K.S. Iyengar", "Paramahansa Yogananda"],
        books: ["Light on Pranayama", "Science of Breath", "Hatha Yoga Pradipika"],
        techniques: ["kumbhaka", "kapalabhati", "nadi-shodhana"]
      }
    },

    'advanced-buteyko': {
      overview: {
        what: "Extended CO₂ tolerance training protocols that go beyond the foundational Buteyko Method — designed for athletes, high-performance practitioners, and those seeking measurable respiratory gains.",
        keyBenefits: [
          "Extends CO₂ tolerance to unlock significant VO₂ max and endurance gains.",
          "Reduces chronic over-breathing patterns that impair athletic performance.",
          "Delivers measurably higher BOLT scores within weeks of consistent practice.",
          "Addresses residual over-breathing that basic Buteyko does not resolve."
        ],
        whenToUse: [
          "After mastering basic Buteyko and achieving a BOLT score above 25.",
          "As part of an athletic performance programme.",
          "When recovery from exercise is slow due to residual over-breathing.",
          "In preparation for high-altitude training or competition."
        ],
        whoFor: "Experienced Buteyko practitioners and athletes. Requires a solid foundation in the basic method. Not for beginners."
      },
      history: {
        origins: "Konstantin Buteyko developed the original CO₂ tolerance training method in the 1950s–60s. Patrick McKeown extended and systematised the advanced protocols in his Oxygen Advantage programme, developing targeted exercises for athletic performance, sleep apnea, and advanced CO₂ tolerance.",
        evolution: "McKeown's Oxygen Advantage book (2015) brought advanced Buteyko protocols to athletic and performance audiences. The BOLT test provided a quantifiable baseline. His certification programme trains thousands of coaches worldwide in advanced methods, and his research collaborations with sports scientists have produced peer-reviewed evidence.",
        figures: [
          { name: "Patrick McKeown", credit: "Developed the advanced Buteyko-for-athletes system, the BOLT test, and the Oxygen Advantage programme." },
          { name: "Konstantin Buteyko", credit: "Developer of the original CO₂ tolerance training method and the foundational insight about chronic over-breathing." }
        ],
        ancient: "While Buteyko himself worked in a medical rather than traditional context, the principle of reducing and gentling the breath appears in ancient yoga — the yogic instruction to breathe 'as little as possible' is found in classical texts."
      },
      howTo: {
        progressions: [
          { level: "Intermediate", detail: "Establish BOLT score above 25. Perform 20-minute reduced breathing sessions with sustained mild air hunger, twice daily." },
          { level: "Advanced", detail: "Add walking breath holds and simulation of altitude. Target BOLT above 40 seconds within 8–12 weeks." },
          { level: "Elite", detail: "Training mask protocols, max breath-hold tables, and competition-specific breathing periodisation under Oxygen Advantage coach guidance." }
        ],
        tips: [
          "Never push through severe air hunger — mild is the target zone.",
          "Track BOLT score weekly at the same time (morning before eating) for consistent measurement.",
          "Combine with nasal-only training during all exercise.",
          "Advanced sessions should never be performed alone."
        ]
      },
      science: {
        physiology: "Advanced CO₂ training works by chronically raising the set point at which the chemoreceptors trigger the urge to breathe. A higher CO₂ set point means the body tolerates greater effort before distress, allowing more efficient oxygen delivery via the Bohr effect at exercise intensities.",
        neuroscience: "The central chemoreceptors in the brainstem — which detect CO₂ levels — are trainable through consistent exposure to mild hypercapnia. Advanced Buteyko protocols create repeated, controlled CO₂ challenge that recalibrates these receptors over weeks.",
        research: [
          "McKeown, P. (2015) — The Oxygen Advantage: comprehensive review of CO₂ tolerance training for athletic performance.",
          "Bowler et al. (1998) — RCT showing Buteyko effects on asthma medication reduction.",
          "Morton et al. (2019) — nasal breathing during exercise: O₂ saturation and performance effects."
        ],
        tags: ["CO₂ tolerance", "BOLT score", "Athletic performance", "Buteyko", "Advanced"]
      },
      learn: { animation: "default" },
      related: {
        people: ["Patrick McKeown", "Konstantin Buteyko", "James Nestor"],
        books: ["The Oxygen Advantage", "The Breathing Cure", "Breathe to Heal"],
        techniques: ["buteyko-method", "kumbhaka", "resonant-breathing"]
      }
    },

    'holotropic-breathwork': {
      overview: {
        what: "Accelerated, sustained breathing with evocative music in a supervised group setting — Stanislav Grof's method for inducing non-ordinary states of consciousness for psychological and spiritual healing.",
        keyBenefits: [
          "Access to non-ordinary states without pharmacological agents.",
          "Documented profound psychological healing, emotional release, and trauma processing.",
          "Transpersonal and perinatal experiences documented across thousands of sessions.",
          "Provides access to inner resources that are inaccessible through ordinary therapy."
        ],
        whenToUse: [
          "Only in a qualified, supervised Holotropic Breathwork workshop.",
          "As part of ongoing psycho-spiritual development.",
          "When other therapeutic modalities have not resolved deep material.",
          "With a trained facilitator and a designated sitter."
        ],
        whoFor: "Adults in good physical and mental health with no contraindications. Must be practised only with a trained Holotropic Breathwork facilitator. Not appropriate as a home practice."
      },
      history: {
        origins: "Stanislav Grof, Czech psychiatrist, developed Holotropic Breathwork in the early 1970s with his wife Christina Grof after LSD was criminalised in the US. Grof had run one of the world's most rigorous LSD-therapy research programs and refused to abandon the therapeutic territory when the substance became unavailable.",
        evolution: "Grof spent decades mapping the territory of non-ordinary states — documenting perinatal matrices (four stages corresponding to the birth process), biographical material, and transpersonal experiences. He co-founded the Grof Transpersonal Training network, which has trained facilitators in over 40 countries.",
        figures: [
          { name: "Stanislav Grof", credit: "Developer of Holotropic Breathwork and cartographer of non-ordinary states of consciousness." },
          { name: "Jack Kornfield", credit: "Trained in both Theravada Buddhism and Grof's transpersonal framework; bridges the two traditions." }
        ],
        ancient: "Grof identifies holotropic-state experiences across shamanic traditions, Sufi breath practices, Tummo, Yoga Nidra, and certain Taoist inner alchemy practices. He argues these traditions are all engaging the same territory of consciousness that Holotropic Breathwork accesses through breath."
      },
      howTo: {
        progressions: [
          { level: "Introduction", detail: "Attend a one-day introductory workshop with a certified facilitator. Each session runs 2–3 hours. You will alternate between 'breather' and 'sitter' roles." },
          { level: "Regular practice", detail: "3–4 sessions minimum for integration of initial experiences. Each session is unique — the inner healer guides the experience." },
          { level: "Training", detail: "Grof Transpersonal Training offers a full facilitator certification programme for those wishing to offer it professionally." }
        ],
        tips: [
          "There is no technique to learn — the method works through surrender, not effort.",
          "The sitter role (supporting another breather) is as transformative as breathing.",
          "Integration is as important as the session itself — journal, draw mandalas, rest.",
          "Never attempt alone — the group container and trained facilitator are essential elements."
        ]
      },
      science: {
        physiology: "Sustained hyperventilation reduces CO₂, causing cerebral vasoconstriction and alkalosis. The combination of altered blood chemistry, altered states of proprioception, and evocative music creates the conditions for non-ordinary experience. Peripheral tingling (carpopedal spasm) is a common side effect and is harmless when facilitated correctly.",
        neuroscience: "The non-ordinary states produced are accompanied by dramatic changes in brain activity detectable on EEG — high-amplitude, wide-ranging activity not typically observed in waking consciousness. Grof documented over 4,000 sessions of LSD therapy and argues that breath produces neurologically comparable states.",
        research: [
          "Grof, S. (2010) — Holotropic Breathwork: theory, practice, and outcomes documentation.",
          "Brewerton et al. (2012) — survey of Holotropic Breathwork practitioners: therapeutic outcomes.",
          "Rhinewine & Williams (2007) — review of HB as a therapeutic modality."
        ],
        tags: ["Non-ordinary states", "Transpersonal", "Grof", "Healing", "Group practice"]
      },
      learn: { animation: "default" },
      related: {
        people: ["Stanislav Grof"],
        books: ["Holotropic Breathwork", "Stealing Fire", "The Biology of Belief"],
        techniques: ["wim-hof-method", "tummo", "kapalabhati"]
      }
    }
  };
