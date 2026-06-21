/* =====================================================
   DRAMAGIC TEAMS-STYLE CHATS
   Class channels + private student chats + integrated homework missions.
   Demo storage: localStorage. Replace storage helpers with Supabase later.
===================================================== */

const DEMO_CLASSES = [
  { letter: "A", name: "Class A", icon: "A", subtitle: "Voice acting assignment" },
  { letter: "B", name: "Class B", icon: "B", subtitle: "Voice challenge" },
  { letter: "C", name: "Class C", icon: "C", subtitle: "Confidence practice" },
  { letter: "D", name: "Class D", icon: "D", subtitle: "Drama mission" }
];

const DEMO_STUDENTS = [
  { id: "student-a-1", full_name: "Adam Youssef", classLetter: "A", avatar: "AY", status: "Needs feedback" },
  { id: "student-a-2", full_name: "Lina Mostafa", classLetter: "A", avatar: "LM", status: "Active today" },
  { id: "student-a-3", full_name: "Youssef Karim", classLetter: "A", avatar: "YK", status: "Submitted voice note" },
  { id: "student-b-1", full_name: "Mariam Ali", classLetter: "B", avatar: "MA", status: "Active yesterday" },
  { id: "student-b-2", full_name: "Omar Hassan", classLetter: "B", avatar: "OH", status: "Needs reminder" },
  { id: "student-c-1", full_name: "Nour Ahmed", classLetter: "C", avatar: "NA", status: "Confident speaker" },
  { id: "student-c-2", full_name: "Malak Samir", classLetter: "C", avatar: "MS", status: "New message" },
  { id: "student-d-1", full_name: "Seif Tamer", classLetter: "D", avatar: "ST", status: "Practice pending" }
];

const HOMEWORK_TEMPLATES = [
  {
    id: "template-voice-imitation",
    title: "Voice Imitation",
    icon: "🎙️",
    preview: "Dramagicians copy the speaker’s voice, emotion, pauses, and pronunciation.",
    homeworkTitle: "Voice Imitation Practice",
    instructions:
      "Listen to the line or short clip. Copy the voice, emotion, pronunciation, pauses, and tone. Send your best voice note here.",
    videoUrl: "https://www.youtube.com/"
  },
  {
    id: "template-dubbing-studio",
    title: "Dubbing Studio",
    icon: "🎬",
    preview: "Dramagicians record voice acting for a video, scene, or character role.",
    homeworkTitle: "Dubbing Studio Task",
    instructions:
      "Watch the video or scene. Record your voice acting as if you are dubbing it. Focus on timing, emotion, and clear English.",
    videoUrl: "https://www.youtube.com/"
  },
  {
    id: "template-story-lab",
    title: "Story Lab",
    icon: "📖",
    preview: "Dramagicians create a full story from a spark: characters, setting, conflict, and ending.",
    homeworkTitle: "Story Lab Mission",
    instructions:
      "Use the story spark to create your own story. Choose the setting, character names, problem, surprise, and ending. Send it as a voice message.",
    videoUrl: "https://www.youtube.com/"
  }
];

const DEMO_HOMEWORK = [
  {
    id: "hw-a-1",
    classLetter: "A",
    title: "Voice Imitation Practice",
    videoUrl: "https://www.youtube.com/",
    instructions:
      "Listen to the short line or clip. Copy the voice, emotion, pauses, and pronunciation. Send your best voice note here."
  },
  {
    id: "hw-b-1",
    classLetter: "B",
    title: "Dubbing Studio Task",
    videoUrl: "https://www.youtube.com/",
    instructions:
      "Watch the short scene. Record your voice acting as if you are dubbing the scene. Focus on timing, emotion, and clarity."
  },
  {
    id: "hw-c-1",
    classLetter: "C",
    title: "Story Lab Mission",
    videoUrl: "https://www.youtube.com/",
    instructions:
      "Create a full story from the story spark. Give your character a name, choose the setting, build the problem, and create an ending."
  },
  {
    id: "hw-d-1",
    classLetter: "D",
    title: "Voice Imitation Practice",
    videoUrl: "https://www.youtube.com/",
    instructions:
      "Record the line with clear pronunciation, emotion, pauses, and confidence. Send your strongest version here."
  }
];

/* =====================================================
   MISSION DEMO BANK
   Lives inside the Homework/Missions tab. For real use, replace
   localStorage with Supabase tables + Supabase Storage later.
===================================================== */

const MISSION_TYPES = [
  { id: "voice-imitation", label: "Voice Imitation 🎙️", icon: "🎙️" },
  { id: "dubbing-studio", label: "Dubbing Studio 🎬", icon: "🎬" },
  { id: "story-lab", label: "Story Lab 📖", icon: "📖" }
];

const MISSION_LEVELS = [
  { id: "little-stars", label: "Ages 8–10 ⭐" },
  { id: "junior-actors", label: "Ages 11–13 🎬" },
  { id: "creative-speakers", label: "Ages 14–15 🎤" },
  { id: "teen-performers", label: "Ages 16–17 🔥" }
];

const MISSION_BANK = [];

const DEFAULT_MISSION_REQUIREMENTS = [
  "Character introduction",
  "Opinion",
  "One clear reason",
  "Example or feeling",
  "Funny or dramatic ending"
];

const DEFAULT_MISSION_STARTERS = [
  "Hello, I am...",
  "In my opinion...",
  "My reason is...",
  "For example...",
  "That is why..."
];

const MISSION_TYPE_CONFIGS = {
  "story-lab": {
    builderIntro: "Story Lab gives one character spark with a real problem. Learners create the name, setting, other characters, conflict, ending, and message.",
    usesChoices: false,
    usesOptions: false,
    usesRequirements: false,
    topicLabel: "Story title / spark",
    topicPlaceholder: "Example: The character who found a tiny dragon in their pocket",
    bankLabel: "Choose Story Lab spark by level",
    choiceLabel: "No character choices",
    choiceHeading: "Open imagination",
    choiceSubmitLabel: "Create the full story",
    choiceSummaryLabel: "Story freedom",
    choicePlaceholder: "Story Lab does not use character choices.",
    optionsLabel: "No mood choices",
    optionsHeading: "Free mood",
    optionsSummaryLabel: "Mood freedom",
    options: [],
    requirementsLabel: "No fixed requirements",
    requirementsHeading: "Open story",
    helperLabel: "Story-building guide — not fixed answers",
    helperHeading: "Build your story:",
    materialLabel: "Picture / prompt material link (optional)",
    instructionsLabel: "Story spark sent to learners",
    recordButton: "🎙️ Record Your Story",
    demoButton: "Submit Demo Story",
    publishNote: "Learners receive the spark only. They must invent the character name, world, conflict, details, and ending.",
    defaultCharacters: [],
    defaultRequirements: [],
    defaultStarters: [
      "Give the main character a name and a clear personality.",
      "Choose the setting: where and when does the story happen?",
      "Create the problem, the surprise, and the turning point.",
      "Add other characters only if your story needs them.",
      "End with a feeling, a lesson, a joke, or a strong final image."
    ],
    defaultInstructions: "Create a complete story from this spark. Give your main character a name, choose the setting, build the problem, add any characters you need, and decide the ending. Send your story as a voice message."
  },
  "dubbing-studio": {
    builderIntro: "Teacher gives a clip or scene. Dramagicians record voice acting for it, and the best audio can be reviewed/downloaded later.",
    topicLabel: "Scene / dubbing task",
    topicPlaceholder: "Example: Dub a funny scene where a pencil argues with a notebook.",
    bankLabel: "Choose Dubbing Studio task",
    choiceLabel: "Voice role choices",
    choiceHeading: "Voice role choices",
    choiceSubmitLabel: "Choose voice role",
    choiceSummaryLabel: "Voice role",
    choicePlaceholder: "One per line. Example:\nHero 🦸\nVillain 🦹\nNarrator 🎙️\nFunny Sidekick 😂",
    optionsLabel: "Voice tone choices",
    optionsHeading: "Choose voice tone",
    optionsSummaryLabel: "Tone",
    options: ["Funny", "Dramatic", "Scared", "Heroic"],
    requirementsLabel: "Dubbing must include",
    requirementsHeading: "Dubbing must include",
    helperLabel: "Dubbing helper / ready voice directions",
    helperHeading: "Dubbing helper / how to perform:",
    materialLabel: "Video / scene link",
    instructionsLabel: "Dubbing instructions",
    recordButton: "🎙️ Record Dubbing Voice",
    demoButton: "Submit Demo Dubbing",
    publishNote: "Dramagicians use the video/scene link, choose a role and tone, then submit their voice from the group chat.",
    defaultCharacters: ["Hero 🦸", "Villain 🦹", "Narrator 🎙️", "Funny Sidekick 😂"],
    defaultRequirements: ["Match the scene timing", "Use clear emotion", "Speak clearly", "Add character voice", "Finish the full line/scene"],
    defaultStarters: ["Watch the clip first without recording.", "Choose which character or narrator voice you are performing.", "Match the timing: start when the character starts speaking.", "Emotion: Make the voice fit the face and situation.", "Replay once and record a stronger version."],
    defaultInstructions: "Watch the video or scene. Record your voice acting as if you are dubbing it. Focus on timing, emotion, and clarity."
  },
  "voice-imitation": {
    builderIntro: "Teacher gives a line or clip. Dramagicians imitate voice, emotion, pauses, pronunciation, and confidence.",
    topicLabel: "Imitation task / line",
    topicPlaceholder: "Example: Say ‘I can do this’ in three different emotions.",
    bankLabel: "Choose Voice Imitation task",
    choiceLabel: "Voice style choices",
    choiceHeading: "Voice style choices",
    choiceSubmitLabel: "Choose voice style",
    choiceSummaryLabel: "Voice style",
    choicePlaceholder: "One per line. Example:\nHappy Voice 😀\nAngry Voice 😡\nScared Voice 😱\nConfident Voice ⭐",
    optionsLabel: "Target emotion choices",
    optionsHeading: "Choose target emotion",
    optionsSummaryLabel: "Emotion",
    options: ["Happy", "Angry", "Scared", "Confident"],
    requirementsLabel: "Imitation must include",
    requirementsHeading: "Imitation must include",
    helperLabel: "Imitation helper / ready practice steps",
    helperHeading: "Imitation helper / how to copy:",
    materialLabel: "Clip / audio / video link (optional)",
    instructionsLabel: "Imitation instructions",
    recordButton: "🎙️ Record Imitation",
    demoButton: "Submit Demo Imitation",
    publishNote: "Dramagicians choose a voice style/emotion and record their imitation from the pinned group-chat card.",
    defaultCharacters: ["Happy Voice 😀", "Angry Voice 😡", "Scared Voice 😱", "Confident Voice ⭐"],
    defaultRequirements: ["Copy the emotion", "Copy the pauses", "Clear pronunciation", "Same energy", "One strong final try"],
    defaultStarters: ["Listen first: notice the speed, pauses, and feeling.", "Repeat slowly before recording.", "Focus on the mouth sounds and ending letters.", "Add facial expression while recording; it changes the voice.", "Record again if your first try feels flat."],
    defaultInstructions: "Copy the voice, emotion, pronunciation, pauses, and tone. Send your best voice note."
  }
};

const MISSION_EXTRA_BANK = [
  // DUBBING STUDIO
  { type: "dubbing-studio", id: "dub-pencil-notebook", level: "little-stars", topic: "Dub a funny scene where a pencil argues with a notebook.", characters: ["Pencil ✏️", "Notebook 📓", "Eraser 🧽", "Narrator 🎙️"], options: ["Funny", "Angry", "Silly"], requirements: ["Clear voice", "Funny emotion", "Short pauses", "Character voice"], starters: ["Imagine the pencil is proud and dramatic.", "The notebook is tired of mistakes.", "Use short lines and funny reactions.", "Make your voice match the character.", "End with a funny apology or comeback."] },
  { type: "dubbing-studio", id: "dub-lost-lion", level: "junior-actors", topic: "Dub a scene where a brave lion loses his roar.", characters: ["Brave Lion 🦁", "Tiny Mouse 🐭", "Narrator 🎙️", "Forest Echo 🌳"], options: ["Heroic", "Scared", "Funny", "Emotional"], requirements: ["Match timing", "Show emotion", "Clear pronunciation", "One strong final line"], starters: ["The lion starts confident but becomes worried.", "The mouse can be funny or wise.", "Use silence before the big final line.", "Make the roar return at the ending.", "Teacher can choose the best audio later."] },
  { type: "dubbing-studio", id: "dub-villain-hero", level: "creative-speakers", topic: "Dub a hero and villain face-off scene.", characters: ["Hero 🦸", "Villain 🦹", "Narrator 🎙️", "Scared Citizen 😨"], options: ["Dramatic", "Dark", "Heroic", "Funny"], requirements: ["Strong opening", "Voice contrast", "Emotion", "Timing", "Dramatic ending"], starters: ["The hero speaks with control and courage.", "The villain speaks slowly and confidently.", "Use pauses before important words.", "Show tension with voice, not shouting only.", "Finish with a line that sounds like a movie trailer."] },
  { type: "dubbing-studio", id: "dub-silent-scene", level: "teen-performers", topic: "Dub a silent scene using only voice narration and sound emotions.", characters: ["Narrator 🎙️", "Inner Voice 💭", "Reporter 🎤", "Memory Voice ✨"], options: ["Poetic", "Suspense", "Emotional", "Comedy"], requirements: ["Narration", "Mood", "Timing", "Clear story", "Strong ending"], starters: ["Watch the scene and decide what the character is feeling.", "Do not explain everything; leave some mystery.", "Use your voice to create atmosphere.", "Match the speed of the visuals.", "End with one memorable sentence."] },

  // VOICE IMITATION
  { type: "voice-imitation", id: "voice-three-emotions", level: "little-stars", topic: "Say one sentence in three emotions: happy, angry, and scared.", characters: ["Happy Voice 😀", "Angry Voice 😡", "Scared Voice 😱", "Tiny Voice 🐭"], options: ["Happy", "Angry", "Scared"], requirements: ["Same sentence", "Three emotions", "Clear words", "Different voice"], starters: ["Sentence idea: I can do this!", "Happy voice goes up and smiles.", "Angry voice is stronger, but not screaming.", "Scared voice can be smaller and shaky.", "Make each version easy to hear."] },
  { type: "voice-imitation", id: "voice-actor-line", level: "junior-actors", topic: "Copy an actor’s line with the same pauses and feeling.", characters: ["Hero Voice 🦸", "Funny Voice 😂", "Serious Voice 😐", "Surprised Voice 😲"], options: ["Confident", "Funny", "Sad", "Surprised"], requirements: ["Copy pauses", "Copy emotion", "Pronunciation", "Energy"], starters: ["Listen once for meaning, once for sound.", "Notice where the actor stops.", "Copy the mouth sounds, especially endings.", "Use facial expression while recording.", "Record twice and choose the better one."] },
  { type: "voice-imitation", id: "voice-confidence-line", level: "creative-speakers", topic: "Record a confident line as if you are speaking on stage.", characters: ["Stage Speaker 🎤", "Coach 📣", "Leader 🏅", "Movie Narrator 🎬"], options: ["Confident", "Calm", "Powerful", "Warm"], requirements: ["Strong voice", "Clear endings", "Good pace", "Confident pause"], starters: ["Stand or sit tall before recording.", "Say the line slowly first.", "Make the first word strong.", "Pause before the final message.", "Smile slightly if you want a warmer voice."] },
  { type: "voice-imitation", id: "voice-movie-trailer", level: "teen-performers", topic: "Imitate a movie trailer voice for a dramatic sentence.", characters: ["Trailer Voice 🎬", "Dark Narrator 🌑", "Hero Narrator 🦸", "Comedy Trailer 😂"], options: ["Epic", "Dark", "Comedy", "Emotional"], requirements: ["Low/strong tone", "Slow pace", "Dramatic pauses", "Clear final sentence"], starters: ["Start lower and slower than normal.", "Use pauses to create suspense.", "Do not rush the important words.", "End like something big is about to happen.", "Make the listener imagine a movie poster."] }
];


/* =====================================================
   EXPANDED STORY LAB BANK — richer homework story prompts
   These are extra ready-to-send stories for the teacher bank.
===================================================== */

