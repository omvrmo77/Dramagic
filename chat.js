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
    id: "template-emotion",
    title: "Emotion Imitation",
    icon: "🎭",
    preview: "Students copy the actor’s tone, emotion, pauses, and pronunciation.",
    homeworkTitle: "Imitate the Actor’s Emotion",
    instructions:
      "Watch the short scene. Imitate the actor’s voice, tone, emotion, facial expression, and pronunciation. Send your best voice note here.",
    videoUrl: "https://www.youtube.com/"
  },
  {
    id: "template-disney",
    title: "Character Voice",
    icon: "🎬",
    preview: "Students choose a character and perform the line with feeling.",
    homeworkTitle: "Disney Voice Challenge",
    instructions:
      "Choose one character voice. Copy the rhythm, emotion, and pronunciation clearly. Try to sound confident and expressive.",
    videoUrl: "https://www.youtube.com/"
  },
  {
    id: "template-confidence",
    title: "Confidence Speech",
    icon: "🎤",
    preview: "Students record a short confident speech with clear English.",
    homeworkTitle: "Confidence Voice Practice",
    instructions:
      "Record a short speech using a strong voice. Focus on clear words, eye-contact feeling, pauses, and confident delivery.",
    videoUrl: "https://www.youtube.com/"
  },
  {
    id: "template-improv",
    title: "Improv Mission",
    icon: "🪄",
    preview: "Students create a mini scene from a random situation.",
    homeworkTitle: "Drama Improv Mission",
    instructions:
      "Create a short imaginary scene. Choose a character, a place, and a problem. Act it with emotion and send your voice note.",
    videoUrl: "https://www.youtube.com/"
  }
];

const DEMO_HOMEWORK = [
  {
    id: "hw-a-1",
    classLetter: "A",
    title: "Imitate the Actor’s Emotion",
    videoUrl: "https://www.youtube.com/",
    instructions:
      "Watch the short scene. Imitate the actor’s voice, tone, emotion, and pronunciation. Send your voice note here."
  },
  {
    id: "hw-b-1",
    classLetter: "B",
    title: "Disney Voice Challenge",
    videoUrl: "https://www.youtube.com/",
    instructions:
      "Choose one character voice. Copy the emotion, rhythm, and pronunciation clearly. Send your voice note here."
  },
  {
    id: "hw-c-1",
    classLetter: "C",
    title: "Confidence Voice Practice",
    videoUrl: "https://www.youtube.com/",
    instructions:
      "Say the lines with confidence and clear English. Focus on strong voice, pauses, and emotion."
  },
  {
    id: "hw-d-1",
    classLetter: "D",
    title: "Drama Voice Mission",
    videoUrl: "https://www.youtube.com/",
    instructions:
      "Use your voice to show the character’s feeling. Record your best attempt and send it to the class chat."
  }
];

/* =====================================================
   MISSION DEMO BANK
   Lives inside the Homework/Missions tab. For real use, replace
   localStorage with Supabase tables + Supabase Storage later.
===================================================== */

const MISSION_TYPES = [
  { id: "character-arena", label: "Character Arena 🎭", icon: "🎭" },
  { id: "voice-imitation", label: "Voice Imitation 🎙️", icon: "🎙️" },
  { id: "story-lab", label: "Story Lab 📖", icon: "📖" },
  { id: "dubbing-studio", label: "Dubbing Studio 🎬", icon: "🎬" }
];

const MISSION_LEVELS = [
  { id: "little-stars", label: "Little Stars ⭐" },
  { id: "junior-actors", label: "Junior Actors 🎬" },
  { id: "creative-speakers", label: "Creative Speakers 🎤" },
  { id: "teen-performers", label: "Teen Performers 🔥" }
];

