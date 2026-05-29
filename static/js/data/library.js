
  // Theme tags used by the filter pills + applied per LIBRARY item
  const LIBRARY_THEMES = [
    "Anxiety & Stress",
    "Sleep",
    "Focus & Performance",
    "Spirituality & Consciousness",
    "Science & Research",
    "Ancient Traditions",
    "Cold Exposure",
    "Beginners"
  ];

  const LIBRARY = {
    books: [
      {
        title: "Breath: The New Science of a Lost Art",
        author: "James Nestor",
        year: 2020,
        summary: "Modern breathing science as narrative — nasal breathing, CO₂ tolerance, Buteyko, and the historical detectives of breath.",
        cover: { hue: "teal", icon: "🌬️" },
        themes: ["Science & Research", "Beginners", "Ancient Traditions"],
        whyMatters: "Nestor took what could have been a niche science book and made it a global conversation. By combining personal experimentation (the Stanford nose-plugging study) with detective-style historical research, he showed that the way most modern humans breathe is making us sicker — and that the fix is simple, ancient, and free.",
        keyThemes: ["Nasal vs mouth breathing", "CO₂ tolerance", "The Buteyko Method", "Sleep apnea and dental arch development", "Lost wisdom of pranayama"],
        chapters: [
          "The Worst Breathers in the Animal Kingdom",
          "Mouth-Breathing",
          "Nose",
          "Exhale",
          "Slow",
          "Less",
          "Chew",
          "More, on Occasion",
          "Hold It",
          "Fast, Slow, and Not at All"
        ],
        amazonUrl: "https://amzn.to/4frIxOz",
        buyOptions: [
          { label: "Buy on Amazon — £8.00", url: "https://amzn.to/4frIxOz", includes: null },
          { label: "2-Book Bundle with Deep — £21.99", url: "https://amzn.to/4uQZsip", includes: "Breath, Deep" },
          { label: "4-Book Gift Set — £42.99", url: "https://amzn.to/4fIHQQI", includes: "Breath, Just Breathe, The Oxygen Advantage, What Doesn't Kill Us" }
        ]
      },
      {
        title: "The Oxygen Advantage",
        author: "Patrick McKeown",
        year: 2015,
        summary: "Buteyko principles applied to athletic performance, with the BOLT test and nasal breathing science.",
        cover: { hue: "sky", icon: "💨" },
        themes: ["Focus & Performance", "Science & Research", "Anxiety & Stress"],
        whyMatters: "McKeown made Buteyko comprehensible to athletes and ordinary people. The BOLT test (a simple breath-hold measure) gives anyone a quantifiable baseline for breathing health — and the protocols deliver measurable results in weeks, not years. The book turned 'breathing well' from an abstract idea into a trainable skill.",
        keyThemes: ["BOLT score", "Nasal breathing for sport", "Bohr effect and oxygen delivery", "Altitude simulation training", "Mouth taping for sleep"],
        chapters: [
          "The Secret of Breath",
          "The BOLT Score",
          "Functional Breathing",
          "Slim, Trim and Toned",
          "Reduce Breathlessness During Exercise",
          "Simulate High-Altitude Training",
          "Bring Your Best Game",
          "Increase Oxygen, Improve Recovery"
        ],
        amazonUrl: "https://amzn.to/4dHdL1l",
        buyOptions: [
          { label: "Buy on Amazon — £8.00", url: "https://amzn.to/4dHdL1l", includes: null },
          { label: "2-Book Bundle with Just Breathe — £16.99", url: "https://amzn.to/4f4gxAf", includes: "The Oxygen Advantage, Just Breathe" },
          { label: "4-Book Gift Set — £42.99", url: "https://amzn.to/4fIHQQI", includes: "Breath, Just Breathe, The Oxygen Advantage, What Doesn't Kill Us" }
        ]
      },
      {
        title: "Light on Pranayama",
        author: "B.K.S. Iyengar",
        year: 1981,
        summary: "The definitive yogic text on pranayama from the most influential 20th-century yoga master.",
        cover: { hue: "gold", icon: "🪔" },
        themes: ["Ancient Traditions", "Spirituality & Consciousness"],
        whyMatters: "Iyengar wrote the technical bible of pranayama. Every modern teacher of yogic breathing references this book — directly or indirectly. He bridges the inner experience of breath with rigorous instruction: which bandhas, which counts, what to feel, when to stop. Without this book, much of the precision in modern pranayama would have been lost.",
        keyThemes: ["The eight limbs of yoga", "Kumbhaka (retention)", "Bandhas and mudras", "Detailed ratio breathing", "Pranayama as preparation for meditation"],
        chapters: [
          "What is Pranayama",
          "Prana and Pranayama",
          "Pranayama and the Yogi",
          "Hints and Cautions",
          "The Art of Sitting in Pranayama",
          "Bandha and Kriya",
          "Ujjayi Pranayama",
          "Surya Bhedana and Chandra Bhedana",
          "Nadi Shodhana Pranayama",
          "Bhastrika and Kapalabhati"
        ],
        amazonUrl: "https://amzn.to/4nNjSWy"
      },
      {
        title: "Science of Breath",
        author: "Swami Rama, Rudolph Ballentine, Alan Hymes",
        year: 1979,
        summary: "Rigorous yogic-scientific account of pranayama, anatomy, and prana theory from the Himalayan Institute.",
        cover: { hue: "violet", icon: "🕉️" },
        themes: ["Ancient Traditions", "Science & Research", "Spirituality & Consciousness"],
        whyMatters: "One of the earliest serious attempts to translate yogic breath practice into the language of Western respiratory physiology. Written by a yogi who could voluntarily stop his heart in a Menninger Foundation lab plus two medical doctors, it set the template for every later 'science of yoga' book.",
        keyThemes: ["Yogic anatomy of breath", "Diaphragmatic breathing", "Prana and the autonomic nervous system", "Nadi system and physiology", "Cleansing kriyas"],
        chapters: [
          "Breath: The Pulse of Life",
          "The Anatomy of Breathing",
          "Diaphragmatic Breathing",
          "Nasal Breathing and Functional Asymmetry",
          "Prana and the Nadis",
          "Pranayama: The Yoga of Breath",
          "Breath, Mind, and Meditation"
        ],
        amazonUrl: "https://amzn.to/4wSGrgJ"
      },
      {
        title: "The Healing Power of the Breath",
        author: "Richard Brown & Patricia Gerbarg",
        year: 2012,
        summary: "Clinical research on coherent breathing and Sudarshan Kriya for anxiety, depression, and PTSD.",
        cover: { hue: "emerald", icon: "🌿" },
        themes: ["Anxiety & Stress", "Science & Research", "Beginners"],
        whyMatters: "Two clinical psychiatrists made breathwork legible to mainstream medicine. They studied Sudarshan Kriya in survivors of major trauma — Rwandan genocide, Bosnian war, 9/11 — and showed measurable, lasting symptom reduction. The 'coherent breathing' protocol (5–6 breaths per minute) is the book's distilled prescription.",
        keyThemes: ["Coherent breathing (~6 breaths/min)", "Sudarshan Kriya", "Vagal tone", "Trauma recovery", "Clinical protocols"],
        chapters: [
          "How We Breathe",
          "Coherent Breathing",
          "Resistance Breathing",
          "Breath Moving",
          "Breath in Mind-Body Practice",
          "Breathing for Anxiety and Depression",
          "Breathing for Trauma and PTSD",
          "Breathing for Heart and Body"
        ],
        amazonUrl: "https://amzn.to/4uEoXmW"
      },
      {
        title: "Just Breathe",
        author: "Dan Brulé",
        year: 2017,
        summary: "A comprehensive, experiential introduction to conscious breathing from a leading breathwork teacher.",
        cover: { hue: "rose", icon: "💗" },
        themes: ["Beginners", "Spirituality & Consciousness", "Anxiety & Stress"],
        whyMatters: "Brulé has been teaching breathwork since the 1970s — to Navy SEALs, executives, monks, and ordinary people. This book is his catalogue: a usable reference of practices across traditions, organised by goal. Tony Robbins calls him 'the world's foremost breath teacher,' and the book lives up to it — practical, broad, and field-tested.",
        keyThemes: ["Breath awareness as practice", "Spiritual breathing", "Performance breathing", "Healing breathwork", "Daily practice design"],
        chapters: [
          "Breathing for Spirit",
          "Breathing for Body",
          "Breathing for Mind",
          "Breathing for Performance",
          "Breathing for Healing",
          "Breath Mastery in Daily Life",
          "Designing Your Own Practice"
        ],
        amazonUrl: "https://amzn.to/4wVRhmk",
        buyOptions: [
          { label: "Buy on Amazon — £8.33", url: "https://amzn.to/4wVRhmk", includes: null },
          { label: "2-Book Bundle with The Oxygen Advantage — £16.99", url: "https://amzn.to/4f4gxAf", includes: "Just Breathe, The Oxygen Advantage" },
          { label: "4-Book Gift Set — £42.99", url: "https://amzn.to/4fIHQQI", includes: "Breath, Just Breathe, The Oxygen Advantage, What Doesn't Kill Us" }
        ]
      },
      {
        title: "The Wim Hof Method",
        author: "Wim Hof",
        year: 2020,
        summary: "A personal account of the method, the life, the vision, and the complete protocol.",
        cover: { hue: "sky", icon: "❄️" },
        themes: ["Cold Exposure", "Science & Research", "Focus & Performance"],
        whyMatters: "Wim Hof's own telling of how the method emerged from personal tragedy and immersion in cold. The book reveals the philosophy behind the breathing protocol — not just the technique. It includes the full instructions, the science (with extensive references to the Radboud studies), and the case for voluntary control of the autonomic nervous system.",
        keyThemes: ["Cold exposure", "Voluntary immune modulation", "Tummo lineage", "The complete 3-pillar method", "Mental resilience"],
        chapters: [
          "The Iceman",
          "Cold",
          "Breath",
          "Mindset",
          "Discovering the Method",
          "The Science",
          "The Practice",
          "A Way of Life"
        ],
        amazonUrl: "https://amzn.to/49q4Ksh"
      },
      {
        title: "Autobiography of a Yogi",
        author: "Paramahansa Yogananda",
        year: 1946,
        summary: "Foundational yoga and pranayama text bridging Eastern inner science with Western consciousness.",
        cover: { hue: "gold", icon: "🙏" },
        themes: ["Ancient Traditions", "Spirituality & Consciousness"],
        whyMatters: "The book that brought yoga to permanent Western residence. Yogananda is the first Indian master to live and die in America, and his Autobiography — one of the most-read spiritual books ever — introduced millions to pranayama, meditation, and the yogic understanding of breath as the bridge between body and consciousness. Steve Jobs gave it to every attendee at his memorial.",
        keyThemes: ["Kriya Yoga", "Pranayama as spiritual practice", "Direct experience of consciousness", "Eastern mystic biographies", "Self-realisation"],
        chapters: [
          "My Parents and Early Life",
          "Mother's Death and the Amulet",
          "The Saint with Two Bodies",
          "My Interrupted Flight Toward the Himalaya",
          "A Master at the Holy Ground",
          "Years in My Master's Hermitage",
          "Kriya Yoga: The Yoga Science",
          "An Experience in Cosmic Consciousness"
        ],
        amazonUrl: "https://amzn.to/42Z35GB",
        buyOptions: [
          { label: "Paperback — £8.99", url: "https://amzn.to/42Z35GB", includes: null },
          { label: "Hardback — £11.99", url: "https://amzn.to/4dG8tTW", includes: null },
          { label: "Deluxe Hardbound Edition — £13.99", url: "https://amzn.to/4dxiiVn", includes: null }
        ]
      },
      {
        title: "Why Zebras Don't Get Ulcers",
        author: "Robert Sapolsky",
        year: 1994,
        summary: "The definitive popular explanation of chronic stress and its effects on body and brain.",
        cover: { hue: "amber", icon: "🦓" },
        themes: ["Anxiety & Stress", "Science & Research", "Beginners"],
        whyMatters: "Sapolsky — Stanford neuroendocrinologist — explains why a zebra escapes the lion and returns to grazing while humans worry themselves into ulcers. The book made stress physiology comprehensible to everyone and is the conceptual backdrop for why breathwork matters: chronic sympathetic activation is the problem, parasympathetic shift is the lever.",
        keyThemes: ["Acute vs chronic stress", "Glucocorticoids and the HPA axis", "Stress and immunity", "Stress and depression", "Coping and resilience"],
        chapters: [
          "Why Don't Zebras Get Ulcers?",
          "Glands, Gushes, and Hormones",
          "Stroke, Heart Attacks, and Voodoo Death",
          "Stress, Metabolism, and Liquidating Your Assets",
          "Ulcers, the Runs, and Hot Fudge Sundaes",
          "Dwarfism and the Importance of Mothers",
          "Sex and Reproduction",
          "Immunity, Stress, and Disease",
          "Pain",
          "Stress and Memory",
          "Stress and a Good Night's Sleep",
          "Aging and Death",
          "Why Is Psychological Stress Stressful?",
          "Stress and Depression",
          "Personality, Temperament, and Stress",
          "Junkies, Adrenaline Junkies, and Pleasure",
          "The View From the Bottom",
          "Managing Stress"
        ],
        amazonUrl: "https://amzn.to/4dGaZti"
      },
      {
        title: "The Miracle of Mindfulness",
        author: "Thich Nhat Hanh",
        year: 1975,
        summary: "A gentle Zen introduction to mindfulness of breath, written as a letter to a colleague.",
        cover: { hue: "emerald", icon: "🍃" },
        themes: ["Beginners", "Spirituality & Consciousness", "Ancient Traditions"],
        whyMatters: "Originally written as a long letter to a fellow Vietnamese activist during the war, this short book became the gentlest possible introduction to mindfulness of breath. Thich Nhat Hanh's prose is so simple and warm that mindfulness becomes a domestic art — washing dishes, walking, smiling — not a foreign discipline.",
        keyThemes: ["Mindfulness of breath", "Walking meditation", "Engaged Buddhism", "Mindful daily activity", "The miracle of being present"],
        chapters: [
          "The Essential Discipline",
          "The Miracle is to Walk on Earth",
          "A Day of Mindfulness",
          "The Pebble",
          "One is All, All is One",
          "Selected Passages from Buddhist Sutras",
          "Thirty-Two Exercises of Mindfulness"
        ],
        amazonUrl: "https://amzn.to/4dMFsGk"
      },
      {
        title: "Breath as Prayer",
        author: "Jennifer Tucker",
        year: 2022,
        summary: "The Christian contemplative tradition of breath prayer, connecting Hesychasm to modern breathwork.",
        cover: { hue: "indigo", icon: "✝️" },
        themes: ["Spirituality & Consciousness", "Ancient Traditions", "Anxiety & Stress"],
        whyMatters: "A reminder that breath prayer is not exclusively Eastern. Tucker traces the Christian Hesychast tradition (the 'Jesus Prayer' of the Orthodox monks of Mount Athos), shows its parallels to mantra-with-breath, and offers practical breath-prayer protocols for contemporary Christians and anyone curious about Western contemplative roots.",
        keyThemes: ["Hesychasm", "The Jesus Prayer", "Breath and scripture", "Christian contemplation", "Anxiety as spiritual material"],
        chapters: [
          "Why Pray With the Breath",
          "Roots in the Desert Fathers",
          "Hesychasm and the Jesus Prayer",
          "Breath in Scripture",
          "A Daily Breath-Prayer Practice",
          "Breath Prayer for Anxiety",
          "Breath Prayer for Grief",
          "Living the Practice"
        ],
        amazonUrl: "https://amzn.to/4uDpPIk"
      },
      {
        title: "The Breathing Book",
        author: "Donna Farhi",
        year: 1996,
        summary: "A practical guide to understanding breathing patterns and correcting habitual dysfunction.",
        cover: { hue: "teal", icon: "📘" },
        themes: ["Beginners", "Anxiety & Stress"],
        whyMatters: "Farhi — yoga teacher and somatic educator — wrote the most accessible book on how breathing actually works in the body, and where it goes wrong. The book is full of self-assessment exercises and gentle, body-first remedies. It's where many yoga and breathwork teachers themselves learned the foundations.",
        keyThemes: ["Habitual breathing patterns", "Breath and posture", "Reverse breathing", "Breath assessment", "Somatic correction"],
        chapters: [
          "The Essential Breath",
          "How We Breathe",
          "Breathing Patterns: Six Dysfunctional Habits",
          "Returning to Natural Breathing",
          "Breath, Movement, and Posture",
          "Breath and Emotion",
          "Breath and Meditation"
        ],
        amazonUrl: "https://amzn.to/3PYWA3D"
      },
      {
        title: "Stealing Fire",
        author: "Steven Kotler & Jamie Wheal",
        year: 2017,
        summary: "Investigation of altered states and performance — from SEALs to executives.",
        cover: { hue: "amber", icon: "🔥" },
        themes: ["Focus & Performance", "Spirituality & Consciousness", "Science & Research"],
        whyMatters: "Kotler and Wheal map a 'four-billion-dollar' underground of practices used to access altered states — including extreme breathwork, cold exposure, and ecstatic dance. The book made clear that what Wim Hof, the SEALs, and Silicon Valley executives are doing share neurobiology with what monks and shamans have done for millennia.",
        keyThemes: ["Flow states", "Altered states for performance", "Ecstatic technologies", "STER framework (Selflessness, Timelessness, Effortlessness, Richness)", "The non-ordinary"],
        chapters: [
          "The Case for Ecstasis",
          "Why It Matters",
          "Psychology",
          "Neurobiology",
          "Pharmacology",
          "Technology",
          "Catch a Fire",
          "The Pinnacle"
        ],
        amazonUrl: "https://amzn.to/4dtfKYo"
      },
      {
        title: "The Biology of Belief",
        author: "Bruce Lipton",
        year: 2005,
        summary: "How environment and mind regulate gene expression — cell biology meets consciousness.",
        cover: { hue: "violet", icon: "🧬" },
        themes: ["Science & Research", "Spirituality & Consciousness"],
        whyMatters: "Lipton — a former cell biology professor — argues that gene expression is regulated by signals from the cellular environment, including the biochemistry of belief and emotional state. Controversial in some scientific quarters, but influential for many breathwork practitioners as a frame for why state-change practices have lasting effects.",
        keyThemes: ["Epigenetics", "Cellular signalling", "Mind–body connection", "Belief as biology", "Neuroplasticity"],
        chapters: [
          "Lessons from the Petri Dish",
          "It's the Environment, Stupid",
          "The Magical Membrane",
          "The New Physics",
          "Biology and Belief",
          "Growth and Protection",
          "Conscious Parenting"
        ],
        amazonUrl: "https://amzn.to/4tSqV1D"
      },
      {
        id: 'deep',
        title: "Deep",
        author: "James Nestor",
        year: 2014,
        cover: { hue: "sky", icon: "🌊" },
        themes: ["Science & Research", "Ancient Traditions", "Focus & Performance"],
        summary: "James Nestor dives into the world of freediving — a discipline that pushes the human body to extraordinary limits. Part adventure narrative, part scientific investigation, Deep explores what happens to the body and mind under extreme pressure, and what freedivers and marine mammals reveal about human potential, consciousness, and our forgotten connection to the ocean.",
        whyMatters: "Nestor shows that breath is not just a daily function but a gateway to altered states, peak performance and a deeper understanding of what the human body is capable of. Deep complements Breath perfectly — together they form a complete picture of Nestor's investigation into human respiratory potential.",
        keyThemes: ["Freediving and breath-hold physiology", "Marine mammals and human evolution", "Altered states through breath", "The limits of human endurance", "Ocean science and consciousness"],
        chapters: ["The Descent", "Spearfishing", "Dolphins", "Whales", "The Deep Frontier"],
        amazonUrl: "https://amzn.to/3RLP4tj",
        buyOptions: [
          { label: "Buy on Amazon — £10.95", url: "https://amzn.to/3RLP4tj", includes: null },
          { label: "2-Book Bundle with Breath — £21.99", url: "https://amzn.to/4uQZsip", includes: "Breath, Deep" }
        ]
      },
      {
        id: 'what-doesnt-kill-us',
        title: "What Doesn't Kill Us",
        author: "Scott Carney",
        year: 2017,
        cover: { hue: "amber", icon: "🧊" },
        themes: ["Science & Research", "Ancient Traditions", "Focus & Performance", "Cold Exposure"],
        summary: "Investigative journalist Scott Carney set out to debunk Wim Hof and ended up training with him in the Polish mountains. What Doesn't Kill Us is the story of how Carney — a sceptic — discovered that the human body has dormant evolutionary abilities that can be unlocked through cold exposure, controlled breathing and deliberate stress. Part memoir, part science, it is one of the most compelling accounts of breathwork in practice.",
        whyMatters: "Carney provides the sceptic's journey into breathwork — rigorous, honest, and ultimately converted. His account of training with Wim Hof bridges the gap between ancient practice and modern science, and gives Triad users the science-backed story behind the Wim Hof technique.",
        keyThemes: ["Wim Hof Method in practice", "Cold exposure science", "Evolutionary biology and breath", "The nervous system and environmental stress", "Breathwork as medicine"],
        chapters: ["The Iceman", "Ascending Kilimanjaro", "The Polish Mountains", "The Science of Cold", "What the Body Remembers"],
        amazonUrl: "https://amzn.to/4u1CSSB",
        buyOptions: [
          { label: "Buy on Amazon — £9.36", url: "https://amzn.to/4u1CSSB", includes: null },
          { label: "4-Book Gift Set — £42.99", url: "https://amzn.to/4fIHQQI", includes: "Breath, Just Breathe, The Oxygen Advantage, What Doesn't Kill Us" }
        ]
      },
      {
        title: "The Power of Now",
        author: "Eckhart Tolle",
        year: 1997,
        summary: "The landmark guide to present-moment awareness and the end of psychological suffering.",
        cover: { hue: "gold", icon: "☀️" },
        themes: ["Spirituality & Consciousness"],
        amazonUrl: ""
      },
      {
        title: "Mindfulness in Plain English",
        author: "Bhante Gunaratana",
        year: 1991,
        summary: "The clearest and most practical guide to vipassana meditation ever written.",
        cover: { hue: "emerald", icon: "🌿" },
        themes: ["Science & Research", "Beginners"],
        amazonUrl: ""
      },
      {
        title: "Full Catastrophe Living",
        author: "Jon Kabat-Zinn",
        year: 1990,
        summary: "The founding text of mindfulness-based stress reduction and its clinical applications.",
        cover: { hue: "teal", icon: "🌊" },
        themes: ["Anxiety & Stress", "Science & Research"],
        amazonUrl: ""
      },
      {
        title: "Loving-Kindness",
        author: "Sharon Salzberg",
        year: 1995,
        summary: "The definitive guide to metta meditation and the revolutionary art of happiness.",
        cover: { hue: "rose", icon: "💗" },
        themes: ["Spirituality & Consciousness"],
        amazonUrl: ""
      },
      {
        title: "Radical Acceptance",
        author: "Tara Brach",
        year: 2003,
        summary: "Embracing your life with the heart of a Buddha. Healing shame and fear through mindfulness.",
        cover: { hue: "violet", icon: "🪷" },
        themes: ["Anxiety & Stress"],
        amazonUrl: ""
      },
      {
        title: "Creative Visualization",
        author: "Shakti Gawain",
        year: 1978,
        summary: "The pioneering guide to using mental imagery to create what you want in life.",
        cover: { hue: "amber", icon: "✨" },
        themes: ["Spirituality & Consciousness"],
        amazonUrl: ""
      },
      {
        title: "The Way of the SEAL",
        author: "Mark Divine",
        year: 2013,
        summary: "Navy SEAL commander Mark Divine's system for developing mental toughness and elite performance.",
        cover: { hue: "sky", icon: "🎯" },
        themes: ["Focus & Performance"],
        amazonUrl: ""
      },
      {
        title: "Yoga Nidra",
        author: "Swami Satyananda Saraswati",
        year: 1976,
        summary: "The original and definitive text on yogic sleep from the Bihar School of Yoga.",
        cover: { hue: "indigo", icon: "🌙" },
        themes: ["Ancient Traditions"],
        amazonUrl: ""
      },
      {
        title: "Hatha Yoga Pradipika",
        author: "Swami Muktibodhananda",
        year: 1985,
        summary: "The classical Sanskrit text on Hatha Yoga, pranayama and the awakening of kundalini.",
        cover: { hue: "gold", icon: "🕉️" },
        themes: ["Ancient Traditions"],
        amazonUrl: ""
      },
      {
        title: "Be As You Are",
        author: "Ramana Maharshi",
        year: 1985,
        summary: "The teachings of Sri Ramana Maharshi on Self-Inquiry and the direct path to liberation.",
        cover: { hue: "amber", icon: "🔆" },
        themes: ["Spirituality & Consciousness"],
        amazonUrl: ""
      },
      {
        title: "Eastern Body Western Mind",
        author: "Anodea Judith",
        year: 1996,
        summary: "Bridging the chakra system with Western psychology and developmental theory.",
        cover: { hue: "violet", icon: "🌈" },
        themes: ["Spirituality & Consciousness"],
        amazonUrl: ""
      },
      {
        title: "The Yoga of Sound",
        author: "Russill Paul",
        year: 2004,
        summary: "The healing and enlightening power of sacred Sanskrit sound and mantra.",
        cover: { hue: "indigo", icon: "🎵" },
        themes: ["Ancient Traditions"],
        amazonUrl: ""
      },
      {
        title: "Holotropic Breathwork",
        author: "Stanislav Grof",
        year: 2010,
        summary: "The theory and practice of Grof's transformative breathwork method.",
        cover: { hue: "violet", icon: "🌀" },
        themes: ["Spirituality & Consciousness", "Science & Research"],
        amazonUrl: ""
      },
      {
        title: "The Breathing Cure",
        author: "Patrick McKeown",
        year: 2021,
        summary: "Develop new habits for a healthier, happier and longer life.",
        cover: { hue: "teal", icon: "💨" },
        themes: ["Science & Research", "Focus & Performance"],
        amazonUrl: ""
      },
      {
        title: "Coherent Breathing",
        author: "Stephen Elliott",
        year: 2005,
        summary: "The definitive guide to breathing at resonant frequency for optimal HRV.",
        cover: { hue: "sky", icon: "💙" },
        themes: ["Science & Research", "Anxiety & Stress"],
        amazonUrl: ""
      },
      {
        title: "Way of the Iceman",
        author: "Wim Hof & Koen de Jong",
        year: 2016,
        summary: "How the Wim Hof Method creates radiant long-term health.",
        cover: { hue: "sky", icon: "❄️" },
        themes: ["Cold Exposure", "Science & Research"],
        amazonUrl: ""
      },
      {
        title: "Breathe to Heal",
        author: "Konstantin Buteyko",
        year: 2014,
        summary: "The Buteyko breathing technique for asthma, anxiety and performance.",
        cover: { hue: "emerald", icon: "🌬️" },
        themes: ["Science & Research", "Anxiety & Stress"],
        amazonUrl: ""
      },
      {
        title: "The Gratitude Diaries",
        author: "Janice Kaplan",
        year: 2015,
        summary: "How a year of gratitude changed everything.",
        cover: { hue: "amber", icon: "📖" },
        themes: ["Spirituality & Consciousness"],
        amazonUrl: ""
      },
      {
        title: "The Heart Sutra",
        author: "Thich Nhat Hanh",
        year: 1988,
        summary: "Thich Nhat Hanh's commentary on the most important text in Mahayana Buddhism.",
        cover: { hue: "emerald", icon: "🪷" },
        themes: ["Ancient Traditions", "Spirituality & Consciousness"],
        amazonUrl: ""
      }
    ],

    people: [
      {
        name: "Wim Hof",
        role: "Breathwork Pioneer",
        bio: "Dutch extremist and 26× Guinness record holder. The Radboud University studies on his method proved voluntary modulation of the innate immune response.",
        whyMatters: "Wim Hof did the unthinkable: he scientifically demonstrated that the autonomic nervous system — long considered beyond conscious control — can be voluntarily modulated. The 2014 Radboud study, in which trained practitioners suppressed inflammatory markers to injected endotoxin, overturned a fundamental assumption of physiology.",
        contributions: [
          "Developed and popularised the Wim Hof Method (breathing, cold, mindset).",
          "Subject of the landmark Kox et al. 2014 PNAS immune-modulation study.",
          "Set 26 Guinness World Records, including a half-marathon barefoot on ice.",
          "Made cold exposure mainstream wellness practice."
        ],
        relatedTechniqueIds: ["wim-hof-method", "kapalabhati"],
        relatedBookTitles: ["The Wim Hof Method", "Stealing Fire", "Breath: The New Science of a Lost Art"],
        themes: ["Cold Exposure", "Science & Research", "Spirituality & Consciousness"],
        photo: { hue: "sky" }
      },
      {
        name: "Andrew Huberman",
        role: "Neuroscientist & Communicator",
        bio: "Stanford professor of neurobiology. Translates research into practical protocols on his Huberman Lab podcast — including landmark work on the physiological sigh.",
        whyMatters: "Huberman has done more than any other scientist to make actionable neuroscience accessible to general audiences. His protocols — the physiological sigh, NSDR, the 90-minute focus cycle — bridge laboratory research and daily practice with rigour and clarity.",
        contributions: [
          "Co-author of the 2023 Balban et al. cyclic-sighing study at Stanford.",
          "Popularised NSDR (Non-Sleep Deep Rest) as a learning and recovery tool.",
          "Brought physiological-sigh research to global mainstream awareness.",
          "Long-form podcast (Huberman Lab) — among the most influential science podcasts in the world."
        ],
        relatedTechniqueIds: ["physiological-sigh", "box-breathing", "wim-hof-method"],
        relatedBookTitles: ["Breath: The New Science of a Lost Art", "Stealing Fire"],
        themes: ["Science & Research", "Focus & Performance", "Sleep"],
        photo: { hue: "teal" }
      },
      {
        name: "Patrick McKeown",
        role: "Buteyko Teacher",
        bio: "Irish breathing instructor who overcame severe asthma through Buteyko. Most influential modern Buteyko teacher; developed the BOLT test.",
        whyMatters: "McKeown took an obscure Soviet method and made it the foundation of modern functional breathing. His BOLT (Body Oxygen Level Test) gave the world a simple, quantifiable way to measure breathing health — and his protocols deliver measurable change for asthma, anxiety, and athletic performance.",
        contributions: [
          "Developed the BOLT test for breathing health measurement.",
          "Wrote The Oxygen Advantage — the modern Buteyko-for-athletes manual.",
          "Trains thousands of breath coaches worldwide via the Oxygen Advantage program.",
          "Bridged Buteyko, sports science, and pranayama into one coherent system."
        ],
        relatedTechniqueIds: ["buteyko-method", "nadi-shodhana", "bhramari"],
        relatedBookTitles: ["The Oxygen Advantage", "Breath: The New Science of a Lost Art", "The Breathing Book"],
        themes: ["Anxiety & Stress", "Focus & Performance", "Science & Research"],
        photo: { hue: "emerald" }
      },
      {
        name: "Dr. Stephen Porges",
        role: "Polyvagal Theory",
        bio: "Distinguished scientist at the Kinsey Institute. His Polyvagal Theory reframed our understanding of trauma and the nervous system.",
        whyMatters: "Porges gave the field a unifying nervous-system framework. Polyvagal Theory — the hierarchy of social-engagement, sympathetic-mobilisation, and dorsal-vagal-shutdown — explains why breath, voice, and face-to-face contact heal trauma. Every modern trauma-informed breathwork teacher draws on his work.",
        contributions: [
          "Developer of Polyvagal Theory (1994 onward).",
          "Identified the role of the myelinated vagus in social engagement.",
          "Foundational influence on somatic and trauma-informed therapy.",
          "Hundreds of peer-reviewed papers on autonomic regulation."
        ],
        relatedTechniqueIds: ["physiological-sigh", "bhramari", "box-breathing"],
        relatedBookTitles: ["Why Zebras Don't Get Ulcers", "The Healing Power of the Breath"],
        themes: ["Science & Research", "Anxiety & Stress"],
        photo: { hue: "indigo" }
      },
      {
        name: "Paramahansa Yogananda",
        role: "Yoga Master (1893–1952)",
        bio: "The first Indian yoga master in permanent Western residence. Founder of the Self-Realization Fellowship; his Autobiography remains one of the most-read spiritual books in history.",
        whyMatters: "Yogananda introduced Kriya Yoga — and with it pranayama as spiritual practice — to the West. His Autobiography of a Yogi has influenced everyone from Aldous Huxley to Steve Jobs. Without Yogananda, most modern Western yoga and breathwork lineages would look very different.",
        contributions: [
          "Founded the Self-Realization Fellowship (1920) — still active globally today.",
          "Wrote Autobiography of a Yogi (1946), one of the bestselling spiritual books of all time.",
          "Brought Kriya Yoga and pranayama to permanent Western residence.",
          "Demonstrated yogic states (including voluntary breath suspension) in controlled settings."
        ],
        relatedTechniqueIds: ["kumbhaka", "ujjayi", "nadi-shodhana", "kapalabhati"],
        relatedBookTitles: ["Autobiography of a Yogi", "Light on Pranayama", "Science of Breath"],
        themes: ["Ancient Traditions", "Spirituality & Consciousness"],
        photo: { hue: "gold" }
      },
      {
        name: "Stanislav Grof",
        role: "Transpersonal Psychiatrist",
        bio: "Czech psychiatrist (b. 1931). Developed Holotropic Breathwork as an LSD alternative after the substance was outlawed — documented profound healing and transpersonal states.",
        whyMatters: "When the US criminalised LSD in 1970, Grof — who had run one of the world's most rigorous LSD-therapy programs — refused to abandon the territory. He developed Holotropic Breathwork: an accelerated breathing protocol that produces non-ordinary states without pharmacology. Decades of session notes document healing, perinatal recall, and transpersonal experience.",
        contributions: [
          "Co-developed Holotropic Breathwork (with Christina Grof, 1970s).",
          "Mapped the perinatal matrices and transpersonal levels of consciousness.",
          "Author of foundational psychedelic-therapy literature.",
          "Founded the Grof Transpersonal Training network."
        ],
        relatedTechniqueIds: ["wim-hof-method", "kapalabhati"],
        relatedBookTitles: ["Stealing Fire", "The Biology of Belief"],
        themes: ["Spirituality & Consciousness", "Science & Research"],
        photo: { hue: "violet" }
      },
      {
        name: "Konstantin Buteyko",
        role: "Soviet Physician",
        bio: "Ukrainian-born physician who discovered that chronic over-breathing harms health. Developed the CO₂ tolerance method — largely suppressed in his lifetime; legacy carried forward by McKeown.",
        whyMatters: "Buteyko inverted Western medicine's assumption that 'more oxygen is better.' By observing that the sickest hospital patients were the heaviest breathers, he discovered that chronic hyperventilation reduces tissue oxygenation (via the Bohr effect) and that gentle nasal under-breathing restores it. The insight is foundational to modern functional breathing.",
        contributions: [
          "Developed the Buteyko Method (1952).",
          "Identified chronic over-breathing as 'the deep breathing disease.'",
          "Demonstrated reductions in asthma medication use — confirmed by later RCTs.",
          "Established CO₂ tolerance as a clinical breathing marker."
        ],
        relatedTechniqueIds: ["buteyko-method", "nadi-shodhana"],
        relatedBookTitles: ["The Oxygen Advantage", "Breath: The New Science of a Lost Art"],
        themes: ["Anxiety & Stress", "Science & Research"],
        photo: { hue: "amber" }
      },
      {
        name: "Dr. Andrew Weil",
        role: "Integrative Medicine",
        bio: "Harvard-educated physician and founder of the Arizona Center for Integrative Medicine. Introduced 4-7-8 breathing to Western audiences.",
        whyMatters: "Weil was among the first credentialled Western physicians to take breathwork seriously as clinical practice. He adapted classical yogic ratio breathing into the simple, memorable 4-7-8 protocol and made it part of mainstream integrative medicine.",
        contributions: [
          "Adapted and popularised the 4-7-8 breathing technique.",
          "Founded the Arizona Center for Integrative Medicine (1994).",
          "Author of Spontaneous Healing and Eight Weeks to Optimum Health.",
          "Trained thousands of physicians in integrative practice."
        ],
        relatedTechniqueIds: ["4-7-8-breathing", "box-breathing"],
        relatedBookTitles: ["The Healing Power of the Breath", "Just Breathe"],
        themes: ["Sleep", "Anxiety & Stress", "Beginners"],
        photo: { hue: "rose" }
      },
      {
        name: "Jack Kornfield",
        role: "Buddhist Teacher",
        bio: "American Theravada-trained teacher. Co-founder of Insight Meditation Society and Spirit Rock — a warm, psychologically sophisticated dharma voice.",
        whyMatters: "Kornfield made Buddhist meditation safe and accessible for Western practitioners with psychological training. His tone — warm, humorous, grounded — became the template for secular Western Buddhism. Decades of dharma talks shape what most Western meditation teachers now sound like.",
        contributions: [
          "Co-founded Insight Meditation Society (1975, with Sharon Salzberg and Joseph Goldstein).",
          "Co-founded Spirit Rock Meditation Center (1987).",
          "Author of A Path with Heart, The Wise Heart, and many others.",
          "Bridged Theravada Buddhism and Western psychology."
        ],
        relatedTechniqueIds: ["nadi-shodhana", "bhramari"],
        relatedBookTitles: ["The Miracle of Mindfulness", "Autobiography of a Yogi"],
        themes: ["Spirituality & Consciousness", "Beginners", "Ancient Traditions"],
        photo: { hue: "emerald" }
      },
      {
        name: "James Nestor",
        role: "Science Journalist",
        bio: "American author of Breath. A gifted communicator who self-experimented in the Stanford nose-plugging study and made breath science mainstream.",
        whyMatters: "Nestor turned breathing into a global conversation. By submitting himself to a 10-day Stanford study in which his nose was plugged shut (and then unplugged), he made the case for nasal breathing in a way no textbook could. His book Breath was a NYT bestseller and changed the public understanding of respiratory health.",
        contributions: [
          "Author of Breath: The New Science of a Lost Art (2020).",
          "Self-experimenter in the Stanford nose-plugging study.",
          "Author of Deep, on free-diving physiology.",
          "Brought the work of Buteyko, McKeown, and ancient pranayama into mainstream awareness."
        ],
        relatedTechniqueIds: ["buteyko-method", "physiological-sigh", "nadi-shodhana"],
        relatedBookTitles: ["Breath: The New Science of a Lost Art", "The Oxygen Advantage"],
        themes: ["Science & Research", "Beginners", "Ancient Traditions"],
        photo: { hue: "teal" }
      },
      {
        name: "Dr. Ela Manga",
        role: "Physician & Breathwork Advocate",
        bio: "South African physician pioneering breathwork for burnout and healthcare worker resilience — bridging traditional and modern wellness.",
        whyMatters: "Manga has brought breathwork into hospital medicine — particularly for burnt-out healthcare workers in South Africa's overstretched system. Her work shows that breathwork isn't just retreat-centre wellness; it's a serious tool for clinical staff facing chronic stress.",
        contributions: [
          "Founded the Wood Foundation breathwork initiative for healthcare resilience.",
          "Author of Breathe: Strategising Energy in the Age of Burnout.",
          "Speaker on breath as preventive medicine.",
          "Pioneer of physician-led breathwork training in Africa."
        ],
        relatedTechniqueIds: ["box-breathing", "4-7-8-breathing", "physiological-sigh"],
        relatedBookTitles: ["The Healing Power of the Breath", "Just Breathe"],
        themes: ["Anxiety & Stress", "Beginners"],
        photo: { hue: "rose" }
      },
      {
        name: "HeartMath Institute",
        role: "Heart-Brain Research",
        bio: "Nonprofit (founded 1991) studying heart-brain coherence and the cardiac electromagnetic field. Developed widely-used HRV tools and coherence techniques.",
        whyMatters: "HeartMath established the language of 'cardiac coherence' — the measurable harmonic state of the heart-brain system that arises with slow, focused breathing at roughly 6 breaths per minute. Their HRV biofeedback tools made these states trainable for the general public, and their research is widely cited across the breathwork field.",
        contributions: [
          "Developed the HeartMath coherence technique and biofeedback tools.",
          "Hundreds of papers on HRV, coherence, and stress.",
          "Built the public framework for understanding 'resonance breathing.'",
          "Trains tens of thousands of practitioners in coherence techniques."
        ],
        relatedTechniqueIds: ["box-breathing", "4-7-8-breathing"],
        relatedBookTitles: ["The Healing Power of the Breath"],
        themes: ["Science & Research", "Anxiety & Stress"],
        photo: { hue: "indigo" }
      },

      /* ─── New: 4 people referenced from the meditation detail pages ─── */
      {
        name: "Sharon Salzberg",
        role: "Loving-Kindness Teacher",
        bio: "American meditation teacher; co-founder of the Insight Meditation Society. The most influential Western voice on metta (loving-kindness) practice.",
        whyMatters: "Salzberg brought Loving-Kindness meditation — Metta Bhavana — into Western secular practice. Her 1995 book Lovingkindness made the case that love is a trainable skill, not just a feeling that visits us, and that the cultivation of benevolence is as legitimate a meditation as breath-focus.",
        contributions: [
          "Co-founded Insight Meditation Society (1975, with Joseph Goldstein and Jack Kornfield).",
          "Author of Lovingkindness, Real Happiness, and Real Love.",
          "Brought metta practice to Western secular meditation.",
          "Decades of teaching at IMS, Spirit Rock, and global retreat centres."
        ],
        relatedTechniqueIds: ["bhramari", "4-7-8-breathing"],
        relatedBookTitles: ["The Miracle of Mindfulness", "The Healing Power of the Breath"],
        themes: ["Spirituality & Consciousness", "Anxiety & Stress", "Beginners"],
        photo: { hue: "rose" }
      },
      {
        name: "Jon Kabat-Zinn",
        role: "MBSR Founder",
        bio: "Founder of Mindfulness-Based Stress Reduction (1979) at the University of Massachusetts Medical School. Brought Buddhist mindfulness — including the body scan and breath meditation — into Western clinical medicine.",
        whyMatters: "Kabat-Zinn is the single person most responsible for making mindfulness a clinical intervention. By stripping Buddhist meditation of religious framing and submitting it to the rigour of clinical trials, he made it acceptable to medical schools, hospitals, and insurance companies — and produced the largest body of research on contemplative practice in history.",
        contributions: [
          "Founded MBSR at UMass Medical School (1979).",
          "Pioneered the clinical use of the body scan and mindfulness of breath.",
          "Author of Full Catastrophe Living and Wherever You Go, There You Are.",
          "Trained tens of thousands of clinicians in mindfulness-based interventions."
        ],
        relatedTechniqueIds: ["physiological-sigh", "4-7-8-breathing", "ujjayi"],
        relatedBookTitles: ["The Miracle of Mindfulness", "Why Zebras Don't Get Ulcers", "The Healing Power of the Breath"],
        themes: ["Anxiety & Stress", "Science & Research", "Beginners"],
        photo: { hue: "emerald" }
      },
      {
        name: "Thich Nhat Hanh",
        role: "Zen Teacher (1926–2022)",
        bio: "Vietnamese Buddhist monk, peace activist, and prolific teacher. Author of The Miracle of Mindfulness and founder of Plum Village. Made mindfulness of breath a gentle domestic art.",
        whyMatters: "Thich Nhat Hanh — Thay, as his students called him — made mindfulness lovable. His teachings on the breath are tender, simple, and concrete: smile while you inhale, dwell in the present moment while you exhale. Nominated for the Nobel Peace Prize by Martin Luther King Jr., he taught engaged Buddhism through six decades of war, exile, and global teaching.",
        contributions: [
          "Wrote The Miracle of Mindfulness — one of the most-read meditation books in the world.",
          "Founded Plum Village monastery in France (1982).",
          "Coined the term 'Engaged Buddhism' — meditation as social action.",
          "Wrote over 100 books making mindfulness accessible to general audiences."
        ],
        relatedTechniqueIds: ["ujjayi", "4-7-8-breathing", "nadi-shodhana"],
        relatedBookTitles: ["The Miracle of Mindfulness", "Breath as Prayer", "Autobiography of a Yogi"],
        themes: ["Spirituality & Consciousness", "Beginners", "Ancient Traditions"],
        photo: { hue: "teal" }
      },
      {
        name: "Bessel van der Kolk",
        role: "Trauma Researcher",
        bio: "Psychiatrist and author of The Body Keeps the Score (2014). The most influential modern voice on trauma — particularly how trauma lives in the body and how somatic practices (including breathwork) restore regulation.",
        whyMatters: "Van der Kolk turned trauma from a primarily talk-therapy problem into a body problem. His work shows that traumatised nervous systems can't be reasoned into safety — they need bottom-up regulation through breath, movement, voice, and somatic awareness. This insight legitimised body-based interventions including breathwork in mainstream trauma treatment.",
        contributions: [
          "Author of The Body Keeps the Score — one of the most-cited trauma books of the 21st century.",
          "Founded the Trauma Center in Brookline, Massachusetts.",
          "Established somatic practices (yoga, EMDR, breathwork) in mainstream PTSD treatment.",
          "Decades of research on PTSD, attachment, and developmental trauma."
        ],
        relatedTechniqueIds: ["physiological-sigh", "box-breathing", "bhramari"],
        relatedBookTitles: ["Why Zebras Don't Get Ulcers", "The Healing Power of the Breath"],
        themes: ["Anxiety & Stress", "Science & Research"],
        photo: { hue: "amber" }
      },
      {
        name: "Eckhart Tolle",
        role: "Spiritual Teacher",
        bio: "Author of The Power of Now. One of the most influential spiritual teachers of our time.",
        themes: ["Spirituality & Consciousness"],
        photo: { hue: "gold" }
      },
      {
        name: "Ramana Maharshi",
        role: "Indian Sage",
        bio: "Pioneer of Self-Inquiry meditation. His teaching: ask Who am I? until only awareness remains.",
        themes: ["Ancient Traditions", "Spirituality & Consciousness"],
        photo: { hue: "amber" }
      },
      {
        name: "Bhante Gunaratana",
        role: "Buddhist Monk & Author",
        bio: "Author of Mindfulness in Plain English. Making vipassana accessible to the modern world.",
        themes: ["Ancient Traditions", "Beginners"],
        photo: { hue: "emerald" }
      },
      {
        name: "Richie Bostock",
        role: "Breathwork Coach",
        bio: "Known as The Breath Guy. Leading modern breathwork teacher and author of Exhale.",
        themes: ["Anxiety & Stress", "Focus & Performance"],
        photo: { hue: "teal" }
      },
      {
        name: "Mark Divine",
        role: "Former Navy SEAL",
        bio: "Founder of SEALFIT. Combines elite military training with yoga, meditation and breathwork.",
        themes: ["Focus & Performance"],
        photo: { hue: "sky" }
      },
      {
        name: "Tara Brach",
        role: "Psychologist & Teacher",
        bio: "Buddhist meditation teacher and psychologist. Pioneer of radical acceptance and RAIN practice.",
        themes: ["Anxiety & Stress", "Spirituality & Consciousness"],
        photo: { hue: "rose" }
      },
      {
        name: "Anodea Judith",
        role: "Author & Therapist",
        bio: "Leading Western authority on the chakra system and its psychological dimensions.",
        themes: ["Spirituality & Consciousness"],
        photo: { hue: "violet" }
      },
      {
        name: "Shakti Gawain",
        role: "Author & Teacher",
        bio: "Pioneer of creative visualisation and the New Thought movement.",
        themes: ["Spirituality & Consciousness"],
        photo: { hue: "amber" }
      },
      {
        name: "Russill Paul",
        role: "Musician & Teacher",
        bio: "Expert in mantra, Nada Yoga and the healing power of sacred sound.",
        themes: ["Ancient Traditions"],
        photo: { hue: "indigo" }
      },
      {
        name: "Stephen Elliott",
        role: "Researcher",
        bio: "Pioneer of coherent breathing and heart rate variability research.",
        themes: ["Science & Research"],
        photo: { hue: "sky" }
      },
      {
        name: "Koen de Jong",
        role: "Author & Coach",
        bio: "Co-author of Way of the Iceman. Breathwork and cold exposure coach.",
        themes: ["Cold Exposure", "Science & Research"],
        photo: { hue: "sky" }
      },
      {
        name: "Swami Satyananda Saraswati",
        role: "Yogi & Teacher",
        bio: "Founder of the Bihar School of Yoga. Systemised Yoga Nidra for the modern world.",
        themes: ["Ancient Traditions"],
        photo: { hue: "gold" }
      }
    ],

    papers: [
      { title: "Voluntary activation of the sympathetic nervous system and attenuation of the innate immune response in humans", authors: "Kox et al.", year: 2014, topic: "The landmark Radboud study — Wim Hof breathing and immune modulation." },
      { title: "Brief structured respiration practices enhance mood and reduce physiological arousal", authors: "Balban et al.", year: 2023, topic: "Cyclic sighing vs other breathing protocols for stress and mood — Huberman Lab." },
      { title: "Brain over body: A study on the willful regulation of autonomic function during cold exposure", authors: "Muzik et al.", year: 2018, topic: "Wim Hof Method, cold tolerance, and brown adipose tissue activation." },
      { title: "Humming greatly increases nasal nitric oxide", authors: "Weitzberg & Lundberg", year: 2002, topic: "The landmark study on Bhramari and nitric oxide production — a 15× increase." },
      { title: "Orienting in a defensive world: Mammalian modifications of our evolutionary heritage", authors: "Porges, S.W.", year: 1995, topic: "The original presentation of Polyvagal Theory." },
      { title: "Effectiveness of a short Yoga Nidra meditation on stress, sleep, and well-being", authors: "Moszeik et al.", year: 2020, topic: "Yoga Nidra / NSDR effectiveness across a large, diverse sample." },
      { title: "Heart rate variability: New perspectives on physiological mechanisms…", authors: "McCraty & Shaffer", year: 2015, topic: "HRV mechanisms, self-regulation capacity, and health risk assessment." },
      { title: "Buteyko breathing techniques in asthma: a blinded randomised controlled trial", authors: "Bowler et al.", year: 1998, topic: "Buteyko's measurable effect on reducing asthma medication use." },
      { title: "Effect of yoga-based interventions on cortisol rhythmicity", authors: "Telles et al.", year: 2013, topic: "Nadi Shodhana and cortisol — stress hormone regulation through alternate-nostril breathing." }
    ],

    podcasts: [
      {
        name: "Huberman Lab",
        host: "Andrew Huberman",
        focus: "Neuroscience and breathing science. Episodes on breathing control, cold exposure, and NSDR — exhaustively referenced.",
        themes: ["Science & Research", "Focus & Performance", "Sleep"],
        url: "https://www.hubermanlab.com/"
      },
      {
        name: "Tara Brach Podcast",
        host: "Tara Brach",
        focus: "Buddhist meditation and dharma talks — integrating psychology with contemplative practice.",
        themes: ["Spirituality & Consciousness", "Anxiety & Stress", "Beginners"],
        url: "https://www.tarabrach.com/podcasts/"
      },
      {
        name: "Jack Kornfield Dharma Talks",
        host: "Jack Kornfield (Spirit Rock)",
        focus: "Buddhist teachings and meditation practice — warm, psychologically sophisticated guidance.",
        themes: ["Spirituality & Consciousness", "Beginners", "Ancient Traditions"],
        url: "https://jackkornfield.com/dharma-talks/"
      },
      {
        name: "Wim Hof on Joe Rogan & Tim Ferriss",
        host: "JRE #712, #865 · TFS",
        focus: "Wim Hof's method, philosophy, and personal journey in long-form conversation.",
        themes: ["Cold Exposure", "Science & Research", "Focus & Performance"],
        url: "https://www.joerogan.com/"
      },
      {
        name: "James Nestor Interviews",
        host: "James Nestor (various)",
        focus: "Breath science research and findings — an accessible popularisation of the field.",
        themes: ["Science & Research", "Beginners"],
        url: "https://www.mrjamesnestor.com/"
      },
      {
        name: "The Science of Breathing (YouTube)",
        host: "Andrew Huberman",
        focus: "A free, comprehensive, scientifically grounded overview of breathing science.",
        themes: ["Science & Research", "Beginners", "Focus & Performance"],
        url: "https://www.youtube.com/c/AndrewHubermanLab"
      },
      {
        name: "Wim Hof Guided Sessions (YouTube)",
        host: "Wim Hof",
        focus: "Free guided rounds of the WHM breathing — the recommended starting point if curious.",
        themes: ["Cold Exposure", "Beginners"],
        url: "https://www.youtube.com/@WimHof"
      },
      {
        name: "HeartMath Demonstrations (YouTube)",
        host: "HeartMath Institute",
        focus: "Practical demonstrations of coherence breathing and the HeartMath protocol.",
        themes: ["Science & Research", "Anxiety & Stress"],
        url: "https://www.youtube.com/c/heartmathinstitute"
      }
    ]
  };

  /* Notable episodes per podcast (keyed by slug(podcast.name)) */
  const _PODCAST_EPISODES = {
    'huberman-lab': [
      { title: "How to Breathe Correctly for Optimal Health", desc: "CO₂ tolerance, nasal breathing, box breathing protocols, and the physiological sigh.", ep: "Ep. 54", duration: "2h 14m" },
      { title: "NSDR, Yoga Nidra & Deep Rest", desc: "Using non-sleep deep rest for recovery, neuroplasticity, and sleep debt.", ep: "Ep. 87", duration: "1h 48m" },
      { title: "The Physiological Sigh — Real-Time Stress Relief", desc: "Double-inhale cyclic sighing as the fastest voluntary stress reduction tool.", ep: "Ep. 22", duration: "1h 12m" },
    ],
    'tara-brach-podcast': [
      { title: "Radical Acceptance: Embracing Your Life with the Heart of a Buddha", desc: "Core teaching on the foundational practice of meeting experience with openness.", ep: "Featured talk", duration: "54m" },
      { title: "RAIN: A Practice of Radical Compassion", desc: "A four-step mindfulness process — Recognise, Allow, Investigate, Nurture.", ep: "Guided practice", duration: "48m" },
      { title: "Awakening Through the Body", desc: "Somatic awareness and body-based mindfulness as a path to presence.", ep: "Dharma talk", duration: "62m" },
    ],
    'jack-kornfield-dharma-talks': [
      { title: "The Wise Heart", desc: "Opening to the innate goodness and wisdom of the human heart.", ep: "Dharma talk", duration: "58m" },
      { title: "Loving-Kindness Meditation", desc: "A guided Metta practice for cultivating compassion toward self and others.", ep: "Guided sit", duration: "40m" },
      { title: "Mindfulness of Breathing — Classic Practice", desc: "Traditional Anapanasati instruction rooted in the Pali Canon.", ep: "Teaching", duration: "47m" },
    ],
    'wim-hof-on-joe-rogan-tim-ferriss': [
      { title: "Wim Hof — Joe Rogan Experience #712", desc: "The original long-form conversation that introduced Wim Hof to a mass audience.", ep: "JRE #712", duration: "1h 50m" },
      { title: "Wim Hof — Joe Rogan Experience #865", desc: "Follow-up with Radboud study findings and live breathing demonstration.", ep: "JRE #865", duration: "1h 22m" },
      { title: "Wim Hof — Tim Ferriss Show", desc: "Practical protocols and the science behind cold exposure and breathwork.", ep: "TFS", duration: "1h 10m" },
    ],
    'james-nestor-interviews': [
      { title: "The Mouth-Breathing Experiment — Stanford Study", desc: "Nestor describes the 10-day nasal-plugged experiment that launched the book.", ep: "Various", duration: "45m" },
      { title: "Ancient Breathing Secrets — On Rogan & Ferriss", desc: "How yogic pranayama and Buteyko arrived at the same conclusions via different paths.", ep: "Various", duration: "60m" },
    ],
    'the-science-of-breathing-youtube': [
      { title: "Breathing for Health & Performance — Full Video", desc: "Comprehensive overview of breathing physiology, CO₂ tolerance, and practical protocols.", ep: "YouTube", duration: "2h 05m" },
    ],
    'wim-hof-guided-sessions-youtube': [
      { title: "Guided Wim Hof Breathing Round 1", desc: "30 power breaths, retention, and recovery — the complete first round.", ep: "Beginner", duration: "11m" },
      { title: "Guided Wim Hof Breathing — Full Session (3 Rounds)", desc: "Three complete rounds with guidance, culminating in cold exposure prep.", ep: "Full session", duration: "28m" },
    ],
    'heartmath-demonstrations-youtube': [
      { title: "Heart Rate Variability Coherence Explained", desc: "What HRV coherence is and why the 5-second breathing cycle achieves it.", ep: "Educational", duration: "18m" },
      { title: "Quick Coherence Technique — Guided Practice", desc: "A 5-minute guided practice for achieving heart-brain coherence.", ep: "Guided", duration: "8m" },
    ],
  };

  /* Map of practice names → ids for inline linking from AI responses */
  const PRACTICE_NAME_MAP = (() => {
    const map = [];
    const addAlias = (name, section, id) => map.push({ name, section, id });
    TECHNIQUES.forEach(t => {
      addAlias(t.title, 'techniques', t.id);
    });
    MEDITATIONS.forEach(m => {
      addAlias(m.title, 'meditate', m.id);
    });
    // Extra aliases
    addAlias("4-7-8", 'techniques', '4-7-8-breathing');
    addAlias("4-7-8 breathing", 'techniques', '4-7-8-breathing');
    addAlias("box breathing", 'techniques', 'box-breathing');
    addAlias("Wim Hof Method", 'techniques', 'wim-hof-method');
    addAlias("Wim Hof method", 'techniques', 'wim-hof-method');
    addAlias("WHM", 'techniques', 'wim-hof-method');
    addAlias("alternate nostril breathing", 'techniques', 'nadi-shodhana');
    addAlias("alternate-nostril breathing", 'techniques', 'nadi-shodhana');
    addAlias("Nadi Shodhana", 'techniques', 'nadi-shodhana');
    addAlias("humming bee breath", 'techniques', 'bhramari');
    addAlias("Bhramari", 'techniques', 'bhramari');
    addAlias("Kapalabhati", 'techniques', 'kapalabhati');
    addAlias("Ujjayi", 'techniques', 'ujjayi');
    addAlias("ocean breath", 'techniques', 'ujjayi');
    addAlias("Buteyko", 'techniques', 'buteyko-method');
    addAlias("physiological sigh", 'techniques', 'physiological-sigh');
    addAlias("cyclic sighing", 'techniques', 'physiological-sigh');
    addAlias("Kumbhaka", 'techniques', 'kumbhaka');
    addAlias("body scan", 'meditate', 'body-scan');
    addAlias("loving-kindness", 'meditate', 'loving-kindness');
    addAlias("Loving Kindness", 'meditate', 'loving-kindness');
    addAlias("Metta", 'meditate', 'loving-kindness');
    addAlias("Yoga Nidra", 'meditate', 'yoga-nidra');
    addAlias("yoga nidra", 'meditate', 'yoga-nidra');
    addAlias("NSDR", 'meditate', 'yoga-nidra');
    addAlias("Anapanasati", 'meditate', 'mindfulness-of-breath');
    addAlias("mindfulness of breath", 'meditate', 'mindfulness-of-breath');
    addAlias("Trataka", 'meditate', 'trataka');
    addAlias("candle gazing", 'meditate', 'trataka');
    addAlias("open awareness", 'meditate', 'open-awareness');
    // Sort by length DESC so longest matches first
    map.sort((a, b) => b.name.length - a.name.length);
    return map;
  })();

  /* ── Accordion toggle ── */
  function toggleAccordion(panelId) {
    const body = document.getElementById(panelId);
    if (!body) return;
    const opening = !body.classList.contains('open');
    body.classList.toggle('open', opening);
    const btn = body.closest('.acc-wrap')?.querySelector('.acc-btn');
    if (btn) btn.classList.toggle('open', opening);
  }

  /* ── Pro banner render (Pro promotion removed; kept as no-op for legacy callers) ── */
  function renderProBanner() {
    const el = document.getElementById('profile-pro-banner');
    if (el) el.innerHTML = '';
  }

  /* ────── Persistent gamification store (localStorage) ────── */
  const STORE_KEY = 'triad:v1';

  /* ─── Practice grouping for tiered achievements ─── */
  // Pranayama: the classical yogic breathing practices
  const PRANAYAMA_IDS = ['nadi-shodhana', 'kapalabhati', 'bhramari', 'ujjayi', 'kumbhaka'];
  // Modern: practices popularised in Western science/podcasts (Huberman et al.)
  const MODERN_IDS    = ['physiological-sigh', 'box-breathing', 'yoga-nidra'];

  /* Helpers used by achievement tests + the next-achievement hint */
  function _completedPracticeIds(s) {
    return new Set((s.sessions || []).map(x => x.practiceId));
  }
  function _sessionsInLastDays(s, days) {
    const cutoff = Date.now() - days * 86400000;
    return (s.sessions || []).filter(x => new Date(x.ts).getTime() >= cutoff).length;
  }
  function _planFinished(s, requireDays = 30) {
    if (!s.plan) return false;
    const total = s.plan.totalDays || 30;
    if (total < requireDays) return false;
    const start = new Date(s.plan.startDate).getTime();
    return Date.now() - start >= requireDays * 86400000;
  }
  function _isMorning(session)  { const h = new Date(session.ts).getHours(); return h >= 5  && h < 11; }
  function _isEvening(session)  { const h = new Date(session.ts).getHours(); return h >= 18 && h < 24; }
  function _totalMinutes(s)     { return (s.sessions || []).reduce((sum, x) => sum + (x.durationMin || 0), 0); }
  function _booksRead(s)        { return Object.values(s.readingList || {}).filter(v => v === 'read').length; }
  function _bestStreak(s)       { return Math.max(s.streak?.longest || 0, s.streak?.current || 0); }
  function _distinctPracticeCount(s) { return _completedPracticeIds(s).size; }

  /* ─── Achievements (21: 11 guest + 10 pro) ─── */
  // Each has: id, name, icon, tier ('guest'|'pro'), test(s), hint, progress(s) → {current, target, label}