const STORY_LAB_CREATIVE_BANK = [
  {
    "type": "story-lab",
    "id": "story-8-pocket-dragon",
    "level": "little-stars",
    "category": "Ages 8–10 · Magical Creature",
    "topic": "A character finds a tiny dragon hiding inside their pocket. The dragon is scared, hungry, and keeps sneezing little sparks of fire. When the character tries to put it back, the dragon whispers, “I did not choose your pocket by mistake.”",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Give the character a name and decide where they are when they find the dragon.",
      "Decide why the dragon chose this character specifically.",
      "Create one funny problem caused by the dragon’s fire sneezes.",
      "Add someone or something that might discover the dragon.",
      "End with the dragon either staying, leaving, or revealing a bigger secret."
    ],
    "instructions": "Create the main character, the setting, the dragon’s secret, the problem, and the ending. Record the story with voice and imagination.",
    "teacherPreview": "Easy magical adventure for younger learners with clear visual action."
  },
  {
    "type": "story-lab",
    "id": "story-8-runaway-shoes",
    "level": "little-stars",
    "category": "Ages 8–10 · Funny Adventure",
    "topic": "A character is getting ready for an important day, but their shoes suddenly jump up and run away. Before escaping, the shoes leave a note: “Today, we choose where to go.”",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Choose the character’s important day: a party, race, show, trip, visit, or something else.",
      "Decide where the shoes run first and why.",
      "Make the shoes have a personality: rude, funny, brave, tired, or dramatic.",
      "Add one strange place the character reaches while chasing them.",
      "End with the character understanding why the shoes ran away."
    ],
    "instructions": "Create the character, the place, the reason the shoes escaped, and the adventure that follows.",
    "teacherPreview": "Funny and performable; great for voice acting and movement imagination."
  },
  {
    "type": "story-lab",
    "id": "story-8-lunchbox-city",
    "level": "little-stars",
    "category": "Ages 8–10 · Tiny World",
    "topic": "A character opens a lunchbox and finds a tiny city inside it. The houses are made of biscuits, the river is made of juice, and the tiny people are shouting, “Please don’t close the lid!”",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Name the character and decide where they open the lunchbox.",
      "Create the tiny city and its most important rule.",
      "Decide what danger is coming when the lid closes.",
      "Add a tiny leader, inventor, chef, guard, or troublemaker.",
      "End with the character saving the city, joining it, or accidentally changing it forever."
    ],
    "instructions": "Build the tiny world inside the lunchbox. Choose the danger, the tiny characters, and how the main character reacts.",
    "teacherPreview": "Visual, playful, and full of setting creation for younger storytellers."
  },
  {
    "type": "story-lab",
    "id": "story-8-lost-laugh",
    "level": "little-stars",
    "category": "Ages 8–10 · Emotional Funny",
    "topic": "A character laughs so hard that their laugh jumps out of their mouth and runs away. After that, the character can smile, but no sound comes out. Somewhere nearby, the runaway laugh is causing trouble.",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Decide what made the character laugh so much.",
      "Imagine what the laugh looks like if it becomes alive.",
      "Choose where the laugh hides: a jar, a tree, a toy shop, a cloud, or anywhere else.",
      "Make the laugh cause funny chaos before the character catches it.",
      "End with why the character needed their laugh back."
    ],
    "instructions": "Create a funny story about a character trying to find their lost laugh. Choose the setting and ending.",
    "teacherPreview": "Simple emotional idea with comedy and clear performance sounds."
  },
  {
    "type": "story-lab",
    "id": "story-8-drawing-alive",
    "level": "little-stars",
    "category": "Ages 8–10 · Imagination",
    "topic": "A character draws something quickly on a piece of paper. A few seconds later, the drawing moves, looks at them, and says, “Finally! I have been waiting for you.”",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Choose what the character drew: a monster, friend, door, animal, crown, machine, or anything else.",
      "Decide why the drawing was waiting.",
      "Make the drawing need help with a problem from its paper world.",
      "Add one moment where the real world and drawing world mix.",
      "End with the drawing returning to paper, staying alive, or changing the character."
    ],
    "instructions": "Create the drawing, its world, its problem, and what happens when it becomes alive.",
    "teacherPreview": "Strong fantasy spark that lets children create characters and worlds freely."
  },
  {
    "type": "story-lab",
    "id": "story-8-moon-help",
    "level": "little-stars",
    "category": "Ages 8–10 · Night Magic",
    "topic": "At night, a character hears someone gently laughing outside the window. They look up and realize the moon is laughing, then the moon says, “I am sorry, but I need your help before sunrise.”",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Name the character and decide why they are awake at night.",
      "Choose why the moon needs help: lost stars, broken light, a secret, or a promise.",
      "Create one magical way the character can reach or talk to the moon.",
      "Add a problem that must be solved before sunrise.",
      "End with the morning looking different because of what happened."
    ],
    "instructions": "Create a magical night story. Decide what the moon needs, how the character helps, and what changes by sunrise.",
    "teacherPreview": "Soft magical mood with a clear time limit."
  },
  {
    "type": "story-lab",
    "id": "story-11-wrong-memory",
    "level": "junior-actors",
    "category": "Ages 11–13 · Mystery",
    "topic": "A character wakes up with a memory that does not belong to them. They remember a place they have never visited, a face they have never seen, and one sentence: “Find me before they do.”",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Create who the character is before the strange memory arrives.",
      "Decide whose memory it might be and why it entered their mind.",
      "Choose the place from the memory and what makes it important.",
      "Add someone searching for the same person, object, or secret.",
      "End with the character discovering whether the memory is a warning, a gift, or a trap."
    ],
    "instructions": "Create a mystery story around the wrong memory. Build the character, the place, the danger, and the reveal.",
    "teacherPreview": "Good for suspense and plot-building without forcing setting or genre."
  },
  {
    "type": "story-lab",
    "id": "story-11-shop-no-money",
    "level": "junior-actors",
    "category": "Ages 11–13 · Magical Choice",
    "topic": "A character finds a small shop that appears only once. Inside, they can buy courage, silence, luck, forgiveness, forgotten dreams, or second chances. The shopkeeper smiles and says, “We do not accept money here.”",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Create the character and why they enter the shop.",
      "Choose what they want to buy and why they need it.",
      "Decide the price: a memory, a promise, a talent, a secret, or something stranger.",
      "Show how the bought thing changes the character’s life.",
      "End with whether the price was worth it."
    ],
    "instructions": "Create the shop, the shopkeeper, the thing the character buys, the price, and the consequence.",
    "teacherPreview": "Strong moral choice with magic and clear stakes."
  },
  {
    "type": "story-lab",
    "id": "story-11-silent-animal",
    "level": "junior-actors",
    "category": "Ages 11–13 · Adventure Mystery",
    "topic": "Everywhere the character goes, a silent animal follows them. It never attacks, never speaks, and never leaves. One day, the animal finally drops something at the character’s feet and disappears.",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Choose the animal and where it first appears.",
      "Decide how the character feels about being followed.",
      "Create the object the animal drops and what it means.",
      "Add a journey, clue, or person connected to the object.",
      "End by revealing whether the animal was protecting, warning, or testing the character."
    ],
    "instructions": "Create the character, the silent animal, the object it leaves, and the story behind it.",
    "teacherPreview": "Flexible for fantasy, mystery, emotional friendship, or adventure."
  },
  {
    "type": "story-lab",
    "id": "story-11-five-minute-watch",
    "level": "junior-actors",
    "category": "Ages 11–13 · Time Problem",
    "topic": "A character finds a watch that can stop time for five minutes only. At first, they use it for small things. Then one day, five minutes is not enough to fix what happens.",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Create how the character finds the watch.",
      "Show one funny or selfish way they use it at first.",
      "Create the serious problem where five minutes is not enough.",
      "Decide if someone else knows about the watch.",
      "End with what the character learns about time, responsibility, or choices."
    ],
    "instructions": "Create a time story with a clear problem. Decide what the watch can and cannot solve.",
    "teacherPreview": "Great for cause-and-effect storytelling and character growth."
  },
  {
    "type": "story-lab",
    "id": "story-11-map-feelings",
    "level": "junior-actors",
    "category": "Ages 11–13 · Emotional Fantasy",
    "topic": "A character finds a map, but it does not show streets or countries. It shows places like the Forest of Fear, the River of Regret, the City of Hope, and the Door of Truth.",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Create why the character needs this map.",
      "Choose the first place they enter and what it looks like.",
      "Make each place test the character in a different way.",
      "Add a guide, enemy, friend, or strange rule inside the map world.",
      "End with the character finding what they were really searching for."
    ],
    "instructions": "Create the map world and the emotional journey. Choose the places, the test, and the ending.",
    "teacherPreview": "Deep but still imaginative; good for vivid setting creation."
  },
  {
    "type": "story-lab",
    "id": "story-11-secret-object",
    "level": "junior-actors",
    "category": "Ages 11–13 · Object Secret",
    "topic": "A character suddenly hears objects talking. It is funny at first, until one object says, “I saw what really happened.”",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Choose which objects the character can hear.",
      "Decide which object knows the secret: a chair, ring, phone, key, mirror, toy, or anything else.",
      "Create what really happened and why nobody knows.",
      "Show whether the character believes the object or not.",
      "End with the object helping, lying, or asking for something in return."
    ],
    "instructions": "Create a mystery where an object knows the truth. Decide the object, the secret, and what the character does.",
    "teacherPreview": "Funny opening that can become mystery, comedy, or drama."
  },
  {
    "type": "story-lab",
    "id": "story-14-famous-false",
    "level": "creative-speakers",
    "category": "Ages 14–15 · Identity and Truth",
    "topic": "A character wakes up and finds their face everywhere. People call them a hero, thank them, and cheer for them. But the character knows one painful truth: they did not do the thing everyone believes they did.",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Create what everyone believes the character did.",
      "Decide what really happened and who actually deserves credit.",
      "Show how fame changes the character’s relationships or choices.",
      "Add pressure: money, popularity, fear, family, public attention, or guilt.",
      "End with whether the character tells the truth and what it costs."
    ],
    "instructions": "Create a story about false fame, truth, and choice. Build the character’s secret and final decision.",
    "teacherPreview": "Teen-friendly moral conflict with strong point of view."
  },
  {
    "type": "story-lab",
    "id": "story-14-delete-memory",
    "level": "creative-speakers",
    "category": "Ages 14–15 · Emotional Choice",
    "topic": "A character is offered the chance to delete one memory forever. It can be a mistake, an embarrassing moment, or something painful. But if the memory disappears, everything they learned from it disappears too.",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Create the memory and why it matters.",
      "Show who offers the chance to delete it: a machine, magician, doctor, stranger, app, or friend.",
      "Decide what lesson would disappear with the memory.",
      "Add someone who wants the character to keep or delete it.",
      "End with the character’s choice and how they change after it."
    ],
    "instructions": "Create a thoughtful story about memory and growth. Keep it safe, emotional, and meaningful.",
    "teacherPreview": "Deep prompt for older learners without being too dark."
  },
  {
    "type": "story-lab",
    "id": "story-14-other-self",
    "level": "creative-speakers",
    "category": "Ages 14–15 · Future Self",
    "topic": "A character meets another version of themselves: richer, braver, colder, kinder, more successful, or completely different. This other version says, “I am what you become if you make one choice tonight.”",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Create the character’s life before meeting the other self.",
      "Decide what the other version is like and why.",
      "Create the choice that will change the character’s future.",
      "Add a reason why the choice is difficult.",
      "End with which future the character chooses — or rejects."
    ],
    "instructions": "Create a story about identity, future, and choice. Decide who the character could become.",
    "teacherPreview": "Strong for point of view, internal conflict, and mature storytelling."
  },
  {
    "type": "story-lab",
    "id": "story-14-enemy-letter",
    "level": "creative-speakers",
    "category": "Ages 14–15 · Perspective Shift",
    "topic": "A character finds a letter written by someone they dislike. After reading it, they discover a side of the story they never knew. Suddenly, the “enemy” looks less like a villain and more like a person who was hurt too.",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Create why the two characters dislike each other.",
      "Decide where the letter is found and why it was hidden.",
      "Reveal something that changes the main character’s opinion.",
      "Show the struggle between pride and understanding.",
      "End with forgiveness, distance, honesty, or an unexpected conversation."
    ],
    "instructions": "Create a story where the character’s point of view changes after discovering hidden truth.",
    "teacherPreview": "Useful for empathy, perspective, and realistic emotional storytelling."
  },
  {
    "type": "story-lab",
    "id": "story-14-museum-unsaid",
    "level": "creative-speakers",
    "category": "Ages 14–15 · Deep Imagination",
    "topic": "A character enters a museum where every room holds words people never said: apologies, confessions, compliments, goodbye messages, and dreams. In the last room, they find words written for them.",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Create why the character enters the museum.",
      "Describe two or three rooms and what words they hold.",
      "Decide whose unsaid words affect the character most.",
      "Add a rule: the character can take only one sentence out of the museum.",
      "End with which sentence they choose and what they do with it."
    ],
    "instructions": "Create a symbolic story about words, silence, and meaning. Choose the rooms and final sentence.",
    "teacherPreview": "Cinematic and emotional with room for mature interpretation."
  },
  {
    "type": "story-lab",
    "id": "story-14-lie-that-helped",
    "level": "creative-speakers",
    "category": "Ages 14–15 · Moral Conflict",
    "topic": "A character tells a lie to protect someone. At first, the lie saves the situation. Then it grows, spreads, and starts hurting people who were not supposed to be involved.",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Create who the character protects and why.",
      "Decide what the lie is and why it feels necessary at first.",
      "Show how the lie becomes bigger than expected.",
      "Add a moment where the character can confess or continue hiding it.",
      "End with whether the lie was understandable, wrong, or both."
    ],
    "instructions": "Create a realistic or imaginative story about a protective lie and its consequences.",
    "teacherPreview": "Good debate-style story with a character-driven moral question."
  },
  {
    "type": "story-lab",
    "id": "story-16-truth-illegal",
    "level": "teen-performers",
    "category": "Ages 16–17+ · Dystopian Truth",
    "topic": "A character lives in a world where truth is illegal. People survive by pretending, smiling, and saying what they are expected to say. One day, the character accidentally says one honest sentence in public — and everyone hears it.",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Create the world and why truth became illegal.",
      "Choose the honest sentence and why it escapes the character.",
      "Show how different people react: fear, relief, anger, hope, or betrayal.",
      "Add a consequence that forces the character to choose silence or resistance.",
      "End with whether one sentence can change a society."
    ],
    "instructions": "Create a mature story about truth, control, and courage. Build the world, the sentence, and its consequences.",
    "teacherPreview": "Advanced prompt for world-building and deeper themes."
  },
  {
    "type": "story-lab",
    "id": "story-16-sell-endings",
    "level": "teen-performers",
    "category": "Ages 16–17+ · Philosophical Fantasy",
    "topic": "A character has a strange job: they sell endings. Happy endings, peaceful endings, revenge endings, mysterious endings. One day, a customer asks for an ending that should not exist.",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Create the character’s shop, rules, and reason for selling endings.",
      "Decide what kind of ending the customer asks for.",
      "Explain why this ending should not exist.",
      "Show what happens when an ending is changed before the story is ready.",
      "End with the character refusing, accepting, or creating a new kind of ending."
    ],
    "instructions": "Create a fantasy story about control, destiny, and endings. Decide what endings cost.",
    "teacherPreview": "High-concept and theatrical without being locked to theatre."
  },
  {
    "type": "story-lab",
    "id": "story-16-borrowed-emotions",
    "level": "teen-performers",
    "category": "Ages 16–17+ · Emotional Sci-Fi",
    "topic": "A character lives in a city where people can borrow emotions for a day: courage, peace, love, anger, confidence. The character borrows one emotion for a simple reason, but when the day ends, they do not want to return it.",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Create how the emotion system works and who controls it.",
      "Choose which emotion the character borrows and why.",
      "Show how the borrowed emotion changes their choices.",
      "Add a problem when the emotion must be returned.",
      "End with whether emotions can be owned, borrowed, or earned."
    ],
    "instructions": "Create a story about feelings, identity, and ownership. Build the city and the character’s choice.",
    "teacherPreview": "Great for advanced learners who can handle metaphor and society rules."
  },
  {
    "type": "story-lab",
    "id": "story-16-assigned-role",
    "level": "teen-performers",
    "category": "Ages 16–17+ · Identity",
    "topic": "In a certain world, every person receives a role at sixteen: Leader, Helper, Dreamer, Worker, Protector, Entertainer. A character receives a role everyone celebrates — but secretly, it feels completely wrong.",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Create the world and how roles are chosen.",
      "Choose the role the character receives and the role they actually want.",
      "Show the pressure from family, society, friends, or fear.",
      "Add someone who benefits from keeping the character in the wrong role.",
      "End with whether they accept, escape, change the system, or redefine the role."
    ],
    "instructions": "Create a story about identity, expectation, and freedom. Decide what the role means and how the character responds.",
    "teacherPreview": "Strong age-appropriate theme for teens: pressure vs. self-understanding."
  },
  {
    "type": "story-lab",
    "id": "story-16-perfect-version",
    "level": "teen-performers",
    "category": "Ages 16–17+ · Psychological Mystery",
    "topic": "A character meets someone who looks exactly like them, but perfect: calmer, smarter, more successful, more loved. Everyone prefers the perfect version. Only the original character knows something is wrong.",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Create where the perfect version appears and how people react.",
      "Decide what makes the perfect version suspicious.",
      "Show the original character’s jealousy, fear, or determination.",
      "Reveal what the perfect version wants.",
      "End with whether perfection is defeated, accepted, exposed, or understood."
    ],
    "instructions": "Create a suspenseful story about comparison, identity, and self-worth without making it too dark.",
    "teacherPreview": "Advanced emotional conflict with mystery and performance potential."
  },
  {
    "type": "story-lab",
    "id": "story-16-last-door",
    "level": "teen-performers",
    "category": "Ages 16–17+ · Symbolic Journey",
    "topic": "A character reaches a hallway with hundreds of doors. Each door shows a life they could live. The final door has no picture, no handle, and only one sentence written on it: “This one is yours.”",
    "characters": [],
    "options": [],
    "requirements": [],
    "starters": [
      "Create why the character arrives at the hallway.",
      "Describe two or three possible lives behind other doors.",
      "Show the temptation of choosing an easy, rich, safe, or famous life.",
      "Explain why the final door has no picture.",
      "End with whether the character opens it and what they understand."
    ],
    "instructions": "Create a symbolic story about choice and future. Decide what each door represents and what the character chooses.",
    "teacherPreview": "Beautiful advanced story spark for meaningful voice storytelling."
  }
];

const CUSTOM_MISSION_BANK_KEY = "dramagic_custom_mission_bank_items";

function readCustomMissionBankItems() {
  try {
    const saved = JSON.parse(localStorage.getItem(CUSTOM_MISSION_BANK_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveCustomMissionBankItems(items) {
  localStorage.setItem(CUSTOM_MISSION_BANK_KEY, JSON.stringify(Array.isArray(items) ? items : []));
}

function getAllMissionBankItemCount() {
  return MISSION_TYPES.reduce(function (total, item) {
    return total + getMissionBankItems(item.id).length;
  }, 0);
}

function getMissionBankItemById(bankId, type = "") {
  const allItems = [];
  MISSION_TYPES.forEach(function (typeItem) {
    allItems.push.apply(allItems, getMissionBankItems(typeItem.id));
  });

  return allItems.find(function (item) {
    return item.id === bankId && (!type || item.type === type);
  }) || null;
}

function getMissionTypeConfig(type) {
  return MISSION_TYPE_CONFIGS[type] || MISSION_TYPE_CONFIGS["voice-imitation"];
}

function getMissionBankItems(type, level = "") {
  const selectedType = type || "voice-imitation";
  const allowedTypes = MISSION_TYPES.map(function (item) { return item.id; });

  const source = MISSION_EXTRA_BANK
    .concat(STORY_LAB_CREATIVE_BANK)
    .concat(readCustomMissionBankItems())
    .map(function (item) {
      return {
        ...item,
        type: item.type || selectedType,
        category: item.category || getMissionTypeLabel(item.type || selectedType).replace(/[🎙️📖🎬]/g, "").trim()
      };
    })
    .filter(function (item) {
      return item.type === selectedType && allowedTypes.includes(item.type);
    });

  if (!level) return source;

  return source.filter(function (item) {
    return item.level === level;
  });
}

function getDefaultMissionOptions(type) {
  const config = getMissionTypeConfig(type);
  if (config.usesOptions === false) return [];
  return config.options || ["Yes", "No", "Maybe"];
}

function getMissionOptions(mission) {
  if (Array.isArray(mission.options) && mission.options.length) return mission.options;
  return getDefaultMissionOptions(mission.type);
}

function getDefaultCharactersForMissionType(type) {
  const config = getMissionTypeConfig(type);
  if (config.usesChoices === false) return [];
  return config.defaultCharacters || getDefaultCharactersForType(type);
}

function getDefaultRequirementsForMissionType(type) {
  const config = getMissionTypeConfig(type);
  if (config.usesRequirements === false) return [];
  return config.defaultRequirements || DEFAULT_MISSION_REQUIREMENTS;
}

function getDefaultStartersForMissionType(type) {
  return getMissionTypeConfig(type).defaultStarters || DEFAULT_MISSION_STARTERS;
}


const STORAGE_KEYS = {
  session: "dramagic_demo_session",
  chatMessages: "dramagic_demo_homework_chat_messages",
  missions: "dramagic_demo_missions",
  missionSubmissions: "dramagic_demo_mission_submissions",
  threadReads: "dramagic_demo_chat_thread_reads",
  activeThread: "dramagic_active_chat_thread",
  activeFilter: "dramagic_active_chat_filter"
};

let currentUser = null;
let currentProfile = null;
let chatMessages = [];
let missions = [];
let missionSubmissions = [];
let threadReads = {};
let activeChatFilter = "channels";
let activeThread = { type: "group", id: "group-A", classLetter: "A" };
let classSearchTerm = "";
let studentSearchTerm = "";
let pendingMissionSubmission = null;
let expandedChatMissionId = "";

let mediaRecorder = null;
let recordedChunks = [];
let recordingTimerInterval = null;
let recordingStartedAt = null;
let currentAudioStream = null;

const backBtn = document.getElementById("backBtn");
const sidebarRoleText = document.getElementById("sidebarRoleText");
const sidebarUserAvatar = document.getElementById("sidebarUserAvatar");
const sidebarUserName = document.getElementById("sidebarUserName");
const sidebarUserRole = document.getElementById("sidebarUserRole");
const classSearchInput = document.getElementById("classSearchInput");
const classList = document.getElementById("classList");
const newPrivateChatBtn = document.getElementById("newPrivateChatBtn");
const studentPickerPanel = document.getElementById("studentPickerPanel");
const closeStudentPickerBtn = document.getElementById("closeStudentPickerBtn");
const studentSearchInput = document.getElementById("studentSearchInput");
const studentPickerList = document.getElementById("studentPickerList");
const activeClassIcon = document.getElementById("activeClassIcon");
const chatTitle = document.getElementById("chatTitle");
const chatSubtitle = document.getElementById("chatSubtitle");
const chatModePill = document.getElementById("chatModePill");
const chatHomeworkCard = document.getElementById("chatHomeworkCard");
const chatHomeworkTitle = document.getElementById("chatHomeworkTitle");
const chatHomeworkText = document.getElementById("chatHomeworkText");
const chatHomeworkVideo = document.getElementById("chatHomeworkVideo");
const chatMessagesBox = document.getElementById("chatMessages");
const emojiBtn = document.getElementById("emojiBtn");
const emojiPicker = document.getElementById("emojiPicker");
const chatInput = document.getElementById("chatInput");
const recordVoiceBtn = document.getElementById("recordVoiceBtn");
const stopVoiceBtn = document.getElementById("stopVoiceBtn");
const sendChatBtn = document.getElementById("sendChatBtn");
const recordingBar = document.getElementById("recordingBar");
const recordingTimer = document.getElementById("recordingTimer");
const chatApp = document.querySelector(".chat-app");
const mobileSidebarBtn = document.getElementById("mobileSidebarBtn");
const mobileSidebarOverlay = document.getElementById("mobileSidebarOverlay");
const sidebarDismissBtn = document.getElementById("sidebarDismissBtn");

initChatPage();

function initChatPage() {
  applyChatThemeFromSettings();

  currentUser = normalizeSession(getSavedSession());
  currentProfile = currentUser;

  if (!currentUser) {
    window.location.href = "auth.html#signin";
    return;
  }

  seedDemoChatData();
  loadChatData();
  loadThreadReads();
  seedDemoMissionData();
  loadMissionData();
  activeThread = getInitialThread();
  activeChatFilter = activeThread.type === "private" ? "private" : "channels";
  markActiveThreadAsRead();

  setupChatEvents();
  setupThemeSync();
  setupMobileKeyboardBehavior();

  renderSidebarUser();
  renderStudentPicker();
  renderChatTabs();
  renderChatList();
  renderChatHeader();
  renderChatMessages();

  setTimeout(function () {
    if (chatInput && !isMobileLayout()) chatInput.focus();
  }, 120);
}

/* =====================================================
   EVENTS
===================================================== */

function setupChatEvents() {
  if (backBtn) {
    backBtn.addEventListener("click", goBackToDashboard);
  }

  if (mobileSidebarBtn) {
    mobileSidebarBtn.addEventListener("click", function () {
      openMobileSidebar();
    });
  }

  if (mobileSidebarOverlay) {
    mobileSidebarOverlay.addEventListener("click", function () {
      closeMobileSidebar();
    });
  }

  if (sidebarDismissBtn) {
    sidebarDismissBtn.addEventListener("click", function () {
      closeMobileSidebar();
    });
  }

  if (classSearchInput) {
    classSearchInput.addEventListener("input", function () {
      classSearchTerm = classSearchInput.value.trim().toLowerCase();
      renderChatList();
    });
  }

  document.querySelectorAll("[data-chat-filter]").forEach(function (button) {
    button.addEventListener("click", function () {
      activeChatFilter = button.dataset.chatFilter || "channels";
      localStorage.setItem(STORAGE_KEYS.activeFilter, activeChatFilter);

      if (activeChatFilter === "homework-templates" && !canSeeTeacherArea()) {
        selectClassChannel(getCurrentStudentClass());
        return;
      }

      if (activeChatFilter === "homework-templates") {
        openMissionsHome();
      } else if (activeChatFilter === "private") {
        const firstPrivate = getVisiblePrivateContacts()[0];
        if (firstPrivate) selectPrivateChat(firstPrivate.id);
      } else {
        const firstClass = getVisibleClasses()[0];
        if (firstClass) selectClassChannel(firstClass.letter);
      }

      renderChatTabs();
      renderChatList();
    });
  });

  if (newPrivateChatBtn) {
    newPrivateChatBtn.addEventListener("click", function () {
      if (!canSeeTeacherArea()) {
        activeChatFilter = "private";
        const selfStudent = getCurrentStudentRecord();
        selectPrivateChat(selfStudent.id);
        return;
      }

      activeChatFilter = "private";
      localStorage.setItem(STORAGE_KEYS.activeFilter, activeChatFilter);
      renderChatTabs();
      renderChatList();
      toggleStudentPicker(true);
    });
  }

  if (closeStudentPickerBtn) {
    closeStudentPickerBtn.addEventListener("click", function () {
      toggleStudentPicker(false);
    });
  }

  if (studentSearchInput) {
    studentSearchInput.addEventListener("input", function () {
      studentSearchTerm = studentSearchInput.value.trim().toLowerCase();
      renderStudentPicker();
    });
  }

  if (emojiBtn) {
    emojiBtn.addEventListener("click", function () {
      if (emojiPicker) emojiPicker.classList.toggle("hidden");
    });
  }

  if (emojiPicker) {
    emojiPicker.querySelectorAll("button").forEach(function (button) {
      button.addEventListener("click", function () {
        addEmojiToInput(button.textContent);
      });
    });
  }

  if (sendChatBtn) {
    sendChatBtn.addEventListener("click", sendTextMessage);
  }

  if (chatInput) {
    chatInput.addEventListener("input", autoResizeChatInput);

    chatInput.addEventListener("keydown", function (event) {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        sendTextMessage();
      }
    });
  }

  if (recordVoiceBtn) {
    recordVoiceBtn.addEventListener("click", startVoiceRecording);
  }

  if (stopVoiceBtn) {
    stopVoiceBtn.addEventListener("click", stopVoiceRecording);
  }

  setupMissionDelegation();

  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      if (chatApp && chatApp.classList.contains("sidebar-open")) {
        closeMobileSidebar();
        return;
      }

      if (studentPickerPanel && !studentPickerPanel.classList.contains("hidden")) {
        toggleStudentPicker(false);
        return;
      }

      goBackToDashboard();
    }
  });
}