const MISSION_BANK = [
  {
    id: "bank-bag-books",
    level: "little-stars",
    topic: "Should school bags have less books?",
    characters: ["Tired School Bag 🎒", "Angry Pencil ✏️", "Happy Lunchbox 🍱", "Sleepy Student 😴"],
    options: ["Yes", "No", "Maybe"],
    requirements: ["Say who you are", "Say how you feel", "Give one simple reason", "End with a funny sentence"],
    starters: ["Start: Hello, I am the tired school bag.", "Feeling: I feel heavy, tired, or annoyed.", "Reason: I carry books, snacks, bottles, and homework every day.", "Funny detail: My zipper is crying or my back hurts.", "Ending: Please give me a holiday or make the books lighter!"]
  },
  {
    id: "bank-toy-alive",
    level: "little-stars",
    topic: "What if your toy came alive?",
    characters: ["Teddy Bear 🧸", "Robot Toy 🤖", "Dinosaur Toy 🦖", "Magic Doll ✨"],
    requirements: ["Introduce the toy", "Say what it wants", "Say one funny problem", "End with goodbye"],
    starters: ["Start: Hello, I am your toy and today I woke up!", "Want: I want to go to school, play, or eat snacks.", "Problem: I am too small, too loud, or nobody believes me.", "Action: Ask your owner to help you.", "Ending: Say a cute or funny goodbye."]
  },
  {
    id: "bank-snack-talks",
    level: "little-stars",
    topic: "Should snacks talk before we eat them?",
    characters: ["Pizza Slice 🍕", "Apple 🍎", "Chocolate Bar 🍫", "Juice Box 🧃"],
    requirements: ["Say who you are", "Say if you want to be eaten or saved", "Give one reason", "Make a funny ending"],
    starters: ["Start: Please listen to me! I am a snack.", "Opinion: Eat me first / do not eat me yet.", "Reason: I am delicious, healthy, scared, or too young.", "Funny detail: I saw the lunchbox monster coming.", "Ending: Thank you, human!"]
  },
  {
    id: "bank-angry-shoes",
    level: "little-stars",
    topic: "Why are your shoes angry today?",
    characters: ["Running Shoes 👟", "School Shoes 👞", "Magic Shoes ✨", "Tiny Socks 🧦"],
    requirements: ["Say who you are", "Say why you are angry", "Ask for something", "End dramatically"],
    starters: ["Start: I am your shoes and I am angry!", "Reason: You run too much, step in mud, or never clean me.", "Wish: I want rest, polish, or a dance party.", "Voice: Sound dramatic and funny.", "Ending: No more running today!"]
  },
  {
    id: "bank-classroom-chair",
    level: "little-stars",
    topic: "What does the classroom chair want to say?",
    characters: ["Classroom Chair 🪑", "Desk 📚", "Whiteboard 📝", "School Bell 🔔"],
    requirements: ["Introduce the object", "Say what happens every day", "Say one wish", "End with a funny line"],
    starters: ["Start: Hello students, I am the classroom chair.", "Every day: Students sit, move, jump, or draw near me.", "Wish: I want kindness, quiet, or a soft pillow.", "Feeling: I am tired but I love my class.", "Ending: Please sit carefully!"]
  },
  {
    id: "bank-animal-teacher",
    level: "little-stars",
    topic: "What if an animal became your teacher?",
    characters: ["Lion Teacher 🦁", "Rabbit Teacher 🐰", "Owl Teacher 🦉", "Monkey Teacher 🐵"],
    requirements: ["Say who the teacher is", "Say what subject they teach", "Say one funny rule", "End with class dismissed"],
    starters: ["Start: Good morning, I am Professor Lion.", "Subject: I teach English, drama, snacks, or roaring.", "Rule: Students must roar, hop, fly, or laugh.", "Funny moment: Someone makes a silly mistake.", "Ending: Class dismissed!"]
  },
  {
    id: "bank-magic-pencil",
    level: "little-stars",
    topic: "What would a magic pencil write by itself?",
    characters: ["Magic Pencil ✏️", "Nervous Eraser 🧽", "Homework Paper 📄", "Talking Notebook 📓"],
    requirements: ["Introduce the object", "Say what it writes", "Say why", "End with surprise"],
    starters: ["Start: I am a magic pencil.", "Action: I write stories, jokes, answers, or secrets.", "Reason: I want to help or make trouble.", "Surprise: The teacher sees the paper moving.", "Ending: Oh no, hide me!"]
  },
  {
    id: "bank-lost-lunchbox",
    level: "little-stars",
    topic: "Where did the lost lunchbox go?",
    characters: ["Lost Lunchbox 🍱", "Hungry Backpack 🎒", "School Cat 🐱", "Brave Sandwich 🥪"],
    requirements: ["Say who is lost", "Say where they went", "Say what happened", "End happily"],
    starters: ["Start: I am the lost lunchbox.", "Setting: I went to the bus, playground, or classroom.", "Problem: I was scared or hungry students chased me.", "Help: Someone found me.", "Ending: I am home again!"]
  },
  {
    id: "bank-rainy-day",
    level: "little-stars",
    topic: "What does the rain say to the students?",
    characters: ["Rain Drop 🌧️", "Umbrella ☂️", "Wet Shoes 👟", "Happy Cloud ☁️"],
    requirements: ["Introduce the weather", "Say how you feel", "Give one message", "End softly"],
    starters: ["Start: Hello, I am a little rain drop.", "Feeling: I am happy, noisy, or sleepy.", "Message: Walk carefully, play safely, or enjoy the weather.", "Sound: Make your voice calm or funny.", "Ending: See you next rainy day."]
  },
  {
    id: "bank-super-student",
    level: "little-stars",
    topic: "If you were a student superhero, what would your power be?",
    characters: ["Homework Hero 🦸", "Kindness Hero 💙", "Fast Reader 📚", "Brave Speaker 🎤"],
    requirements: ["Say your hero name", "Say your power", "Say who you help", "End with a hero line"],
    starters: ["Start: I am Homework Hero!", "Power: I can read fast, speak bravely, or help friends.", "Help: I help shy students or lost pencils.", "Voice: Use a strong superhero voice.", "Ending: Dramagic needs me!"]
  },
  {
    id: "bank-pets-school",
    level: "junior-actors",
    topic: "Should pets come to school?",
    characters: ["Dog Principal 🐶", "Cat Student 🐱", "Scared Teacher 😳", "Happy Student 😄"],
    requirements: ["Character introduction", "Opinion", "One reason", "Funny ending"],
    starters: ["Start: Good morning, I am Dog Principal Max.", "Opinion: Say yes, no, or maybe.", "Reason: Pets can make students happy, but they can also be noisy.", "Example: Imagine a cat sleeping on the teacher’s desk.", "Ending: Give one funny school rule for pets."]
  },
  {
    id: "bank-homework-everyday",
    level: "junior-actors",
    topic: "Should students have homework every day?",
    characters: ["Tired Student 😴", "Strict Teacher 👩‍🏫", "School Bag 🎒", "Parent 👨‍👩‍👧"],
    requirements: ["Character introduction", "Opinion", "One reason", "Example", "Ending"],
    starters: ["Start: Hello everyone, I am the tired student / strict teacher.", "Opinion: Homework every day is good / bad / sometimes okay.", "Reason: Practice helps, but students need rest too.", "Example: Talk about drama practice, family time, or exams.", "Ending: Make a balanced final decision."]
  },
  {
    id: "bank-drama-every-class",
    level: "junior-actors",
    topic: "Should every class have drama?",
    characters: ["Shy Student 🙈", "Drama Teacher 🎭", "Boring Textbook 📘", "Famous Actor ⭐"],
    requirements: ["Introduce character", "Opinion", "Reason", "Class example", "Ending"],
    starters: ["Start: I am the boring textbook and I have a complaint.", "Opinion: Drama should / should not be in every class.", "Reason: Drama makes learning fun, but some people feel shy.", "Example: Act science, history, or English as a scene.", "Ending: Give a dramatic final line."]
  },
  {
    id: "bank-school-shorter",
    level: "junior-actors",
    topic: "Should the school day be shorter?",
    characters: ["Sleepy Student 😴", "School Clock 🕰️", "Teacher 👩‍🏫", "Bus Driver 🚌"],
    requirements: ["Character voice", "Opinion", "Reason", "Problem", "Ending"],
    starters: ["Start: Tick tock, I am the school clock.", "Opinion: The day should be shorter / stay the same.", "Reason: Students get tired or need more learning time.", "Problem: Long days can make brains sleepy.", "Ending: Ring the bell dramatically."]
  },
  {
    id: "bank-kids-subjects",
    level: "junior-actors",
    topic: "Should kids choose their own school subjects?",
    characters: ["Artist Student 🎨", "Math Book ➗", "Principal 👔", "Football Coach ⚽"],
    requirements: ["Character intro", "Opinion", "One reason", "Example subject", "Ending"],
    starters: ["Start: I am an artist student and I have a dream.", "Opinion: Kids should choose some subjects / not all subjects.", "Reason: Choice makes students excited, but basics are important.", "Example: Drama, art, sports, science, or English.", "Ending: Ask the principal for one creative day."]
  },
  {
    id: "bank-uniforms",
    level: "junior-actors",
    topic: "Should students wear school uniforms?",
    characters: ["Fashion Designer 👗", "Principal 👔", "Messy Student 😅", "School Mirror 🪞"],
    requirements: ["Say who you are", "Opinion", "Reason", "Example", "Funny ending"],
    starters: ["Start: Hello, I am the school mirror.", "Opinion: Uniforms are useful / boring / sometimes good.", "Reason: They save time, but students want personality.", "Example: Add badge, color, or creative day.", "Ending: The mirror gives a final fashion review."]
  },
  {
    id: "bank-recess-longer",
    level: "junior-actors",
    topic: "Should break time be longer?",
    characters: ["Playground Ball ⚽", "Hungry Student 🍔", "Teacher on Duty 👩‍🏫", "School Bell 🔔"],
    requirements: ["Introduce character", "Opinion", "Reason", "Example", "Ending"],
    starters: ["Start: I am the school bell and I decide everything.", "Opinion: Break should be longer / shorter / balanced.", "Reason: Students need energy and friends.", "Example: More time to eat, play, or relax.", "Ending: Ring the bell with a funny warning."]
  },
  {
    id: "bank-robots-school",
    level: "junior-actors",
    topic: "Should robots help teachers in school?",
    characters: ["Robot Assistant 🤖", "Teacher 👩‍🏫", "Student Inventor 🧪", "Old Chalk 🧑‍🏫"],
    requirements: ["Character introduction", "Opinion", "Reason", "Benefit/problem", "Ending"],
    starters: ["Start: Beep beep, I am Robot Assistant 3000.", "Opinion: Robots should help / not replace teachers.", "Reason: They can organize work but cannot feel emotions.", "Example: Robot checks attendance or explains homework.", "Ending: Human teachers still win."]
  },
  {
    id: "bank-best-classroom-rule",
    level: "junior-actors",
    topic: "What is the most important classroom rule?",
    characters: ["Class Captain 🏅", "Noisy Chair 🪑", "Teacher 👩‍🏫", "New Student 🎒"],
    requirements: ["Introduce character", "Choose rule", "Explain why", "Give example", "Ending"],
    starters: ["Start: I am the class captain and I have one rule.", "Rule: Listen, be kind, try, or raise your hand.", "Reason: The rule protects learning and feelings.", "Example: A noisy class vs. a kind class.", "Ending: Say your rule like a leader."]
  },
  {
    id: "bank-presentation-fear",
    level: "junior-actors",
    topic: "How can a shy student become braver?",
    characters: ["Shy Student 🙈", "Microphone 🎤", "Best Friend 🤝", "Drama Coach 🎭"],
    requirements: ["Character intro", "Problem", "Advice", "Example", "Encouraging ending"],
    starters: ["Start: I am the microphone and I hear tiny voices.", "Problem: Some students are scared to speak.", "Advice: Breathe, practice, smile, and start small.", "Example: Say one sentence first, then two.", "Ending: Tell the shy student they can do it."]
  },
  {
    id: "bank-phones-class",
    level: "creative-speakers",
    topic: "Should phones be allowed in class?",
    characters: ["The Phone 📱", "Old Notebook 📓", "Teacher 👨‍🏫", "Student 🎒"],
    requirements: ["Opinion", "Reason", "Problem", "Solution", "Ending"],
    starters: ["Start: Listen carefully, I am the phone everyone blames.", "Opinion: Phones can help learning, but they need rules.", "Problem: Games and distraction can ruin class.", "Solution: Use phones only for tasks, recording, or research.", "Ending: Technology is a tool, not the teacher."]
  },
  {
    id: "bank-kind-popular",
    level: "creative-speakers",
    topic: "Is being kind more important than being popular?",
    characters: ["Famous Student ⭐", "Lonely Student 💭", "Wise Tree 🌳", "Class Captain 🏅"],
    requirements: ["Character intro", "Opinion", "Reason", "Small story example", "Lesson"],
    starters: ["Start: I have watched students for many years.", "Opinion: Kindness lasts longer than popularity.", "Reason: Popularity can disappear, but kindness helps people.", "Story: Mention someone alone who needed a friend.", "Lesson: The best kind of famous is being remembered for good."]
  },
  {
    id: "bank-smart-brave",
    level: "creative-speakers",
    topic: "Is it better to be smart or brave?",
    characters: ["Knight 🛡️", "Scientist 🧪", "Scared Hero 🦸", "Magic Mirror 🪞"],
    requirements: ["Strong character voice", "Opinion", "Reason", "Example", "Message"],
    starters: ["Start: I am the magic mirror and I see the truth.", "Opinion: Smart, brave, or both?", "Reason: Smart people plan, brave people try.", "Example: A hero needs a plan and courage.", "Message: Balance is stronger than one skill alone."]
  },
  {
    id: "bank-mistakes",
    level: "creative-speakers",
    topic: "Should students learn from mistakes?",
    characters: ["Broken Robot 🤖", "Football Player ⚽", "Actor 🎭", "Pencil With No Eraser ✏️"],
    requirements: ["Story opening", "Mistake", "Opinion", "Lesson", "Ending"],
    starters: ["Start: I am a pencil with no eraser, so mistakes scare me.", "Mistake: Say what went wrong.", "Opinion: Mistakes can teach us if we do not hide them.", "Lesson: Practice makes the second try better.", "Ending: My mistake became my teacher."]
  },
  {
    id: "bank-real-hero",
    level: "creative-speakers",
    topic: "What makes a real hero?",
    characters: ["Superhero 🦸", "Villain 🦹", "Normal Student 🎒", "School Cleaner 🧹"],
    requirements: ["Character intro", "Opinion", "Reason", "Example", "Hero message"],
    starters: ["Start: Everyone thinks heroes wear capes, but I disagree.", "Opinion: A hero is brave, kind, honest, or helpful.", "Reason: Small actions can change someone’s day.", "Example: Helping a new student or speaking the truth.", "Ending: Heroes are made by choices."]
  },
  {
    id: "bank-rules-creativity",
    level: "creative-speakers",
    topic: "Should people always follow rules?",
    characters: ["Inventor 🧪", "Principal 👔", "Villain 🦹", "Artist 🎨"],
    requirements: ["Opinion", "Reason", "Danger/problem", "Creative solution", "Ending"],
    starters: ["Start: I am an inventor, and rules are interesting.", "Opinion: Some rules protect us, but some need creative thinking.", "Problem: Breaking rules can hurt people; blind rules can stop ideas.", "Solution: Respect safety, question unfair rules.", "Ending: Creativity needs responsibility."]
  },
  {
    id: "bank-social-media",
    level: "creative-speakers",
    topic: "Is social media good for young people?",
    characters: ["Phone 📱", "Parent 👨‍👩‍👧", "Influencer ⭐", "Quiet Student 💭"],
    requirements: ["Opinion", "Reason", "Good side", "Bad side", "Advice"],
    starters: ["Start: I am the phone, and I know your secrets.", "Opinion: Social media can be useful and dangerous.", "Good side: Learning, inspiration, connection.", "Bad side: Wasting time or comparing yourself.", "Advice: Control the app before it controls you."]
  },
  {
    id: "bank-teamwork-alone",
    level: "creative-speakers",
    topic: "Is teamwork better than working alone?",
    characters: ["Team Captain 🏅", "Lone Artist 🎨", "Coach 📣", "Puzzle Piece 🧩"],
    requirements: ["Character intro", "Opinion", "Reason", "Example", "Final message"],
    starters: ["Start: I am a puzzle piece; alone, I am strange.", "Opinion: Teamwork or alone work depends on the task.", "Reason: Teams share ideas; alone time builds focus.", "Example: A play needs a team, a monologue needs practice.", "Ending: Great people know when to do both."]
  },
  {
    id: "bank-imagination-knowledge",
    level: "creative-speakers",
    topic: "Is imagination more powerful than knowledge?",
    characters: ["Wizard 🧙", "Scientist 🧪", "Book 📘", "Dream 💭"],
    requirements: ["Dramatic opening", "Opinion", "Reason", "Example", "Message"],
    starters: ["Start: I am a dream, and I visit minds at night.", "Opinion: Imagination and knowledge need each other.", "Reason: Knowledge gives tools; imagination builds new worlds.", "Example: Every invention was imagined before it existed.", "Ending: Learn facts, then make magic."]
  },
  {
    id: "bank-pressure-friends",
    level: "creative-speakers",
    topic: "Should friends always agree with each other?",
    characters: ["Best Friend 🤝", "Honest Mirror 🪞", "Class Captain 🏅", "Drama Narrator 🎭"],
    requirements: ["Character intro", "Opinion", "Reason", "Example", "Kind ending"],
    starters: ["Start: I am the honest mirror, and I cannot lie.", "Opinion: Real friends do not always agree.", "Reason: Honest advice can protect someone.", "Example: A friend stops another from making a bad choice.", "Ending: Disagree with kindness, not cruelty."]
  },
  {
    id: "bank-confidence-talent",
    level: "teen-performers",
    topic: "Is confidence more important than talent?",
    characters: ["Famous Actor 🎬", "Shy Singer 🎤", "Coach 📣", "Jealous Rival 😏"],
    requirements: ["Strong opening", "Opinion", "Reason", "Example", "Powerful ending"],
    starters: ["Opening: Let me tell you what talent cannot do alone.", "Opinion: Confidence opens the door; talent improves the performance.", "Reason: A talented person who never tries stays invisible.", "Example: A shy singer with practice becomes stronger on stage.", "Ending: Talent whispers, but confidence steps into the light."]
  },
  {
    id: "bank-failure-useful",
    level: "teen-performers",
    topic: "Can failure be useful?",
    characters: ["Failed Magician 🎩", "Broken Robot 🤖", "Athlete 🏃", "Student Before Exam 📝"],
    requirements: ["Emotional opening", "Problem", "Opinion", "Lesson", "Ending"],
    starters: ["Opening: Yesterday, I failed in front of everyone.", "Problem: Explain what went wrong and how it felt.", "Opinion: Failure hurts, but it can guide the next try.", "Lesson: Every mistake shows what needs training.", "Ending: Failure is not the end of the show; it is rehearsal."]
  },
  {
    id: "bank-second-chance",
    level: "teen-performers",
    topic: "Should everyone get a second chance?",
    characters: ["Villain 🦹", "Judge ⚖️", "Teacher 👩‍🏫", "Best Friend 🤝"],
    requirements: ["Character intro", "Opinion", "Reason", "Example", "Final message"],
    starters: ["Opening: I am the judge, and this decision is not easy.", "Opinion: Some people deserve a second chance, with responsibility.", "Reason: People can grow, but trust needs proof.", "Example: Someone apologizes, changes, and works harder.", "Ending: A second chance is not a gift; it is a test."]
  },
  {
    id: "bank-popularity-kindness",
    level: "teen-performers",
    topic: "Is popularity worth changing yourself?",
    characters: ["Influencer ⭐", "Quiet Student 💭", "Old Friend 🤝", "Mirror 🪞"],
    requirements: ["Strong opening", "Conflict", "Opinion", "Example", "Ending"],
    starters: ["Opening: Everyone liked my mask, but nobody knew my face.", "Conflict: The character changes to impress people.", "Opinion: Popularity is not worth losing yourself.", "Example: A student hides their real interests to fit in.", "Ending: Being accepted as yourself is the real win."]
  },
  {
    id: "bank-risk-safe",
    level: "teen-performers",
    topic: "Is it better to take risks or stay safe?",
    characters: ["Explorer 🧭", "Careful Parent 👨‍👩‍👧", "Inventor 🧪", "Fearful Friend 😟"],
    requirements: ["Character voice", "Opinion", "Reason", "Example", "Balanced ending"],
    starters: ["Opening: I stand at the edge of a new journey.", "Opinion: Good risks can help us grow, but foolish risks can harm us.", "Reason: Fear protects us, but it can also trap us.", "Example: Auditioning, presenting, joining a new team.", "Ending: Take brave risks, not blind risks."]
  },
  {
    id: "bank-rules-break",
    level: "teen-performers",
    topic: "Should people follow rules or break them creatively?",
    characters: ["Villain 🦹", "Hero 🦸", "Inventor 🧪", "Principal 👔"],
    requirements: ["Dramatic opening", "Opinion", "Reason", "Warning", "Ending"],
    starters: ["Opening: Rules built this city, but imagination changed it.", "Opinion: Rules matter, but creative thinking questions limits.", "Reason: Some rules protect; some rules need improvement.", "Warning: Breaking rules without care becomes chaos.", "Ending: The best rebels build something better."]
  },
  {
    id: "bank-leader-friend",
    level: "teen-performers",
    topic: "Can a leader also be a friend?",
    characters: ["Team Leader 🏅", "Best Friend 🤝", "Coach 📣", "Jealous Teammate 😏"],
    requirements: ["Opening", "Opinion", "Reason", "Challenge", "Ending"],
    starters: ["Opening: Today I had to choose between being liked and being fair.", "Opinion: A leader can be a friend, but must be honest.", "Reason: Friendship without fairness destroys trust.", "Challenge: Correcting a friend is hard.", "Ending: Real friends respect honest leadership."]
  },
  {
    id: "bank-forgiveness",
    level: "teen-performers",
    topic: "Is forgiving someone always the right choice?",
    characters: ["Best Friend 🤝", "Judge ⚖️", "Hurt Student 💭", "Wise Grandparent 👵"],
    requirements: ["Emotional intro", "Opinion", "Boundary", "Example", "Final lesson"],
    starters: ["Opening: I forgave them, but I did not forget the lesson.", "Opinion: Forgiveness can free you, but it does not mean accepting harm.", "Boundary: You can forgive and still protect yourself.", "Example: A friend apologizes after betrayal.", "Ending: Forgiveness needs wisdom, not weakness."]
  },
  {
    id: "bank-dream-career",
    level: "teen-performers",
    topic: "Should you follow your dream even if people doubt you?",
    characters: ["Young Actor 🎭", "Strict Parent 👨‍👩‍👧", "Future Self ✨", "Jealous Rival 😏"],
    requirements: ["Strong opening", "Conflict", "Opinion", "Reason", "Powerful ending"],
    starters: ["Opening: They called my dream impossible.", "Conflict: People doubt the character’s goal.", "Opinion: Dreams need work, not just wishes.", "Reason: Doubt can hurt, but it can also push you to prove yourself.", "Ending: I do not need everyone to believe before I begin."]
  },
  {
    id: "bank-pressure-success",
    level: "teen-performers",
    topic: "Does success always make people happy?",
    characters: ["Famous Actor 🎬", "Tired Winner 🏆", "Old Friend 🤝", "Reporter 🎙️"],
    requirements: ["Opening", "Opinion", "Reason", "Hidden problem", "Ending"],
    starters: ["Opening: Everyone clapped, but I felt strangely quiet.", "Opinion: Success can feel good, but it does not solve everything.", "Reason: Pressure, loneliness, or fear can follow success.", "Hidden problem: The character misses simple happiness.", "Ending: Success matters, but peace matters too."]
  }
];

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
  "character-arena": {
    builderIntro: "Dramagicians answer one topic as a chosen character. Perfect for acting + speaking + opinion.",
    topicLabel: "Topic / question",
    topicPlaceholder: "Example: Should school bags have less books?",
    bankLabel: "Choose Character Arena topic",
    choiceLabel: "Character choices",
    choiceHeading: "Character choices",
    choiceSubmitLabel: "Choose character",
    choiceSummaryLabel: "Character",
    choicePlaceholder: "One per line. Example:\nTired School Bag 🎒\nAngry Pencil ✏️\nSleepy Student 😴",
    optionsLabel: "Opinion choices",
    optionsHeading: "Choose opinion",
    optionsSummaryLabel: "Opinion",
    options: ["Yes", "No", "Maybe"],
    requirementsLabel: "Dramagician must include",
    requirementsHeading: "Must include",
    helperLabel: "Detailed Dramagician helper / ready speaking ideas",
    helperHeading: "Dramagician helper / what to talk about:",
    materialLabel: "Video or material link (optional)",
    instructionsLabel: "Extra instructions",
    recordButton: "🎙️ Record Character Voice",
    demoButton: "Submit Demo Without Recording",
    publishNote: "Dramagicians choose a character and opinion, then submit from the pinned card in the group chat.",
    defaultCharacters: ["Tired School Bag 🎒", "Strict Teacher 👩‍🏫", "Sleepy Student 😴", "Robot Principal 🤖"],
    defaultRequirements: DEFAULT_MISSION_REQUIREMENTS,
    defaultStarters: DEFAULT_MISSION_STARTERS,
    defaultInstructions: "Choose a character, choose your opinion, and perform the answer as that character."
  },
  "story-lab": {
    builderIntro: "Dramagicians build and perform a short story. The form changes into setting, problem, twist, and ending help.",
    topicLabel: "Story prompt",
    topicPlaceholder: "Example: A school bag found a secret map inside the classroom.",
    bankLabel: "Choose Story Lab prompt",
    choiceLabel: "Story role / narrator choices",
    choiceHeading: "Story role choices",
    choiceSubmitLabel: "Choose story role",
    choiceSummaryLabel: "Story role",
    choicePlaceholder: "One per line. Example:\nNarrator 🎙️\nMain Hero 🦸\nFunny Friend 😂\nSecret Villain 🦹",
    optionsLabel: "Story mood choices",
    optionsHeading: "Choose story mood",
    optionsSummaryLabel: "Mood",
    options: ["Funny", "Mysterious", "Magical", "Dramatic"],
    requirementsLabel: "Story must include",
    requirementsHeading: "Story must include",
    helperLabel: "Story helper / ready story ideas",
    helperHeading: "Story helper / what to build:",
    materialLabel: "Picture / prompt material link (optional)",
    instructionsLabel: "Story instructions",
    recordButton: "🎙️ Record Story Performance",
    demoButton: "Submit Demo Story",
    publishNote: "Dramagicians choose a story role and mood, then perform a short story from the pinned group-chat card.",
    defaultCharacters: ["Narrator 🎙️", "Main Hero 🦸", "Funny Friend 😂", "Secret Villain 🦹"],
    defaultRequirements: ["Setting", "Main character", "Problem", "Twist", "Ending"],
    defaultStarters: ["Setting: Start by telling us where the story happens.", "Character: Introduce who the story follows and what they want.", "Problem: Something goes wrong or a secret appears.", "Twist: Add a surprise that changes the story.", "Ending: Finish with a lesson, joke, or dramatic final line."],
    defaultInstructions: "Create a short story. Mention the setting, main character, problem, twist, and ending. Perform it with voice and emotion."
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
  // STORY LAB
  { type: "story-lab", id: "story-magic-map", level: "little-stars", topic: "A school bag found a secret map inside the classroom.", characters: ["Narrator 🎙️", "School Bag 🎒", "Magic Map 🗺️", "Brave Pencil ✏️"], options: ["Funny", "Magical", "Mysterious"], requirements: ["Setting", "Main character", "Secret map", "One problem", "Happy ending"], starters: ["Setting: The classroom is quiet after everyone leaves.", "Character: The school bag hears paper moving inside it.", "Problem: The map points to a hidden place in school.", "Twist: The treasure is not money; it is something funny or helpful.", "Ending: End with a surprise sound or magical line."] },
  { type: "story-lab", id: "story-lost-star", level: "little-stars", topic: "A tiny star fell into the playground and needed help.", characters: ["Tiny Star ⭐", "Kind Student 💙", "Moon Friend 🌙", "Playground Slide 🛝"], options: ["Sweet", "Funny", "Magical"], requirements: ["Where it landed", "Who found it", "What it wanted", "How they helped", "Ending"], starters: ["Start in the playground at night or after school.", "The tiny star is scared because it cannot fly back.", "A kind character tries silly ways to help it.", "The solution can be teamwork, a ladder, or magic words.", "End with the star shining brighter."] },
  { type: "story-lab", id: "story-talking-door", level: "junior-actors", topic: "A door in the school started talking and refused to open.", characters: ["Talking Door 🚪", "Late Student 😰", "Strict Teacher 👩‍🏫", "Secret Key 🗝️"], options: ["Comedy", "Mystery", "Adventure"], requirements: ["Setting", "Problem", "Dialogue", "Twist", "Ending"], starters: ["Start with a student running late to class.", "The door refuses to open until someone answers a question.", "Add dialogue between the door and the student.", "Twist: The door is trying to protect something inside.", "End with a funny or mysterious reveal."] },
  { type: "story-lab", id: "story-villain-right", level: "creative-speakers", topic: "Write a story where the villain might actually be right.", characters: ["Villain 🦹", "Hero 🦸", "Reporter 🎙️", "Citizen 👥"], options: ["Dramatic", "Debate", "Mystery"], requirements: ["World/background", "Villain reason", "Hero reaction", "Moral question", "Ending"], starters: ["Start by showing the world has a real problem.", "The villain has a reason, not just evil behavior.", "The hero disagrees with the method, not the problem.", "Give the audience a difficult question to think about.", "End without making it too easy."] },
  { type: "story-lab", id: "story-object-secret", level: "teen-performers", topic: "Tell a story from the point of view of an object that knows everyone’s secrets.", characters: ["Old Mirror 🪞", "Classroom Chair 🪑", "Forgotten Notebook 📓", "Stage Curtain 🎭"], options: ["Emotional", "Suspense", "Deep"], requirements: ["Object narrator", "Secrets it saw", "Conflict", "Lesson", "Powerful ending"], starters: ["Begin with the object saying how long it has been watching people.", "Describe small secrets without exposing anyone too harshly.", "Choose one secret that changes the story.", "Show what the object learns about people.", "End with a strong final sentence from the object."] },

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
    "id": "story-cloud-lost-voice",
    "level": "little-stars",
    "category": "Magical school",
    "topic": "A cloud lost its voice and asked the class to help it rain again.",
    "characters": [
      "Narrator 🎙️",
      "Silent Cloud ☁️",
      "Brave Student 🎒",
      "Thunder Drum 🥁"
    ],
    "options": [
      "Sweet",
      "Funny",
      "Magical"
    ],
    "requirements": [
      "Where the cloud appears",
      "Why it lost its voice",
      "How the class helps",
      "One funny failed idea",
      "Happy ending"
    ],
    "starters": [
      "Setting: The class hears tiny rain sounds from inside a school bag.",
      "Problem: The cloud cannot speak, so it makes pictures in the air.",
      "Try: Students test silly ideas like singing, clapping, or whispering magic words.",
      "Twist: The quietest student understands the cloud first.",
      "Ending: The cloud rains glitter or soft happy rain over the playground."
    ],
    "teacherPreview": "Great for gentle emotion, teamwork, and simple magical storytelling."
  },
  {
    "type": "story-lab",
    "id": "story-library-book-sneeze",
    "level": "little-stars",
    "category": "Funny objects",
    "topic": "A library book sneezed and all the words jumped out of the pages.",
    "characters": [
      "Library Book 📘",
      "Lost Word 🔤",
      "Librarian 🤫",
      "Curious Reader 👀"
    ],
    "options": [
      "Funny",
      "Chaotic",
      "Magical"
    ],
    "requirements": [
      "Quiet library setting",
      "Words escaping",
      "A funny chase",
      "How words return",
      "Ending line"
    ],
    "starters": [
      "Setting: The library is very quiet until one book sneezes loudly.",
      "Problem: The words jump out and run around the room.",
      "Action: The characters chase verbs, adjectives, and funny words.",
      "Twist: One word refuses to go back because it wants to be in a story.",
      "Ending: The reader writes a new sentence and the words finally sleep."
    ],
    "teacherPreview": "Setting: The library is very quiet until one book sneezes loudly."
  },
  {
    "type": "story-lab",
    "id": "story-shy-microphone",
    "level": "little-stars",
    "category": "Confidence stories",
    "topic": "A shy microphone was afraid to make anyone hear its voice.",
    "characters": [
      "Shy Microphone 🎤",
      "Kind Speaker 💙",
      "Stage Light 💡",
      "Audience Clap 👏"
    ],
    "options": [
      "Sweet",
      "Dramatic",
      "Hopeful"
    ],
    "requirements": [
      "Introduce the microphone",
      "Show the fear",
      "Someone helps",
      "First small sound",
      "Confident ending"
    ],
    "starters": [
      "Start: The microphone is hiding behind the curtain.",
      "Fear: It thinks every voice will sound bad through it.",
      "Helper: A kind speaker tells it that voices grow with practice.",
      "Moment: The microphone makes one tiny sound, then a stronger one.",
      "Ending: The audience claps for the microphone too."
    ],
    "teacherPreview": "Start: The microphone is hiding behind the curtain."
  },
  {
    "type": "story-lab",
    "id": "story-backpack-elevator",
    "level": "little-stars",
    "category": "Comedy disaster",
    "topic": "A backpack got stuck in a school elevator and started telling everyone’s secrets.",
    "characters": [
      "Backpack 🎒",
      "Nervous Pencil ✏️",
      "Late Student 😅",
      "Elevator Button 🔘"
    ],
    "options": [
      "Funny",
      "Silly",
      "Mysterious"
    ],
    "requirements": [
      "Where it happens",
      "What secret is told",
      "Reaction",
      "Problem solved",
      "Funny ending"
    ],
    "starters": [
      "Setting: The student is late and the elevator stops.",
      "Problem: The backpack gets bored and starts talking.",
      "Secret: It reveals funny things inside it, like old snacks or lost homework.",
      "Solution: The elevator button asks for an apology or a joke.",
      "Ending: The backpack promises to keep secrets, maybe."
    ],
    "teacherPreview": "Setting: The student is late and the elevator stops."
  },
  {
    "type": "story-lab",
    "id": "story-moon-homework",
    "level": "little-stars",
    "category": "Dream / fantasy",
    "topic": "The moon asked a student for help with its homework.",
    "characters": [
      "Moon 🌙",
      "Sleepy Student 😴",
      "Star Teacher ⭐",
      "Night Notebook 📓"
    ],
    "options": [
      "Magical",
      "Funny",
      "Sweet"
    ],
    "requirements": [
      "Night setting",
      "Moon problem",
      "Student help",
      "One mistake",
      "Soft ending"
    ],
    "starters": [
      "Start: A student wakes up and sees the moon at the window.",
      "Problem: The moon has homework about humans.",
      "Action: The student explains school, friends, and courage.",
      "Mistake: The moon writes something funny about breakfast or exams.",
      "Ending: The moon shines brighter after learning."
    ],
    "teacherPreview": "Start: A student wakes up and sees the moon at the window."
  },
  {
    "type": "story-lab",
    "id": "story-chair-wanted-dayoff",
    "level": "little-stars",
    "category": "Funny objects",
    "topic": "A classroom chair wanted one day off because everyone kept sitting dramatically.",
    "characters": [
      "Tired Chair 🪑",
      "Jumping Student 🦘",
      "Desk 📚",
      "Teacher 👩‍🏫"
    ],
    "options": [
      "Funny",
      "Dramatic",
      "Silly"
    ],
    "requirements": [
      "Chair complaint",
      "Daily problem",
      "Wish",
      "Class reaction",
      "Funny ending"
    ],
    "starters": [
      "Start: The chair announces it is on strike.",
      "Problem: Students move, jump, and lean on it all day.",
      "Wish: It wants a pillow, holiday, or chair spa.",
      "Reaction: The class tries standing but gets tired quickly.",
      "Ending: The chair returns only after getting respect."
    ],
    "teacherPreview": "Start: The chair announces it is on strike."
  },
  {
    "type": "story-lab",
    "id": "story-stage-curtain-secret",
    "level": "junior-actors",
    "category": "Stage stories",
    "topic": "The stage curtain refused to open because it knew the actors were not ready.",
    "characters": [
      "Stage Curtain 🎭",
      "Nervous Actor 😰",
      "Drama Coach 📣",
      "Audience Whisper 👥"
    ],
    "options": [
      "Dramatic",
      "Funny",
      "Inspiring"
    ],
    "requirements": [
      "Backstage setting",
      "Why curtain refuses",
      "Actor fear",
      "Practice moment",
      "Opening scene"
    ],
    "starters": [
      "Setting: Everyone is waiting, but the curtain stays closed.",
      "Conflict: The curtain says the actors are acting brave, not feeling brave.",
      "Action: The coach helps them breathe and focus.",
      "Twist: The curtain opens only when the shy actor says the first line.",
      "Ending: The audience claps before the show even starts."
    ],
    "teacherPreview": "Setting: Everyone is waiting, but the curtain stays closed."
  },
  {
    "type": "story-lab",
    "id": "story-bus-to-wrong-school",
    "level": "junior-actors",
    "category": "Comedy adventure",
    "topic": "A school bus accidentally drove to a school for superheroes.",
    "characters": [
      "Bus Driver 🚌",
      "Normal Student 🎒",
      "Super Principal 🦸",
      "Flying Hall Monitor 🚀"
    ],
    "options": [
      "Comedy",
      "Adventure",
      "Heroic"
    ],
    "requirements": [
      "Wrong destination",
      "New school rules",
      "One challenge",
      "Student solution",
      "Return home"
    ],
    "starters": [
      "Start: The student notices the school gate is floating.",
      "Problem: Everyone thinks the student has a hidden superpower.",
      "Challenge: They must pass a strange class like flying math or invisible English.",
      "Twist: The student’s real power is speaking clearly and bravely.",
      "Ending: The bus returns, but the student keeps the confidence."
    ],
    "teacherPreview": "Start: The student notices the school gate is floating."
  },
  {
    "type": "story-lab",
    "id": "story-principal-time-machine",
    "level": "junior-actors",
    "category": "Mystery school",
    "topic": "The principal found a time machine in the teachers’ room.",
    "characters": [
      "Principal 👔",
      "Curious Student 👀",
      "Old Teacher 👩‍🏫",
      "Time Machine ⏳"
    ],
    "options": [
      "Mystery",
      "Funny",
      "Adventure"
    ],
    "requirements": [
      "Discovery",
      "Where they travel",
      "One problem",
      "Lesson learned",
      "Return"
    ],
    "starters": [
      "Opening: A strange ticking sound comes from the teachers’ room.",
      "Discovery: The principal finds a machine with school years written on buttons.",
      "Trip: They visit the first day Dramagic started or a future classroom.",
      "Problem: They almost get stuck in the wrong year.",
      "Ending: They return with one lesson about courage or learning."
    ],
    "teacherPreview": "Opening: A strange ticking sound comes from the teachers’ room."
  },
  {
    "type": "story-lab",
    "id": "story-noisy-shadow",
    "level": "junior-actors",
    "category": "Mystery / expression",
    "topic": "A student’s shadow became noisy and started acting the opposite of them.",
    "characters": [
      "Quiet Student 🤫",
      "Noisy Shadow 🖤",
      "Best Friend 🤝",
      "Drama Teacher 🎭"
    ],
    "options": [
      "Funny",
      "Mysterious",
      "Dramatic"
    ],
    "requirements": [
      "Character contrast",
      "Shadow problem",
      "Public moment",
      "Understanding",
      "Ending"
    ],
    "starters": [
      "Start: The student is quiet, but their shadow is dancing and shouting.",
      "Problem: The shadow says everything the student is scared to say.",
      "Scene: This happens during a presentation or class activity.",
      "Twist: The shadow is trying to help, not embarrass them.",
      "Ending: The student and shadow perform together."
    ],
    "teacherPreview": "Start: The student is quiet, but their shadow is dancing and shouting."
  },
  {
    "type": "story-lab",
    "id": "story-cafeteria-kingdom",
    "level": "junior-actors",
    "category": "Funny world-building",
    "topic": "The school cafeteria turned into a tiny kingdom during lunch break.",
    "characters": [
      "Sandwich King 🥪",
      "Juice Queen 🧃",
      "Hungry Knight 🍗",
      "Lunchbox Guard 🍱"
    ],
    "options": [
      "Comedy",
      "Adventure",
      "Royal"
    ],
    "requirements": [
      "Kingdom setting",
      "Lunch problem",
      "Character conflict",
      "Peace plan",
      "Funny ending"
    ],
    "starters": [
      "Start: The student opens the lunchbox and hears royal music.",
      "Problem: The sandwich and juice are fighting for the throne.",
      "Conflict: Hungry students are coming like dragons.",
      "Solution: The character creates a lunch treaty.",
      "Ending: Everyone bows to the one who cleans the table."
    ],
    "teacherPreview": "Start: The student opens the lunchbox and hears royal music."
  },
  {
    "type": "story-lab",
    "id": "story-friendship-button",
    "level": "junior-actors",
    "category": "Friendship / kindness",
    "topic": "A student found a button that could replay one friendship moment.",
    "characters": [
      "Student 🎒",
      "Best Friend 🤝",
      "Memory Button 🔘",
      "Future Self ✨"
    ],
    "options": [
      "Emotional",
      "Warm",
      "Mysterious"
    ],
    "requirements": [
      "Object discovery",
      "Memory replay",
      "Feeling",
      "Choice",
      "Lesson"
    ],
    "starters": [
      "Opening: The button is hidden under a desk.",
      "Power: When pressed, it shows one important friendship moment.",
      "Feeling: The student remembers kindness, apology, or support.",
      "Choice: They decide whether to change something today.",
      "Ending: The button disappears after the lesson is understood."
    ],
    "teacherPreview": "Opening: The button is hidden under a desk."
  },
  {
    "type": "story-lab",
    "id": "story-city-no-eye-contact",
    "level": "creative-speakers",
    "category": "Confidence metaphor",
    "topic": "A city where nobody could look anyone in the eye until one speaker changed it.",
    "characters": [
      "Brave Speaker 🎤",
      "Mayor 👔",
      "Mirror Seller 🪞",
      "Silent Crowd 👥"
    ],
    "options": [
      "Inspiring",
      "Dramatic",
      "Symbolic"
    ],
    "requirements": [
      "City rule",
      "Main problem",
      "Speaker’s attempt",
      "Crowd change",
      "Message"
    ],
    "starters": [
      "World: People speak while looking at the floor, walls, or phones.",
      "Problem: Nobody feels truly heard.",
      "Hero: A speaker decides to look up during a public speech.",
      "Conflict: People feel uncomfortable at first.",
      "Ending: Eye contact becomes the city’s first sign of courage."
    ],
    "teacherPreview": "World: People speak while looking at the floor, walls, or phones."
  },
  {
    "type": "story-lab",
    "id": "story-library-of-unspoken-words",
    "level": "creative-speakers",
    "category": "Deep imagination",
    "topic": "There is a secret library that stores every sentence people were too afraid to say.",
    "characters": [
      "Librarian 📚",
      "Shy Speaker 💭",
      "Old Sentence 🔤",
      "Locked Book 🔐"
    ],
    "options": [
      "Emotional",
      "Mystery",
      "Inspiring"
    ],
    "requirements": [
      "Secret place",
      "Unspoken words",
      "Personal choice",
      "Spoken moment",
      "Ending message"
    ],
    "starters": [
      "Setting: The library shelves are full of glowing unfinished sentences.",
      "Problem: The main character finds their own sentence inside a locked book.",
      "Conflict: Speaking it might change a friendship, class, or dream.",
      "Action: They practice the sentence until it becomes clear.",
      "Ending: One book disappears because the words were finally spoken."
    ],
    "teacherPreview": "Setting: The library shelves are full of glowing unfinished sentences."
  },
  {
    "type": "story-lab",
    "id": "story-school-of-forgotten-talents",
    "level": "creative-speakers",
    "category": "Character building",
    "topic": "A school exists for talents that people ignored or laughed at.",
    "characters": [
      "Forgotten Artist 🎨",
      "Drama Coach 🎭",
      "Talent Keeper 🗝️",
      "Doubt Monster 🌫️"
    ],
    "options": [
      "Inspiring",
      "Fantasy",
      "Dramatic"
    ],
    "requirements": [
      "Hidden school",
      "Forgotten talent",
      "Obstacle",
      "Training",
      "Final performance"
    ],
    "starters": [
      "Opening: The student receives an invitation after saying “I am not good at anything.”",
      "World: The school teaches unusual talents like listening, courage, or storytelling.",
      "Obstacle: The Doubt Monster repeats negative thoughts.",
      "Training: The student learns one small skill is still valuable.",
      "Ending: They return and use the talent in real life."
    ],
    "teacherPreview": "Opening: The student receives an invitation after saying “I am not good at anything.”"
  },
  {
    "type": "story-lab",
    "id": "story-trial-of-the-hero",
    "level": "creative-speakers",
    "category": "Moral choice",
    "topic": "A hero is put on trial because saving the day caused a new problem.",
    "characters": [
      "Hero 🦸",
      "Judge ⚖️",
      "Citizen 👥",
      "Reporter 🎙️"
    ],
    "options": [
      "Debate",
      "Dramatic",
      "Thoughtful"
    ],
    "requirements": [
      "Court setting",
      "Hero action",
      "Problem created",
      "Both sides",
      "Fair ending"
    ],
    "starters": [
      "Start with a courtroom scene after a dramatic rescue.",
      "Hero side: They saved people or protected someone.",
      "Other side: Their action damaged something or hurt trust.",
      "Question: Can a good choice still have bad results?",
      "Ending: Give a fair decision, not an easy one."
    ],
    "teacherPreview": "Start with a courtroom scene after a dramatic rescue."
  },
  {
    "type": "story-lab",
    "id": "story-emotion-market",
    "level": "creative-speakers",
    "category": "Emotions / performance",
    "topic": "A market sells emotions in small bottles, but one bottle is missing.",
    "characters": [
      "Emotion Seller 🧪",
      "Customer 😶",
      "Bottle of Courage 💙",
      "Thief of Fear 🌫️"
    ],
    "options": [
      "Mystery",
      "Fantasy",
      "Emotional"
    ],
    "requirements": [
      "Market description",
      "Missing emotion",
      "Search",
      "Character need",
      "Resolution"
    ],
    "starters": [
      "Setting: Every shop sells bottled feelings like joy, calm, fear, or courage.",
      "Problem: The courage bottle is gone before a big presentation.",
      "Search: The character discovers courage cannot be bought easily.",
      "Twist: The missing bottle was empty because courage is made by action.",
      "Ending: The character speaks without the bottle."
    ],
    "teacherPreview": "Setting: Every shop sells bottled feelings like joy, calm, fear, or courage."
  },
  {
    "type": "story-lab",
    "id": "story-newsroom-impossible-event",
    "level": "creative-speakers",
    "category": "News reporter",
    "topic": "A reporter must cover an impossible event: the school building started moving.",
    "characters": [
      "Reporter 🎙️",
      "Moving School 🏫",
      "Principal 👔",
      "Confused Student 😵"
    ],
    "options": [
      "Breaking News",
      "Comedy",
      "Mystery"
    ],
    "requirements": [
      "Report opening",
      "Event details",
      "Interview",
      "Cause",
      "Final headline"
    ],
    "starters": [
      "Open like breaking news: “We are live from Dramagic...”",
      "Describe the impossible event clearly.",
      "Interview one funny or serious witness.",
      "Reveal the cause: magic, technology, or a forgotten promise.",
      "End with a strong final headline."
    ],
    "teacherPreview": "Open like breaking news: “We are live from Dramagic...”"
  },
  {
    "type": "story-lab",
    "id": "story-applause-machine",
    "level": "teen-performers",
    "category": "Stage / identity",
    "topic": "A machine can create fake applause, but one performer wants the real thing.",
    "characters": [
      "Performer 🎭",
      "Inventor 🧪",
      "Audience Member 👤",
      "Applause Machine 👏"
    ],
    "options": [
      "Dramatic",
      "Emotional",
      "Thoughtful"
    ],
    "requirements": [
      "Invention",
      "Temptation",
      "Real vs fake",
      "Performance moment",
      "Lesson"
    ],
    "starters": [
      "Opening: The performer is scared nobody will clap.",
      "Invention: A machine can make perfect applause at any time.",
      "Conflict: Fake applause feels safe but empty.",
      "Turning point: The performer chooses a real honest performance.",
      "Ending: Even a small real clap means more than a machine."
    ],
    "teacherPreview": "Opening: The performer is scared nobody will clap."
  },
  {
    "type": "story-lab",
    "id": "story-person-who-could-edit-memories",
    "level": "teen-performers",
    "category": "Deep moral choice",
    "topic": "A teenager discovers they can edit one memory, but every edit changes their confidence.",
    "characters": [
      "Teen Performer 🎤",
      "Memory Editor ✂️",
      "Old Friend 🤝",
      "Future Self ✨"
    ],
    "options": [
      "Emotional",
      "Mystery",
      "Reflective"
    ],
    "requirements": [
      "Memory power",
      "Chosen memory",
      "Consequence",
      "Self-discovery",
      "Final choice"
    ],
    "starters": [
      "Start with a memory that still feels embarrassing or painful.",
      "Power: The character can erase or rewrite it.",
      "Problem: Removing mistakes also removes lessons.",
      "Realization: Confidence came from surviving that moment.",
      "Ending: They keep the memory but change what it means."
    ],
    "teacherPreview": "Start with a memory that still feels embarrassing or painful."
  },
  {
    "type": "story-lab",
    "id": "story-perfect-student-bug",
    "level": "teen-performers",
    "category": "Technology / pressure",
    "topic": "An app creates the perfect student, but the real student feels invisible.",
    "characters": [
      "Real Student 💭",
      "Perfect App 🤖",
      "Teacher 👩‍🏫",
      "Friend 🤝"
    ],
    "options": [
      "Sci-fi",
      "Dramatic",
      "Thoughtful"
    ],
    "requirements": [
      "Technology setup",
      "Perfect version",
      "Emotional problem",
      "Decision",
      "Message"
    ],
    "starters": [
      "Opening: The app answers perfectly, speaks perfectly, and never gets nervous.",
      "Conflict: Everyone praises the app version.",
      "Feeling: The real student wonders if mistakes make them useless.",
      "Choice: They do something the app cannot: feel, connect, or improvise.",
      "Ending: Being real becomes the strongest skill."
    ],
    "teacherPreview": "Opening: The app answers perfectly, speaks perfectly, and never gets nervous."
  },
  {
    "type": "story-lab",
    "id": "story-stage-with-no-audience",
    "level": "teen-performers",
    "category": "Confidence / resilience",
    "topic": "A performer prepares for a big show, but when the curtain opens, the room is empty.",
    "characters": [
      "Performer 🎭",
      "Empty Chair 🪑",
      "Stage Light 💡",
      "Inner Voice 💭"
    ],
    "options": [
      "Emotional",
      "Poetic",
      "Powerful"
    ],
    "requirements": [
      "Big preparation",
      "Empty room",
      "Inner conflict",
      "Decision to perform",
      "Meaningful ending"
    ],
    "starters": [
      "Opening: The performer has rehearsed for weeks.",
      "Shock: The audience is gone, but the stage light is still on.",
      "Conflict: Do they perform if nobody is watching?",
      "Realization: Practice and passion still matter.",
      "Ending: One person enters at the end, or the performer becomes their own audience."
    ],
    "teacherPreview": "Opening: The performer has rehearsed for weeks."
  },
  {
    "type": "story-lab",
    "id": "story-truth-theater",
    "level": "teen-performers",
    "category": "Dramatic concept",
    "topic": "A theater shows the truth behind every character’s smile.",
    "characters": [
      "Actor 🎭",
      "Truth Theater 🎟️",
      "Audience Member 👤",
      "Mask Maker 🎭"
    ],
    "options": [
      "Dramatic",
      "Deep",
      "Mystery"
    ],
    "requirements": [
      "Theater rule",
      "Hidden truth",
      "Character mask",
      "Audience reaction",
      "Lesson"
    ],
    "starters": [
      "Set the scene in a beautiful theater where every smile has a shadow.",
      "The actor performs a happy role while hiding fear, pressure, or doubt.",
      "The theater reveals the truth through lights, music, or mirrors.",
      "The audience learns not to judge people only by appearances.",
      "End with the actor choosing honesty over a perfect mask."
    ],
    "teacherPreview": "Set the scene in a beautiful theater where every smile has a shadow."
  },
  {
    "type": "story-lab",
    "id": "story-final-line-stolen",
    "level": "teen-performers",
    "category": "Mystery / performance",
    "topic": "Before a performance, someone steals the final line of the speech.",
    "characters": [
      "Speaker 🎤",
      "Line Thief 🕵️",
      "Coach 📣",
      "Audience 👥"
    ],
    "options": [
      "Mystery",
      "Suspense",
      "Inspiring"
    ],
    "requirements": [
      "Missing line",
      "Search",
      "Pressure",
      "Improvised ending",
      "Lesson"
    ],
    "starters": [
      "Opening: The speech is ready, but the last sentence disappears.",
      "Search: Everyone looks backstage, in notebooks, and in memories.",
      "Pressure: The speaker must go on without the perfect ending.",
      "Twist: The best final line is improvised honestly.",
      "Ending: The audience remembers the real words more than the planned ones."
    ],
    "teacherPreview": "Opening: The speech is ready, but the last sentence disappears."
  },
  {
    "type": "story-lab",
    "id": "story-robot-learning-sorry",
    "level": "junior-actors",
    "category": "Character building",
    "topic": "A robot learned every English word except “sorry”.",
    "characters": [
      "Robot 🤖",
      "Patient Friend 🤝",
      "Teacher 👩‍🏫",
      "Broken Toy 🧸"
    ],
    "options": [
      "Funny",
      "Emotional",
      "Lesson"
    ],
    "requirements": [
      "Robot problem",
      "Mistake",
      "Friend reaction",
      "Learning moment",
      "Ending"
    ],
    "starters": [
      "The robot speaks perfectly but cannot apologize.",
      "It makes a mistake that hurts a friend or breaks something.",
      "Everyone teaches it that words need feelings too.",
      "The robot practices “sorry” with real emotion.",
      "End with a small kind action, not only a word."
    ],
    "teacherPreview": "The robot speaks perfectly but cannot apologize."
  },
  {
    "type": "story-lab",
    "id": "story-shoes-walk-to-dream",
    "level": "little-stars",
    "category": "Dream / adventure",
    "topic": "A pair of shoes walked by themselves toward the owner’s dream.",
    "characters": [
      "Magic Shoes 👟",
      "Dreamer 💭",
      "Street Cat 🐱",
      "Old Map 🗺️"
    ],
    "options": [
      "Adventure",
      "Funny",
      "Magical"
    ],
    "requirements": [
      "Shoes move",
      "Dream destination",
      "Obstacle",
      "Helper",
      "Ending"
    ],
    "starters": [
      "The shoes start walking while the student is asleep.",
      "They know the student’s dream better than the student does.",
      "A funny obstacle blocks the way.",
      "A helper gives advice about courage.",
      "The student wakes up one step closer to the dream."
    ],
    "teacherPreview": "The shoes start walking while the student is asleep."
  },
  {
    "type": "story-lab",
    "id": "story-classroom-underwater",
    "level": "little-stars",
    "category": "Fantasy setting",
    "topic": "The classroom slowly became an underwater classroom.",
    "characters": [
      "Fish Teacher 🐠",
      "Bubble Student 🫧",
      "Octopus Desk 🐙",
      "Shy Crab 🦀"
    ],
    "options": [
      "Funny",
      "Magical",
      "Adventure"
    ],
    "requirements": [
      "Underwater change",
      "Class reaction",
      "One lesson",
      "Problem",
      "Ending"
    ],
    "starters": [
      "Water appears under the chairs, then bubbles in the air.",
      "Nobody panics because the fish teacher starts the lesson.",
      "The class learns a word or drama move underwater.",
      "Problem: Homework starts floating away.",
      "Ending: The bell rings like a whale song."
    ],
    "teacherPreview": "Water appears under the chairs, then bubbles in the air."
  },
  {
    "type": "story-lab",
    "id": "story-day-without-names",
    "level": "creative-speakers",
    "category": "Identity",
    "topic": "One day, everyone forgot their names and had to choose who they wanted to be.",
    "characters": [
      "Name Keeper 🗝️",
      "Quiet Student 💭",
      "Teacher 👩‍🏫",
      "Old Badge 🪪"
    ],
    "options": [
      "Thoughtful",
      "Mystery",
      "Dramatic"
    ],
    "requirements": [
      "Strange event",
      "Identity problem",
      "Choice",
      "Conflict",
      "Message"
    ],
    "starters": [
      "Start with attendance: every name disappears from the list.",
      "People choose labels like smart, funny, popular, or brave.",
      "The main character questions if a name defines a person.",
      "A conflict happens when someone chooses a label that is not true.",
      "End with the message that actions build identity."
    ],
    "teacherPreview": "Start with attendance: every name disappears from the list."
  },
  {
    "type": "story-lab",
    "id": "story-mirror-only-showed-future",
    "level": "teen-performers",
    "category": "Future / choice",
    "topic": "A mirror only showed the future people were afraid to choose.",
    "characters": [
      "Future Mirror 🪞",
      "Teen Speaker 🎤",
      "Parent 👨‍👩‍👧",
      "Doubt Voice 🌫️"
    ],
    "options": [
      "Deep",
      "Emotional",
      "Mysterious"
    ],
    "requirements": [
      "Mirror power",
      "Fearful future",
      "Choice",
      "Conflict",
      "Ending"
    ],
    "starters": [
      "The mirror appears before a big decision.",
      "It shows a future where the character chose courage.",
      "The character is scared because courage costs effort.",
      "Someone tries to cover the mirror.",
      "End with the character choosing one brave step."
    ],
    "teacherPreview": "The mirror appears before a big decision."
  },
  {
    "type": "story-lab",
    "id": "story-camera-captured-feelings",
    "level": "junior-actors",
    "category": "Media / emotion",
    "topic": "A camera took photos of feelings instead of faces.",
    "characters": [
      "Magic Camera 📷",
      "Happy Student 😄",
      "Hidden Feeling 💭",
      "Photographer 👀"
    ],
    "options": [
      "Funny",
      "Emotional",
      "Mysterious"
    ],
    "requirements": [
      "Camera rule",
      "First photo",
      "Hidden feeling",
      "Reaction",
      "Ending"
    ],
    "starters": [
      "The first photo shows storm clouds instead of a smile.",
      "Everyone realizes the camera sees feelings, not faces.",
      "One character tries to hide their nervousness.",
      "A friend helps them talk honestly.",
      "End with a photo full of light."
    ],
    "teacherPreview": "The first photo shows storm clouds instead of a smile."
  },
  {
    "type": "story-lab",
    "id": "story-last-seat-on-spaceship",
    "level": "creative-speakers",
    "category": "Debate drama",
    "topic": "There is one seat left on a spaceship leaving Earth, and four characters want it.",
    "characters": [
      "Scientist 🧪",
      "Artist 🎨",
      "Child Dreamer 💭",
      "Robot Pilot 🤖"
    ],
    "options": [
      "Debate",
      "Drama",
      "Sci-fi"
    ],
    "requirements": [
      "Situation",
      "Four reasons",
      "Fair decision",
      "Emotion",
      "Ending"
    ],
    "starters": [
      "Set the scene: the spaceship leaves in ten minutes.",
      "Each character explains why they should get the seat.",
      "Add emotion, not just reasons.",
      "The decision should feel difficult and fair.",
      "End with a surprising solution or sacrifice."
    ],
    "teacherPreview": "Set the scene: the spaceship leaves in ten minutes."
  },
  {
    "type": "story-lab",
    "id": "story-classroom-lost-gravity",
    "level": "little-stars",
    "category": "Physical comedy",
    "topic": "The classroom lost gravity during English class.",
    "characters": [
      "Floating Teacher 👩‍🏫",
      "Flying Homework 📄",
      "Student Astronaut 🚀",
      "Angry Pencil ✏️"
    ],
    "options": [
      "Funny",
      "Adventure",
      "Magical"
    ],
    "requirements": [
      "Gravity problem",
      "Funny reactions",
      "One English task",
      "Solution",
      "Ending"
    ],
    "starters": [
      "Books, pencils, and shoes start floating.",
      "The teacher continues the lesson like it is normal.",
      "Students must say a sentence to float down.",
      "One object refuses to return to Earth.",
      "End when the bell falls from the ceiling."
    ],
    "teacherPreview": "Books, pencils, and shoes start floating."
  },
  {
    "type": "story-lab",
    "id": "story-mask-shop",
    "level": "teen-performers",
    "category": "Identity / confidence",
    "topic": "A shop sells masks that make people look confident, but one mask cracks on stage.",
    "characters": [
      "Mask Seller 🎭",
      "Performer 🎤",
      "Real Friend 🤝",
      "Audience 👥"
    ],
    "options": [
      "Dramatic",
      "Emotional",
      "Deep"
    ],
    "requirements": [
      "Shop setup",
      "Mask promise",
      "Stage problem",
      "Real confidence",
      "Ending"
    ],
    "starters": [
      "Open with a shop full of perfect confident masks.",
      "The performer buys one before a presentation.",
      "On stage, the mask cracks when the words become personal.",
      "A friend encourages the performer to speak without it.",
      "End with real confidence sounding imperfect but honest."
    ],
    "teacherPreview": "Open with a shop full of perfect confident masks."
  },
  {
    "type": "story-lab",
    "id": "story-silent-bell",
    "level": "junior-actors",
    "category": "School mystery",
    "topic": "The school bell became silent because it was tired of ending good moments.",
    "characters": [
      "Silent Bell 🔔",
      "Drama Class 🎭",
      "Principal 👔",
      "Clock 🕰️"
    ],
    "options": [
      "Mystery",
      "Funny",
      "Warm"
    ],
    "requirements": [
      "Bell silence",
      "Why it stopped",
      "School problem",
      "Agreement",
      "Ending"
    ],
    "starters": [
      "The class waits for the bell, but nothing happens.",
      "The bell says it hates stopping creative moments.",
      "The school becomes confused: no breaks, no endings, no timing.",
      "The class promises to finish moments properly.",
      "The bell rings softly and respectfully."
    ],
    "teacherPreview": "The class waits for the bell, but nothing happens."
  },
  {
    "type": "story-lab",
    "id": "story-invisible-audience",
    "level": "creative-speakers",
    "category": "Presentation courage",
    "topic": "A speaker had to present to an invisible audience that reacted only with sound.",
    "characters": [
      "Speaker 🎤",
      "Invisible Audience 👥",
      "Sound Technician 🎧",
      "Fear Voice 💭"
    ],
    "options": [
      "Suspense",
      "Funny",
      "Inspiring"
    ],
    "requirements": [
      "Invisible audience",
      "Sound reactions",
      "Speaker fear",
      "Adaptation",
      "Ending"
    ],
    "starters": [
      "The speaker cannot see faces, only hear coughs, whispers, or claps.",
      "They must learn to trust their message without seeing approval.",
      "Add one funny wrong interpretation of a sound.",
      "The speaker adjusts voice and pace.",
      "End with invisible applause becoming real confidence."
    ],
    "teacherPreview": "The speaker cannot see faces, only hear coughs, whispers, or claps."
  },
  {
    "type": "story-lab",
    "id": "story-pencil-writing-truth",
    "level": "little-stars",
    "category": "Funny object",
    "topic": "A pencil only wrote the truth, even when the student wanted a normal story.",
    "characters": [
      "Truth Pencil ✏️",
      "Student Writer 📄",
      "Eraser 🧽",
      "Teacher 👩‍🏫"
    ],
    "options": [
      "Funny",
      "Magical",
      "Lesson"
    ],
    "requirements": [
      "Magic pencil",
      "Truth problem",
      "Funny truth",
      "Choice",
      "Ending"
    ],
    "starters": [
      "The student writes “Once upon a time,” but the pencil writes a real secret.",
      "The eraser tries to erase it but learns it is important.",
      "The teacher asks why the story feels honest.",
      "The student decides to write a true story with imagination.",
      "End with the pencil finally saying “Good job.”"
    ],
    "teacherPreview": "The student writes “Once upon a time,” but the pencil writes a real secret."
  },
  {
    "type": "story-lab",
    "id": "story-audition-for-clouds",
    "level": "junior-actors",
    "category": "Performance fantasy",
    "topic": "Clouds held auditions to choose the next thunder voice.",
    "characters": [
      "Tiny Cloud ☁️",
      "Thunder Judge ⚡",
      "Rain Dancer 🌧️",
      "Wind Coach 🌬️"
    ],
    "options": [
      "Comedy",
      "Dramatic",
      "Magical"
    ],
    "requirements": [
      "Audition setting",
      "Characters perform",
      "Problem",
      "Winner",
      "Ending"
    ],
    "starters": [
      "Start above the city where clouds line up for auditions.",
      "Each cloud performs a different thunder voice.",
      "The tiny cloud is shy and almost leaves.",
      "The wind coach teaches breath and confidence.",
      "End with the tiniest cloud making the biggest sound."
    ],
    "teacherPreview": "Start above the city where clouds line up for auditions."
  },
  {
    "type": "story-lab",
    "id": "story-world-without-questions",
    "level": "teen-performers",
    "category": "Thoughtful debate",
    "topic": "A world banned questions because questions made people uncomfortable.",
    "characters": [
      "Question Keeper ❓",
      "Strict Leader 👔",
      "Curious Teen 💭",
      "Old Book 📘"
    ],
    "options": [
      "Dramatic",
      "Political",
      "Mystery"
    ],
    "requirements": [
      "World rule",
      "Why questions banned",
      "Curious act",
      "Risk",
      "Message"
    ],
    "starters": [
      "Describe a place where people only repeat answers.",
      "The main character finds an old book full of questions.",
      "Asking one question creates tension but also truth.",
      "Show why questions can be scary and powerful.",
      "End with a question the audience remembers."
    ],
    "teacherPreview": "Describe a place where people only repeat answers."
  },
  {
    "type": "story-lab",
    "id": "story-lost-ending",
    "level": "creative-speakers",
    "category": "Story craft",
    "topic": "A writer lost the ending of a story, and the characters escaped to find it.",
    "characters": [
      "Writer ✍️",
      "Hero 🦸",
      "Villain 🦹",
      "Missing Ending 📄"
    ],
    "options": [
      "Adventure",
      "Comedy",
      "Meta"
    ],
    "requirements": [
      "Writer problem",
      "Characters escape",
      "Search",
      "Argument",
      "Ending"
    ],
    "starters": [
      "The writer cannot finish the story.",
      "The hero and villain jump out of the page to complain.",
      "They search in the classroom, stage, or writer’s memory.",
      "The villain suggests an ending that might be better.",
      "End with the characters choosing their own ending."
    ],
    "teacherPreview": "The writer cannot finish the story."
  },
  {
    "type": "story-lab",
    "id": "story-bravery-bank",
    "level": "creative-speakers",
    "category": "Confidence metaphor",
    "topic": "A bank stored bravery instead of money, but one student had an empty account.",
    "characters": [
      "Banker 🏦",
      "Student 💭",
      "Courage Coin 🪙",
      "Fear Collector 🌫️"
    ],
    "options": [
      "Inspiring",
      "Fantasy",
      "Emotional"
    ],
    "requirements": [
      "Bank concept",
      "Empty account",
      "How bravery is earned",
      "Small act",
      "Ending"
    ],
    "starters": [
      "Introduce a bank where people deposit brave moments.",
      "The student feels poor because their courage account is empty.",
      "The banker explains courage is earned by action, not wishes.",
      "The student does one tiny brave thing.",
      "End with one small coin shining brighter than gold."
    ],
    "teacherPreview": "Introduce a bank where people deposit brave moments."
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
  return MISSION_BANK.length + MISSION_EXTRA_BANK.length + STORY_LAB_CREATIVE_BANK.length + readCustomMissionBankItems().length;
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
  return MISSION_TYPE_CONFIGS[type] || MISSION_TYPE_CONFIGS["character-arena"];
}

