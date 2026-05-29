
  /* ════════════════ RICH MEDITATION DETAILS (5-tab payload) ════════════════ */
  // Same shape as TECHNIQUE_DETAILS. One entry per practice in MEDITATIONS.

  const MEDITATION_DETAILS = {

    'mindfulness-of-breath': {
      overview: {
        what: "A gentle, sustained attention to your natural breath exactly as it is — not how you want it to be. Known traditionally as Anapanasati (mindfulness of breathing), this practice is the bedrock of breath awareness. The process is simple: when your mind wanders (and it will), you gently return your focus. This straightforward reset is the most foundational meditation across nearly every contemplative tradition on earth.",
        tldr: "Rest your attention on your natural breath. When your mind wanders, gently return. That's the whole practice.",
        keyBenefits: [
          "Calms the brain's alarm system over weeks of consistent practice",
          "Sharpens sustained attention and breaks mind-wandering loops",
          "Cuts through overthinking, rumination, anxiety and depressive symptoms",
          "Builds lasting equanimity that carries into daily life"
        ],
        whenToUse: [
          "Start your day — first thing in the morning is the classical recommendation",
          "Midday reset — a quick 5-minute circuit breaker during the afternoon slump",
          "Wind down — right before bed to quiet your mind",
          "On-demand focus — whenever your attention has scattered"
        ],
        whoFor: "Everyone. The single most accessible and deeply studied meditation available. For trauma survivors, keeping eyes slightly open or focusing on a physical body anchor can feel safer than closed-eye breath focus."
      },
      history: {
        origins: "Taught by the Buddha himself in the Anapanasati Sutta (Majjhima Nikaya 118) approximately 2,500 years ago. The term anapanasati literally means mindfulness of breathing — directing sati (mindfulness) onto the pana (breath). One of the very earliest formal meditation instructions ever recorded.",
        evolution: "Preserved intact across all major Buddhist traditions including Theravada, Mahayana, Zen and Tibetan lineages. In 1979, Jon Kabat-Zinn at UMass Medical School stripped away the religious framing to create MBSR (Mindfulness-Based Stress Reduction). Today it is the single most-studied meditation practice in contemporary neuroscience.",
        figures: [
          { name: "The Buddha",       credit: "Original teacher whose Anapanasati Sutta provided foundational instructions still followed today." },
          { name: "Mahasi Sayadaw",   credit: "Renowned Burmese monk (1904–1982) whose Vipassana method shaped modern mindfulness teaching." },
          { name: "Jon Kabat-Zinn",   credit: "Founder of MBSR (1979) who brought breath meditation into clinical and corporate mainstream." },
          { name: "Jack Kornfield",   credit: "Theravada teacher and co-founder of Insight Meditation Society." }
        ],
        ancient: "Considered the oldest formal meditation practice still in continuous transmission today. Passed down orally through monastic communities for centuries before being recorded in ancient Pali. Core philosophy: where attention rests, the mind becomes."
      },
      howTo: {
        progressions: [
          { level: "Beginner",     detail: "5–10 minutes daily. Set a timer. Notice when you've wandered; return without self-criticism." },
          { level: "Intermediate", detail: "20–30 minutes. Choose one anchor and stay with it. Add gentle noting (rising / falling)." },
          { level: "Advanced",     detail: "Longer sessions; explore the 16 contemplations of the Anapanasati Sutta. Retreat work." }
        ],
        tips: [
          "The Return Is the Rep: Every time you notice your mind drifting and bring it back, you just did a bicep curl for your attention span.",
          "Invite, Don't Force: Simply invite your focus back. Forcing creates tension, not calm.",
          "Stick to One Anchor: Pick one focal point and commit to it for at least a month.",
          "Quick Adjustments: If falling asleep, crack your eyes slightly. If restless, make your exhales a little longer."
        ]
      },
      science: {
        physiology: "Bringing slow, sustained attention to your breath naturally lowers your respiratory rate. Over time this shifts heart-rate variability toward parasympathetic dominance and actively drops cortisol stress levels.",
        neuroscience: "Sara Lazar's lab at Harvard demonstrated that just 8 weeks of MBSR produces measurable physical changes in brain structure — increased grey matter density in the hippocampus, insula and prefrontal cortex, alongside a physical reduction in amygdala volume. Long-term meditators show significantly decreased activity in the Default-Mode Network (DMN).",
        keyMechanisms: [
          "Default-Mode Network (DMN): Deactivating this network stops repetitive thought patterns",
          "Amygdala-PFC Coupling: Strengthens connection between rational prefrontal cortex and emotional amygdala",
          "Insula: Increasing grey matter sharpens interoception and self-regulation",
          "Neuroplasticity: Physical remodeling of neural pathways based on targeted attention"
        ],
        research: [
          { title: "Lazar et al.", finding: "8-week MBSR produces measurable structural changes across key brain regions", url: "" },
          { title: "Brewer et al.", finding: "Meditation experience directly correlates with DMN deactivation during practice", url: "" },
          { title: "Clinical MBSR trials", finding: "Documented success managing chronic pain, anxiety, depression and immune function", url: "" }
        ]
      },
      learn: {
        animation: "mindful-breath",
        video: {
          title: "Guided Meditation: Mindfulness of Breath",
          teacher: "Jack Kornfield",
          youtubeId: "qpRpgrlvKa0"
        }
      },
      quiz: true,
      related: {
        people:     ["Jack Kornfield", "Andrew Huberman"],
        books:      ["The Miracle of Mindfulness", "Breath: The New Science of a Lost Art"],
        techniques: ["ujjayi", "nadi-shodhana", "4-7-8-breathing"]
      },
      product: {
        title: "Silent Mind Tibetan Singing Bowl Set",
        price: "£28.00",
        badge: "Special buy",
        desc: "A beginner-friendly meditation bowl with cushion, mallet and case. Used for centuries to deepen meditation practice.",
        url: "https://www.amazon.co.uk/s?k=tibetan+singing+bowl+set",
        ctaLabel: "Buy on Amazon"
      }
    },

    'body-scan': {
      overview: {
        what: "Sequential head-to-toe (or toe-to-head) attention to physical sensation, noticing what's there without trying to change it. The gateway to interoception — the felt sense of the body from within.",
        keyBenefits: [
          "Reduces chronic pain perception (substantially in RCT data).",
          "Improves sleep quality and reduces insomnia.",
          "Decreases anxiety by anchoring attention in the body.",
          "Builds interoception — the foundation of emotional regulation."
        ],
        whenToUse: [
          "Before sleep — one of the best wind-down practices.",
          "During chronic pain flare-ups (gently).",
          "After a stressful day to release accumulated tension.",
          "As a daily 20-minute restoration practice."
        ],
        whoFor: "Most people, including beginners. Excellent for those with chronic pain or sleep issues. Trauma survivors may benefit from a teacher's guidance to navigate strong sensations safely."
      },
      history: {
        origins: "A traditional element of Buddhist meditation — kayagatasati, 'mindfulness of the body' — taught in the Satipatthana Sutta as one of the four foundations of mindfulness. The 'sweeping' practice of S.N. Goenka's Vipassana lineage is a refined body-scan variant.",
        evolution: "Brought to clinical mainstream through Jon Kabat-Zinn's MBSR program (1979), where the body scan became one of the foundational practices. Later adapted by trauma therapists — Bessel van der Kolk, Peter Levine — for somatic awareness in trauma recovery. Now used clinically for chronic pain, PTSD, and stress.",
        figures: [
          { name: "S.N. Goenka",         credit: "Burmese-Indian teacher (1924–2013) whose Vipassana courses use a refined body-sweep as core practice." },
          { name: "Jon Kabat-Zinn",      credit: "Formalised the clinical body scan as the entry point to MBSR." },
          { name: "Bessel van der Kolk", credit: "Trauma researcher; brought body-based awareness into mainstream trauma treatment." }
        ],
        ancient: "Buddhist meditation has always emphasised body awareness as a doorway to insight — attention to the body 'roots you in the present moment and grounds away from cognitive rumination.' The Satipatthana Sutta enumerates kayagatasati (body), vedananussati (feeling-tone), cittanupassana (mind), and dhammanupassana (mental objects) as the four foundations. Body comes first because it's the most accessible."
      },
      howTo: {
        progressions: [
          { level: "Beginner",     detail: "10-minute guided body scan. Don't worry about being thorough — meet what you notice." },
          { level: "Intermediate", detail: "20–30 minutes, region by region, no recording needed. Notice sensations without naming them as good or bad." },
          { level: "Advanced",     detail: "S.N. Goenka's 1-hour sweep — moving attention through the whole body with increasing speed and refinement. Often done in retreats." }
        ],
        tips: [
          "Where you feel nothing, that's still data — neutrality is information, not failure.",
          "Don't skip uncomfortable areas. Meet them with curiosity, not pressure to change them.",
          "Lying down is fine — many practitioners do body scan supine.",
          "If you fall asleep, you needed the rest. Try sitting next time if you want to stay alert."
        ]
      },
      science: {
        physiology: "Direct training in interoception — the perception of internal bodily states. Reduces sympathetic tone, increases vagal tone, and lowers blood pressure during practice. Long-term: reduced inflammatory markers.",
        neuroscience: "Activates the insula — the brain's interoceptive hub. Strengthens insula–prefrontal connectivity, which underlies emotional regulation. Reduces Anterior Cingulate Cortex activation during pain (Kabat-Zinn's pain studies).",
        research: [
          "Cherkin et al. (2016, JAMA) — MBSR (which centres on body scan) matched CBT for chronic low-back pain, both superior to usual care.",
          "Multiple pain-modulation studies showing reduced subjective pain ratings during meditation.",
          "van der Kolk — body-awareness practices integrated into trauma protocols with substantial PTSD outcome data."
        ],
        tags: ["Interoception", "Insula", "Pain modulation", "Autonomic shift"]
      },
      learn: {
        animation: "body-scan",
        video: {
          title: "Guided Body Scan Meditation",
          teacher: "Jon Kabat-Zinn",
          youtubeId: "T0nuKBcyqEM"
        }
      },
      related: {
        people:     ["Jack Kornfield", "Dr. Stephen Porges"],
        books:      ["The Miracle of Mindfulness", "Why Zebras Don't Get Ulcers", "The Healing Power of the Breath"],
        techniques: ["physiological-sigh", "4-7-8-breathing", "bhramari"]
      }
    },

    'loving-kindness': {
      overview: {
        what: "Systematic cultivation of unconditional benevolence — toward self, loved ones, neutral people, difficult people, and all beings. Five stages. The classical Buddhist practice of metta (loving-kindness).",
        keyBenefits: [
          "Increases positive emotions and social connectedness measurably.",
          "Reduces implicit bias (including racial bias).",
          "Improves vagal tone and HRV (Kok & Fredrickson 2013).",
          "Builds compassion as a trait, not just a feeling."
        ],
        whenToUse: [
          "When feeling isolated, lonely, or cut off.",
          "After conflict — particularly the 'difficult person' stage.",
          "Before sleep as a closing practice.",
          "As a daily compassion training."
        ],
        whoFor: "Anyone willing to engage emotion. For trauma survivors, modify the difficult-person stage carefully — sometimes years of self-stage work come first."
      },
      history: {
        origins: "Metta Bhavana ('cultivation of loving-kindness') is one of the Buddha's four brahmaviharas (divine abodes): metta, karuna (compassion), mudita (sympathetic joy), upekkha (equanimity). The Karaniya Metta Sutta (Sutta Nipata 1.8) gives the original instructions. Buddhaghosa's 5th-century Visuddhimagga elaborates the five-stage method.",
        evolution: "Preserved through Theravada lineages. Brought to Western secular practice through Sharon Salzberg's foundational book Lovingkindness (1995) and the Insight Meditation Society. Researched extensively by Barbara Fredrickson (positive psychology, UNC) and Richie Davidson (neuroscience, Wisconsin), establishing it as a measurably effective intervention.",
        figures: [
          { name: "The Buddha",       credit: "Original teacher; the Karaniya Metta Sutta is one of the most-chanted Buddhist texts." },
          { name: "Jack Kornfield",   credit: "Has taught and written about metta extensively; co-founder of Spirit Rock." },
          { name: "Andrew Huberman",  credit: "Has covered the neuroscience of compassion training and its measurable health effects." }
        ],
        ancient: "One of the four 'divine abodes' (brahmaviharas) in Buddhist meditation — the cultivated states said to be where divinity itself dwells. The radical claim: love is a trainable skill, not just a feeling that visits us. Two and a half millennia later, the laboratory has confirmed it: short-term metta practice produces measurable changes in cardiac vagal tone and social cognition."
      },
      howTo: {
        progressions: [
          { level: "Beginner",     detail: "Self only. 10 minutes. Phrases: 'May I be safe. May I be healthy. May I be happy. May I live with ease.'" },
          { level: "Intermediate", detail: "Five stages: self → benefactor → neutral person → difficult person → all beings. 20–30 minutes." },
          { level: "Advanced",     detail: "Sustain across daily activities. Combine with breath. Customise phrases. Multi-week retreats focused on metta." }
        ],
        tips: [
          "If the self stage feels forced, start with someone you love unconditionally, then return to yourself.",
          "Don't manufacture the feeling — invite it. Sincere wishes are enough.",
          "The difficult-person stage may take years. That's normal.",
          "Adapt the phrases to what resonates. 'May you be free from suffering' is also classical."
        ]
      },
      science: {
        physiology: "Kok & Fredrickson (2013) showed that even 9 weeks of loving-kindness practice raised cardiac vagal tone — a direct physiological marker of social-emotional health. Reduces cortisol and inflammatory markers.",
        neuroscience: "Activates the temporoparietal junction (theory of mind), insula (empathy), and the medial prefrontal cortex. Reduces amygdala reactivity to emotional faces. Davidson's lab showed sustained structural changes in long-term Buddhist practitioners.",
        research: [
          "Fredrickson — 'Open Hearts Build Lives' (2008) — even short-term metta practice broadens positive emotions and resources.",
          "Hutcherson et al. — brief metta reduced implicit racial bias compared to control.",
          "Davidson, Lutz et al. — long-term practitioners show heightened gamma synchrony during compassion meditation."
        ],
        tags: ["Vagal tone", "Empathy circuits", "Positive affect", "Social cognition"]
      },
      learn: {
        animation: "metta",
        video: {
          title: "Loving-Kindness Meditation",
          teacher: "Sharon Salzberg",
          youtubeId: "c7nb35yqu7Y"
        }
      },
      related: {
        people:     ["Jack Kornfield"],
        books:      ["The Miracle of Mindfulness", "The Healing Power of the Breath"],
        techniques: ["bhramari", "4-7-8-breathing", "physiological-sigh"]
      }
    },

    'yoga-nidra': {
      overview: {
        what: "Non-Sleep Deep Rest — a guided journey through body, breath, and visualisation while lying down, holding you in the hypnagogic state between waking and sleep for 20–45 minutes.",
        keyBenefits: [
          "Restores dopamine levels after sleep deprivation (Huberman protocols).",
          "Enhances neuroplasticity and learning consolidation.",
          "Profound nervous-system recovery — sometimes equivalent to several hours of sleep.",
          "Excellent for jet lag and acute stress."
        ],
        whenToUse: [
          "After poor sleep, jet lag, or all-nighters.",
          "Between intense work blocks (Huberman recommends 10–20 min mid-day).",
          "Before sleep when wound-up.",
          "Recovery between athletic sessions or intense days."
        ],
        whoFor: "Everyone. Safe for all ages and conditions. Often more accessible than seated meditation — you just lie down and listen."
      },
      history: {
        origins: "Modern Yoga Nidra was developed by Swami Satyananda Saraswati at the Bihar School of Yoga in the 1960s, drawing on tantric Nyasa practices (ritual placement of awareness on body parts) and classical pratyahara (sense withdrawal). The formalised protocol is 20th century, the roots are ancient.",
        evolution: "Brought to Western audiences through Satyananda's book Yoga Nidra (1976) and Bihar School-trained teachers. Re-popularised globally by Andrew Huberman under the term 'NSDR' (Non-Sleep Deep Rest) on his Huberman Lab podcast (2020+), citing it as a tool for dopamine restoration and learning. Used clinically through Richard Miller's iRest protocol, adopted by the US Department of Veterans Affairs for PTSD.",
        figures: [
          { name: "Paramahansa Yogananda", credit: "Brought yogic consciousness practices — including precursors to nidra — to permanent Western residence." },
          { name: "Andrew Huberman",       credit: "Popularised Yoga Nidra under the name NSDR; brought the dopamine-restoration research to mainstream awareness." },
          { name: "Dr. Stephen Porges",    credit: "Polyvagal Theory provides the framework for understanding why deep restful states heal the nervous system." }
        ],
        ancient: "Roots in tantric Nyasa — the ritual placing of mantras and awareness on specific body parts. Also draws on classical pratyahara (the fifth limb of Patanjali's eight-limbed yoga: withdrawal of the senses). The state of conscious sleep — 'tandra' — is described in classical yoga as a borderland of consciousness with healing properties. What the rishis called yoga nidra, modern science calls the hypnagogic state."
      },
      howTo: {
        progressions: [
          { level: "Beginner",     detail: "Follow a guided 20-minute recording lying flat on your back. Don't worry about falling asleep — you'll benefit either way." },
          { level: "Intermediate", detail: "30–45 minute recordings. Notice the hypnagogic threshold; learn to ride the edge of sleep without crossing it." },
          { level: "Advanced",     detail: "Self-guided practice. Use as daily restoration. Combine with athletic recovery or learning consolidation routines." }
        ],
        tips: [
          "Lie down — never sit. The whole point is to relax the body completely.",
          "Cover with a blanket; body temperature drops as you settle.",
          "Headphones or a quiet room are essential. The guidance is the practice.",
          "If you fall asleep, you needed it. Don't fight it. Try shorter sessions if you want to stay conscious."
        ]
      },
      science: {
        physiology: "Heart rate drops, breathing slows, vagal tone rises substantially. Brain enters slow-wave-like states while remaining minimally conscious. Cortisol drops; growth hormone may pulse.",
        neuroscience: "EEG studies show theta and alpha dominance during yoga nidra — the hallmarks of the hypnagogic state. fMRI shows default-mode network suppression and dopamine restoration in the basal ganglia (basis of Huberman's NSDR claims). Promotes consolidation of recently-learned material.",
        research: [
          "Moszeik et al. (2020) — large-sample study showing significant improvements in stress, sleep, and well-being from short yoga nidra practice.",
          "Studies on iRest in PTSD veterans show clinical effectiveness comparable to evidence-based therapies.",
          "Kjaer et al. — PET imaging of yoga nidra showing measurable dopamine release during practice."
        ],
        tags: ["Theta/alpha waves", "Dopamine restoration", "Default-mode network", "Vagal tone"]
      },
      learn: {
        animation: "nidra",
        video: {
          title: "Yoga Nidra for Deep Sleep & Recovery",
          teacher: "Ally Boothroyd",
          youtubeId: "M0u9GST_j3s"
        }
      },
      related: {
        people:     ["Andrew Huberman", "Paramahansa Yogananda", "Dr. Stephen Porges"],
        books:      ["Science of Breath", "Autobiography of a Yogi", "The Healing Power of the Breath"],
        techniques: ["4-7-8-breathing", "physiological-sigh", "bhramari"]
      }
    },

    'trataka': {
      overview: {
        what: "Sustained unblinking gaze at a candle flame followed by internal visualisation of the afterimage. Classical concentration practice — dharana made specific.",
        keyBenefits: [
          "Develops single-pointed concentration like no other practice.",
          "Reduces mind-wandering tendency over weeks.",
          "Strengthens eye-mind coordination and visualisation capacity.",
          "Prepares the mind for deeper meditation (Patanjali considered dharana the gateway to dhyana)."
        ],
        whenToUse: [
          "As preparation for seated meditation.",
          "Evening practice in dim light.",
          "When concentration feels weak or scattered.",
          "Before visualisation-based practice."
        ],
        whoFor: "Most people. Skip with serious eye conditions, glaucoma, or recent eye surgery. Pregnant women may want to avoid extended sessions."
      },
      history: {
        origins: "One of the six shatkarmas (cleansing practices) in classical Hatha Yoga. Documented in the Hatha Yoga Pradipika (2.31–32) and the Gheranda Samhita (1.53–54). Classified as a kriya — a cleansing practice that polishes both the eyes (literally) and the mind.",
        evolution: "Preserved through Hatha yoga lineages, particularly in the Bihar School and Sivananda lineages. Less mainstream in Western yoga than asana or meditation, but enjoying a revival via Kundalini yoga, integrative meditation curricula, and contemplative neuroscience studies of concentration training.",
        figures: [
          { name: "Paramahansa Yogananda", credit: "Brought yogic concentration practices including trataka into Western awareness." },
          { name: "Andrew Huberman",       credit: "Has discussed the neuroscience of visual focus and gaze training on his podcast." }
        ],
        ancient: "One of the classical kriyas — a cleansing practice that simultaneously cleanses the eyes (literally producing tears that flush the surface) and the mind (sustained single-pointed attention). Related to dharana (concentration), the sixth limb of Patanjali's eight-limbed path. The afterimage practice trains a transition from external object to internal visualisation — mirroring the move from outer to inner that defines deeper meditation."
      },
      howTo: {
        progressions: [
          { level: "Beginner",     detail: "5 minutes with the candle 2–3 feet away. Eyes may water — that's the cleansing." },
          { level: "Intermediate", detail: "10–15 minutes. Spend equal time gazing outwardly and visualising the afterimage with closed eyes." },
          { level: "Advanced",     detail: "20+ minutes. Combine with breath retention. Build to gazing on a dot (bindu), a yantra, or the open sky." }
        ],
        tips: [
          "Dim room. Steady flame (no draft).",
          "Don't strain. The flame doesn't need conquering — just held.",
          "The afterimage IS the practice — when it fades, return to the flame.",
          "Begin with short sessions to avoid eye strain. Build gradually."
        ]
      },
      science: {
        physiology: "Eye muscles strengthen and dry-eye symptoms often reduce over time. Tears that flow during gazing physically cleanse the cornea — the literal kriya effect.",
        neuroscience: "EEG studies show increased alpha coherence during sustained focal gazing. Strengthens the dorsal attention network. The afterimage phase activates visual cortex without external input — a unique training in voluntary visualisation, with its own neural signatures.",
        research: [
          "Indian research groups (Telles lab and others) have shown improvements in concentration measures, working memory, and reaction time after consistent trataka practice.",
          "Studies on focused-attention meditation broadly support attentional benefits of sustained-gaze practices.",
          "EEG coherence studies suggest measurable shifts in cortical synchrony during trataka."
        ],
        tags: ["Dharana", "Alpha coherence", "Visualisation", "Dorsal attention network"]
      },
      learn: {
        animation: "trataka",
        video: {
          title: "Trataka — Candle Gazing Meditation",
          teacher: "Bihar School of Yoga / Satyananda lineage",
          youtubeId: "qpe9N1Tj-3w"
        }
      },
      related: {
        people:     ["Paramahansa Yogananda"],
        books:      ["Light on Pranayama", "Science of Breath", "Autobiography of a Yogi"],
        techniques: ["ujjayi", "nadi-shodhana", "kumbhaka"]
      }
    },

    'open-awareness': {
      overview: {
        what: "Resting as awareness itself — without focusing on any object. Thoughts, sounds, and sensations arise and pass without engagement. The practice points at what's already the case: awareness is the ground in which experience appears.",
        keyBenefits: [
          "Direct experiential access to non-conceptual awareness.",
          "Freedom from habitual mental patterns (grasping, aversion, identification).",
          "Profound equanimity that doesn't depend on conditions.",
          "Recognition of selfless awareness — the central insight of non-dual traditions."
        ],
        whenToUse: [
          "After establishing a concentration foundation (months of focused-attention practice).",
          "As a deeper exploration after focused meditation.",
          "Throughout daily life once recognised — 'life as the meditation hall.'",
          "When concentration practice has matured to where forcing is the only remaining obstacle."
        ],
        whoFor: "Experienced meditators. Beginners may find it disorienting — concentration is the prerequisite, not the alternative."
      },
      history: {
        origins: "Present across multiple traditions, each pointing at the same recognition: Tibetan Dzogchen ('the great perfection'), Zen Shikantaza ('just sitting'), Advaita Vedanta (self-inquiry), Kashmiri Shaivism, Mahamudra. All teach that awareness is what we're looking for AS what's looking.",
        evolution: "Tibetan Dzogchen carries the explicit pointing-out lineage — from Garab Dorje through Longchenpa (14th c.), Patrul Rinpoche, to modern teachers like Tulku Urgyen and Mingyur Rinpoche. In Zen: Dogen's Shikantaza. In Advaita: Ramana Maharshi (early 20th c.) and modern non-dual teachers Rupert Spira, Loch Kelly, Adyashanti. Krishnamurti's 'choiceless awareness' is a parallel formulation.",
        figures: [
          { name: "Paramahansa Yogananda", credit: "Brought the Advaita / non-dual lineage into Western awareness through Kriya Yoga teachings." },
          { name: "Jack Kornfield",        credit: "Has taught open-awareness practices alongside Theravada concentration in the Western Insight movement." },
          { name: "Stanislav Grof",        credit: "Explored non-ordinary states of consciousness scientifically — adjacent territory to non-dual recognition." }
        ],
        ancient: "Possibly the deepest meditation in the contemplative traditions — pointing not at a technique but at what's already the case. Considered the 'pinnacle' practice in Dzogchen and Mahamudra; in Zen the recognition of 'before thinking.' The ancient assertion: awareness is already free, intrinsically aware, and ever-present. Meditation isn't producing this — it's recognising what was never absent."
      },
      howTo: {
        progressions: [
          { level: "Beginner",     detail: "5 minutes. After 10 minutes of concentration practice, gently release the anchor and rest in the openness that remains." },
          { level: "Intermediate", detail: "20–30 minutes. Allow concentration to fall away naturally. Notice thoughts without following them." },
          { level: "Advanced",     detail: "Sustained recognition that doesn't require sitting. Life as the meditation hall. Pointing-out instructions from a qualified teacher accelerate this." }
        ],
        tips: [
          "Not a 'blank mind' — awareness is already alive with experience.",
          "Don't try to make anything special happen. Trying is what obscures.",
          "If you notice yourself trying, notice that too. Even effort appears in awareness.",
          "The recognition is now, not later. If it doesn't happen now, sitting longer won't help — it's not in time."
        ]
      },
      science: {
        physiology: "Heart rate and breath naturally slow. Long-term practitioners show very low baseline arousal — a relaxed alertness distinct from drowsiness.",
        neuroscience: "Long-term meditators (Davidson and Lutz, studying Tibetan monks) show distinctive gamma synchrony patterns and reduced default-mode network activity during open-awareness practice. The fMRI signature differs from focused-attention meditation — different neural pathways are emphasised.",
        research: [
          "Lutz et al. (2004, PNAS) — long-term Buddhist practitioners show high-amplitude gamma synchrony during meditation, especially compassion and open-awareness practices.",
          "Davidson's lab — sustained structural and functional brain changes in practitioners with 10,000+ hours.",
          "Less mainstream clinical research because open-awareness is harder to operationalise than focused-attention protocols."
        ],
        tags: ["Default-mode network", "Gamma synchrony", "Non-conceptual awareness", "Neural deconstruction"]
      },
      learn: {
        animation: "spacious",
        video: {
          title: "Effortless Mindfulness — Glimpse Practices",
          teacher: "Loch Kelly",
          youtubeId: "r2_v3IqxGCs"
        }
      },
      related: {
        people:     ["Jack Kornfield", "Paramahansa Yogananda", "Stanislav Grof"],
        books:      ["Autobiography of a Yogi", "The Miracle of Mindfulness", "Light on Pranayama"],
        techniques: ["kumbhaka", "ujjayi", "nadi-shodhana"]
      }
    },

    'gratitude-meditation': {
      overview: {
        what: "Systematic, deliberate cultivation of appreciation — moving through specific people, circumstances, and gifts and allowing each to expand into felt gratitude in the body.",
        keyBenefits: [
          "Increases dopamine and serotonin through positive emotional focus.",
          "Reduces symptoms of depression and anxiety with regular practice.",
          "Strengthens social connection and empathy.",
          "Rewires habitual attention toward positive aspects of experience."
        ],
        whenToUse: [
          "Morning — sets a positive emotional tone for the day.",
          "Evening — a completion practice that closes the day with appreciation.",
          "During low mood, stress, or disconnection.",
          "After a difficult experience as a rebalancing tool."
        ],
        whoFor: "Everyone. No contraindications. Particularly powerful for those experiencing depression, anxiety, or chronic stress."
      },
      history: {
        origins: "Gratitude practices appear in virtually every spiritual and religious tradition. The Hebrew practice of offering 100 blessings daily, the Christian thanksgiving prayer, the Buddhist practice of mudita (appreciative joy), and the Sufi tradition of shukr all cultivate appreciation as a path to presence.",
        evolution: "Modern positive psychology — particularly the work of Martin Seligman, Robert Emmons, and Michael McCullough — has produced extensive research on gratitude as a trainable quality with measurable effects on wellbeing, health, and social connection. The gratitude letter exercise is one of the most studied interventions in positive psychology.",
        figures: [
          { name: "Sharon Salzberg", credit: "Teaches gratitude as an aspect of loving-kindness meditation — appreciation for the good that is already here." },
          { name: "Jon Kabat-Zinn", credit: "MBSR includes gratitude elements; beginner's mind as an expression of deep appreciation." }
        ],
        ancient: "The Stoic philosophers — particularly Marcus Aurelius and Seneca — wrote extensively about gratitude as a philosophical practice. 'Very little is needed to make a happy life' (Aurelius) is an expression of conscious appreciation. The practice of reflecting on what is good, before sleep, is ancient."
      },
      howTo: {
        progressions: [
          { level: "Beginner", detail: "List 3 specific things you are grateful for each morning. Write them — don't just think them. Specificity is key." },
          { level: "Intermediate", detail: "Shift from listing to feeling. With each entry, pause and actually feel the appreciation in the body. 10 minutes." },
          { level: "Advanced", detail: "Meditate through 10–15 sources of gratitude for 20 minutes, spending time in the felt sense of each before moving on." }
        ],
        tips: [
          "Specificity is everything — 'I'm grateful for the conversation with X this morning' is more powerful than 'I'm grateful for my family.'",
          "The felt sense in the body is the practice — not the list.",
          "Allow grief or sadness to arise if it does — gratitude and grief are not opposites.",
          "Gratitude letters — written to someone who has helped you but never been properly thanked — are the single most-studied gratitude intervention."
        ]
      },
      science: {
        physiology: "Gratitude activates the reward circuitry — dopaminergic pathways associated with positive reinforcement — as well as the social engagement system. Chronic gratitude practice has been associated with lower inflammatory markers and improved cardiovascular health.",
        neuroscience: "Emmons & McCullough (2003) showed that gratitude journalling produced measurable increases in positive affect, life satisfaction, and exercise levels — with reductions in illness symptoms. Functional MRI studies show gratitude activating the medial prefrontal cortex and anterior cingulate cortex.",
        research: [
          "Emmons & McCullough (2003) — foundational gratitude journalling RCT with wide-ranging positive effects.",
          "Seligman et al. (2005) — gratitude visit as highest-impact positive psychology intervention.",
          "Wood et al. (2010) — meta-analysis of gratitude and wellbeing across 26 studies."
        ],
        tags: ["Gratitude", "Positive psychology", "Wellbeing", "Serotonin", "Beginners"]
      },
      learn: {},
      related: {
        people: ["Sharon Salzberg", "Jon Kabat-Zinn"],
        books: ["The Gratitude Diaries", "Loving-Kindness", "The Miracle of Mindfulness"],
        techniques: ["4-7-8-breathing", "extended-exhale", "resonant-breathing"]
      },
      product: {
        title: "Hardcover Linen Gratitude Journal",
        price: "£14.99",
        badge: "Focus pick",
        desc: "Thick lay-flat premium paper designed to structurally track daily reflections post-session.",
        url: "https://www.amazon.co.uk/s?k=gratitude+journal+hardcover",
        ctaLabel: "Buy on Amazon"
      }
    },

    'box-visualization': {
      overview: {
        what: "A combined practice that pairs the four-count box breathing rhythm with guided mental imagery — tracing the sides of a luminous square while filling each side with a quality (calm, focus, strength, ease).",
        keyBenefits: [
          "Combines the calming effect of box breathing with the cognitive benefits of visualisation.",
          "Develops mental imagery capacity alongside breath control.",
          "Anchors abstract qualities (calm, focus) to a sensory image.",
          "An accessible bridge for beginners between breathwork and seated meditation."
        ],
        whenToUse: [
          "Before a performance, meeting, or challenging task.",
          "As a beginner's combined practice to build both skills simultaneously.",
          "When box breathing feels mechanical — the visualisation brings it alive.",
          "As a midday reset: 10 minutes produces clear cognitive improvement."
        ],
        whoFor: "All levels. Particularly valuable for beginners who want to explore both breathwork and meditation without committing to separate practices."
      },
      history: {
        origins: "Box Visualization is a modern synthesis that emerged from performance coaching and military mental training. It combines the Navy SEAL box breathing protocol with established visualisation techniques used in sport psychology.",
        evolution: "The combination of breath pacing and visual imagery is implicit in many classical traditions — Tibetan Buddhist visualisation practices are always coordinated with breath, as are certain pranayama practices described in the Hatha Yoga Pradipika. The modern box visualisation is a simplified, accessible version of these approaches.",
        figures: [
          { name: "Mark Divine", credit: "SEALFIT founder who integrated box breathing with mental imagery in elite military and performance training." },
          { name: "Andrew Huberman", credit: "Has highlighted the synergistic benefits of combining breath control with cognitive imagery for performance." }
        ],
        ancient: "Tibetan Buddhist visualisation practice always involves breath coordination. The yidam (deity visualisation) practices require simultaneous breath awareness, internal imagery, and mantra — the ancient three-element approach that box visualisation echoes in simplified form."
      },
      howTo: {
        progressions: [
          { level: "Beginner", detail: "4 rounds of standard box breathing (4:4:4:4). Then simply trace the square of the box on the inhale, hold, exhale, hold. 10 minutes." },
          { level: "Intermediate", detail: "Assign a quality to each side: bottom = ground/stability, right = inhale/expansion, top = hold/strength, left = exhale/release. Visualise each vividly." },
          { level: "Advanced", detail: "After the four sides are established, let the square transform into a scene — a space that embodies the qualities you have been cultivating. Rest in it." }
        ],
        tips: [
          "Make the square as specific as possible — a colour, a material, a texture.",
          "Don't strain for a vivid image. Intention is enough — the imagery will develop with practice.",
          "The breath is the anchor; the image is the amplifier.",
          "End with a moment of stillness to let the practice settle before reopening your eyes."
        ]
      },
      science: {
        physiology: "Box breathing produces balanced autonomic tone. The concurrent visualisation engages additional prefrontal and occipital activity, creating a dual-task that reduces the tendency of the mind to wander while meditating.",
        neuroscience: "Mental imagery activates the same neural circuits as actual perception — the visual cortex responds to imagined scenes almost identically to viewed ones. Combining this with breath pacing creates a richly cross-modal meditative experience that sustains attention more effectively than breath awareness alone.",
        research: [
          "Pearson et al. (2015) — review of mental imagery neuroscience: overlapping visual cortex activation.",
          "Box breathing literature — see box-breathing entry for autonomic effects.",
          "Visualisation sport psychology research — imagery as neural rehearsal."
        ],
        tags: ["Visualisation", "Box breathing", "Focus", "Imagery", "Beginners"]
      },
      learn: {},
      related: {
        people: ["Mark Divine", "Andrew Huberman"],
        books: ["The Way of the SEAL", "Stealing Fire"],
        techniques: ["box-breathing", "visualization", "4-7-8-breathing"]
      },
      product: {
        title: "Premium Matte Black Zafu Cushion",
        price: "£32.00",
        badge: "Design pick",
        desc: "High-density buckwheat hull cushion providing absolute structural support for visual concentration.",
        url: "https://www.amazon.co.uk/s?k=zafu+meditation+cushion+buckwheat",
        ctaLabel: "Buy on Amazon"
      }
    },

    'soundscape-meditation': {
      overview: {
        what: "Using ambient sound — natural, musical, or environmental — as the primary anchor for meditative awareness. The ears become the sense organ of present-moment attention.",
        keyBenefits: [
          "Provides an accessible anchor for those who struggle with breath or body focus.",
          "Develops open, non-reactive awareness through sound as object.",
          "Can be practised anywhere without special conditions or posture.",
          "Soothes the nervous system through auditory entrainment."
        ],
        whenToUse: [
          "When the mind is very active and breath-focus isn't landing.",
          "Outdoors in nature — rain, wind, birdsong.",
          "With binaural beats or theta-frequency music for altered states.",
          "As a daily accessible practice that requires no special setup."
        ],
        whoFor: "Everyone. Particularly valuable for those with anxiety around body awareness, trauma survivors, or those who find breath meditation frustrating."
      },
      history: {
        origins: "Sound as a meditation anchor is universal. The Indian Nada Yoga tradition (yoga of sound) is perhaps the most systematic — using sound at all levels from gross to subtle as a direct path to samadhi. The Tibetan tradition uses singing bowls and mantras as meditation supports.",
        evolution: "Secular mindfulness programmes have increasingly incorporated soundscape meditation as an accessible alternative to breath-based practice. The research on binaural beats and neural entrainment has added a scientific basis for using specific sound frequencies to support meditative states.",
        figures: [
          { name: "Russill Paul", credit: "Expert in Nada Yoga and the use of sacred sound as a path to stillness." },
          { name: "Thich Nhat Hanh", credit: "Taught the bell as a mindfulness tool — sound as an invitation to return to presence." }
        ],
        ancient: "The Vigyan Bhairav Tantra — an ancient Shaivite text — describes 112 meditation techniques. Several use sound as the primary anchor: 'hear a sound, become the sound.' In the Tibetan tradition, the guru's voice is considered an emanation of the dharma — sound as transmission."
      },
      howTo: {
        progressions: [
          { level: "Beginner", detail: "Choose a natural sound environment or ambient music. Sit comfortably. Let the ears be fully open. When the mind wanders, return to sound. 10 minutes." },
          { level: "Intermediate", detail: "Move from hearing sounds to listening between sounds — the silence between them. Let awareness include both sound and silence." },
          { level: "Advanced", detail: "Allow the sense of a listener to dissolve — there is only the field of sound. The boundary between inside and outside becomes permeable." }
        ],
        tips: [
          "Don't try to identify or label sounds — just receive them.",
          "Notice near sounds and far sounds simultaneously, without preference.",
          "If using music, choose something without lyrics to avoid cognitive engagement.",
          "The return from wandering to sound is the practice — not just the staying."
        ]
      },
      science: {
        physiology: "Auditory processing activates the default mode network and the salience network. Deliberate open-monitoring of sound has been shown to reduce activity in the default mode network, correlating with reduced mind-wandering and increased present-moment awareness.",
        neuroscience: "Binaural beats research suggests that specific frequency differences between left and right ear can entrain brainwave patterns toward theta (meditative) and alpha (relaxed focus) states. Natural sound environments (particularly water sounds and birdsong) have been shown to reduce cortisol and promote parasympathetic tone.",
        research: [
          "Oster (1973) — foundational binaural beats research.",
          "Kaplan (2001) — attention restoration theory: nature sounds promote cognitive recovery.",
          "Nada Yoga research — emerging studies on sound as meditation support."
        ],
        tags: ["Sound", "Nada Yoga", "Presence", "Auditory", "Accessible"]
      },
      learn: {},
      related: {
        people: ["Russill Paul", "Thich Nhat Hanh"],
        books: ["The Yoga of Sound", "The Miracle of Mindfulness"],
        techniques: ["bhramari", "mantra-japa", "open-awareness"]
      },
      product: {
        title: "Noise-Isolating Studio Headphones",
        price: "£89.00",
        badge: "Gear selection",
        desc: "Ultra-accurate acoustic reproduction profile to resolve precise layers of soundscape tracks.",
        url: "https://www.amazon.co.uk/s?k=studio+headphones+noise+isolating",
        ctaLabel: "Buy on Amazon"
      }
    },

    'visualization': {
      overview: {
        what: "Directed mental imagery used deliberately to rehearse performance, activate healing processes, embody desired qualities, or manifest intended outcomes.",
        keyBenefits: [
          "Activates the same neural pathways as physical rehearsal with measurable performance gains.",
          "Accelerates motor learning and skill acquisition.",
          "Can reduce physiological pain and accelerate healing through psycho-immunological pathways.",
          "Standard practice among Olympic athletes, musicians, surgeons, and special forces."
        ],
        whenToUse: [
          "Before a performance, competition, or important event.",
          "During recovery from injury as a rehabilitation tool.",
          "As a creative or goal-setting practice.",
          "Daily, upon waking — as a morning visualisation of the desired day."
        ],
        whoFor: "Everyone. Visualisation ability develops with practice — those who report 'not being visual' often develop strong imagery with consistent effort."
      },
      history: {
        origins: "Mental rehearsal as a tool for performance appears in athletic training literature from the early 20th century. Edmund Jacobson — the inventor of progressive muscle relaxation — observed in the 1930s that imagining a movement produces tiny activations in the relevant muscles (ideomotor response).",
        evolution: "Soviet sports science pioneered rigorous mental rehearsal programmes in the 1960–70s, which contributed to extraordinary results at the Olympics. Shakti Gawain's Creative Visualisation (1978) brought the practice to a popular self-development audience. Modern neuroscience has provided the mechanistic explanation: the brain cannot fully distinguish imagined from experienced events.",
        figures: [
          { name: "Shakti Gawain", credit: "Pioneer of creative visualisation in the popular arena; brought the practice to millions with Creative Visualization." },
          { name: "Mark Divine", credit: "Navy SEAL commander who systematically uses visualisation as a mental toughness tool in SEALFIT training." }
        ],
        ancient: "Tibetan deity visualisation (yidam practice) is among the most elaborate mental imagery practices ever developed — requiring years of training to hold complex, detailed inner images with complete vividness. The alchemical traditions of both East and West used inner imagery for transformation."
      },
      howTo: {
        progressions: [
          { level: "Beginner", detail: "Choose one specific target (a presentation, a race, a conversation). Close your eyes and build a still image of the ideal outcome. Hold it for 5 minutes." },
          { level: "Intermediate", detail: "Make the visualisation dynamic — run through the entire event in real time, embodying all the senses (feel, sound, smell, temperature). 10–15 minutes." },
          { level: "Advanced", detail: "Visualise from the inside out (first person, full sensory). Then review the event as an outside observer to identify refinements. Then re-run it perfectly." }
        ],
        tips: [
          "Always visualise success, not failure avoidance.",
          "Specificity is power — vague intentions produce vague outcomes.",
          "Pair with a breath anchor to ground the imagery in the body.",
          "Emotional resonance is the key ingredient — feeling it is more important than seeing it."
        ]
      },
      science: {
        physiology: "The ideomotor effect — small muscle activations during mental rehearsal — was documented by Jacobson (1930s). fMRI studies show that imagining a movement activates the motor cortex, cerebellum, and premotor areas almost identically to physical execution.",
        neuroscience: "The visual cortex responds to imagined images almost identically to viewed ones (Kosslyn et al.). This means that mental rehearsal literally grows the neural circuits that execution would grow. This is the mechanism by which visualisation improves athletic performance without physical practice.",
        research: [
          "Driskell et al. (1994) — meta-analysis of mental practice: consistent performance improvement across sports and music.",
          "Kosslyn et al. (2001) — neural basis of visual imagery.",
          "Soviet Olympic sports science literature — foundational empirical evidence of systematic visualisation programmes."
        ],
        tags: ["Mental rehearsal", "Performance", "Imagery", "Motor learning", "Neuroscience"]
      },
      learn: {},
      related: {
        people: ["Shakti Gawain", "Mark Divine"],
        books: ["Creative Visualization", "The Way of the SEAL", "Stealing Fire"],
        techniques: ["box-visualization", "yoga-nidra", "box-breathing"]
      }
    },

    'mantra-japa': {
      overview: {
        what: "Rhythmic, repetitive mental or vocal repetition of a sacred sound or phrase (mantra), coordinated with the breath — the primary meditation practice of the Vedic, Shaivite, and many Buddhist traditions.",
        keyBenefits: [
          "Settles mental activity through vibrational resonance and rhythmic focus.",
          "Aligns breath and mind through a single, continuous point of return.",
          "Provides access to increasingly deep states of concentration and stillness.",
          "Rooted in 5,000 years of living contemplative practice with documented effects."
        ],
        whenToUse: [
          "Daily, at the same time — morning ideally, before the mind becomes busy.",
          "When concentration practice (breath) feels effortful or abstract.",
          "During walking or repetitive physical activity.",
          "In times of distress, grief, or difficulty as a stabilising support."
        ],
        whoFor: "Everyone. Japa requires no prior meditation experience — the repetition itself is the training. Suitable for all ages and backgrounds."
      },
      history: {
        origins: "Japa (Sanskrit: muttering, whispering) is described in the Vedas as one of the primary yogic practices and is considered by many classical teachers to be the most accessible path to samadhi. The Bhagavad Gita (c. 200 BCE) describes Japa as the highest form of yajna (sacred offering).",
        evolution: "Mantra practice entered Western awareness through Transcendental Meditation (introduced by Maharishi Mahesh Yogi in the 1950s–60s) and through the Hare Krishna movement. The Loving-Kindness phrases used in Buddhist meditation are a secular form of japa. Modern neuroscience has investigated the effects of mantra repetition on neural coherence and stress.",
        figures: [
          { name: "Paramahansa Yogananda", credit: "Taught mantra and japa as core Kriya Yoga practices for Self-realisation." },
          { name: "Russill Paul", credit: "Expert in Sanskrit mantra and Nada Yoga; teaches the healing and transformative power of sacred sound." }
        ],
        ancient: "The Mandukya Upanishad says Om is all of this — the entire cosmos. To chant Om is to align oneself with the fundamental vibration of existence. The tradition of 108 repetitions on a mala (prayer beads) maps the mantra practice onto the geometry of the solar system — 108 being the ratio of the sun's diameter to the earth-sun distance."
      },
      howTo: {
        progressions: [
          { level: "Beginner", detail: "Choose a simple mantra (So Hum: 'I am that'; Om). Repeat silently, coordinated with the breath — So on the inhale, Hum on the exhale. 10 minutes." },
          { level: "Intermediate", detail: "Use a mala (108 beads). One repetition per bead. Complete one full round (108 repetitions) daily. 20 minutes." },
          { level: "Advanced", detail: "Build to three rounds (324 repetitions) with a mantra received from a teacher. Allow the mantra to continue spontaneously in the background of daily life." }
        ],
        tips: [
          "Choose your mantra with intention — if possible, receive it from a teacher in your tradition.",
          "The mantra should be slightly beyond audible — a whisper of sound, or purely mental.",
          "Don't try to stop thoughts — when you notice you have wandered, return to the mantra.",
          "Consistency over months is what produces depth. Daily practice, however short, is more powerful than long irregular sessions."
        ]
      },
      science: {
        physiology: "Mantra repetition at typical rates (one repetition per ~6 seconds with a two-syllable mantra coordinated with breath) produces slow, even breathing at approximately 6 breaths per minute — the resonant frequency. This may be why mantra practice produces HRV coherence.",
        neuroscience: "Newberg et al. (2015) — neuroimaging of chanting showed significant activity changes in the prefrontal cortex (attention regulation) and parietal lobe (self-other boundary), correlating with reported transcendent experiences. Mantra repetition also suppresses the default mode network.",
        research: [
          "Newberg et al. (2015) — brain imaging during chanting: attention and self-other boundary effects.",
          "Bernardi et al. (2001) — mantra recitation at 6 breaths/min produces HRV coherence identical to resonant breathing.",
          "Kalyani et al. (2011) — neural correlates of Om chanting."
        ],
        tags: ["Mantra", "Japa", "Vedic", "Sound", "Concentration"]
      },
      learn: {},
      related: {
        people: ["Paramahansa Yogananda", "Russill Paul"],
        books: ["The Yoga of Sound", "Autobiography of a Yogi", "Science of Breath"],
        techniques: ["soundscape-meditation", "bhramari", "resonant-breathing"]
      }
    },

    'gap-watching': {
      overview: {
        what: "The practice of resting attention in the space between thoughts — noticing the stillness that is always present before, during, and after mental activity.",
        keyBenefits: [
          "Disrupts the trance of compulsive, habitual thinking.",
          "Reveals the dimension of presence that underlies thought.",
          "Provides direct access to what Eckhart Tolle calls the Now.",
          "Requires no special technique — only alert, open attention."
        ],
        whenToUse: [
          "When thinking has become compulsive or distressing.",
          "As a short practice (5 minutes) at any time of day.",
          "While waiting — in queues, before appointments.",
          "As the foundation of Tolle's wakefulness teachings."
        ],
        whoFor: "Everyone. Particularly powerful for those whose primary struggle is mental over-activity rather than emotional content."
      },
      history: {
        origins: "The observation that gaps between thoughts are available as objects of meditation appears across traditions: Zen (the space between thoughts is Buddha-nature), Dzogchen (rigpa is what remains when thoughts are allowed to dissolve), Advaita Vedanta (the witness is what persists between thoughts).",
        evolution: "Eckhart Tolle's The Power of Now (1997) brought gap-watching to a mass audience in a simplified, non-traditional form. His instruction — 'watch for the next thought and see what happens' — became one of the most widely shared meditation pointers of the 21st century.",
        figures: [
          { name: "Eckhart Tolle", credit: "Brought gap-watching to mainstream awareness through The Power of Now; author of one of the bestselling spiritual books of all time." },
          { name: "Ramana Maharshi", credit: "Taught that the self is what remains in the gap — the awareness that is present between all thoughts." }
        ],
        ancient: "In the Tibetan Dzogchen tradition, the master points the student to the nature of mind precisely through gaps in thought. The term 'pointing-out instruction' describes this direct introduction to the open awareness that becomes visible when the discursive mind momentarily stops."
      },
      howTo: {
        progressions: [
          { level: "Beginner", detail: "Close the eyes and ask: what will my next thought be? Wait. Notice the gap before thought arises. Rest there for as long as it lasts." },
          { level: "Intermediate", detail: "Maintain alert, background awareness of gaps throughout the day — in conversations, while walking, while eating. The gaps are always there." },
          { level: "Advanced", detail: "As gaps lengthen, investigate what is present in them. Not nothing — but an alive, aware emptiness. Rest there without conceptualising." }
        ],
        tips: [
          "Don't try to extend the gap — that effort collapses it.",
          "The gap is noticed, not created.",
          "Even a fraction of a second of gap-awareness is transformative.",
          "The quality of alert, open waiting is itself the practice."
        ]
      },
      science: {
        physiology: "Gap-watching engages the default mode network suppression circuitry — specifically, deactivating the narrative self-referential processing that drives habitual thinking. This is similar to the 'open monitoring' state studied in advanced meditators.",
        neuroscience: "EEG studies of advanced meditators in open-awareness states show suppression of the default mode network (associated with self-referential thought) and increased activity in the present-moment attentional network. Gap-watching is an informal version of this state.",
        research: [
          "Tolle, E. (1997) — The Power of Now: phenomenological account of gap practice.",
          "Brewer et al. (2011) — default mode network suppression in experienced meditators.",
          "Dzogchen literature — traditional accounts of the pointing-out instruction and rigpa."
        ],
        tags: ["Present moment", "Tolle", "Gaps", "Stillness", "Awareness"]
      },
      learn: {},
      related: {
        people: ["Eckhart Tolle", "Ramana Maharshi"],
        books: ["The Power of Now", "Be As You Are"],
        techniques: ["self-inquiry", "void-meditation", "open-awareness"]
      }
    },

    'self-inquiry': {
      overview: {
        what: "The direct investigation of the nature of the self through the question 'Who am I?' — turning attention back on its own source rather than toward objects of experience.",
        keyBenefits: [
          "Direct path to the recognition of awareness as the fundamental nature of experience.",
          "Dissolves the sense of a separate, bounded self through persistent inquiry.",
          "Ramana Maharshi's most direct and powerful teaching — offered as the shortest path.",
          "Produces the deepest equanimity when practised consistently."
        ],
        whenToUse: [
          "In dedicated formal sitting periods.",
          "As the inquiry that underlies all other meditation: who is meditating?",
          "When mental activity is quiet enough to turn attention inward.",
          "As Ramana advised — whenever you feel disturbed, ask who is disturbed."
        ],
        whoFor: "Advanced meditators primarily, though Ramana taught it to all. Best approached with a foundation in basic meditation. Teacher guidance is strongly recommended."
      },
      history: {
        origins: "Self-Inquiry (Atma Vichara in Sanskrit) is the central teaching of Ramana Maharshi (1879–1950), the Indian sage of Arunachala. His method emerged from his own spontaneous self-enquiry at age 16, which culminated in direct liberation. He spent 54 years at Arunachala, teaching whoever came through this question alone.",
        evolution: "Ramana's teaching was made accessible to Western audiences through the work of Arthur Osborne, David Godman, and Papaji (H.W.L. Poonja). The inquiry method has influenced both academic philosophy of consciousness and practitioner-focused paths including Advaita Vedanta and Neo-Advaita teaching.",
        figures: [
          { name: "Ramana Maharshi", credit: "Discoverer and primary teacher of Atma Vichara as a direct path to Self-realisation." }
        ],
        ancient: "The question 'Who am I?' has antecedents in the Upanishads' inquiry into the nature of the Atman. The Mandukya Upanishad's inquiry into the witness of the three states of consciousness is a philosophical precursor. Ramana distilled this into a single, practical, non-philosophical pointer."
      },
      howTo: {
        progressions: [
          { level: "Beginner", detail: "Ask 'who is aware?' or 'who am I?' and notice the 'I' that seems to be the observer. This is the starting point — keep returning to it." },
          { level: "Intermediate", detail: "When thoughts arise, ask 'to whom does this thought arise?' The answer is always 'to me.' Then ask 'who is this I?' — and turn attention toward its source." },
          { level: "Advanced", detail: "Abide in the source of the I. When the sense of inquiry disappears and only awareness remains, the inquiry has succeeded. This is Sahaja Samadhi." }
        ],
        tips: [
          "The inquiry is not a mental question looking for a mental answer — it is a turning of attention.",
          "The sense of 'I' that seems to be the thinker is itself an object of awareness — notice this.",
          "Ramana said: if you cannot do Self-Inquiry, surrender to God — both paths lead to the same place.",
          "Patience — the inquiry may feel mechanical at first. The practice deepens through repetition over months and years."
        ]
      },
      science: {
        physiology: "Long-term practitioners of non-dual awareness practices show distinct neurological signatures — reduced default mode network activity, enlarged corpus callosum, and thickened interoceptive cortex. The inquiry practice appears to retrain the brain's self-referential circuitry.",
        neuroscience: "Functional MRI studies of experienced Advaita meditators show reduced activity in the medial prefrontal cortex (self-narrative) and posterior cingulate cortex (self-referential processing) — consistent with the dissolution of the conceptual self that inquiry targets.",
        research: [
          "Ramana Maharshi's collected works — phenomenological accounts from thousands of devotees.",
          "Godman, D. (1985) — Be As You Are: the most systematic account of Ramana's teaching method.",
          "Faber, R. (2013) — academic philosophy of consciousness: Self-Inquiry and the problem of the witness."
        ],
        tags: ["Self-inquiry", "Non-dual", "Advaita", "Liberation", "Advanced"]
      },
      learn: {},
      related: {
        people: ["Ramana Maharshi"],
        books: ["Be As You Are", "The Power of Now"],
        techniques: ["gap-watching", "void-meditation", "open-awareness"]
      }
    },

    'chakra-visualization': {
      overview: {
        what: "A systematic meditation that moves awareness through the seven chakra energy centres of the subtle body, using colour, imagery, and breath to activate and balance each one.",
        keyBenefits: [
          "Deepens interoceptive awareness through systematic internal imagery.",
          "Bridges the ancient yogic map of the subtle body with modern somatic experience.",
          "Balances and energises the pranic body through directed attention.",
          "Integrates the traditions of pranayama, visualisation, and meditation."
        ],
        whenToUse: [
          "As a weekly deep practice for pranic balancing.",
          "When energy feels stuck, depleted, or uneven.",
          "As preparation for more advanced pranayama or meditation.",
          "As a complement to yoga asana practice."
        ],
        whoFor: "Intermediate meditators comfortable with visualisation. No contraindications, though those with very active imaginations may find the practice deeply engaging."
      },
      history: {
        origins: "The chakra system is described in early tantric texts of the Shaivite tradition, particularly the Sat-Cakra-Nirupana (16th century). The seven major chakras — from muladhara (root) to sahasrara (crown) — represent levels of consciousness corresponding to aspects of the physical, emotional, and spiritual body.",
        evolution: "The chakra system was brought to Western audiences primarily through Theosophical Society writings (Leadbeater, 1927), and later through B.K.S. Iyengar, Anodea Judith's Eastern Body Western Mind (1996), and the broader New Age movement. Contemporary bodywork and somatic therapy have integrated chakra concepts with Western psychological models.",
        figures: [
          { name: "Anodea Judith", credit: "Author of Eastern Body Western Mind — the most thorough integration of the chakra system with Western psychology." },
          { name: "B.K.S. Iyengar", credit: "Described chakra anatomy in relation to yoga asana and pranayama practice in Light on Pranayama." }
        ],
        ancient: "The Sat-Cakra-Nirupana describes each chakra with precise colour, number of petals, presiding deity, and associated element — a precise phenomenological map developed through centuries of inner exploration. Kundalini yoga uses chakra visualisation as the central practice for awakening the dormant spiritual energy."
      },
      howTo: {
        progressions: [
          { level: "Beginner", detail: "Work with one chakra per session. Start with the heart (Anahata) — green, four-petalled lotus. Breathe into it for 10 minutes." },
          { level: "Intermediate", detail: "Move through all seven in sequence, spending 2–3 minutes at each. Begin at the root, ascend to the crown." },
          { level: "Advanced", detail: "After ascending to the crown, descend back to the root in reverse — completing a full circuit of the sushumna channel. Add pranayama coordination." }
        ],
        tips: [
          "Colour is the most accessible entry point — start with the associations and let experience confirm or correct them.",
          "The physical location in the body is a pointer, not a precise anatomy — direct your breath and attention to the approximate area.",
          "Don't strain for vividness. The intention to attend to each centre is sufficient.",
          "Keep a journal — chakra work often surfaces emotional material that benefits from integration."
        ]
      },
      science: {
        physiology: "Visualising specific body areas activates neural maps of those areas in the somatosensory cortex. Focused attention to the abdomen, chest, and throat activates interoceptive circuits and produces relaxation responses in those areas.",
        neuroscience: "The overlapping territory between chakra centres and major nerve plexuses (root/sacral = pelvic plexus; solar plexus = celiac ganglion; heart = cardiac plexus; throat = pharyngeal plexus) suggests the ancient map may track anatomically relevant areas of autonomic nerve concentration.",
        research: [
          "Judith, A. (1996) — Eastern Body Western Mind: systematic integration of chakra map with psychology.",
          "Khalsa, S.B. (2004) — yoga and the nervous system: emerging evidence.",
          "Interoception research — neural mapping of body awareness centres."
        ],
        tags: ["Chakra", "Subtle body", "Yogic", "Energy", "Visualisation"]
      },
      learn: {},
      related: {
        people: ["Anodea Judith", "B.K.S. Iyengar", "Paramahansa Yogananda"],
        books: ["Eastern Body Western Mind", "Light on Pranayama", "Science of Breath"],
        techniques: ["visualization", "mantra-japa", "yoga-nidra"]
      }
    },

    'void-meditation': {
      overview: {
        what: "Resting as the open, empty awareness that is the ground of all experience — the direct realisation of shunyata (emptiness) as taught in Mahayana Buddhism and other non-dual traditions.",
        keyBenefits: [
          "Non-conceptual direct experience of the empty, luminous nature of awareness.",
          "Dissolves the illusion of a fixed, solid, separate self.",
          "The most radical and direct path available in the Buddhist contemplative canon.",
          "Profound peace arising from the cessation of grasping at experience."
        ],
        whenToUse: [
          "After a solid foundation in concentration and open-awareness practice.",
          "In extended retreat conditions with a qualified teacher.",
          "As the final phase of a comprehensive sitting practice.",
          "When conceptual inquiry (self-inquiry) has become ripe for a direct leap."
        ],
        whoFor: "Advanced meditators with substantial experience in concentration and mindfulness. Teacher guidance from a qualified non-dual tradition is essential."
      },
      history: {
        origins: "Shunyata (emptiness) is the central philosophical concept of the Prajnaparamita literature — the Perfection of Wisdom texts — of which the Heart Sutra is the most compact expression. Nagarjuna's Madhyamaka philosophy (2nd century CE) provided the systematic philosophical basis.",
        evolution: "The Tibetan Dzogchen and Mahamudra traditions developed the most direct experiential methods for recognising the open, empty nature of mind. Zen's koan practice produces similar states through paradoxical inquiry. Modern teachers — including Adyashanti, Rupert Spira, and Francis Lucille — offer non-traditional pointers to emptiness.",
        figures: [
          { name: "Thich Nhat Hanh", credit: "Wrote extensively on shunyata; The Heart Sutra is his commentary on emptiness as an everyday reality." },
          { name: "Ramana Maharshi", credit: "The source of the 'I' that self-inquiry reveals is void — the emptiness that is pure awareness." }
        ],
        ancient: "The Heart Sutra says: 'Form is emptiness, emptiness is form.' This is not nihilism — it is the recognition that phenomena arise in and as openness, without independent existence. Nagarjuna's Madhyamaka establishes that emptiness itself is empty — which avoids the trap of reifying the void."
      },
      howTo: {
        progressions: [
          { level: "Preliminary", detail: "Establish deep concentration (samatha) and clear insight into impermanence (vipassana). Void practice without this foundation is unstable." },
          { level: "Intermediate", detail: "From open-awareness meditation, relax all sense of boundary between awareness and its contents. Notice: is there a container? Is there anything inside it?" },
          { level: "Advanced", detail: "Rest as the empty, luminous openness that remains when all objects of experience are allowed to dissolve. Do not try to describe it. Do not grasp at it. Rest." }
        ],
        tips: [
          "The void is not nothing — it is a knowing emptiness. The difference is crucial.",
          "Any experience of 'entering the void' is an experience — and therefore not the void itself.",
          "Work with a teacher who has directly realised this — transmission matters here.",
          "Integration: the void is not separate from ordinary life. Everything is the void, displaying itself as form."
        ]
      },
      science: {
        physiology: "EEG studies of advanced meditators in non-dual awareness states show dramatic reduction in default mode network activity and a shift to global, coherent, high-amplitude neural oscillations not typically observed in waking consciousness.",
        neuroscience: "Zoran Josipovic (2014) identified a distinct neural signature of non-dual awareness — both the default mode network and the task-positive network become simultaneously active, suggesting a dissolution of the usual antagonism between the two. This may be the neural correlate of the end of subject-object division.",
        research: [
          "Josipovic (2014) — neural correlates of non-dual awareness.",
          "Thich Nhat Hanh (1988) — The Heart Sutra: phenomenological commentary.",
          "Dzogchen literature — traditional accounts of rigpa, the natural state."
        ],
        tags: ["Emptiness", "Shunyata", "Non-dual", "Mahayana", "Liberation"]
      },
      learn: {},
      related: {
        people: ["Thich Nhat Hanh", "Ramana Maharshi"],
        books: ["The Heart Sutra", "Be As You Are", "The Power of Now"],
        techniques: ["self-inquiry", "gap-watching", "open-awareness"]
      }
    }
  };