/* =====================================================
   THEME
===================================================== */

function setupThemeSync() {
  window.addEventListener("storage", function (event) {
    if (event.key === "dramagic_settings" || event.key === "dramagic_theme") {
      applyChatThemeFromSettings();
    }
  });

  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", function () {
      applyChatThemeFromSettings();
    });
  }
}

function applyChatThemeFromSettings() {
  const theme = getSavedChatTheme();

  const systemDark =
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const useDark = theme === "dark" || (theme === "system" && systemDark);

  document.documentElement.classList.toggle("dark-mode", useDark);
  document.documentElement.classList.toggle("light-mode", !useDark);

  if (document.body) {
    document.body.classList.toggle("dark-mode", useDark);
    document.body.classList.toggle("light-mode", !useDark);
  }
}

function getSavedChatTheme() {
  try {
    const settings = JSON.parse(localStorage.getItem("dramagic_settings")) || {};
    return settings.theme || localStorage.getItem("dramagic_theme") || "light";
  } catch {
    return localStorage.getItem("dramagic_theme") || "light";
  }
}

/* =====================================================
   SIDEBAR
===================================================== */

function renderSidebarUser() {
  if (sidebarUserAvatar) sidebarUserAvatar.src = getCurrentUserAvatar();
  if (sidebarUserName) sidebarUserName.textContent = currentProfile?.full_name || "Dramagic User";
  if (sidebarUserRole) sidebarUserRole.textContent = getRoleLabel();

  if (sidebarRoleText) {
    if (isStudent()) {
      sidebarRoleText.textContent = `Class ${getCurrentStudentClass()} + private teacher chat`;
    } else if (isCEO()) {
      sidebarRoleText.textContent = "CEO oversight: all channels and private chats";
    } else {
      sidebarRoleText.textContent = "Channels, missions, and private chats";
    }
  }

  if (newPrivateChatBtn) {
    newPrivateChatBtn.textContent = isCEO()
      ? "Audit chats"
      : (canSeeTeacherArea() ? "New chat" : "Teacher chat");
  }
}

function renderChatTabs() {
  const tabsRow = document.querySelector(".chat-tabs-row");
  if (tabsRow) tabsRow.classList.toggle("student-tabs-mode", isStudent());

  document.querySelectorAll("[data-chat-filter]").forEach(function (button) {
    const isMissionTab = button.dataset.chatFilter === "homework-templates";

    if (isMissionTab) {
      button.textContent = canSeeTeacherArea() ? "Missions" : "Homework";
      button.classList.toggle("hidden", isStudent());
    }

    button.classList.toggle("active", button.dataset.chatFilter === activeChatFilter);
  });
}

function renderChatList() {
  if (!classList) return;

  if (activeChatFilter === "homework-templates") {
    renderMissionsList();
    return;
  }

  if (activeChatFilter === "private") {
    renderPrivateChatList();
    return;
  }

  renderChannelList();
}

function renderChannelList() {
  let visibleClasses = getVisibleClasses();

  if (classSearchTerm) {
    visibleClasses = visibleClasses.filter(function (classItem) {
      const haystack = `${classItem.name} ${classItem.letter} ${classItem.subtitle}`.toLowerCase();
      return haystack.includes(classSearchTerm);
    });
  }

  if (visibleClasses.length === 0) {
    classList.innerHTML = `<div class="class-list-empty">No class channels found.</div>`;
    return;
  }

  classList.innerHTML = visibleClasses.map(renderClassChannelItem).join("\n");

  classList.querySelectorAll("[data-class-letter]").forEach(function (button) {
    button.addEventListener("click", function () {
      selectClassChannel(button.dataset.classLetter);
    });
  });
}

function renderPrivateChatList() {
  let contacts = getVisiblePrivateContacts();

  if (classSearchTerm) {
    contacts = contacts.filter(function (student) {
      const haystack = `${student.full_name} class ${student.classLetter} ${student.status}`.toLowerCase();
      return haystack.includes(classSearchTerm);
    });
  }

  if (contacts.length === 0) {
    classList.innerHTML = `<div class="class-list-empty">No private chats found.</div>`;
    return;
  }

  classList.innerHTML = contacts.map(renderPrivateChatItem).join("\n");

  classList.querySelectorAll("[data-student-id]").forEach(function (button) {
    button.addEventListener("click", function () {
      selectPrivateChat(button.dataset.studentId);
    });
  });
}

function renderMissionsList() {
  if (canSeeTeacherArea()) {
    const pendingCount = missionSubmissions.filter(function (submission) {
      return submission.status === "waiting-review";
    }).length;

    const reviewedCount = missionSubmissions.filter(function (submission) {
      return submission.status === "accepted" || submission.status === "featured" || submission.status === "rejected";
    }).length;

    classList.innerHTML = `
      <button class="class-chat-item mission-create-list-item" type="button" data-mission-action="create">
        <span class="class-item-avatar">＋</span>
        <span class="class-item-main">
          <span class="class-item-top">
            <strong>Create Mission</strong>
            <time>New</time>
          </span>
          <span class="class-item-preview">Create and publish one homework mission to a class.</span>
        </span>
        <span class="class-item-count">+</span>
      </button>

      <button class="class-chat-item" type="button" data-mission-action="submissions">
        <span class="class-item-avatar">📥</span>
        <span class="class-item-main">
          <span class="class-item-top">
            <strong>Pending Submissions</strong>
            <time>${pendingCount}</time>
          </span>
          <span class="class-item-preview">See who submitted, then accept or request redo privately.</span>
        </span>
        <span class="class-item-count">${pendingCount}</span>
      </button>

      <div class="mission-sidebar-note">
        <strong>Simple rule</strong>
        <span>Student work stays private until you accept it.</span>
        <span>${reviewedCount} reviewed homework item${reviewedCount === 1 ? "" : "s"}</span>
      </div>
    `;

    attachMissionListEvents();
    return;
  }

  const studentClass = getCurrentStudentClass();
  const mission = getActiveMissionForClass(studentClass);
  const submission = mission ? getMySubmissionForMission(mission.id) : null;

  classList.innerHTML = `
    <button class="class-chat-item ${mission ? "active" : ""}" type="button" data-mission-action="student-home">
      <span class="class-item-avatar">${mission ? clean(getMissionIcon(mission.type)) : "🎭"}</span>
      <span class="class-item-main">
        <span class="class-item-top">
          <strong>Today’s Mission</strong>
          <time>Class ${clean(studentClass)}</time>
        </span>
        <span class="class-item-preview">${mission ? clean(mission.topic) : "No mission has been published yet."}</span>
      </span>
      <span class="class-item-count">${mission ? "Go" : "—"}</span>
    </button>

    <button class="class-chat-item" type="button" data-mission-action="my-submission">
      <span class="class-item-avatar">📤</span>
      <span class="class-item-main">
        <span class="class-item-top">
          <strong>My Homework</strong>
          <time>${submission ? clean(getStatusLabel(submission.status)) : "None"}</time>
        </span>
        <span class="class-item-preview">${submission ? clean(submission.feedback || "Your submission status is updated here.") : "Submit your homework from the mission card."}</span>
      </span>
      <span class="class-item-count">${submission ? "✓" : "0"}</span>
    </button>
  `;

  attachMissionListEvents();
}


function renderMissionListItem(mission, classItem) {
  const submissions = getSubmissionsForMission(mission.id);
  const pending = submissions.filter(function (item) {
    return item.status === "waiting-review";
  }).length;

  return `
    <button class="class-chat-item active" type="button" data-mission-id="${clean(mission.id)}">
      <span class="class-item-avatar">${clean(getMissionIcon(mission.type))}</span>
      <span class="class-item-main">
        <span class="class-item-top">
          <strong>${clean(classItem.name)} • ${clean(mission.title)}</strong>
          <time>${clean(mission.deadline || "Active")}</time>
        </span>
        <span class="class-item-preview">${clean(mission.topic)}</span>
      </span>
      <span class="class-item-count">${pending}</span>
    </button>
  `;
}

function attachMissionListEvents() {
  classList.querySelectorAll("[data-mission-action]").forEach(function (button) {
    button.addEventListener("click", function () {
      const action = button.dataset.missionAction;

      if (action === "create") {
        openMissionCreator(button.dataset.prefillClass || "");
      } else if (action === "submissions") {
        openMissionSubmissions();
      } else if (action === "bank") {
        openQuestionBank();
      } else if (action === "templates") {
        openHomeworkTemplatesView();
      } else if (action === "student-home") {
        openStudentMissionHome();
      } else if (action === "my-submission") {
        openStudentMissionHome("submission");
      }
    });
  });

  classList.querySelectorAll("[data-mission-id]").forEach(function (button) {
    button.addEventListener("click", function () {
      openMissionDetails(button.dataset.missionId);
    });
  });
}

function renderClassChannelItem(classItem) {
  const threadId = getGroupThreadId(classItem.letter);
  const stats = getThreadStats(threadId);
  const active = activeThread.type === "group" && activeThread.classLetter === classItem.letter;
  const unreadBadge = renderUnreadBadge(threadId, active);

  return `
    <button class="class-chat-item ${active ? "active" : ""}" type="button" data-class-letter="${clean(classItem.letter)}">
      <span class="class-item-avatar channel-avatar">${clean(classItem.icon)}</span>

      <span class="class-item-main">
        <span class="class-item-top">
          <strong>${clean(classItem.name)} Channel</strong>
          <time>${clean(stats.time)}</time>
        </span>

        <span class="class-item-preview">${clean(stats.preview)}</span>
      </span>

      ${unreadBadge}
    </button>
  `;
}

function renderPrivateChatItem(student) {
  const threadId = getPrivateThreadId(student.id);
  const stats = getThreadStats(threadId);
  const active = activeThread.type === "private" && activeThread.studentId === student.id;
  const previewText = stats.preview || (isCEO()
    ? `CEO oversight • Class ${student.classLetter} • ${student.status}`
    : `Class ${student.classLetter} • ${student.status}`);
  const dotTitle = isCEO() ? "CEO can audit this private chat" : "Private chat";
  const unreadBadge = renderUnreadBadge(threadId, active);
  const trailing = unreadBadge || `<span class="private-status-dot" title="${clean(dotTitle)}"></span>`;

  return `
    <button class="class-chat-item private-chat-item ${active ? "active" : ""}" type="button" data-student-id="${clean(student.id)}">
      <img class="class-item-photo" src="${clean(getStudentAvatar(student))}" alt="${clean(student.full_name)} profile picture" />

      <span class="class-item-main">
        <span class="class-item-top">
          <strong>${clean(student.full_name)}</strong>
          <time>${clean(stats.time)}</time>
        </span>

        <span class="class-item-preview">${clean(previewText)}</span>
      </span>

      ${trailing}
    </button>
  `;
}

function renderHomeworkTemplateItem(template) {
  return `
    <button class="class-chat-item homework-template-item" type="button" data-homework-template="${clean(template.id)}">
      <span class="class-item-avatar">${clean(template.icon)}</span>

      <span class="class-item-main">
        <span class="class-item-top">
          <strong>${clean(template.title)}</strong>
          <time>Template</time>
        </span>

        <span class="class-item-preview">${clean(template.preview)}</span>
      </span>

      <span class="class-item-count" title="Template">HW</span>
    </button>
  `;
}

function renderStudentPicker() {
  if (!studentPickerList) return;

  let students = DEMO_STUDENTS;

  if (studentSearchTerm) {
    students = students.filter(function (student) {
      const haystack = `${student.full_name} class ${student.classLetter} ${student.status}`.toLowerCase();
      return haystack.includes(studentSearchTerm);
    });
  }

  if (students.length === 0) {
    studentPickerList.innerHTML = `<div class="class-list-empty">No Dramagicians found.</div>`;
    return;
  }

  studentPickerList.innerHTML = students.map(function (student) {
    return `
      <button class="student-picker-item" type="button" data-picker-student-id="${clean(student.id)}">
        <img src="${clean(getStudentAvatar(student))}" alt="${clean(student.full_name)} profile picture" />

        <span>
          <strong>${clean(student.full_name)}</strong>
          <small>Class ${clean(student.classLetter)} • ${clean(student.status)}</small>
        </span>
      </button>
    `;
  }).join("\n");

  studentPickerList.querySelectorAll("[data-picker-student-id]").forEach(function (button) {
    button.addEventListener("click", function () {
      selectPrivateChat(button.dataset.pickerStudentId);
      toggleStudentPicker(false);
    });
  });
}

function toggleStudentPicker(show) {
  if (!studentPickerPanel) return;

  studentPickerPanel.classList.toggle("hidden", !show);

  if (show) {
    studentSearchTerm = "";
    if (studentSearchInput) {
      studentSearchInput.value = "";
      setTimeout(function () {
        studentSearchInput.focus();
      }, 80);
    }

    renderStudentPicker();
  }
}

function getVisibleClasses() {
  if (isStudent()) {
    const studentClass = getCurrentStudentClass();

    return DEMO_CLASSES.filter(function (item) {
      return item.letter === studentClass;
    });
  }

  return DEMO_CLASSES;
}

function getVisiblePrivateContacts() {
  if (isStudent()) {
    return [getCurrentStudentRecord()];
  }

  // CEO oversight: CEO sees every private teacher/Dramagician thread.
  // Teachers also see learner private chats in this frontend demo.
  // Later with Supabase, restrict teachers to their assigned classes and keep CEO global.
  return DEMO_STUDENTS;
}

function getThreadStats(threadId) {
  const threadMessages = getMessagesForThread(threadId).sort(function (a, b) {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  const latest = threadMessages[threadMessages.length - 1];

  if (!latest) {
    return {
      count: 0,
      preview: "No messages yet. Start the conversation.",
      time: ""
    };
  }

  return {
    count: threadMessages.length,
    preview: latest.type === "mission" ? `🎭 Mission: ${latest.missionTopic || "Published assignment"}` : (latest.type === "voice" ? "🎙️ Voice note" : latest.text),
    time: formatShortTime(latest.createdAt)
  };
}

function loadThreadReads() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.threadReads));
    threadReads = saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
  } catch {
    threadReads = {};
  }
}

function saveThreadReads() {
  localStorage.setItem(STORAGE_KEYS.threadReads, JSON.stringify(threadReads));
}

function getThreadReadKey(threadId) {
  const userId = currentUser?.id || currentProfile?.id || currentUser?.username || currentProfile?.username || "guest";
  return `${userId}::${threadId}`;
}

function getThreadLastReadTime(threadId) {
  const raw = threadReads[getThreadReadKey(threadId)];
  const time = raw ? new Date(raw).getTime() : 0;
  return Number.isFinite(time) ? time : 0;
}

function isMyMessage(message) {
  return !!currentUser && message.senderId === currentUser.id;
}

function getUnreadCountForThread(threadId) {
  const lastRead = getThreadLastReadTime(threadId);

  return getMessagesForThread(threadId).filter(function (message) {
    const createdAt = new Date(message.createdAt).getTime();
    if (!Number.isFinite(createdAt) || createdAt <= lastRead) return false;

    // A user should not get a notification badge for messages they sent themselves.
    return !isMyMessage(message);
  }).length;
}