function getMissionBankItems(type, level = "") {
  const selectedType = type || "character-arena";
  const characterArenaItems = MISSION_BANK.map(function (item) {
    return { ...item, type: "character-arena", category: item.category || "Character Arena" };
  });

  const expandedItems = MISSION_EXTRA_BANK
    .concat(STORY_LAB_CREATIVE_BANK)
    .concat(readCustomMissionBankItems())
    .map(function (item) {
      return {
        ...item,
        type: item.type || selectedType,
        category: item.category || getMissionTypeLabel(item.type || selectedType).replace(/[🎭🎙️📖🎬]/g, "").trim()
      };
    });

  const source = selectedType === "character-arena"
    ? characterArenaItems.concat(expandedItems.filter(function (item) { return item.type === "character-arena"; }))
    : expandedItems.filter(function (item) { return item.type === selectedType; });

  if (!level) return source;

  return source.filter(function (item) {
    return item.level === level;
  });
}

function getDefaultMissionOptions(type) {
  return getMissionTypeConfig(type).options || ["Yes", "No", "Maybe"];
}

function getMissionOptions(mission) {
  if (Array.isArray(mission.options) && mission.options.length) return mission.options;
  return getDefaultMissionOptions(mission.type);
}

function getDefaultCharactersForMissionType(type) {
  return getMissionTypeConfig(type).defaultCharacters || getDefaultCharactersForType(type);
}