function renderUnreadBadge(threadId, active) {
  if (active) return "";

  const unreadCount = getUnreadCountForThread(threadId);
  if (!unreadCount) return "";

  const label = unreadCount === 1 ? "1 new message" : `${unreadCount} new messages`;
  return `<span class="class-item-count unread-badge" title="${clean(label)}" aria-label="${clean(label)}">${unreadCount}</span>`;
}

function markThreadRead(threadId) {
  if (!threadId) return;

  threadReads[getThreadReadKey(threadId)] = new Date().toISOString();
  saveThreadReads();
}

function markActiveThreadAsRead() {
  if (!activeThread || !activeThread.id) return;
  if (activeThread.type !== "group" && activeThread.type !== "private") return;

  markThreadRead(activeThread.id);
}


/* =====================================================
   MISSIONS INSIDE HOMEWORK TAB
===================================================== */

function setupMissionDelegation() {
  if (!chatMessagesBox) return;

  chatMessagesBox.addEventListener("click", function (event) {
    const button = event.target.closest("[data-mission-action], [data-bank-topic], [data-template-preview], [data-select-mission-character], [data-select-mission-opinion], [data-review-submission], [data-download-submission]");
    if (!button) return;

    if (button.dataset.bankTopic) {
      applyBankTopicToCreator(button.dataset.bankTopic);
      return;
    }

    if (button.dataset.templatePreview) {
      previewHomeworkTemplate(button.dataset.templatePreview);
      return;
    }

    if (button.dataset.selectMissionCharacter) {
      selectMissionChoice("character", button.dataset.selectMissionCharacter);
      return;
    }

    if (button.dataset.selectMissionOpinion) {
      selectMissionChoice("opinion", button.dataset.selectMissionOpinion);
      return;
    }

    if (button.dataset.reviewSubmission) {
      reviewMissionSubmission(button.dataset.reviewSubmission, button.dataset.reviewStatus);
      return;
    }

    if (button.dataset.downloadSubmission) {
      downloadMissionSubmission(button.dataset.downloadSubmission);
      return;
    }

    const action = button.dataset.missionAction;

    if (action === "create") openMissionCreator(button.dataset.prefillClass || "", {
      type: button.dataset.prefillType || "",
      level: button.dataset.prefillLevel || "",
      bankId: button.dataset.prefillBankId || ""
    });
    if (action === "save-bank") saveCurrentMissionToBank();
    if (action === "publish") publishMissionFromForm();
    if (action === "submissions") openMissionSubmissions(button.dataset.missionId || "");
    if (action === "bank") openQuestionBank();
    if (action === "student-home") openStudentMissionHome();
    if (action === "student-submit-demo") createDemoMissionSubmission(button.dataset.missionId);
    if (action === "student-record") beginMissionRecording(button.dataset.missionId);
    if (action === "open-chat-mission") {
      expandedChatMissionId = button.dataset.missionId || "";
      renderChatMessages();
    }
    if (action === "close-chat-mission") {
      expandedChatMissionId = "";
      renderChatMessages();
    }
    if (action === "details") openMissionDetails(button.dataset.missionId);
    if (action === "templates") openHomeworkTemplatesView();
  });

  chatMessagesBox.addEventListener("change", function (event) {
    const target = event.target;
    if (!target) return;

    if (target.id === "missionCreatorLevel") {
      refreshCreatorBankOptions();
    }

    if (target.id === "missionCreatorBankTopic") {
      applyBankTopicToCreator(target.value);
    }

    if (target.id === "missionCreatorType") {
      refreshCreatorBankOptions();
      refreshCreatorTypeHelper();
    }
  });
}

function openMissionsHome() {
  closeMobileSidebar();

  if (!canSeeTeacherArea()) {
    selectClassChannel(getCurrentStudentClass());
    return;
  }

  activeChatFilter = "homework-templates";
  activeThread = {
    type: "missions",
    id: "missions-home"
  };

  localStorage.setItem(STORAGE_KEYS.activeFilter, activeChatFilter);
  saveActiveThread(false);

  renderChatTabs();
  renderChatList();
  renderMissionsHeader();

  if (canSeeTeacherArea()) {
    renderTeacherMissionsHome();
  } else {
    renderStudentMissionHome();
  }
}

function renderMissionsHeader(title = "Assignments / Missions", subtitle = "") {
  if (activeClassIcon) activeClassIcon.textContent = "🎭";
  if (chatTitle) chatTitle.textContent = title;
  if (chatSubtitle) chatSubtitle.textContent = subtitle || (canSeeTeacherArea()
    ? "Create, publish, and review class missions"
    : "See today’s mission and submit your voice note");
  if (chatModePill) chatModePill.textContent = "Missions";

  if (chatHomeworkVideo) chatHomeworkVideo.classList.add("hidden");
  if (chatHomeworkCard) chatHomeworkCard.classList.remove("hidden");
  if (chatHomeworkTitle) chatHomeworkTitle.textContent = canSeeTeacherArea()
    ? "Homework Control"
    : "Today’s Mission";
  if (chatHomeworkText) chatHomeworkText.textContent = canSeeTeacherArea()
    ? "Create missions and review pending submissions. Student work stays private until accepted."
    : "Open the mission, submit your homework, and check feedback here.";

  if (chatInput) {
    chatInput.placeholder = "Use the assignment cards above...";
  }
}

function renderTeacherMissionsHome() {
  const pending = missionSubmissions
    .filter(function (item) { return item.status === "waiting-review"; })
    .sort(function (a, b) { return new Date(b.createdAt) - new Date(a.createdAt); });

  const reviewed = missionSubmissions
    .filter(function (item) { return item.status !== "waiting-review"; })
    .sort(function (a, b) { return new Date(b.reviewedAt || b.createdAt) - new Date(a.reviewedAt || a.createdAt); });

  if (!chatMessagesBox) return;

  chatMessagesBox.innerHTML = `
    <div class="mission-screen mission-simple-home">
      <section class="mission-hero-panel mission-clean-control-panel">
        <span class="mission-kicker">Homework Control</span>
        <h2>Create Mission</h2>
        <p>Create the homework mission, then review submissions from one clean place. Student work is not posted in the class chat until it is accepted.</p>

        <div class="mission-actions-row">
          <button class="mission-primary-btn" type="button" data-mission-action="create">＋ Create Mission</button>
          <button class="mission-soft-btn" type="button" data-mission-action="submissions">📥 Pending Submissions (${pending.length})</button>
        </div>
      </section>

      <section class="mission-review-section">
        <div class="mission-section-title-row">
          <div>
            <span class="mission-kicker">Waiting for Review</span>
            <h2>Pending submissions</h2>
          </div>
          <span class="mission-status waiting-review">${pending.length} waiting</span>
        </div>

        ${pending.length ? pending.map(renderReviewSubmissionCard).join("\n") : `
          <section class="mission-empty-card compact-empty">
            <div class="empty-icon">📥</div>
            <h2>No pending homework</h2>
            <p>When a Dramagician submits a voice note or demo homework, it will appear here.</p>
          </section>
        `}
      </section>

      ${reviewed.length ? `
        <section class="mission-review-section reviewed-homework-section">
          <div class="mission-section-title-row">
            <div>
              <span class="mission-kicker">Already Reviewed</span>
              <h2>Accepted / Needs Redo</h2>
            </div>
            <span class="mission-status accepted">${reviewed.length} reviewed</span>
          </div>
          ${reviewed.slice(0, 6).map(renderReviewSubmissionCard).join("\n")}
        </section>
      ` : ""}
    </div>
  `;
}


function openMissionCreator(prefillClass = "", preset = {}) {
  closeMobileSidebar();

  activeChatFilter = "homework-templates";
  activeThread = {
    type: "mission-create",
    id: "mission-create"
  };

  const initialType = preset.type || "story-lab";
  const initialLevel = preset.level || "junior-actors";

  renderChatTabs();
  renderChatList();
  renderMissionsHeader("Create Mission", "Choose from the bank, edit if needed, then publish to the class.");

  if (!chatMessagesBox) return;

  chatMessagesBox.innerHTML = `
    <div class="mission-screen">
      <section class="mission-builder-card enhanced-mission-builder">
        <div class="mission-builder-head">
          <div>
            <span class="mission-kicker">Mission Builder</span>
            <h2>Create a class mission</h2>
            <p>Pick a ready story from the bank, customize the details, then send it to the class chat.</p>
          </div>
          <button class="mission-soft-btn" type="button" data-mission-action="bank">Open Bank</button>
        </div>

        <div class="mission-builder-note">
          <strong>Teacher flow:</strong>
          <span>Choose mission type + level → pick a bank task → edit the instructions → publish.</span>
        </div>

        <div class="mission-form-grid">
          <label>
            <span>Publish to class</span>
            <select id="missionCreatorClass">
              ${DEMO_CLASSES.map(function (item) {
                return `<option value="${clean(item.letter)}" ${prefillClass === item.letter ? "selected" : ""}>${clean(item.name)}</option>`;
              }).join("\n")}
            </select>
          </label>

          <label>
            <span>Mission type</span>
            <select id="missionCreatorType">
              ${MISSION_TYPES.map(function (item) {
                return `<option value="${clean(item.id)}" ${initialType === item.id ? "selected" : ""}>${clean(item.label)}</option>`;
              }).join("\n")}
            </select>
          </label>

          <label>
            <span>Level</span>
            <select id="missionCreatorLevel">
              ${MISSION_LEVELS.map(function (item) {
                return `<option value="${clean(item.id)}" ${initialLevel === item.id ? "selected" : ""}>${clean(item.label)}</option>`;
              }).join("\n")}
            </select>
          </label>

          <label>
            <span>Deadline</span>
            <input id="missionCreatorDeadline" type="text" placeholder="Example: Thursday 9 PM" value="Next session" />
          </label>

          <label class="wide">
            <span id="missionCreatorBankLabel">Choose from homework bank</span>
            <select id="missionCreatorBankTopic"></select>
          </label>

          <article id="missionCreatorSparkPreview" class="mission-spark-preview wide hidden" aria-live="polite"></article>

          <label class="wide">
            <span id="missionCreatorTopicLabel">Topic</span>
            <textarea id="missionCreatorTopic" rows="4" placeholder="Example: A stage curtain refused to open."></textarea>
          </label>

          <label class="wide">
            <span id="missionCreatorChoicesLabel">Character choices</span>
            <textarea id="missionCreatorCharacters" rows="3" placeholder="One per line"></textarea>
          </label>

          <label class="wide">
            <span id="missionCreatorOptionsLabel">Mood / option choices</span>
            <textarea id="missionCreatorOptions" rows="2" placeholder="One per line"></textarea>
          </label>

          <label class="wide">
            <span id="missionCreatorRequirementsLabel">Dramagician must include</span>
            <textarea id="missionCreatorRequirements" rows="3" placeholder="One per line"></textarea>
          </label>

          <label class="wide">
            <span id="missionCreatorStartersLabel">Detailed helper / ready speaking ideas</span>
            <textarea id="missionCreatorStarters" rows="6" placeholder="One idea per line"></textarea>
          </label>

          <label class="wide">
            <span id="missionCreatorVideoLabel">Video or material link (optional)</span>
            <input id="missionCreatorVideo" type="url" placeholder="YouTube / Drive / uploaded file link later" />
          </label>

          <label class="wide">
            <span id="missionCreatorInstructionsLabel">Extra instructions</span>
            <textarea id="missionCreatorInstructions" rows="4" placeholder="Tell Dramagicians exactly what to do."></textarea>
          </label>
        </div>

        <div id="missionTypeHelper" class="mission-helper-box"></div>

        <div class="mission-actions-row">
          <button class="mission-primary-btn" type="button" data-mission-action="publish">Publish Mission</button>
          <button class="mission-soft-btn" type="button" data-mission-action="save-bank">Save This to My Bank</button>
          <button class="mission-soft-btn" type="button" data-mission-action="student-home">Preview Student View</button>
        </div>
      </section>
    </div>
  `;

  refreshCreatorBankOptions();
  refreshCreatorTypeHelper();

  const bankTopic = document.getElementById("missionCreatorBankTopic");
  if (bankTopic && preset.bankId) {
    bankTopic.value = preset.bankId;
    applyBankTopicToCreator(preset.bankId);
  } else if (bankTopic && bankTopic.value) {
    applyBankTopicToCreator(bankTopic.value);
  }
}

function getMissionBankDropdownLabel(item, index = 0) {
  if (!item) return "Choose a spark";

  const category = String(item.category || "").replace(/^Ages\s*\d+[^·]*·\s*/i, "").trim();
  const topic = String(item.topic || "").trim();
  const firstSentence = (topic.split(/(?<=[.!?])\s+/)[0] || topic).trim();
  const shortSpark = firstSentence.length > 54 ? firstSentence.slice(0, 51).trim() + "…" : firstSentence;

  if (category && shortSpark) return `${index + 1}. ${category} — ${shortSpark}`;
  if (shortSpark) return `${index + 1}. ${shortSpark}`;
  return `${index + 1}. Story spark`;
}

function updateMissionCreatorSparkPreview(bankItem) {
  const preview = document.getElementById("missionCreatorSparkPreview");
  if (!preview) return;

  if (!bankItem) {
    preview.classList.add("hidden");
    preview.innerHTML = "";
    return;
  }

  const category = bankItem.category || "Story Lab Spark";
  const topic = bankItem.topic || "";
  const instructions = bankItem.instructions || "Create your own story from this spark. Choose the character name, setting, conflict, ending, and message.";
  const starters = Array.isArray(bankItem.starters) ? bankItem.starters.slice(0, 5) : [];

  preview.classList.remove("hidden");
  preview.innerHTML = `
    <div class="mission-spark-preview-top">
      <span>${clean(category)}</span>
      <strong>Full story spark</strong>
    </div>
    <p class="mission-spark-preview-text">${clean(topic)}</p>
    <div class="mission-spark-preview-task">
      <strong>What they create:</strong>
      <span>${clean(instructions)}</span>
    </div>
    ${starters.length ? `
      <details class="mission-spark-preview-details">
        <summary>Show story-building guide</summary>
        <ul>
          ${starters.map(function (line) { return `<li>${clean(line)}</li>`; }).join("")}
        </ul>
      </details>
    ` : ""}
  `;
}

function refreshCreatorBankOptions() {
  const typeSelect = document.getElementById("missionCreatorType");
  const levelSelect = document.getElementById("missionCreatorLevel");
  const bankSelect = document.getElementById("missionCreatorBankTopic");
  if (!levelSelect || !bankSelect) return;

  const type = typeSelect?.value || "voice-imitation";
  const level = levelSelect.value;
  const topics = getMissionBankItems(type, level);

  bankSelect.innerHTML = topics.map(function (item, index) {
    return `<option value="${clean(item.id)}">${clean(getMissionBankDropdownLabel(item, index))}</option>`;
  }).join("\n");

  if (topics[0]) {
    applyBankTopicToCreator(topics[0].id);
  } else {
    const config = getMissionTypeConfig(type);
    const usesChoices = config.usesChoices !== false;
    const usesOptions = config.usesOptions !== false;
    const usesRequirements = config.usesRequirements !== false;
    const topicInput = document.getElementById("missionCreatorTopic");
    const charactersInput = document.getElementById("missionCreatorCharacters");
    const optionsInput = document.getElementById("missionCreatorOptions");
    const requirementsInput = document.getElementById("missionCreatorRequirements");
    const startersInput = document.getElementById("missionCreatorStarters");
    const instructionsInput = document.getElementById("missionCreatorInstructions");
    if (topicInput) topicInput.value = "";
    updateMissionCreatorSparkPreview(null);
    if (charactersInput) charactersInput.value = usesChoices ? (config.defaultCharacters || []).join("\n") : "";
    if (optionsInput) optionsInput.value = usesOptions ? (config.options || []).join("\n") : "";
    if (requirementsInput) requirementsInput.value = usesRequirements ? (config.defaultRequirements || []).join("\n") : "";
    if (startersInput) startersInput.value = (config.defaultStarters || []).join("\n");
    if (instructionsInput) instructionsInput.value = getDefaultMissionInstructions(type);
  }
}

function applyBankTopicToCreator(bankId) {
  const typeSelect = document.getElementById("missionCreatorType");
  const type = typeSelect?.value || "voice-imitation";
  const bankItem = getMissionBankItems(type).find(function (item) {
    return item.id === bankId;
  }) || MISSION_EXTRA_BANK.find(function (item) {
    return item.id === bankId;
  });

  if (!bankItem) {
    updateMissionCreatorSparkPreview(null);
    return;
  }

  updateMissionCreatorSparkPreview(bankItem);

  const config = getMissionTypeConfig(type);
  const topicInput = document.getElementById("missionCreatorTopic");
  const charactersInput = document.getElementById("missionCreatorCharacters");
  const optionsInput = document.getElementById("missionCreatorOptions");
  const requirementsInput = document.getElementById("missionCreatorRequirements");
  const startersInput = document.getElementById("missionCreatorStarters");
  const instructionsInput = document.getElementById("missionCreatorInstructions");

  const usesChoices = config.usesChoices !== false;
  const usesOptions = config.usesOptions !== false;
  const usesRequirements = config.usesRequirements !== false;

  if (topicInput) topicInput.value = bankItem.topic || "";
  if (charactersInput) charactersInput.value = usesChoices ? (bankItem.characters || config.defaultCharacters || []).join("\n") : "";
  if (optionsInput) optionsInput.value = usesOptions ? (bankItem.options || config.options || []).join("\n") : "";
  if (requirementsInput) requirementsInput.value = usesRequirements ? (bankItem.requirements || config.defaultRequirements || []).join("\n") : "";
  if (startersInput) startersInput.value = (bankItem.starters || config.defaultStarters || []).join("\n");
  if (instructionsInput) instructionsInput.value = bankItem.instructions || getDefaultMissionInstructions(type);
}

function refreshCreatorTypeHelper() {
  const typeSelect = document.getElementById("missionCreatorType");
  const helper = document.getElementById("missionTypeHelper");
  if (!typeSelect || !helper) return;

  const type = typeSelect.value;
  const config = getMissionTypeConfig(type);

  const bankLabel = document.getElementById("missionCreatorBankLabel");
  const topicLabel = document.getElementById("missionCreatorTopicLabel");
  const topicInput = document.getElementById("missionCreatorTopic");
  const choicesLabel = document.getElementById("missionCreatorChoicesLabel");
  const choicesInput = document.getElementById("missionCreatorCharacters");
  const optionsLabel = document.getElementById("missionCreatorOptionsLabel");
  const optionsInput = document.getElementById("missionCreatorOptions");
  const requirementsLabel = document.getElementById("missionCreatorRequirementsLabel");
  const startersLabel = document.getElementById("missionCreatorStartersLabel");
  const videoLabel = document.getElementById("missionCreatorVideoLabel");
  const instructionsLabel = document.getElementById("missionCreatorInstructionsLabel");

  const usesChoices = config.usesChoices !== false;
  const usesOptions = config.usesOptions !== false;
  const usesRequirements = config.usesRequirements !== false;

  if (choicesInput) {
    const choicesWrap = choicesInput.closest("label");
    if (choicesWrap) choicesWrap.classList.toggle("hidden", !usesChoices);
    if (!usesChoices) choicesInput.value = "";
  }

  if (optionsInput) {
    const optionsWrap = optionsInput.closest("label");
    if (optionsWrap) optionsWrap.classList.toggle("hidden", !usesOptions);
    if (!usesOptions) optionsInput.value = "";
  }

  const requirementsInput = document.getElementById("missionCreatorRequirements");
  if (requirementsInput) {
    const requirementsWrap = requirementsInput.closest("label");
    if (requirementsWrap) requirementsWrap.classList.toggle("hidden", !usesRequirements);
    if (!usesRequirements) requirementsInput.value = "";
  }

  if (bankLabel) bankLabel.textContent = config.bankLabel;
  if (topicLabel) topicLabel.textContent = config.topicLabel;
  if (topicInput) topicInput.placeholder = config.topicPlaceholder;
  if (choicesLabel) choicesLabel.textContent = config.choiceLabel;
  if (choicesInput) choicesInput.placeholder = config.choicePlaceholder;
  if (optionsLabel) optionsLabel.textContent = config.optionsLabel;
  if (optionsInput && !optionsInput.value.trim()) optionsInput.value = (config.options || []).join("\n");
  if (requirementsLabel) requirementsLabel.textContent = config.requirementsLabel;
  if (startersLabel) startersLabel.textContent = config.helperLabel;
  if (videoLabel) videoLabel.textContent = config.materialLabel;
  if (instructionsLabel) instructionsLabel.textContent = config.instructionsLabel;

  helper.innerHTML = `
    <strong>${clean(getMissionTypeLabel(type))}</strong>
    <span>${clean(config.builderIntro)}</span>
    <span>${clean(config.publishNote)}</span>
  `;
}

function publishMissionFromForm() {
  const classSelect = document.getElementById("missionCreatorClass");
  const typeSelect = document.getElementById("missionCreatorType");
  const levelSelect = document.getElementById("missionCreatorLevel");
  const topicInput = document.getElementById("missionCreatorTopic");
  const charactersInput = document.getElementById("missionCreatorCharacters");
  const requirementsInput = document.getElementById("missionCreatorRequirements");
  const startersInput = document.getElementById("missionCreatorStarters");
  const optionsInput = document.getElementById("missionCreatorOptions");
  const deadlineInput = document.getElementById("missionCreatorDeadline");
  const videoInput = document.getElementById("missionCreatorVideo");
  const instructionsInput = document.getElementById("missionCreatorInstructions");

  if (!classSelect || !typeSelect || !levelSelect || !topicInput) return;

  const classLetter = classSelect.value;
  const type = typeSelect.value;
  const level = levelSelect.value;
  const topic = topicInput.value.trim();

  if (!topic) {
    alert("Please choose or write a topic first.");
    return;
  }

  const typeLabel = getMissionTypeLabel(type);
  const config = getMissionTypeConfig(type);
  const usesChoices = config.usesChoices !== false;
  const usesOptions = config.usesOptions !== false;
  const usesRequirements = config.usesRequirements !== false;
  const characters = splitLines(charactersInput?.value || "").slice(0, 8);
  const requirements = splitLines(requirementsInput?.value || "").slice(0, 8);
  const starters = splitLines(startersInput?.value || "").slice(0, 10);
  const options = splitLines(optionsInput?.value || "").slice(0, 6);

  missions = missions.map(function (mission) {
    if (mission.classLetter === classLetter && mission.status === "active") {
      return { ...mission, status: "archived" };
    }

    return mission;
  });

  const mission = {
    id: makeId("mission"),
    classLetter: classLetter,
    type: type,
    title: typeLabel.replace(/[🎭🎙️📖🎬]/g, "").trim(),
    level: level,
    topic: topic,
    characters: usesChoices ? (characters.length ? characters : getDefaultCharactersForMissionType(type)) : [],
    options: usesOptions ? (options.length ? options : getDefaultMissionOptions(type)) : [],
    requirements: usesRequirements ? (requirements.length ? requirements : getDefaultRequirementsForMissionType(type)) : [],
    starters: starters.length ? starters : getDefaultStartersForMissionType(type),
    instructions: instructionsInput?.value.trim() || getDefaultMissionInstructions(type),
    deadline: deadlineInput?.value.trim() || "Next session",
    videoUrl: videoInput?.value.trim() || "",
    status: "active",
    createdBy: currentUser?.id || "demo",
    createdAt: new Date().toISOString()
  };

  missions.push(mission);
  saveMissionData();

  const systemMessage = makeMissionAnnouncementMessage(mission);
  chatMessages.push(systemMessage);
  saveChatData();

  renderChatList();
  selectClassChannel(classLetter);
  setTimeout(function () {
    alert(`Mission published to Class ${classLetter} group chat.`);
  }, 80);
}


function saveCurrentMissionToBank() {
  const typeSelect = document.getElementById("missionCreatorType");
  const levelSelect = document.getElementById("missionCreatorLevel");
  const topicInput = document.getElementById("missionCreatorTopic");
  const charactersInput = document.getElementById("missionCreatorCharacters");
  const optionsInput = document.getElementById("missionCreatorOptions");
  const requirementsInput = document.getElementById("missionCreatorRequirements");
  const startersInput = document.getElementById("missionCreatorStarters");
  const instructionsInput = document.getElementById("missionCreatorInstructions");

  const type = typeSelect?.value || "story-lab";
  const level = levelSelect?.value || "junior-actors";
  const topic = topicInput?.value.trim() || "";

  if (!topic) {
    alert("Write or choose a mission topic first, then save it to the bank.");
    return;
  }

  const config = getMissionTypeConfig(type);
  const usesChoices = config.usesChoices !== false;
  const usesOptions = config.usesOptions !== false;
  const usesRequirements = config.usesRequirements !== false;

  const customItems = readCustomMissionBankItems();
  const item = {
    type: type,
    id: makeId("custom-bank"),
    level: level,
    category: "My Saved Missions",
    topic: topic,
    characters: usesChoices ? splitLines(charactersInput?.value || "").slice(0, 8) : [],
    options: usesOptions ? splitLines(optionsInput?.value || "").slice(0, 6) : [],
    requirements: usesRequirements ? splitLines(requirementsInput?.value || "").slice(0, 8) : [],
    starters: splitLines(startersInput?.value || "").slice(0, 10),
    instructions: instructionsInput?.value.trim() || getDefaultMissionInstructions(type),
    teacherPreview: "Saved by teacher from the mission builder.",
    createdAt: new Date().toISOString()
  };

  customItems.unshift(item);
  saveCustomMissionBankItems(customItems.slice(0, 80));

  refreshCreatorBankOptions();
  const bankTopic = document.getElementById("missionCreatorBankTopic");
  if (bankTopic) bankTopic.value = item.id;
  applyBankTopicToCreator(item.id);
  alert("Saved to your mission bank. You can reuse it later from the Homework Bank.");
}

function openMissionDetails(missionId) {
  const mission = getMissionById(missionId);
  if (!mission) {
    openMissionsHome();
    return;
  }

  activeChatFilter = "homework-templates";
  activeThread = {
    type: "mission-details",
    id: mission.id,
    missionId: mission.id
  };

  saveActiveThread(false);
  renderChatTabs();
  renderChatList();
  renderMissionsHeader(`Class ${mission.classLetter} Mission`, `${getMissionTypeLabel(mission.type)} • ${getLevelLabel(mission.level)}`);

  if (!chatMessagesBox) return;

  const submissions = getSubmissionsForMission(mission.id);
  const waiting = submissions.filter(function (item) { return item.status === "waiting-review"; }).length;

  chatMessagesBox.innerHTML = `
    <div class="mission-screen">
      ${renderMissionDisplayCard(mission, "teacher")}
      <section class="mission-review-summary">
        <article><strong>${submissions.length}</strong><span>Total submissions</span></article>
        <article><strong>${waiting}</strong><span>Waiting review</span></article>
        <article><strong>${submissions.filter(function (item) { return item.status === "accepted"; }).length}</strong><span>Accepted</span></article>
        <article><strong>${submissions.filter(function (item) { return item.status === "rejected"; }).length}</strong><span>Needs redo</span></article>
      </section>

      <div class="mission-actions-row">
        <button class="mission-soft-btn" type="button" data-mission-action="submissions" data-mission-id="${clean(mission.id)}">Review this mission</button>
        <button class="mission-soft-btn" type="button" data-mission-action="create" data-prefill-class="${clean(mission.classLetter)}">Create another for Class ${clean(mission.classLetter)}</button>
      </div>
    </div>
  `;
}

function openStudentMissionHome(view = "") {
  const classLetter = getCurrentStudentClass();
  const mission = getActiveMissionForClass(classLetter);

  activeChatFilter = "homework-templates";
  activeThread = {
    type: "student-mission",
    id: "student-mission"
  };

  renderChatTabs();
  renderChatList();
  renderMissionsHeader("Today’s Assignment", `Class ${classLetter} • Dramagician view`);

  if (!chatMessagesBox) return;

  if (!mission) {
    chatMessagesBox.innerHTML = `
      <div class="mission-screen">
        <section class="mission-empty-card">
          <div class="empty-icon">🎭</div>
          <h2>No mission yet</h2>
          <p>Your teacher/CEO has not published a mission for Class ${clean(classLetter)} yet.</p>
        </section>
      </div>
    `;
    return;
  }

  const submission = getMySubmissionForMission(mission.id);

  chatMessagesBox.innerHTML = `
    <div class="mission-screen">
      ${renderMissionDisplayCard(mission, "student")}
      ${submission ? renderStudentSubmissionCard(submission) : renderStudentSubmitCard(mission)}
    </div>
  `;
}

function renderMissionDisplayCard(mission, mode) {
  const config = getMissionTypeConfig(mission.type);
  const options = getMissionOptions(mission);
  const usesChoices = config.usesChoices !== false;
  const usesOptions = config.usesOptions !== false;
  const usesRequirements = config.usesRequirements !== false;
  const showChoices = usesChoices && Array.isArray(mission.characters) && mission.characters.length;
  const showOptions = usesOptions && Array.isArray(options) && options.length;
  const showRequirements = usesRequirements && Array.isArray(mission.requirements) && mission.requirements.length;
  const showHelper = Array.isArray(mission.starters) && mission.starters.length;
  const materialText = mission.videoUrl
    ? (mission.type === "dubbing-studio" ? "Open video / scene" : "Open material / video")
    : "";

  if (mission.type === "story-lab") {
    const storyGuideText = Array.isArray(mission.starters) && mission.starters.length
      ? mission.starters.map(function (item) { return String(item || "").trim(); }).filter(Boolean).join(" ")
      : "Create the world, choose the sentence, show the reactions, add the consequence, and decide the ending.";

    return `
      <section class="mission-display-card mission-display-${clean(mission.type)}">
        <div class="mission-display-top">
          <span class="mission-icon">${clean(getMissionIcon(mission.type))}</span>
          <div>
            <span class="mission-kicker">${clean(getMissionTypeLabel(mission.type))} • ${clean(getLevelLabel(mission.level))}</span>
            <h2>${clean(mission.topic)}</h2>
            <p>${clean(mission.instructions)}</p>
          </div>
        </div>

        <div class="mission-pill-row">
          <span>Class ${clean(mission.classLetter)}</span>
          <span>Deadline: ${clean(mission.deadline || "Next session")}</span>
          <span>${clean(mission.status)}</span>
        </div>

        <div class="mission-story-single-box">
          <strong>Open Story Lab</strong>
          <p>No fixed characters. No fixed mood. No required path. Create the character name, setting, other characters, problem, turning point, and ending from your imagination.</p>
          <p><b>Build your story:</b> ${clean(storyGuideText)}</p>
        </div>

        ${mission.videoUrl ? `<a class="mission-video-link" href="${clean(mission.videoUrl)}" target="_blank" rel="noopener">${clean(materialText)}</a>` : ""}
      </section>
    `;
  }

  const choiceSection = (showChoices || showOptions) ? `
      <div class="mission-two-col">
        ${showChoices ? `
          <div>
            <h3>${clean(config.choiceHeading)}</h3>
            <div class="mission-chip-wrap">
              ${mission.characters.map(function (item) {
                return `<span class="mission-chip">${clean(item)}</span>`;
              }).join("")}
            </div>
          </div>
        ` : ""}

        ${showOptions ? `
          <div>
            <h3>${clean(config.optionsHeading)}</h3>
            <div class="mission-chip-wrap">
              ${options.map(function (item) {
                return `<span class="mission-chip soft">${clean(item)}</span>`;
              }).join("")}
            </div>
          </div>
        ` : ""}
      </div>
  ` : "";

  const requirementsAndHelper = (showRequirements || showHelper) ? `
      <div class="mission-two-col ${!showRequirements || !showHelper ? "mission-one-col" : ""}">
        ${showRequirements ? `
          <div>
            <h3>${clean(config.requirementsHeading)}</h3>
            <ul class="mission-clean-list">
              ${mission.requirements.map(function (item) {
                return `<li>${clean(item)}</li>`;
              }).join("")}
            </ul>
          </div>
        ` : ""}

        ${showHelper ? `
          <div class="mission-helper-box mission-detailed-helper compact-helper">
            <strong>${clean(config.helperHeading)}</strong>
            ${mission.starters.map(function (item) {
              return `<span class="mission-helper-line">${clean(item)}</span>`;
            }).join("")}
          </div>
        ` : ""}
      </div>
  ` : "";

  const openStoryNote = mission.type === "story-lab" ? `
      <div class="mission-helper-box mission-detailed-helper compact-helper">
        <strong>Open Story Lab</strong>
        <span>No fixed characters. No fixed mood. No required path.</span>
        <span>Create the character name, setting, other characters, problem, turning point, and ending from your imagination.</span>
      </div>
  ` : "";

  return `
    <section class="mission-display-card mission-display-${clean(mission.type)}">
      <div class="mission-display-top">
        <span class="mission-icon">${clean(getMissionIcon(mission.type))}</span>
        <div>
          <span class="mission-kicker">${clean(getMissionTypeLabel(mission.type))} • ${clean(getLevelLabel(mission.level))}</span>
          <h2>${clean(mission.topic)}</h2>
          <p>${clean(mission.instructions)}</p>
        </div>
      </div>

      <div class="mission-pill-row">
        <span>Class ${clean(mission.classLetter)}</span>
        <span>Deadline: ${clean(mission.deadline || "Next session")}</span>
        <span>${clean(mission.status)}</span>
      </div>

      ${openStoryNote}
      ${choiceSection}
      ${requirementsAndHelper}

      ${mission.videoUrl ? `<a class="mission-video-link" href="${clean(mission.videoUrl)}" target="_blank" rel="noopener">${clean(materialText)}</a>` : ""}
    </section>
  `;
}

function renderStudentSubmitCard(mission) {
  const config = getMissionTypeConfig(mission.type);
  const options = getMissionOptions(mission);
  const usesChoices = config.usesChoices !== false;
  const usesOptions = config.usesOptions !== false;

  const choiceBlocks = `
      ${usesChoices ? `
        <div class="mission-choice-block">
          <h3>${clean(config.choiceSubmitLabel)}</h3>
          <div class="mission-choice-row" id="missionCharacterChoices">
            ${mission.characters.map(function (item, index) {
              return `<button class="mission-choice-btn ${index === 0 ? "selected" : ""}" type="button" data-select-mission-character="${clean(item)}">${clean(item)}</button>`;
            }).join("")}
          </div>
        </div>
      ` : ""}

      ${usesOptions ? `
        <div class="mission-choice-block">
          <h3>${clean(config.optionsHeading)}</h3>
          <div class="mission-choice-row" id="missionOpinionChoices">
            ${options.map(function (item, index) {
              return `<button class="mission-choice-btn ${index === 0 ? "selected" : ""}" type="button" data-select-mission-opinion="${clean(item)}">${clean(item)}</button>`;
            }).join("")}
          </div>
        </div>
      ` : ""}
  `;

  const title = mission.type === "story-lab"
    ? "Create the full story"
    : `${config.choiceSubmitLabel} and perform`;

  const note = mission.type === "story-lab"
    ? "Build everything yourself: character name, setting, other characters, problem, twist, ending, and message."
    : "Demo mode saves on this browser only. Later Supabase will let teacher and Dramagician see it from different devices.";

  return `
    <section class="mission-submit-card">
      <span class="mission-kicker">Your submission</span>
      <h2>${clean(title)}</h2>
      ${mission.type === "story-lab" ? `<p>${clean(note)}</p>` : ""}

      ${choiceBlocks}

      <div class="mission-actions-row">
        <button class="mission-primary-btn" type="button" data-mission-action="student-record" data-mission-id="${clean(mission.id)}">${clean(config.recordButton)}</button>
        <button class="mission-soft-btn" type="button" data-mission-action="student-submit-demo" data-mission-id="${clean(mission.id)}">${clean(config.demoButton)}</button>
      </div>

      ${mission.type !== "story-lab" ? `<p class="mission-small-note">${clean(note)}</p>` : `<p class="mission-small-note">Demo mode saves on this browser only. Later Supabase will let teacher and Dramagician see it from different devices.</p>`}
    </section>
  `;
}

function renderStudentSubmissionCard(submission) {
  const mission = getMissionById(submission.missionId);
  const config = getMissionTypeConfig(mission?.type || "voice-imitation");
  const usesChoices = config.usesChoices !== false;
  const usesOptions = config.usesOptions !== false;
  const canRedo = submission.status === "rejected";
  const metaLine = (usesChoices || usesOptions) ? `
      <p>
        ${usesChoices ? `<strong>${clean(config.choiceSummaryLabel)}:</strong> ${clean(submission.character)}` : ""}
        ${usesChoices && usesOptions ? " • " : ""}
        ${usesOptions ? `<strong>${clean(config.optionsSummaryLabel)}:</strong> ${clean(submission.opinion)}` : ""}
      </p>
  ` : `<p>Your story was submitted as a free imagination Story Lab response.</p>`;

  return `
    <section class="mission-submit-card">
      <span class="mission-kicker">My Homework</span>
      <h2>${clean(getStatusLabel(submission.status))}</h2>
      ${metaLine}
      ${submission.feedback ? `<p><strong>Teacher Feedback:</strong> ${clean(submission.feedback)}</p>` : ""}
      ${submission.audioUrl ? `<audio controls src="${clean(submission.audioUrl)}"></audio>` : `<div class="mission-demo-audio">🎙️ Demo voice note submitted</div>`}
      <p class="mission-small-note">Submitted ${clean(formatShortTime(submission.createdAt))}</p>

      ${canRedo ? `
        <div class="mission-actions-row">
          <button class="mission-primary-btn" type="button" data-mission-action="student-record" data-mission-id="${clean(submission.missionId)}">🎙️ Record Redo</button>
          <button class="mission-soft-btn" type="button" data-mission-action="student-submit-demo" data-mission-id="${clean(submission.missionId)}">Submit Demo Redo</button>
        </div>
      ` : ""}
    </section>
  `;
}


function selectMissionChoice(type, value) {
  const containerId = type === "character" ? "missionCharacterChoices" : "missionOpinionChoices";
  const container = document.getElementById(containerId);
  if (!container) return;

  container.querySelectorAll(".mission-choice-btn").forEach(function (button) {
    const isSelected = type === "character"
      ? button.dataset.selectMissionCharacter === value
      : button.dataset.selectMissionOpinion === value;

    button.classList.toggle("selected", isSelected);
  });
}

function getSelectedMissionChoice(type) {
  const selector = type === "character"
    ? "#missionCharacterChoices .mission-choice-btn.selected"
    : "#missionOpinionChoices .mission-choice-btn.selected";

  const selected = document.querySelector(selector);

  if (!selected) {
    return type === "character" ? "Dramagician Performer 🎭" : "Maybe";
  }

  return type === "character"
    ? selected.dataset.selectMissionCharacter
    : selected.dataset.selectMissionOpinion;
}

function beginMissionRecording(missionId) {
  const mission = getMissionById(missionId);
  if (!mission) return;

  const config = getMissionTypeConfig(mission.type);
  const usesChoices = config.usesChoices !== false;
  const usesOptions = config.usesOptions !== false;

  pendingMissionSubmission = {
    missionId: mission.id,
    character: usesChoices ? getSelectedMissionChoice("character") : "",
    opinion: usesOptions ? getSelectedMissionChoice("opinion") : ""
  };

  startVoiceRecording();
}