function getDefaultRequirementsForMissionType(type) {
  return getMissionTypeConfig(type).defaultRequirements || DEFAULT_MISSION_REQUIREMENTS;
}

function getDefaultStartersForMissionType(type) {
  return getMissionTypeConfig(type).defaultStarters || DEFAULT_MISSION_STARTERS;
}


const STORAGE_KEYS = {
  session: "dramagic_demo_session",
  chatMessages: "dramagic_demo_homework_chat_messages",
  missions: "dramagic_demo_missions",
  missionSubmissions: "dramagic_demo_mission_submissions",
  activeThread: "dramagic_active_chat_thread",
  activeFilter: "dramagic_active_chat_filter"
};

let currentUser = null;
let currentProfile = null;
let chatMessages = [];
let missions = [];
let missionSubmissions = [];
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
  seedDemoMissionData();
  loadMissionData();
  activeThread = getInitialThread();
  activeChatFilter = activeThread.type === "private" ? "private" : "channels";

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
    sidebarRoleText.textContent = isStudent()
      ? `Class ${getCurrentStudentClass()} + private teacher chat`
      : "Channels, missions, and private chats";
  }

  if (newPrivateChatBtn) {
    newPrivateChatBtn.textContent = canSeeTeacherArea() ? "New chat" : "Teacher chat";
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
  const visibleClasses = getVisibleClasses();

  if (canSeeTeacherArea()) {
    const activeMissions = visibleClasses
      .map(function (classItem) {
        const mission = getActiveMissionForClass(classItem.letter);
        return { classItem, mission };
      })
      .filter(function (item) {
        if (!classSearchTerm) return true;
        const haystack = `${item.classItem.name} ${item.classItem.letter} ${item.mission?.topic || ""} ${item.mission?.title || ""}`.toLowerCase();
        return haystack.includes(classSearchTerm);
      });

    const pendingCount = missionSubmissions.filter(function (submission) {
      return submission.status === "waiting-review";
    }).length;

    classList.innerHTML = `
      <button class="class-chat-item mission-create-list-item" type="button" data-mission-action="create">
        <span class="class-item-avatar">＋</span>
        <span class="class-item-main">
          <span class="class-item-top">
            <strong>Create Mission</strong>
            <time>CEO</time>
          </span>
          <span class="class-item-preview">Publish Character Arena, Story Lab, Dubbing Studio, or imitation tasks.</span>
        </span>
        <span class="class-item-count">New</span>
      </button>

      <button class="class-chat-item" type="button" data-mission-action="submissions">
        <span class="class-item-avatar">📥</span>
        <span class="class-item-main">
          <span class="class-item-top">
            <strong>Review Submissions</strong>
            <time>${pendingCount}</time>
          </span>
          <span class="class-item-preview">Accept, reject, feature, or download Dramagician voice notes.</span>
        </span>
        <span class="class-item-count">${pendingCount}</span>
      </button>

      ${activeMissions.map(function (item) {
        if (!item.mission) {
          return `
            <button class="class-chat-item" type="button" data-mission-action="create" data-prefill-class="${clean(item.classItem.letter)}">
              <span class="class-item-avatar">${clean(item.classItem.icon)}</span>
              <span class="class-item-main">
                <span class="class-item-top">
                  <strong>${clean(item.classItem.name)} Mission</strong>
                  <time>Empty</time>
                </span>
                <span class="class-item-preview">No active mission. Create one for this class.</span>
              </span>
              <span class="class-item-count">+</span>
            </button>
          `;
        }

        return renderMissionListItem(item.mission, item.classItem);
      }).join("\n")}

      <button class="class-chat-item" type="button" data-mission-action="bank">
        <span class="class-item-avatar">🧠</span>
        <span class="class-item-main">
          <span class="class-item-top">
            <strong>Question Bank</strong>
            <time>${getAllMissionBankItemCount()}</time>
          </span>
          <span class="class-item-preview">Ready topics by level so you never run out of missions.</span>
        </span>
        <span class="class-item-count">Bank</span>
      </button>

      <button class="class-chat-item" type="button" data-mission-action="templates">
        <span class="class-item-avatar">📚</span>
        <span class="class-item-main">
          <span class="class-item-top">
            <strong>Saved Templates</strong>
            <time>${HOMEWORK_TEMPLATES.length}</time>
          </span>
          <span class="class-item-preview">Preview saved assignment templates if needed.</span>
        </span>
        <span class="class-item-count">HW</span>
      </button>
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
          <strong>Today’s Assignment</strong>
          <time>Class ${clean(studentClass)}</time>
        </span>
        <span class="class-item-preview">${mission ? clean(mission.topic) : "No assignment has been published yet."}</span>
      </span>
      <span class="class-item-count">${mission ? "Go" : "—"}</span>
    </button>

    <button class="class-chat-item" type="button" data-mission-action="my-submission">
      <span class="class-item-avatar">📤</span>
      <span class="class-item-main">
        <span class="class-item-top">
          <strong>My Submission</strong>
          <time>${submission ? clean(getStatusLabel(submission.status)) : "None"}</time>
        </span>
        <span class="class-item-preview">${submission ? clean(`Character: ${submission.character}`) : "Record your voice note when an assignment is active."}</span>
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

      <span class="class-item-count" title="Messages">${stats.count}</span>
    </button>
  `;
}

function renderPrivateChatItem(student) {
  const threadId = getPrivateThreadId(student.id);
  const stats = getThreadStats(threadId);
  const active = activeThread.type === "private" && activeThread.studentId === student.id;

  return `
    <button class="class-chat-item private-chat-item ${active ? "active" : ""}" type="button" data-student-id="${clean(student.id)}">
      <img class="class-item-photo" src="${clean(getStudentAvatar(student))}" alt="${clean(student.full_name)} profile picture" />

      <span class="class-item-main">
        <span class="class-item-top">
          <strong>${clean(student.full_name)}</strong>
          <time>${clean(stats.time)}</time>
        </span>

        <span class="class-item-preview">${clean(stats.preview || `Class ${student.classLetter} • ${student.status}`)}</span>
      </span>

      <span class="private-status-dot" title="Private chat"></span>
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
    ? "Teacher Assignment Control"
    : "Today’s Assignment";
  if (chatHomeworkText) chatHomeworkText.textContent = canSeeTeacherArea()
    ? "Build one mission inside the chat, publish it to a class, then review Dramagician submissions."
    : "Choose your character, choose your opinion, and submit your performance.";

  if (chatInput) {
    chatInput.placeholder = "Use the assignment cards above...";
  }
}

function renderTeacherMissionsHome() {
  const stats = DEMO_CLASSES.map(function (classItem) {
    const mission = getActiveMissionForClass(classItem.letter);
    const submissions = mission ? getSubmissionsForMission(mission.id) : [];

    return {
      classItem,
      mission,
      submissions,
      pending: submissions.filter(function (item) { return item.status === "waiting-review"; }).length,
      accepted: submissions.filter(function (item) { return item.status === "accepted" || item.status === "featured"; }).length
    };
  });

  if (!chatMessagesBox) return;

  chatMessagesBox.innerHTML = `
    <div class="mission-screen">
      <section class="mission-hero-panel">
        <span class="mission-kicker">Dramagic Missions</span>
        <h2>Assignment Builder lives inside chat.</h2>
        <p>CEO/teacher creates the task here, Dramagicians see it here, and submissions are reviewed here.</p>

        <div class="mission-actions-row">
          <button class="mission-primary-btn" type="button" data-mission-action="create">＋ Create Mission</button>
          <button class="mission-soft-btn" type="button" data-mission-action="submissions">📥 Review Submissions</button>
          <button class="mission-soft-btn" type="button" data-mission-action="bank">🧠 Homework Bank</button>
        </div>
      </section>

      <section class="mission-stat-grid">
        ${stats.map(function (item) {
          return `
            <article class="mission-class-card">
              <div class="mission-class-top">
                <strong>${clean(item.classItem.name)}</strong>
                <span>${item.mission ? clean(getMissionIcon(item.mission.type)) : "—"}</span>
              </div>

              ${item.mission ? `
                <h3>${clean(item.mission.title)}</h3>
                <p>${clean(item.mission.topic)}</p>
                <div class="mission-mini-stats">
                  <span>${item.submissions.length} submitted</span>
                  <span>${item.pending} waiting</span>
                  <span>${item.accepted} accepted</span>
                </div>
                <button class="mission-soft-btn full" type="button" data-mission-action="details" data-mission-id="${clean(item.mission.id)}">Open Class Mission</button>
              ` : `
                <h3>No active mission</h3>
                <p>Create a mission for this class when you are ready.</p>
                <button class="mission-soft-btn full" type="button" data-mission-action="create" data-prefill-class="${clean(item.classItem.letter)}">Create for ${clean(item.classItem.name)}</button>
              `}
            </article>
          `;
        }).join("\n")}
      </section>
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
          <span>Choose type + level → pick a bank story → edit the instructions → publish.</span>
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

          <label class="wide">
            <span id="missionCreatorTopicLabel">Topic</span>
            <input id="missionCreatorTopic" type="text" placeholder="Example: A stage curtain refused to open." />
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

function refreshCreatorBankOptions() {
  const typeSelect = document.getElementById("missionCreatorType");
  const levelSelect = document.getElementById("missionCreatorLevel");
  const bankSelect = document.getElementById("missionCreatorBankTopic");
  if (!levelSelect || !bankSelect) return;

  const type = typeSelect?.value || "character-arena";
  const level = levelSelect.value;
  const topics = getMissionBankItems(type, level);

  bankSelect.innerHTML = topics.map(function (item) {
    return `<option value="${clean(item.id)}">${clean(item.topic)}</option>`;
  }).join("\n");

  if (topics[0]) {
    applyBankTopicToCreator(topics[0].id);
  } else {
    const config = getMissionTypeConfig(type);
    const topicInput = document.getElementById("missionCreatorTopic");
    const charactersInput = document.getElementById("missionCreatorCharacters");
    const optionsInput = document.getElementById("missionCreatorOptions");
    const requirementsInput = document.getElementById("missionCreatorRequirements");
    const startersInput = document.getElementById("missionCreatorStarters");
    if (topicInput) topicInput.value = "";
    if (charactersInput) charactersInput.value = (config.defaultCharacters || []).join("\n");
    if (optionsInput) optionsInput.value = (config.options || []).join("\n");
    if (requirementsInput) requirementsInput.value = (config.defaultRequirements || []).join("\n");
    if (startersInput) startersInput.value = (config.defaultStarters || []).join("\n");
  }
}

function applyBankTopicToCreator(bankId) {
  const typeSelect = document.getElementById("missionCreatorType");
  const type = typeSelect?.value || "character-arena";
  const bankItem = getMissionBankItems(type).find(function (item) {
    return item.id === bankId;
  }) || MISSION_BANK.find(function (item) {
    return item.id === bankId;
  }) || MISSION_EXTRA_BANK.find(function (item) {
    return item.id === bankId;
  });

  if (!bankItem) return;

  const config = getMissionTypeConfig(type);
  const topicInput = document.getElementById("missionCreatorTopic");
  const charactersInput = document.getElementById("missionCreatorCharacters");
  const optionsInput = document.getElementById("missionCreatorOptions");
  const requirementsInput = document.getElementById("missionCreatorRequirements");
  const startersInput = document.getElementById("missionCreatorStarters");

  if (topicInput) topicInput.value = bankItem.topic || "";
  if (charactersInput) charactersInput.value = (bankItem.characters || config.defaultCharacters || []).join("\n");
  if (optionsInput) optionsInput.value = (bankItem.options || config.options || []).join("\n");
  if (requirementsInput) requirementsInput.value = (bankItem.requirements || config.defaultRequirements || []).join("\n");
  if (startersInput) startersInput.value = (bankItem.starters || config.defaultStarters || []).join("\n");
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
    characters: characters.length ? characters : getDefaultCharactersForMissionType(type),
    options: options.length ? options : getDefaultMissionOptions(type),
    requirements: requirements.length ? requirements : getDefaultRequirementsForMissionType(type),
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

  const type = typeSelect?.value || "story-lab";
  const level = levelSelect?.value || "junior-actors";
  const topic = topicInput?.value.trim() || "";

  if (!topic) {
    alert("Write or choose a mission topic first, then save it to the bank.");
    return;
  }

  const customItems = readCustomMissionBankItems();
  const item = {
    type: type,
    id: makeId("custom-bank"),
    level: level,
    category: "My Saved Missions",
    topic: topic,
    characters: splitLines(charactersInput?.value || "").slice(0, 8),
    options: splitLines(optionsInput?.value || "").slice(0, 6),
    requirements: splitLines(requirementsInput?.value || "").slice(0, 8),
    starters: splitLines(startersInput?.value || "").slice(0, 10),
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
  const materialText = mission.videoUrl
    ? (mission.type === "dubbing-studio" ? "Open video / scene" : "Open material / video")
    : "";

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

      <div class="mission-two-col">
        <div>
          <h3>${clean(config.choiceHeading)}</h3>
          <div class="mission-chip-wrap">
            ${mission.characters.map(function (item) {
              return `<span class="mission-chip">${clean(item)}</span>`;
            }).join("\n")}
          </div>
        </div>

        <div>
          <h3>${clean(config.optionsHeading)}</h3>
          <div class="mission-chip-wrap">
            ${options.map(function (item) {
              return `<span class="mission-chip soft">${clean(item)}</span>`;
            }).join("\n")}
          </div>
        </div>
      </div>

      <div class="mission-two-col">
        <div>
          <h3>${clean(config.requirementsHeading)}</h3>
          <ul class="mission-clean-list">
            ${mission.requirements.map(function (item) {
              return `<li>${clean(item)}</li>`;
            }).join("\n")}
          </ul>
        </div>

        <div class="mission-helper-box mission-detailed-helper compact-helper">
          <strong>${clean(config.helperHeading)}</strong>
          ${mission.starters.map(function (item) {
            return `<span class="mission-helper-line">${clean(item)}</span>`;
          }).join("\n")}
        </div>
      </div>

      ${mission.videoUrl ? `<a class="mission-video-link" href="${clean(mission.videoUrl)}" target="_blank" rel="noopener">${clean(materialText)}</a>` : ""}
    </section>
  `;
}

function renderStudentSubmitCard(mission) {
  const config = getMissionTypeConfig(mission.type);
  const options = getMissionOptions(mission);

  return `
    <section class="mission-submit-card">
      <span class="mission-kicker">Your submission</span>
      <h2>${clean(config.choiceSubmitLabel)} and perform</h2>

      <div class="mission-choice-block">
        <h3>${clean(config.choiceSubmitLabel)}</h3>
        <div class="mission-choice-row" id="missionCharacterChoices">
          ${mission.characters.map(function (item, index) {
            return `<button class="mission-choice-btn ${index === 0 ? "selected" : ""}" type="button" data-select-mission-character="${clean(item)}">${clean(item)}</button>`;
          }).join("\n")}
        </div>
      </div>

      <div class="mission-choice-block">
        <h3>${clean(config.optionsHeading)}</h3>
        <div class="mission-choice-row" id="missionOpinionChoices">
          ${options.map(function (item, index) {
            return `<button class="mission-choice-btn ${index === 0 ? "selected" : ""}" type="button" data-select-mission-opinion="${clean(item)}">${clean(item)}</button>`;
          }).join("\n")}
        </div>
      </div>

      <div class="mission-actions-row">
        <button class="mission-primary-btn" type="button" data-mission-action="student-record" data-mission-id="${clean(mission.id)}">${clean(config.recordButton)}</button>
        <button class="mission-soft-btn" type="button" data-mission-action="student-submit-demo" data-mission-id="${clean(mission.id)}">${clean(config.demoButton)}</button>
      </div>

      <p class="mission-small-note">Demo mode saves on this browser only. Later Supabase will let teacher and Dramagician see it from different devices.</p>
    </section>
  `;
}

function renderStudentSubmissionCard(submission) {
  const mission = getMissionById(submission.missionId);
  const config = getMissionTypeConfig(mission?.type || "character-arena");

  return `
    <section class="mission-submit-card">
      <span class="mission-kicker">My Submission</span>
      <h2>${clean(getStatusLabel(submission.status))}</h2>
      <p><strong>${clean(config.choiceSummaryLabel)}:</strong> ${clean(submission.character)} • <strong>${clean(config.optionsSummaryLabel)}:</strong> ${clean(submission.opinion)}</p>
      ${submission.feedback ? `<p><strong>Teacher feedback:</strong> ${clean(submission.feedback)}</p>` : ""}
      ${submission.audioUrl ? `<audio controls src="${clean(submission.audioUrl)}"></audio>` : `<div class="mission-demo-audio">🎙️ Demo voice note submitted</div>`}
      <p class="mission-small-note">Submitted ${clean(formatShortTime(submission.createdAt))}</p>
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

  pendingMissionSubmission = {
    missionId: mission.id,
    character: getSelectedMissionChoice("character"),
    opinion: getSelectedMissionChoice("opinion")
  };

  startVoiceRecording();
}

function createDemoMissionSubmission(missionId, audioUrl = "") {
  const mission = getMissionById(missionId);
  if (!mission) return;

  const existing = getMySubmissionForMission(mission.id);

  const submission = {
    id: existing?.id || makeId("submission"),
    missionId: mission.id,
    classLetter: mission.classLetter,
    studentId: getCurrentStudentRecord().id,
    studentName: currentUser?.full_name || getCurrentStudentRecord().full_name,
    character: pendingMissionSubmission?.character || getSelectedMissionChoice("character"),
    opinion: pendingMissionSubmission?.opinion || getSelectedMissionChoice("opinion"),
    audioUrl: audioUrl || "",
    status: "waiting-review",
    feedback: "",
    featured: false,
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
    id: "mission-submissions"
  };

  renderChatTabs();
  renderChatList();
  renderMissionsHeader("Review Submissions", "Accept, reject, feature, or download student mission audio.");

  let submissions = missionId
    ? missionSubmissions.filter(function (item) { return item.missionId === missionId; })
    : missionSubmissions;

  submissions = submissions.sort(function (a, b) {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  if (!chatMessagesBox) return;

  if (submissions.length === 0) {
    chatMessagesBox.innerHTML = `
      <div class="mission-screen">
        <section class="mission-empty-card">
          <div class="empty-icon">📥</div>
          <h2>No submissions yet</h2>
          <p>When students submit mission voice notes, they will appear here for review.</p>
        </section>
      </div>
    `;
    return;
  }

  chatMessagesBox.innerHTML = `
    <div class="mission-screen">
      ${submissions.map(renderReviewSubmissionCard).join("\n")}
    </div>
  `;
}

function renderReviewSubmissionCard(submission) {
  const mission = getMissionById(submission.missionId);
  const statusLabel = getStatusLabel(submission.status);
  const config = getMissionTypeConfig(mission?.type || "character-arena");

  return `
    <section class="mission-review-card">
      <div class="mission-review-head">
        <div>
          <span class="mission-kicker">${clean(mission?.title || "Mission")} • Class ${clean(submission.classLetter)}</span>
          <h2>${clean(submission.studentName)}</h2>
          <p>${clean(mission?.topic || "Mission topic")}</p>
        </div>
        <span class="mission-status ${clean(submission.status)}">${clean(statusLabel)}</span>
      </div>

      <div class="mission-pill-row">
        <span>${clean(config.choiceSummaryLabel)}: ${clean(submission.character)}</span>
        <span>${clean(config.optionsSummaryLabel)}: ${clean(submission.opinion)}</span>
        <span>${clean(formatShortTime(submission.createdAt))}</span>
      </div>

      ${submission.audioUrl ? `<audio controls src="${clean(submission.audioUrl)}"></audio>` : `<div class="mission-demo-audio">🎙️ Demo voice note submitted</div>`}

      ${submission.feedback ? `<p class="mission-feedback"><strong>Feedback:</strong> ${clean(submission.feedback)}</p>` : ""}

      <div class="mission-actions-row">
        <button class="mission-primary-btn" type="button" data-review-submission="${clean(submission.id)}" data-review-status="accepted">✅ Accept</button>
        <button class="mission-soft-btn" type="button" data-review-submission="${clean(submission.id)}" data-review-status="featured">⭐ Feature</button>
        <button class="mission-danger-btn" type="button" data-review-submission="${clean(submission.id)}" data-review-status="rejected">❌ Reject</button>
        ${submission.audioUrl ? `<button class="mission-soft-btn" type="button" data-download-submission="${clean(submission.id)}">⬇ Download Audio</button>` : ""}
      </div>
    </section>
  `;
}

function reviewMissionSubmission(submissionId, nextStatus) {
  const feedback = nextStatus === "rejected"
    ? prompt("Why is it rejected? Write what the student should improve:", "Please record again with clearer voice and stronger emotion.")
    : "";

  missionSubmissions = missionSubmissions.map(function (submission) {
    if (submission.id !== submissionId) return submission;

    return {
      ...submission,
      status: nextStatus,
      featured: nextStatus === "featured",
      feedback: feedback || submission.feedback || "",
      reviewedBy: currentUser?.id || "demo-teacher",
      reviewedAt: new Date().toISOString()
    };
  });

  saveMissionData();
  openMissionSubmissions();
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
        <p>The Story Lab bank is now much richer: magical school stories, stage stories, confidence stories, mystery scenes, comedy disasters, and deeper teen prompts.</p>
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
                        <div class="bank-character-line">${clean(characters.slice(0, 4).join(" • "))}</div>
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
  return {
    id: makeId(),
    threadId: getGroupThreadId(mission.classLetter),
    chatType: "group",
    classLetter: mission.classLetter,
    type: "mission",
    missionId: mission.id,
    missionTopic: mission.topic,
    text: `${getMissionIcon(mission.type)} New ${mission.title} Mission

Topic: ${mission.topic}
Deadline: ${mission.deadline}

Dramagicians submit directly from this class group chat.`,
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
    type: "character-arena",
    title: "Character Arena",
    level: "little-stars",
    topic: "Should school bags have less books?",
    characters: ["Tired School Bag 🎒", "Angry Pencil ✏️", "Happy Lunchbox 🍱", "Sleepy Student 😴"],
    options: ["Yes", "No", "Maybe"],
    requirements: ["Say who you are", "Say how you feel", "Give one reason", "End with a funny sentence"],
    starters: ["Hello, I am...", "I feel...", "I want...", "Because...", "Goodbye!"],
    instructions: "Choose one character and record a short voice note as that character. Make us believe the character is real.",
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
  missions = readArray(STORAGE_KEYS.missions).map(normalizeMission);
  missionSubmissions = readArray(STORAGE_KEYS.missionSubmissions).map(normalizeMissionSubmission);
  saveMissionData();
}

function saveMissionData() {
  localStorage.setItem(STORAGE_KEYS.missions, JSON.stringify(missions));
  localStorage.setItem(STORAGE_KEYS.missionSubmissions, JSON.stringify(missionSubmissions));
}

function normalizeMission(mission) {
  return {
    id: mission.id || makeId("mission"),
    classLetter: mission.classLetter || "A",
    type: mission.type || "character-arena",
    title: mission.title || "Character Arena",
    level: mission.level || "junior-actors",
    topic: mission.topic || "Should students have homework every day?",
    characters: Array.isArray(mission.characters) ? mission.characters : getDefaultCharactersForMissionType(mission.type || "character-arena"),
    options: Array.isArray(mission.options) ? mission.options : getDefaultMissionOptions(mission.type || "character-arena"),
    requirements: Array.isArray(mission.requirements) ? mission.requirements : getDefaultRequirementsForMissionType(mission.type || "character-arena"),
    starters: Array.isArray(mission.starters) ? mission.starters : getDefaultStartersForMissionType(mission.type || "character-arena"),
    instructions: mission.instructions || getDefaultMissionInstructions(mission.type || "character-arena"),
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

  return missionType ? missionType.label : "Character Arena 🎭";
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
      : "Teacher/CEO view • class group channel";
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
    ? "Only you and the teacher/CEO can see this"
    : `Private chat • Class ${student.classLetter} • ${student.status}`;

  if (activeClassIcon) {
    activeClassIcon.innerHTML = `<img src="${clean(getStudentAvatar(student))}" alt="${clean(student.full_name)} profile picture" />`;
  }

  if (chatTitle) chatTitle.textContent = title;
  if (chatSubtitle) chatSubtitle.textContent = subtitle;
  if (chatModePill) chatModePill.textContent = "Private";

  if (chatHomeworkCard) chatHomeworkCard.classList.add("hidden");
  if (chatHomeworkVideo) chatHomeworkVideo.classList.add("hidden");

  if (chatInput) {
    chatInput.placeholder = isStudent()
      ? "Message your teacher privately..."
      : `Message ${student.full_name} privately...`;
  }
}

function renderChatMessages() {
  if (!chatMessagesBox) return;

  if (activeThread.type === "template" || String(activeThread.type || "").startsWith("mission") || activeThread.type === "missions" || activeThread.type === "student-mission") return;

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
        <strong>${isStudent() ? "Start your private teacher chat" : `Start a private chat with ${clean(student.full_name)}`}</strong>
        <p>This message stays between the teacher/CEO and this Dramagician.</p>
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