function createDemoMissionSubmission(missionId, audioUrl = "") {
  const mission = getMissionById(missionId);
  if (!mission) return;

  const existing = getMySubmissionForMission(mission.id);
  const config = getMissionTypeConfig(mission.type);
  const usesChoices = config.usesChoices !== false;
  const usesOptions = config.usesOptions !== false;

  if (existing && existing.status !== "rejected" && existing.status !== "waiting-review") {
    alert("Your homework was already accepted. Ask your teacher before submitting again.");
    return;
  }

  const submission = {
    id: existing?.id || makeId("submission"),
    missionId: mission.id,
    classLetter: mission.classLetter,
    studentId: getCurrentStudentRecord().id,
    studentName: currentUser?.full_name || getCurrentStudentRecord().full_name,
    character: usesChoices ? (pendingMissionSubmission?.character || getSelectedMissionChoice("character")) : "",
    opinion: usesOptions ? (pendingMissionSubmission?.opinion || getSelectedMissionChoice("opinion")) : "",
    audioUrl: audioUrl || "",
    status: "waiting-review",
    feedback: "",
    featured: false,
    privateMessageId: "",
    sharedMessageId: "",
    createdAt: new Date().toISOString()
  };

  missionSubmissions = missionSubmissions.filter(function (item) {
    return item.id !== submission.id &&
      !(item.missionId === submission.missionId && item.studentId === submission.studentId);
  });

  missionSubmissions.push(submission);
  pendingMissionSubmission = null;
  expandedChatMissionId = "";
  saveMissionData();

  if (isStudent() || activeThread.type === "group") {
    selectClassChannel(mission.classLetter);
    return;
  }

  openStudentMissionHome("submission");
}


function openMissionSubmissions(missionId = "") {
  activeChatFilter = "homework-templates";
  activeThread = {
    type: "mission-submissions",
    id: "mission-submissions",
    missionId: missionId || ""
  };

  renderChatTabs();
  renderChatList();
  renderMissionsHeader("Pending Submissions", "Accept homework to publish it in the class chat, or reject it to send private feedback.");

  let submissions = missionId
    ? missionSubmissions.filter(function (item) { return item.missionId === missionId; })
    : missionSubmissions;

  submissions = submissions.sort(function (a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const pending = submissions.filter(function (item) { return item.status === "waiting-review"; });
  const reviewed = submissions.filter(function (item) { return item.status !== "waiting-review"; });

  if (!chatMessagesBox) return;

  if (submissions.length === 0) {
    chatMessagesBox.innerHTML = `
      <div class="mission-screen">
        <section class="mission-empty-card">
          <div class="empty-icon">📥</div>
          <h2>No submissions yet</h2>
          <p>When students submit homework, it will appear here for review.</p>
        </section>
      </div>
    `;
    return;
  }

  chatMessagesBox.innerHTML = `
    <div class="mission-screen mission-review-board">
      <section class="mission-review-section">
        <div class="mission-section-title-row">
          <div>
            <span class="mission-kicker">Waiting for Review</span>
            <h2>Pending submissions</h2>
          </div>
          <span class="mission-status waiting-review">${pending.length} waiting</span>
        </div>
        ${pending.length ? pending.map(renderReviewSubmissionCard).join("\n") : `
          <section class="mission-empty-card compact-empty">
            <div class="empty-icon">✅</div>
            <h2>No pending submissions</h2>
            <p>Everything is reviewed for now.</p>
          </section>
        `}
      </section>

      ${reviewed.length ? `
        <section class="mission-review-section reviewed-homework-section">
          <div class="mission-section-title-row">
            <div>
              <span class="mission-kicker">Reviewed</span>
              <h2>Accepted / Needs Redo</h2>
            </div>
            <span class="mission-status accepted">${reviewed.length} reviewed</span>
          </div>
          ${reviewed.map(renderReviewSubmissionCard).join("\n")}
        </section>
      ` : ""}
    </div>
  `;
}


function renderReviewSubmissionCard(submission) {
  const mission = getMissionById(submission.missionId);
  const statusLabel = getStatusLabel(submission.status);
  const config = getMissionTypeConfig(mission?.type || "voice-imitation");
  const student = getStudentById(submission.studentId);
  const isWaiting = submission.status === "waiting-review";
  const isAccepted = submission.status === "accepted" || submission.status === "featured";
  const isRejected = submission.status === "rejected";

  return `
    <section class="mission-review-card ${isWaiting ? "pending-review-card" : ""}">
      <div class="mission-review-head">
        <div class="mission-review-student-line">
          <img class="mission-review-avatar" src="${clean(student ? getStudentAvatar(student) : getDefaultAvatar("student"))}" alt="${clean(submission.studentName)} profile picture" />
          <div>
            <span class="mission-kicker">${clean(mission?.title || "Mission")} • Class ${clean(submission.classLetter)}</span>
            <h2>${clean(submission.studentName)}</h2>
            <p>${clean(mission?.topic || "Mission topic")}</p>
          </div>
        </div>
        <span class="mission-status ${clean(submission.status)}">${clean(statusLabel)}</span>
      </div>

      <div class="mission-pill-row">
        ${config.usesChoices !== false ? `<span>${clean(config.choiceSummaryLabel)}: ${clean(submission.character || "—")}</span>` : ""}
        ${config.usesOptions !== false ? `<span>${clean(config.optionsSummaryLabel)}: ${clean(submission.opinion || "—")}</span>` : ""}
        ${config.usesChoices === false && config.usesOptions === false ? `<span>Story Lab submission</span>` : ""}
        <span>Submitted ${clean(formatShortTime(submission.createdAt))}</span>
        ${isAccepted ? `<span>Published to class chat</span>` : ""}
        ${isRejected ? `<span>Private feedback sent</span>` : ""}
      </div>

      ${submission.audioUrl ? `<audio controls src="${clean(submission.audioUrl)}"></audio>` : `<div class="mission-demo-audio">🎙️ Demo voice note submitted</div>`}

      ${submission.feedback ? `<p class="mission-feedback"><strong>Teacher Feedback:</strong> ${clean(submission.feedback)}</p>` : ""}

      ${isWaiting ? `<p class="mission-small-note">This homework is private now. It will only appear in the class chat after you accept it.</p>` : ""}

      <div class="mission-actions-row">
        ${!isAccepted ? `<button class="mission-primary-btn" type="button" data-review-submission="${clean(submission.id)}" data-review-status="accepted">✅ Accept and publish</button>` : ""}
        ${!isRejected ? `<button class="mission-danger-btn" type="button" data-review-submission="${clean(submission.id)}" data-review-status="rejected">↺ Reject and send private feedback</button>` : ""}
        ${submission.audioUrl ? `<button class="mission-soft-btn" type="button" data-download-submission="${clean(submission.id)}">⬇ Download Audio</button>` : ""}
      </div>
    </section>
  `;
}


function reviewMissionSubmission(submissionId, nextStatus) {
  const target = missionSubmissions.find(function (item) {
    return item.id === submissionId;
  });

  if (!target) return;

  const finalStatus = nextStatus === "featured" ? "accepted" : nextStatus;
  let feedback = "";
  let privateMessageId = target.privateMessageId || "";
  let sharedMessageId = target.sharedMessageId || "";

  if (finalStatus === "rejected") {
    feedback = prompt("Write the reason. This will be sent privately to the student:", target.feedback || "Please record again with clearer voice and stronger emotion.") || "";
    feedback = feedback.trim();

    if (!feedback) {
      alert("Please write a reason before rejecting the homework.");
      return;
    }

    privateMessageId = sendMissionRejectionPrivateMessage(target, feedback);
  }

  if (finalStatus === "accepted") {
    sharedMessageId = publishAcceptedHomeworkToClass(target);
  }

  missionSubmissions = missionSubmissions.map(function (submission) {
    if (submission.id !== submissionId) return submission;

    return {
      ...submission,
      status: finalStatus,
      featured: false,
      feedback: finalStatus === "rejected" ? feedback : submission.feedback,
      privateMessageId: privateMessageId,
      sharedMessageId: sharedMessageId,
      reviewedBy: currentUser?.id || "demo-teacher",
      reviewedAt: new Date().toISOString()
    };
  });

  saveMissionData();
  saveChatData();
  renderChatList();
  openMissionSubmissions(activeThread.missionId || "");
}

function sendMissionRejectionPrivateMessage(submission, feedback) {
  if (submission.privateMessageId && chatMessages.some(function (message) { return message.id === submission.privateMessageId; })) {
    return submission.privateMessageId;
  }

  const mission = getMissionById(submission.missionId);
  const message = {
    id: makeId("feedback"),
    threadId: getPrivateThreadId(submission.studentId),
    chatType: "private",
    studentId: submission.studentId,
    classLetter: submission.classLetter,
    type: "text",
    text: `Your homework needs redo.\n\nTeacher Feedback: ${feedback}\n\nPlease open the mission and resubmit when you are ready.`,
    audioUrl: "",
    senderId: currentUser?.id || "teacher-demo-user",
    senderName: currentUser?.full_name || "Demo Teacher",
    senderRole: currentUser?.role || "teacher",
    missionId: submission.missionId,
    submissionId: submission.id,
    systemKind: "homework-rejected",
    createdAt: new Date().toISOString()
  };

  chatMessages.push(message);
  return message.id;
}

function publishAcceptedHomeworkToClass(submission) {
  if (submission.sharedMessageId && chatMessages.some(function (message) { return message.id === submission.sharedMessageId; })) {
    return submission.sharedMessageId;
  }

  const mission = getMissionById(submission.missionId);
  const message = {
    id: makeId("accepted-homework"),
    threadId: getGroupThreadId(submission.classLetter),
    chatType: "group",
    classLetter: submission.classLetter,
    type: "accepted-homework",
    text: `Accepted homework from ${submission.studentName}.`,
    audioUrl: submission.audioUrl || "",
    senderId: currentUser?.id || "teacher-demo-user",
    senderName: currentUser?.full_name || "Demo Teacher",
    senderRole: currentUser?.role || "teacher",
    missionId: submission.missionId,
    submissionId: submission.id,
    studentName: submission.studentName,
    missionTitle: mission?.title || "Homework",
    createdAt: new Date().toISOString()
  };

  chatMessages.push(message);
  return message.id;
}


function downloadMissionSubmission(submissionId) {
  const submission = missionSubmissions.find(function (item) {
    return item.id === submissionId;
  });

  if (!submission || !submission.audioUrl) return;

  const link = document.createElement("a");
  link.href = submission.audioUrl;
  link.download = `${submission.studentName || "student"}-${submission.character || "mission"}-voice-note.webm`
    .replace(/[^a-z0-9._-]+/gi, "-")
    .toLowerCase();

  document.body.appendChild(link);
  link.click();
  link.remove();
}

function openQuestionBank() {
  activeChatFilter = "homework-templates";
  activeThread = {
    type: "mission-bank",
    id: "mission-bank"
  };

  renderChatTabs();
  renderChatList();
  renderMissionsHeader("Homework Bank", "Ready creative missions organized by type, level, and story style.");

  if (!chatMessagesBox) return;

  const storyLabTotal = getMissionBankItems("story-lab").length;

  chatMessagesBox.innerHTML = `
    <div class="mission-screen">
      <section class="mission-bank-intro">
        <span class="mission-kicker">Teacher Library</span>
        <h2>Choose a ready mission, then edit it before sending.</h2>
        <p>The Story Lab bank now uses character-based story sparks with age levels: 8–10, 11–13, 14–15, and 16–17+. Each spark gives a situation, but learners create the name, setting, conflict, and ending.</p>
        <div class="mission-mini-stats">
          <span>${getAllMissionBankItemCount()} total missions</span>
          <span>${storyLabTotal} Story Lab prompts</span>
          <span>Custom saves supported</span>
        </div>
      </section>

      ${MISSION_TYPES.map(function (typeItem) {
        const typeItems = getMissionBankItems(typeItem.id);
        const grouped = MISSION_LEVELS.map(function (level) {
          return {
            level,
            items: typeItems.filter(function (item) { return item.level === level.id; })
          };
        }).filter(function (group) { return group.items.length; });

        return `
          <section class="mission-bank-section enhanced-bank-section">
            <div class="mission-bank-section-head">
              <div>
                <span class="mission-kicker">${clean(typeItems.length)} ready options</span>
                <h2>${clean(typeItem.label)}</h2>
              </div>
              <button class="mission-soft-btn" type="button" data-mission-action="create" data-prefill-type="${clean(typeItem.id)}">Create Custom</button>
            </div>

            ${grouped.map(function (group) {
              return `
                <h3 class="mission-bank-level-title">${clean(group.level.label)}</h3>
                <div class="mission-bank-grid enhanced-bank-grid">
                  ${group.items.map(function (item) {
                    const config = getMissionTypeConfig(typeItem.id);
                    const characters = item.characters || config.defaultCharacters || [];
                    const bankLine = config.usesChoices === false
                      ? "Open imagination • no fixed characters"
                      : characters.slice(0, 4).join(" • ");
                    const preview = item.teacherPreview || (Array.isArray(item.starters) && item.starters[0]) || config.builderIntro;
                    const category = item.category || getMissionTypeLabel(typeItem.id).replace(/[🎭🎙️📖🎬]/g, "").trim();
                    return `
                      <article class="mission-bank-card enhanced-bank-card">
                        <div class="bank-card-topline">
                          <span>${clean(category)}</span>
                          <small>${clean(group.level.label.replace(/[⭐🎬🎤🔥]/g, "").trim())}</small>
                        </div>
                        <h3>${clean(item.topic)}</h3>
                        <p>${clean(preview)}</p>
                        <div class="bank-character-line">${clean(bankLine)}</div>
                        <div class="mission-actions-row bank-card-actions">
                          <button class="mission-primary-btn" type="button" data-mission-action="create" data-prefill-type="${clean(typeItem.id)}" data-prefill-level="${clean(item.level)}" data-prefill-bank-id="${clean(item.id)}">Use in Builder</button>
                        </div>
                      </article>
                    `;
                  }).join("\n")}
                </div>
              `;
            }).join("\n")}
          </section>
        `;
      }).join("\n")}
    </div>
  `;
}

function openHomeworkTemplatesView() {
  activeChatFilter = "homework-templates";
  renderChatTabs();
  renderMissionsHeader("Assignment Templates", "Old template previews kept inside the same Homework/Missions tab.");

  if (!chatMessagesBox) return;

  chatMessagesBox.innerHTML = `
    <div class="mission-screen">
      <section class="mission-bank-section">
        <h2>Saved Templates</h2>
        <div class="mission-bank-grid">
          ${HOMEWORK_TEMPLATES.map(function (template) {
            return `
              <article class="mission-bank-card">
                <h3>${clean(template.icon)} ${clean(template.title)}</h3>
                <p>${clean(template.preview)}</p>
                <button class="mission-soft-btn full" type="button" data-template-preview="${clean(template.id)}">Preview</button>
              </article>
            `;
          }).join("\n")}
        </div>
      </section>
    </div>
  `;
}

function makeMissionAnnouncementMessage(mission) {
  const topicLabel = mission.type === "story-lab" ? "Story Spark" : "Topic";
  const missionInstructions = mission.type === "story-lab" && mission.instructions
    ? `

${mission.instructions}`
    : "";

  return {
    id: makeId(),
    threadId: getGroupThreadId(mission.classLetter),
    chatType: "group",
    classLetter: mission.classLetter,
    type: "mission",
    missionId: mission.id,
    missionTopic: mission.topic,
    text: `${getMissionIcon(mission.type)} New ${mission.title} Mission

${topicLabel}: ${mission.topic}${missionInstructions}
Deadline: ${mission.deadline}

Submit directly from this class group chat.`,
    audioUrl: "",
    senderId: currentUser?.id || "teacher-demo-user",
    senderName: currentUser?.full_name || "Demo Teacher",
    senderRole: currentUser?.role || "teacher",
    createdAt: new Date().toISOString()
  };
}

function seedDemoMissionData() {
  const hasMissions = localStorage.getItem(STORAGE_KEYS.missions);
  if (hasMissions) return;

  const demoMission = {
    id: "mission-demo-class-a",
    classLetter: "A",
    type: "voice-imitation",
    title: "Voice Imitation",
    level: "little-stars",
    topic: "Say one sentence in three emotions: happy, angry, and scared.",
    characters: ["Happy Voice 😀", "Angry Voice 😡", "Scared Voice 😱", "Confident Voice ⭐"],
    options: ["Happy", "Angry", "Scared", "Confident"],
    requirements: ["Copy the emotion", "Copy the pauses", "Clear pronunciation", "Same energy", "One strong final try"],
    starters: ["Listen first: notice the speed, pauses, and feeling.", "Repeat slowly before recording.", "Focus on the mouth sounds and ending letters.", "Add facial expression while recording; it changes the voice.", "Record again if your first try feels flat."],
    instructions: "Copy the voice, emotion, pronunciation, pauses, and tone. Send your best voice note.",
    deadline: "Next session",
    videoUrl: "",
    status: "active",
    createdBy: "teacher-demo-user",
    createdAt: new Date().toISOString()
  };

  localStorage.setItem(STORAGE_KEYS.missions, JSON.stringify([demoMission]));
  localStorage.setItem(STORAGE_KEYS.missionSubmissions, JSON.stringify([]));
}

function loadMissionData() {
  const allowedTypes = MISSION_TYPES.map(function (item) { return item.id; });

  missions = readArray(STORAGE_KEYS.missions)
    .map(normalizeMission)
    .filter(function (mission) {
      return allowedTypes.includes(mission.type);
    });

  missionSubmissions = readArray(STORAGE_KEYS.missionSubmissions)
    .filter(function (submission) {
      const mission = missions.find(function (item) { return item.id === submission.missionId; });
      return !!mission;
    });

  saveMissionData();
}

function saveMissionData() {
  localStorage.setItem(STORAGE_KEYS.missions, JSON.stringify(missions));
  localStorage.setItem(STORAGE_KEYS.missionSubmissions, JSON.stringify(missionSubmissions));
}

function normalizeMission(mission) {
  const incomingType = mission.type || "voice-imitation";
  const allowedTypes = MISSION_TYPES.map(function (item) { return item.id; });
  const safeType = allowedTypes.includes(incomingType) ? incomingType : "voice-imitation";
  const config = getMissionTypeConfig(safeType);

  return {
    id: mission.id || makeId("mission"),
    classLetter: mission.classLetter || "A",
    type: safeType,
    title: safeType === "story-lab" ? (mission.title || "Story Lab") : safeType === "dubbing-studio" ? (mission.title || "Dubbing Studio") : (mission.title || "Voice Imitation"),
    level: mission.level || "junior-actors",
    topic: mission.topic || (safeType === "story-lab" ? "Create a complete story from this spark." : safeType === "dubbing-studio" ? "Dub this scene with clear timing and emotion." : "Copy the voice, emotion, pronunciation, pauses, and tone."),
    characters: Array.isArray(mission.characters) ? mission.characters : getDefaultCharactersForMissionType(safeType),
    options: Array.isArray(mission.options) ? mission.options : getDefaultMissionOptions(safeType),
    requirements: Array.isArray(mission.requirements) ? mission.requirements : getDefaultRequirementsForMissionType(safeType),
    starters: Array.isArray(mission.starters) ? mission.starters : getDefaultStartersForMissionType(safeType),
    instructions: mission.instructions || getDefaultMissionInstructions(safeType),
    deadline: mission.deadline || "Next session",
    videoUrl: mission.videoUrl || "",
    status: mission.status || "active",
    createdBy: mission.createdBy || "demo",
    createdAt: mission.createdAt || new Date().toISOString()
  };
}

function normalizeMissionSubmission(submission) {
  return {
    id: submission.id || makeId("submission"),
    missionId: submission.missionId || "",
    classLetter: submission.classLetter || "A",
    studentId: submission.studentId || "student-demo-user",
    studentName: submission.studentName || "Demo Dramagician",
    character: submission.character || "Dramagician",
    opinion: submission.opinion || "Maybe",
    audioUrl: submission.audioUrl || "",
    status: submission.status || "waiting-review",
    feedback: submission.feedback || "",
    featured: Boolean(submission.featured),
    createdAt: submission.createdAt || new Date().toISOString()
  };
}

function getActiveMissionForClass(classLetter) {
  return missions
    .filter(function (mission) {
      return mission.classLetter === classLetter && mission.status === "active";
    })
    .sort(function (a, b) {
      return new Date(b.createdAt) - new Date(a.createdAt);
    })[0] || null;
}

function getMissionById(missionId) {
  return missions.find(function (mission) {
    return mission.id === missionId;
  });
}

function getSubmissionsForMission(missionId) {
  return missionSubmissions.filter(function (submission) {
    return submission.missionId === missionId;
  });
}

function getMySubmissionForMission(missionId) {
  const student = getCurrentStudentRecord();

  return missionSubmissions.find(function (submission) {
    return submission.missionId === missionId && submission.studentId === student.id;
  });
}

function getMissionIcon(type) {
  const missionType = MISSION_TYPES.find(function (item) {
    return item.id === type;
  });

  return missionType ? missionType.icon : "🎭";
}

function getMissionTypeLabel(type) {
  const missionType = MISSION_TYPES.find(function (item) {
    return item.id === type;
  });

  return missionType ? missionType.label : "Voice Imitation 🎙️";
}

function getLevelLabel(level) {
  const missionLevel = MISSION_LEVELS.find(function (item) {
    return item.id === level;
  });

  return missionLevel ? missionLevel.label : "Junior Actors 🎬";
}

function getStatusLabel(status) {
  const labels = {
    "waiting-review": "Waiting Review",
    accepted: "Accepted",
    rejected: "Needs Redo",
    featured: "Featured"
  };

  return labels[status] || status || "Waiting Review";
}

function splitLines(value) {
  return String(value || "")
    .split(/\n|,/)
    .map(function (item) { return item.trim(); })
    .filter(Boolean);
}

function getDefaultCharactersForType(type) {
  return getDefaultCharactersForMissionType(type);
}

function getDefaultMissionInstructions(type) {
  return getMissionTypeConfig(type).defaultInstructions || "Choose a character, choose your option, and perform the answer.";
}


/* =====================================================
   THREAD SELECTION
===================================================== */

function selectClassChannel(classLetter) {
  const allowed = getVisibleClasses().some(function (item) {
    return item.letter === classLetter;
  });

  if (!allowed) return;

  activeChatFilter = "channels";
  expandedChatMissionId = "";
  activeThread = {
    type: "group",
    id: getGroupThreadId(classLetter),
    classLetter: classLetter
  };

  saveActiveThread();
  markActiveThreadAsRead();

  if (emojiPicker) emojiPicker.classList.add("hidden");

  renderChatTabs();
  renderChatList();
  renderChatHeader();
  renderChatMessages();

  closeMobileSidebar();

  setTimeout(function () {
    if (chatInput && !isMobileLayout()) chatInput.focus();
  }, 80);
}

function selectPrivateChat(studentId) {
  const student = getStudentById(studentId) || getCurrentStudentRecord();

  if (!canOpenPrivateThread(student.id)) {
    alert("Students can only open their own private teacher chat.");
    return;
  }

  activeChatFilter = "private";
  expandedChatMissionId = "";
  activeThread = {
    type: "private",
    id: getPrivateThreadId(student.id),
    studentId: student.id,
    classLetter: student.classLetter
  };

  saveActiveThread();
  markActiveThreadAsRead();

  if (emojiPicker) emojiPicker.classList.add("hidden");

  renderChatTabs();
  renderChatList();
  renderChatHeader();
  renderChatMessages();

  closeMobileSidebar();

  setTimeout(function () {
    if (chatInput && !isMobileLayout()) chatInput.focus();
  }, 80);
}

function previewHomeworkTemplate(templateId) {
  const template = HOMEWORK_TEMPLATES.find(function (item) {
    return item.id === templateId;
  });

  if (!template) return;

  closeMobileSidebar();

  activeChatFilter = "homework-templates";
  activeThread = {
    type: "template",
    id: template.id,
    templateId: template.id
  };

  saveActiveThread(false);

  if (activeClassIcon) activeClassIcon.textContent = template.icon;
  if (chatTitle) chatTitle.textContent = template.title;
  if (chatSubtitle) chatSubtitle.textContent = "Homework template preview";
  if (chatModePill) chatModePill.textContent = "Template";

  if (chatHomeworkCard) chatHomeworkCard.classList.remove("hidden");
  if (chatHomeworkTitle) chatHomeworkTitle.textContent = template.homeworkTitle;
  if (chatHomeworkText) chatHomeworkText.textContent = template.instructions;

  if (chatHomeworkVideo) {
    chatHomeworkVideo.classList.remove("hidden");
    chatHomeworkVideo.href = template.videoUrl;
  }

  if (chatInput) {
    chatInput.placeholder = "Choose Channels or Private to send real messages...";
  }

  if (chatMessagesBox) {
    chatMessagesBox.innerHTML = `
      <div class="chat-day-label">Template Preview</div>

      <div class="chat-message-row theirs">
        <img class="chat-message-avatar" src="${clean(getDefaultAvatar("teacher"))}" alt="Teacher profile picture" />

        <article class="chat-bubble theirs">
          <strong class="chat-sender">Teacher Preview</strong>
          <div class="chat-text">${clean(template.instructions)}</div>

          <div class="chat-meta">
            <span>Template</span>
          </div>
        </article>
      </div>

      <div class="chat-message-row mine">
        <article class="chat-bubble mine">
          <strong class="chat-sender">Student Preview</strong>
          <div class="chat-text">Okay, I’ll send my voice note 🎤</div>

          <div class="chat-meta">
            <span>Preview</span>
            <span>✓✓</span>
          </div>
        </article>

        <img class="chat-message-avatar" src="${clean(getCurrentUserAvatar())}" alt="Your profile picture" />
      </div>
    `;
  }
}

function saveActiveThread(updateUrl = true) {
  localStorage.setItem(STORAGE_KEYS.activeThread, JSON.stringify(activeThread));
  localStorage.setItem(STORAGE_KEYS.activeFilter, activeChatFilter);

  if (!updateUrl) return;

  const params = new URLSearchParams();

  if (activeThread.type === "group") {
    params.set("type", "channel");
    params.set("class", activeThread.classLetter);
  }

  if (activeThread.type === "private") {
    params.set("type", "private");
    params.set("student", activeThread.studentId);
  }

  const nextUrl = `chat.html?${params.toString()}`;
  window.history.replaceState({}, "", nextUrl);
}

function getInitialThread() {
  const params = new URLSearchParams(window.location.search);
  const queryType = params.get("type");
  const queryClass = params.get("class");
  const queryStudent = params.get("student");

  if (queryType === "private" && queryStudent && canOpenPrivateThread(queryStudent)) {
    const student = getStudentById(queryStudent) || getCurrentStudentRecord();
    return {
      type: "private",
      id: getPrivateThreadId(student.id),
      studentId: student.id,
      classLetter: student.classLetter
    };
  }

  if (queryType === "channel" && queryClass) {
    const visible = getVisibleClasses().some(function (item) {
      return item.letter === queryClass;
    });

    if (visible) {
      return {
        type: "group",
        id: getGroupThreadId(queryClass),
        classLetter: queryClass
      };
    }
  }

  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.activeThread));

    if (saved && saved.type === "private" && canOpenPrivateThread(saved.studentId)) {
      const student = getStudentById(saved.studentId) || getCurrentStudentRecord();
      return {
        type: "private",
        id: getPrivateThreadId(student.id),
        studentId: student.id,
        classLetter: student.classLetter
      };
    }

    if (saved && saved.type === "group") {
      const visible = getVisibleClasses().some(function (item) {
        return item.letter === saved.classLetter;
      });

      if (visible) {
        return {
          type: "group",
          id: getGroupThreadId(saved.classLetter),
          classLetter: saved.classLetter
        };
      }
    }
  } catch {
    // Keep safe fallback below.
  }

  const classLetter = isStudent() ? getCurrentStudentClass() : "A";

  return {
    type: "group",
    id: getGroupThreadId(classLetter),
    classLetter: classLetter
  };
}

function goBackToDashboard() {
  stopRecordingCleanup();

  if (currentProfile && (currentProfile.role === "teacher" || currentProfile.role === "ceo")) {
    window.location.href = "auth.html#teacherArea";
    return;
  }

  window.location.href = "auth.html#studentArea";
}

/* =====================================================
   CHAT HEADER + MESSAGES
===================================================== */

function renderChatHeader() {
  if (activeThread.type === "private") {
    renderPrivateHeader();
    return;
  }

  renderGroupHeader();
}

function renderGroupHeader() {
  const classLetter = activeThread.classLetter || "A";
  const homework = getHomeworkForClass(classLetter);

  const classItem = DEMO_CLASSES.find(function (item) {
    return item.letter === classLetter;
  }) || DEMO_CLASSES[0];

  if (activeClassIcon) activeClassIcon.textContent = classItem.icon;
  if (chatTitle) chatTitle.textContent = `${classItem.name} Channel`;

  if (chatSubtitle) {
    chatSubtitle.textContent = isStudent()
      ? "Your class channel • everyone in this class can see this"
      : "Teacher / CEO view • class group channel";
  }

  if (chatModePill) chatModePill.textContent = "Channel";

  if (chatHomeworkCard) chatHomeworkCard.classList.remove("hidden");
  if (chatHomeworkTitle) chatHomeworkTitle.textContent = homework.title;
  if (chatHomeworkText) chatHomeworkText.textContent = homework.instructions;

  if (chatHomeworkVideo) {
    if (homework.videoUrl && homework.videoUrl !== "#") {
      chatHomeworkVideo.classList.remove("hidden");
      chatHomeworkVideo.href = homework.videoUrl;
    } else {
      chatHomeworkVideo.classList.add("hidden");
      chatHomeworkVideo.href = "#";
    }
  }

  if (chatInput) {
    chatInput.placeholder = `Message ${classItem.name} channel...`;
  }
}

function renderPrivateHeader() {
  const student = getStudentById(activeThread.studentId) || getCurrentStudentRecord();
  const title = isStudent() ? "Private chat with your teacher" : student.full_name;
  const subtitle = isStudent()
    ? "Private teacher chat"
    : (isCEO()
      ? `CEO oversight • Private chat • Class ${student.classLetter} • ${student.status}`
      : `Private chat • Class ${student.classLetter} • ${student.status}`);

  if (activeClassIcon) {
    activeClassIcon.innerHTML = `<img src="${clean(getStudentAvatar(student))}" alt="${clean(student.full_name)} profile picture" />`;
  }

  if (chatTitle) chatTitle.textContent = title;
  if (chatSubtitle) chatSubtitle.textContent = subtitle;
  if (chatModePill) chatModePill.textContent = isCEO() ? "CEO View" : "Private";

  if (chatHomeworkCard) chatHomeworkCard.classList.add("hidden");
  if (chatHomeworkVideo) chatHomeworkVideo.classList.add("hidden");

  if (chatInput) {
    chatInput.placeholder = isStudent()
      ? "Message your teacher privately..."
      : (isCEO()
        ? `Message or monitor ${student.full_name}'s private chat...`
        : `Message ${student.full_name} privately...`);
  }
}

function renderChatMessages() {
  if (!chatMessagesBox) return;

  if (activeThread.type === "template" || String(activeThread.type || "").startsWith("mission") || activeThread.type === "missions" || activeThread.type === "student-mission") return;

  markActiveThreadAsRead();

  const threadMessages = getMessagesForThread(activeThread.id).sort(function (a, b) {
    return new Date(a.createdAt) - new Date(b.createdAt);
  });

  const missionDock = renderGroupMissionPanelForChat();

  if (threadMessages.length === 0) {
    chatMessagesBox.innerHTML = renderEmptyThread() + missionDock;
  } else {
    chatMessagesBox.innerHTML = `
      <div class="chat-day-label">Today</div>
      ${threadMessages.map(renderChatMessage).join("\n")}
      ${missionDock}
    `;
  }

  chatMessagesBox.querySelectorAll("[data-delete-message]").forEach(function (button) {
    button.addEventListener("click", function () {
      deleteChatMessage(button.dataset.deleteMessage);
    });
  });

  chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
}

function renderGroupMissionPanelForChat() {
  if (!activeThread || activeThread.type !== "group") return "";

  const mission = getActiveMissionForClass(activeThread.classLetter);
  if (!mission) return "";

  const isExpanded = expandedChatMissionId === mission.id;

  if (canSeeTeacherArea()) {
    const submissions = getSubmissionsForMission(mission.id);
    const waiting = submissions.filter(function (item) { return item.status === "waiting-review"; }).length;

    if (!isExpanded) {
      return `
        <section class="chat-mission-dock teacher-chat-mission-dock" aria-label="Active mission shortcut">
          <div class="chat-mission-dock-main">
            <span class="mission-mini-icon">${clean(getMissionIcon(mission.type))}</span>
            <div>
              <strong>${clean(mission.title)} is live in Class ${clean(mission.classLetter)}</strong>
              <p>${clean(mission.topic)}</p>
            </div>
          </div>
          <div class="chat-mission-dock-actions">
            <button class="mission-soft-btn" type="button" data-mission-action="open-chat-mission" data-mission-id="${clean(mission.id)}">Open Mission</button>
            <button class="mission-primary-btn" type="button" data-mission-action="submissions" data-mission-id="${clean(mission.id)}">Review ${waiting}</button>
          </div>
        </section>
      `;
    }

    return `
      <section class="chat-mission-panel teacher-chat-mission-panel expanded-chat-mission-panel">
        <div class="chat-mission-panel-head">
          <span class="mission-kicker">Pinned mission inside this group chat</span>
          <button class="mission-soft-btn" type="button" data-mission-action="close-chat-mission">Minimize</button>
        </div>
        ${renderMissionDisplayCard(mission, "teacher")}
        <div class="mission-actions-row">
          <button class="mission-soft-btn" type="button" data-mission-action="submissions" data-mission-id="${clean(mission.id)}">Review ${waiting} waiting</button>
          <button class="mission-soft-btn" type="button" data-mission-action="create" data-prefill-class="${clean(mission.classLetter)}">Create another mission for Class ${clean(mission.classLetter)}</button>
          <button class="mission-soft-btn" type="button" data-mission-action="details" data-mission-id="${clean(mission.id)}">Open teacher details</button>
        </div>
      </section>
    `;
  }

  const submission = getMySubmissionForMission(mission.id);
  const statusText = submission ? getStatusLabel(submission.status) : "Not submitted yet";

  if (!isExpanded) {
    return `
      <section class="chat-mission-dock student-chat-mission-dock" aria-label="Today mission shortcut">
        <div class="chat-mission-dock-main">
          <span class="mission-mini-icon">${clean(getMissionIcon(mission.type))}</span>
          <div>
            <strong>Today’s mission: ${clean(mission.title)}</strong>
            <p>${clean(mission.topic)}</p>
          </div>
        </div>
        <div class="chat-mission-dock-actions">
          <span class="mission-status ${submission ? clean(submission.status) : "waiting-review"}">${clean(statusText)}</span>
          <button class="mission-primary-btn" type="button" data-mission-action="open-chat-mission" data-mission-id="${clean(mission.id)}">${submission ? "View" : "Choose & Submit"}</button>
        </div>
      </section>
    `;
  }

  return `
    <section class="chat-mission-panel student-chat-mission-panel expanded-chat-mission-panel">
      <div class="chat-mission-panel-head">
        <span class="mission-kicker">Pinned assignment</span>
        <button class="mission-soft-btn" type="button" data-mission-action="close-chat-mission">Minimize</button>
      </div>
      ${renderMissionDisplayCard(mission, "student")}
      ${submission ? renderStudentSubmissionCard(submission) : renderStudentSubmitCard(mission)}
    </section>
  `;
}

function renderEmptyThread() {
  if (activeThread.type === "private") {
    const student = getStudentById(activeThread.studentId) || getCurrentStudentRecord();

    return `
      <div class="chat-empty teams-empty">
        <div class="empty-icon">💬</div>
        <strong>${isStudent() ? "Start your private teacher chat" : (isCEO() ? `CEO oversight for ${clean(student.full_name)}` : `Start a private chat with ${clean(student.full_name)}`)}</strong>
        <p>${isCEO() ? "You can see this private conversation for safety and quality control." : "Private support messages appear here."}</p>
      </div>
    `;
  }

  return `
    <div class="chat-empty teams-empty">
      <div class="empty-icon">#</div>
      <strong>No messages yet</strong>
      <p>Start the class channel conversation.</p>
    </div>
  `;
}

function renderChatMessage(message) {
  const mine = currentUser && message.senderId === currentUser.id;
  const bubbleClass = mine ? "mine" : "theirs";
  const rowClass = mine ? "mine" : "theirs";
  const sender = mine ? "You" : message.senderName;
  const time = formatMessageTime(message.createdAt);
  const canDelete = mine || isCEO() || canSeeTeacherArea();
  const avatar = getChatAvatarForMessage(message, mine);

  let bodyHTML = "";

  if (message.type === "mission") {
    bodyHTML = renderMissionAnnouncementBubble(message);
  } else if (message.type === "accepted-homework") {
    bodyHTML = renderAcceptedHomeworkBubble(message);
  } else if (message.type === "voice") {
    bodyHTML = `
      <div class="voice-note">
        <div class="voice-note-title">
          <span>🎙️</span>
          <strong>Voice note</strong>
        </div>

        <audio controls src="${clean(message.audioUrl)}"></audio>
      </div>
    `;
  } else {
    bodyHTML = `<div class="chat-text">${clean(message.text)}</div>`;
  }

  return `
    <div class="chat-message-row ${rowClass}">
      ${!mine ? `<img class="chat-message-avatar" src="${clean(avatar)}" alt="${clean(sender)} profile picture" />` : ""}

      <article class="chat-bubble ${bubbleClass}">
        <strong class="chat-sender">${clean(sender)}</strong>

        ${bodyHTML}

        <div class="chat-meta">
          <span>${time}</span>
          ${activeThread.type === "private" ? "<span>Private</span>" : ""}
          ${mine ? "<span>✓✓</span>" : ""}
        </div>

        ${canDelete ? `<button class="chat-delete-btn" type="button" data-delete-message="${clean(message.id)}">Delete</button>` : ""}
      </article>

      ${mine ? `<img class="chat-message-avatar" src="${clean(avatar)}" alt="Your profile picture" />` : ""}
    </div>
  `;
}

function renderMissionAnnouncementBubble(message) {
  const mission = getMissionById(message.missionId);

  if (!mission) {
    return `<div class="chat-text">${clean(message.text || "Mission published.")}</div>`;
  }

  return `
    <div class="mission-chat-announcement">
      <div class="mission-announcement-title">
        <span>${clean(getMissionIcon(mission.type))}</span>
        <strong>${clean(mission.title)} published</strong>
      </div>
      <p><strong>Topic:</strong> ${clean(mission.topic)}</p>
      <p><strong>Deadline:</strong> ${clean(mission.deadline || "Next session")}</p>
      <button class="mission-soft-btn full" type="button" data-mission-action="open-chat-mission" data-mission-id="${clean(mission.id)}">Open pinned mission</button>
      <p class="mission-small-note">Dramagicians submit from the pinned card at the bottom of this group chat. Teacher can manage missions from the Missions tab.</p>
    </div>
  `;
}

function renderAcceptedHomeworkBubble(message) {
  const mission = getMissionById(message.missionId);
  const studentName = message.studentName || "Dramagician";

  return `
    <div class="mission-chat-announcement accepted-homework-announcement">
      <div class="mission-announcement-title">
        <span>✅</span>
        <strong>Accepted Homework</strong>
      </div>
      <p><strong>Student:</strong> ${clean(studentName)}</p>
      <p><strong>Mission:</strong> ${clean(mission?.title || message.missionTitle || "Homework")}</p>
      ${message.audioUrl ? `<audio controls src="${clean(message.audioUrl)}"></audio>` : `<div class="mission-demo-audio compact-demo-audio">🎙️ Accepted demo voice note</div>`}
      <p class="mission-small-note">This was shared only after teacher acceptance.</p>
    </div>
  `;
}


function sendTextMessage() {
  if (!currentUser || !chatInput) return;

  if (activeThread.type === "template" || activeChatFilter === "homework-templates") {
    alert("This is only an assignment template preview. Choose Channels or Private to send a real message.");
    return;
  }

  const text = chatInput.value.trim();
  if (!text) return;

  const message = makeMessage({
    type: "text",
    text: text,
    audioUrl: ""
  });

  chatMessages.push(message);
  saveChatData();
  markActiveThreadAsRead();

  chatInput.value = "";
  autoResizeChatInput();

  if (emojiPicker) emojiPicker.classList.add("hidden");

  renderChatList();
  renderChatMessages();
}

function makeMessage({ type, text, audioUrl }) {
  const base = {
    id: makeId(),
    threadId: activeThread.id,
    chatType: activeThread.type,
    type: type,
    text: text || "",
    audioUrl: audioUrl || "",
    senderId: currentUser.id,
    senderName: currentUser.full_name,
    senderRole: currentUser.role,
    createdAt: new Date().toISOString()
  };

  if (activeThread.type === "group") {
    base.classLetter = activeThread.classLetter;
  }

  if (activeThread.type === "private") {
    base.studentId = activeThread.studentId;
    base.classLetter = activeThread.classLetter;
  }

  return base;
}

function addEmojiToInput(emoji) {
  if (!chatInput) return;

  const start = chatInput.selectionStart || 0;
  const end = chatInput.selectionEnd || 0;
  const currentValue = chatInput.value;

  chatInput.value = currentValue.slice(0, start) + emoji + currentValue.slice(end);

  const nextPosition = start + emoji.length;
  chatInput.focus();
  chatInput.setSelectionRange(nextPosition, nextPosition);

  autoResizeChatInput();
}

function autoResizeChatInput() {
  if (!chatInput) return;

  chatInput.style.height = "auto";
  chatInput.style.height = Math.min(chatInput.scrollHeight, 120) + "px";
}

/* =====================================================
   VOICE RECORDING
===================================================== */

async function startVoiceRecording() {
  if (!currentUser) return;

  if ((activeThread.type === "template" || activeChatFilter === "homework-templates") && !pendingMissionSubmission) {
    alert("Use the mission card’s “Record Mission Voice” button, or choose Channels/Private for normal voice notes.");
    return;
  }

  if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia || !window.MediaRecorder) {
    alert("Voice recording is not supported in this browser. Try Chrome or Edge.");
    return;
  }

  try {
    currentAudioStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    recordedChunks = [];

    mediaRecorder = new MediaRecorder(currentAudioStream);

    mediaRecorder.addEventListener("dataavailable", function (event) {
      if (event.data && event.data.size > 0) {
        recordedChunks.push(event.data);
      }
    });

    mediaRecorder.addEventListener("stop", handleVoiceRecordingFinished);
    mediaRecorder.start();

    recordingStartedAt = Date.now();
    startRecordingUI();
  } catch (error) {
    console.error(error);
    alert("Microphone permission was not allowed. Please allow microphone access and try again.");
    stopRecordingCleanup();
  }
}

function stopVoiceRecording() {
  if (!mediaRecorder) return;

  if (mediaRecorder.state !== "inactive") {
    mediaRecorder.stop();
  }
}

function handleVoiceRecordingFinished() {
  const audioBlob = new Blob(recordedChunks, {
    type: recordedChunks[0]?.type || "audio/webm"
  });

  stopRecordingCleanup(false);

  if (!audioBlob.size) {
    alert("No voice was recorded. Please try again.");
    return;
  }

  blobToDataURL(audioBlob, function (audioUrl) {
    if (pendingMissionSubmission) {
      try {
        createDemoMissionSubmission(pendingMissionSubmission.missionId, audioUrl);
      } catch (error) {
        console.error(error);
        pendingMissionSubmission = null;
        alert("The mission voice note is too large for demo localStorage. Try recording a shorter note.");
      }

      return;
    }

    const message = makeMessage({
      type: "voice",
      text: "",
      audioUrl: audioUrl
    });

    chatMessages.push(message);

    try {
      saveChatData();
      markActiveThreadAsRead();
    } catch (error) {
      console.error(error);
      alert("The voice note is too large for demo localStorage. Try recording a shorter voice note.");

      chatMessages = chatMessages.filter(function (item) {
        return item.id !== message.id;
      });

      return;
    }

    renderChatList();
    renderChatMessages();
  });
}

function startRecordingUI() {
  if (recordVoiceBtn) {
    recordVoiceBtn.classList.add("recording");
    recordVoiceBtn.classList.add("hidden");
  }

  if (stopVoiceBtn) stopVoiceBtn.classList.remove("hidden");
  if (recordingBar) recordingBar.classList.remove("hidden");

  updateRecordingTimer();
  recordingTimerInterval = setInterval(updateRecordingTimer, 500);
}

function stopRecordingCleanup(resetRecorder = true) {
  if (recordingTimerInterval) {
    clearInterval(recordingTimerInterval);
    recordingTimerInterval = null;
  }

  if (currentAudioStream) {
    currentAudioStream.getTracks().forEach(function (track) {
      track.stop();
    });

    currentAudioStream = null;
  }

  if (recordVoiceBtn) {
    recordVoiceBtn.classList.remove("recording");
    recordVoiceBtn.classList.remove("hidden");
  }

  if (stopVoiceBtn) stopVoiceBtn.classList.add("hidden");
  if (recordingBar) recordingBar.classList.add("hidden");
  if (recordingTimer) recordingTimer.textContent = "0:00";

  recordingStartedAt = null;

  if (resetRecorder) {
    mediaRecorder = null;
    recordedChunks = [];
  }
}

function updateRecordingTimer() {
  if (!recordingStartedAt || !recordingTimer) return;

  const elapsedSeconds = Math.floor((Date.now() - recordingStartedAt) / 1000);
  const minutes = Math.floor(elapsedSeconds / 60);
  const seconds = elapsedSeconds % 60;

  recordingTimer.textContent = `${minutes}:${String(seconds).padStart(2, "0")}`;

  if (elapsedSeconds >= 60) {
    stopVoiceRecording();
  }
}

function blobToDataURL(blob, callback) {
  const reader = new FileReader();

  reader.onloadend = function () {
    callback(reader.result);
  };

  reader.readAsDataURL(blob);
}

/* =====================================================
   DELETE
===================================================== */

function deleteChatMessage(id) {
  const message = chatMessages.find(function (item) {
    return item.id === id;
  });

  if (!message) return;

  const mine = currentUser && message.senderId === currentUser.id;
  const allowed = mine || isCEO() || canSeeTeacherArea();

  if (!allowed) {
    alert("You can only delete your own demo messages.");
    return;
  }

  const sure = confirm("Delete this message?");
  if (!sure) return;

  chatMessages = chatMessages.filter(function (item) {
    return item.id !== id;
  });

  saveChatData();
  renderChatList();
  renderChatMessages();
}

/* =====================================================
   DATA
===================================================== */

function getHomeworkForClass(classLetter) {
  const mission = getActiveMissionForClass(classLetter);

  if (mission) {
    return {
      id: mission.id,
      classLetter: classLetter,
      title: `${getMissionIcon(mission.type)} ${mission.title}`,
      videoUrl: mission.videoUrl || "#",
      instructions: `${mission.topic} • Dramagicians choose their character and submit directly from the group chat below.`
    };
  }

  return DEMO_HOMEWORK.find(function (homework) {
    return homework.classLetter === classLetter;
  }) || {
    id: "hw-default",
    classLetter: classLetter,
    title: `Class ${classLetter} Voice Acting Homework`,
    videoUrl: "https://www.youtube.com/",
    instructions: "Watch the short clip, imitate the actor’s voice and emotion, then send your voice note here."
  };
}

function seedDemoChatData() {
  const hasMessages = localStorage.getItem(STORAGE_KEYS.chatMessages);
  if (hasMessages) return;

  const demoMessages = [
    {
      id: makeId(),
      threadId: "group-A",
      chatType: "group",
      classLetter: "A",
      type: "text",
      text: "Welcome Class A. Your assignment is to imitate the actor’s emotion and send a voice note.",
      audioUrl: "",
      senderId: "teacher-demo-user",
      senderName: "Demo Teacher",
      senderRole: "teacher",
      createdAt: new Date(Date.now() - 1000 * 60 * 22).toISOString()
    },
    {
      id: makeId(),
      threadId: "group-A",
      chatType: "group",
      classLetter: "A",
      type: "text",
      text: "Okay miss, I’ll try it today.",
      audioUrl: "",
      senderId: "student-demo-user",
      senderName: "Demo Dramagician A",
      senderRole: "student",
      createdAt: new Date(Date.now() - 1000 * 60 * 16).toISOString()
    },
    {
      id: makeId(),
      threadId: "group-B",
      chatType: "group",
      classLetter: "B",
      type: "text",
      text: "Class B, your challenge is voice acting. Focus on clear pronunciation.",
      audioUrl: "",
      senderId: "teacher-demo-user",
      senderName: "Demo Teacher",
      senderRole: "teacher",
      createdAt: new Date(Date.now() - 1000 * 60 * 14).toISOString()
    },
    {
      id: makeId(),
      threadId: "private-student-a-1-teacher",
      chatType: "private",
      studentId: "student-a-1",
      classLetter: "A",
      type: "text",
      text: "Hi Adam, your voice note was expressive. Try to make the ending clearer next time.",
      audioUrl: "",
      senderId: "teacher-demo-user",
      senderName: "Demo Teacher",
      senderRole: "teacher",
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString()
    },
    {
      id: makeId(),
      threadId: "private-student-a-1-teacher",
      chatType: "private",
      studentId: "student-a-1",
      classLetter: "A",
      type: "text",
      text: "Thank you miss, I’ll redo it with stronger emotion.",
      audioUrl: "",
      senderId: "student-a-1",
      senderName: "Adam Youssef",
      senderRole: "student",
      createdAt: new Date(Date.now() - 1000 * 60 * 7).toISOString()
    },
    {
      id: makeId(),
      threadId: "private-student-c-2-teacher",
      chatType: "private",
      studentId: "student-c-2",
      classLetter: "C",
      type: "text",
      text: "Can you send me the line again? I want to practice before class.",
      audioUrl: "",
      senderId: "student-c-2",
      senderName: "Malak Samir",
      senderRole: "student",
      createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString()
    }
  ];

  localStorage.setItem(STORAGE_KEYS.chatMessages, JSON.stringify(demoMessages));
}

function loadChatData() {
  chatMessages = readArray(STORAGE_KEYS.chatMessages).map(normalizeMessage);
  saveChatData();
}

function saveChatData() {
  localStorage.setItem(STORAGE_KEYS.chatMessages, JSON.stringify(chatMessages));
}

function readArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return Array.isArray(value) ? value : [];
  } catch {
    return [];
  }
}

function normalizeMessage(message) {
  const copy = { ...message };

  if (!copy.chatType) {
    copy.chatType = copy.studentId ? "private" : "group";
  }

  if (!copy.threadId) {
    if (copy.chatType === "private" && copy.studentId) {
      copy.threadId = getPrivateThreadId(copy.studentId);
    } else {
      copy.threadId = getGroupThreadId(copy.classLetter || "A");
    }
  }

  if (!copy.createdAt) copy.createdAt = new Date().toISOString();
  if (!copy.senderName) copy.senderName = "Dramagic User";
  if (!copy.senderRole) copy.senderRole = "student";

  return copy;
}

function getMessagesForThread(threadId) {
  return chatMessages.filter(function (message) {
    if (message.threadId === threadId) return true;

    // Legacy fallback for old messages that only had classLetter.
    if (threadId.startsWith("group-") && !message.threadId) {
      return message.classLetter === threadId.replace("group-", "");
    }

    return false;
  });
}

function getGroupThreadId(classLetter) {
  return `group-${classLetter}`;
}

function getPrivateThreadId(studentId) {
  return `private-${studentId}-teacher`;
}

/* =====================================================
   SESSION / ROLES
===================================================== */

function getSavedSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.session));
  } catch {
    return null;
  }
}

function normalizeSession(session) {
  if (!session) return null;

  const cleanSession = {
    id: session.id || session.username + "-demo-user",
    email: session.email || "",
    username: session.username || "",
    full_name: session.full_name || "Demo User",
    role: session.role || "student",
    account_status: session.account_status || "active",
    classLetter: session.classLetter || null
  };

  if (cleanSession.role === "student" && !cleanSession.classLetter) {
    cleanSession.classLetter = "A";
  }

  return cleanSession;
}

function isCEO() {
  return currentProfile &&
    currentProfile.role === "ceo" &&
    currentProfile.account_status === "active";
}

function canSeeTeacherArea() {
  return currentProfile &&
    currentProfile.account_status === "active" &&
    (currentProfile.role === "teacher" || currentProfile.role === "ceo");
}

function isStudent() {
  return currentProfile &&
    currentProfile.role === "student" &&
    currentProfile.account_status === "active";
}

function canOpenPrivateThread(studentId) {
  // CEO can audit/open every private chat for safety and quality control.
  if (isCEO()) return true;

  // Teacher demo access: teachers can open learner private chats.
  // Later with Supabase, restrict this by teacher-class assignment.
  if (canSeeTeacherArea()) return true;

  if (!isStudent()) return false;

  return getCurrentStudentRecord().id === studentId;
}

function getCurrentStudentClass() {
  if (currentProfile && currentProfile.classLetter) {
    return currentProfile.classLetter;
  }

  return "A";
}

function getCurrentStudentRecord() {
  const matchedDemo = DEMO_STUDENTS.find(function (student) {
    return student.id === currentProfile?.id ||
      student.full_name.toLowerCase() === String(currentProfile?.full_name || "").toLowerCase();
  });

  if (matchedDemo) return matchedDemo;

  return {
    id: currentProfile?.id || "student-demo-user",
    full_name: currentProfile?.full_name || "Demo Dramagician",
    classLetter: getCurrentStudentClass(),
    avatar: "D",
    status: "Your private teacher chat"
  };
}

function getRoleLabel() {
  if (!currentProfile) return "user";
  if (currentProfile.role === "ceo") return "CEO";
  if (currentProfile.role === "teacher") return "Teacher";

  return `Student • Class ${getCurrentStudentClass()}`;
}

function getStudentById(studentId) {
  const selfStudent = getCurrentStudentRecord();

  if (selfStudent.id === studentId) return selfStudent;

  return DEMO_STUDENTS.find(function (student) {
    return student.id === studentId;
  });
}

/* =====================================================
   HELPERS
===================================================== */

function formatMessageTime(value) {
  if (!value) return "";

  return new Date(value).toLocaleTimeString("en-EG", {
    hour: "2-digit",
    minute: "2-digit"
  });
}

function formatShortTime(value) {
  if (!value) return "";

  return new Date(value).toLocaleTimeString("en-EG", {
    hour: "numeric",
    minute: "2-digit"
  });
}

function clean(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function makeId(prefix = "demo") {
  if (window.crypto && crypto.randomUUID) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-` + Date.now() + "-" + Math.random().toString(16).slice(2);
}

/* =====================================================
   AVATARS
===================================================== */

function getCurrentUserAvatar() {
  const userId = currentProfile?.id || currentUser?.id || "guest";

  const possibleKeys = [
    `dramagic_profile_${userId}`,
    "dramagic_current_profile_picture",
    "dramagic_latest_profile_picture",
    "dramagic_profile_picture",
    "dramagic_profile_guest"
  ];

  for (const key of possibleKeys) {
    const avatar = readAvatarFromStorageKey(key);
    if (avatar) return avatar;
  }

  return getDefaultAvatar(currentProfile?.role || currentUser?.role || "student");
}

function getChatAvatarForMessage(message, mine) {
  if (mine) return getCurrentUserAvatar();

  const senderId = message.senderId || "guest";
  const senderRole = message.senderRole || "student";
  const senderAvatar = readAvatarFromStorageKey(`dramagic_profile_${senderId}`);

  if (senderAvatar) return senderAvatar;

  const student = getStudentById(message.studentId || senderId);
  if (student && senderRole === "student") return getStudentAvatar(student);

  if (senderRole === "teacher") return avatarSvg("T", "#6264a7", "#6264a7");
  if (senderRole === "ceo") return avatarSvg("CEO", "#06a8df", "#007fae");

  return avatarSvg("D", "#8a8886", "#605e5c");
}

function getStudentAvatar(student) {
  const savedAvatar = readAvatarFromStorageKey(`dramagic_profile_${student.id}`);
  if (savedAvatar) return savedAvatar;

  return avatarSvg(student.avatar || "D", "#6264a7", "#4f508c");
}

function readAvatarFromStorageKey(key) {
  const value = localStorage.getItem(key);
  if (!value) return "";

  if (value.startsWith("data:image")) return value;

  try {
    const parsed = JSON.parse(value);

    return parsed.profilePic ||
      parsed.avatar ||
      parsed.picture ||
      parsed.photo ||
      parsed.pfp ||
      "";
  } catch {
    return "";
  }
}

function getDefaultAvatar(role) {
  if (role === "ceo") return avatarSvg("CEO", "#06a8df", "#007fae");
  if (role === "teacher") return avatarSvg("T", "#6264a7", "#6264a7");

  return avatarSvg("D", "#06a8df", "#007fae");
}

function avatarSvg(icon, colorOne, colorTwo) {
  const safeIcon = String(icon || "D").slice(0, 3).toUpperCase();
  const fontSize = safeIcon.length > 2 ? 40 : (safeIcon.length > 1 ? 48 : 58);

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="${colorOne}"/>
          <stop offset="100%" stop-color="${colorTwo}"/>
        </linearGradient>
      </defs>

      <rect width="160" height="160" rx="80" fill="url(#g)"/>
      <text x="80" y="92" text-anchor="middle" dominant-baseline="middle" font-family="Segoe UI, Arial, sans-serif" font-size="${fontSize}" font-weight="700" fill="white">${safeIcon}</text>
    </svg>
  `;

  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}


/* =====================================================
   MOBILE SIDE DRAWER
===================================================== */

function isMobileLayout() {
  return window.matchMedia && window.matchMedia("(max-width: 920px)").matches;
}

function openMobileSidebar() {
  if (!chatApp) return;
  chatApp.classList.add("sidebar-open");
  document.body.classList.add("chat-sidebar-open");

  if (classSearchInput && isMobileLayout()) {
    setTimeout(function () {
      classSearchInput.focus();
    }, 120);
  }
}

function closeMobileSidebar() {
  if (!chatApp) return;
  chatApp.classList.remove("sidebar-open");
  document.body.classList.remove("chat-sidebar-open");
}

/* =====================================================
   MOBILE KEYBOARD MODE
   When the phone keyboard opens, hide the chat list/header area
   so the student/teacher can actually see the conversation.
===================================================== */

function setupMobileKeyboardBehavior() {
  syncChatViewportHeight();

  window.addEventListener("resize", syncChatViewportHeight);
  window.addEventListener("orientationchange", function () {
    setTimeout(syncChatViewportHeight, 250);
  });

  if (window.visualViewport) {
    window.visualViewport.addEventListener("resize", syncChatViewportHeight);
    window.visualViewport.addEventListener("scroll", syncChatViewportHeight);
  }

  if (!chatInput) return;

  chatInput.addEventListener("focus", function () {
    closeMobileSidebar();
    document.body.classList.add("chat-writing-mode");
    syncChatViewportHeight();
    setTimeout(scrollOpenedChatToBottom, 180);
    setTimeout(scrollOpenedChatToBottom, 420);
  });

  chatInput.addEventListener("blur", function () {
    setTimeout(function () {
      if (document.activeElement !== chatInput) {
        document.body.classList.remove("chat-writing-mode");
        syncChatViewportHeight();
      }
    }, 180);
  });
}

function syncChatViewportHeight() {
  const viewportHeight = window.visualViewport
    ? window.visualViewport.height
    : window.innerHeight;

  document.documentElement.style.setProperty("--chat-vh", `${viewportHeight}px`);

  if (!isMobileLayout()) {
    closeMobileSidebar();
    document.body.classList.remove("chat-writing-mode");
  }
}

function scrollOpenedChatToBottom() {
  if (!chatMessagesBox) return;
  chatMessagesBox.scrollTop = chatMessagesBox.scrollHeight;
}
