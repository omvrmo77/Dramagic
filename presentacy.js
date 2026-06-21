const roleSelect = document.getElementById("roleSelect");
const classSelect = document.getElementById("classSelect");
const studentSelect = document.getElementById("studentSelect");
const scoreClassSelect = document.getElementById("scoreClassSelect");
const scoreStudentSelect = document.getElementById("scoreStudentSelect");
const studentPickerWrap = document.getElementById("studentPickerWrap");

const lockedView = document.getElementById("lockedView");
const presentacyApp = document.getElementById("presentacyApp");
const roleBadge = document.getElementById("roleBadge");

const tabButtons = document.querySelectorAll(".tab-btn");
const tabSections = document.querySelectorAll(".tab-section");
const tabTargetButtons = document.querySelectorAll("[data-tab-target]");

const myStudentName = document.getElementById("myStudentName");
const myStatusText = document.getElementById("myStatusText");
const myClassTag = document.getElementById("myClassTag");
const myRoundTag = document.getElementById("myRoundTag");
const myPoints = document.getElementById("myPoints");
const myProgressBar = document.getElementById("myProgressBar");
const myRank = document.getElementById("myRank");
const myRankText = document.getElementById("myRankText");
const classRankTag = document.getElementById("classRankTag");
const dramagicRankTag = document.getElementById("dramagicRankTag");
const currentTopicText = document.getElementById("currentTopicText");
const teacherNotesText = document.getElementById("teacherNotesText");

const topicLevel = document.getElementById("topicLevel");
const topicGenre = document.getElementById("topicGenre");
const generateTopicBtn = document.getElementById("generateTopicBtn");
const generatedTopicTitle = document.getElementById("generatedTopicTitle");
const generatedTopicMeta = document.getElementById("generatedTopicMeta");
const generatedTopicIdeas = document.getElementById("generatedTopicIdeas");
const saveTopicBtn = document.getElementById("saveTopicBtn");
const copyTopicBtn = document.getElementById("copyTopicBtn");

const timerDisplay = document.getElementById("timerDisplay");
const startTimerBtn = document.getElementById("startTimerBtn");
const resetTimerBtn = document.getElementById("resetTimerBtn");

const pickNextBtn = document.getElementById("pickNextBtn");
const nextPresenterBox = document.getElementById("nextPresenterBox");
const nextPresenterName = document.getElementById("nextPresenterName");
const nextPresenterClass = document.getElementById("nextPresenterClass");
const waitingList = document.getElementById("waitingList");
const presentedList = document.getElementById("presentedList");
const waitingCount = document.getElementById("waitingCount");
const presentedCount = document.getElementById("presentedCount");

const leaderboardList = document.getElementById("leaderboardList");
const boardButtons = document.querySelectorAll(".board-btn");

const challengePointsButtons = document.querySelectorAll(".challenge-points-btn");

const addStudentForm = document.getElementById("addStudentForm");
const newStudentName = document.getElementById("newStudentName");
const newStudentClass = document.getElementById("newStudentClass");

const updateStudentForm = document.getElementById("updateStudentForm");
const pointsInput = document.getElementById("pointsInput");
const reasonInput = document.getElementById("reasonInput");
const notesInput = document.getElementById("notesInput");
const resetDemoBtn = document.getElementById("resetDemoBtn");

const helpTopicBtn = document.getElementById("helpTopicBtn");
const topicHelpBox = document.getElementById("topicHelpBox");
const topicHelpTitle = document.getElementById("topicHelpTitle");
const topicHelpOpenings = document.getElementById("topicHelpOpenings");
const topicHelpStructure = document.getElementById("topicHelpStructure");
const topicHelpHints = document.getElementById("topicHelpHints");
const topicHelpBackground = document.getElementById("topicHelpBackground");
const topicHelpTalkingPoints = document.getElementById("topicHelpTalkingPoints");
const topicHelpPhrases = document.getElementById("topicHelpPhrases");
const topicHelpEndings = document.getElementById("topicHelpEndings");

const criteriaGrid = document.getElementById("criteriaGrid");
const scoringForm = document.getElementById("scoringForm");
const scoringSliders = document.getElementById("scoringSliders");
const scoreTotal = document.getElementById("scoreTotal");
const scoreFeedbackInput = document.getElementById("scoreFeedbackInput");
const scoreTotal100 = document.getElementById("scoreTotal100");
const scoringStudentName = document.getElementById("scoringStudentName");
const scoringStudentMeta = document.getElementById("scoringStudentMeta");
const scoringPanelTitle = document.getElementById("scoringPanelTitle");
const scoreHistoryList = document.getElementById("scoreHistoryList");
const scoreHistoryCount = document.getElementById("scoreHistoryCount");
const resetCurrentScoreBtn = document.getElementById("resetCurrentScoreBtn");
const scorePresentationCount = document.getElementById("scorePresentationCount");
const scorePresentationNext = document.getElementById("scorePresentationNext");
const scoreLatestScore = document.getElementById("scoreLatestScore");

let activeBoard = "class";
let generatedTopic = null;
let timerSeconds = 60;
let timerInterval = null;

const SCORE_LEVELS = {
  1: "Needs Improvement",
  2: "Developing",
  3: "Good",
  4: "Excellent"
};

const SCORE_MAX = 4;
const SCORE_TOTAL_MAX = 10 * SCORE_MAX; // 10 rubric criteria × 4 levels. Keep this before scoringCriteria to avoid startup errors.

function clampScore(value, fallback = 1) {
  const number = Number(value);
  if (!Number.isFinite(number) || number <= 0) return fallback;

  // Safety for old saved 10-point demo scores: convert them to the new 1–4 scale.
  if (number > SCORE_MAX) {
    return Math.min(SCORE_MAX, Math.max(1, Math.round(number / 2.5)));
  }

  return Math.min(SCORE_MAX, Math.max(1, Math.round(number)));
}

function getScoreLabel(value) {
  const rounded = clampScore(value, 0);
  return SCORE_LEVELS[rounded] || "Not scored";
}

function formatScoreValue(value) {
  const score = clampScore(value, 0);
  if (!score) return "0 / 4";
  return `${score} / 4 — ${getScoreLabel(score)}`;
}

function formatAverageScore(value) {
  const number = Number(value || 0);
  if (!number) return "0 / 4";

  const roundedForLabel = Math.min(SCORE_MAX, Math.max(1, Math.round(number)));
  return `${number.toFixed(1)} / 4 — ${getScoreLabel(roundedForLabel)}`;
}

const scoringCriteria = [
  {
    key: "facial",
    icon: "😊",
    name: "Facial Expressions",
    description: "Uses face reactions and emotions to match the speech or character."
  },
  {
    key: "pronunciation",
    icon: "🗣️",
    name: "Pronunciation",
    description: "Speaks words clearly and correctly."
  },
  {
    key: "bodyLanguage",
    icon: "🧍",
    name: "Body Language",
    description: "Uses posture, movement, and gestures confidently."
  },
  {
    key: "voice",
    icon: "🔊",
    name: "Voice & Clarity",
    description: "Voice is clear, strong, and easy to hear."
  },
  {
    key: "confidence",
    icon: "🌟",
    name: "Confidence",
    description: "Looks prepared, brave, and comfortable while presenting."
  },
  {
    key: "eyeContact",
    icon: "👀",
    name: "Eye Contact",
    description: "Looks at the audience instead of only reading."
  },
  {
    key: "fluency",
    icon: "🌊",
    name: "Fluency",
    description: "Speaks smoothly without too many long pauses."
  },
  {
    key: "content",
    icon: "📝",
    name: "Content & Organization",
    description: "Has a clear beginning, middle, and ending."
  },
  {
    key: "creativity",
    icon: "🎨",
    name: "Creativity",
    description: "Adds original ideas, examples, or performance style."
  },
  {
    key: "engagement",
    icon: "👏",
    name: "Audience Engagement",
    description: "Keeps the audience interested and connected."
  }
];

const defaultStudents = [
  {
    id: "s1",
    name: "Laila Hassan",
    classId: "kids-a",
    className: "Kids A",
    presented: false,
    round: 1,
    topic: "My favorite magical place",
    points: 42,
    notes: "Good confidence. Needs a stronger ending."
  },
  {
    id: "s2",
    name: "Youssef Ali",
    classId: "kids-a",
    className: "Kids A",
    presented: true,
    round: 1,
    topic: "If animals could talk",
    points: 65,
    notes: "Excellent voice and clear opening."
  },
  {
    id: "s3",
    name: "Mariam Tarek",
    classId: "kids-b",
    className: "Kids B",
    presented: false,
    round: 1,
    topic: "",
    points: 38,
    notes: ""
  },
  {
    id: "s4",
    name: "Omar Nabil",
    classId: "teens",
    className: "Teens",
    presented: true,
    round: 1,
    topic: "Should students have less homework?",
    points: 81,
    notes: "Strong argument and great examples."
  },
  {
    id: "s5",
    name: "Nour Ahmed",
    classId: "teens",
    className: "Teens",
    presented: false,
    round: 1,
    topic: "The future of robots",
    points: 58,
    notes: "Prepare more examples before presenting."
  },
  {
    id: "s6",
    name: "Malak Samir",
    classId: "adults",
    className: "Adults",
    presented: true,
    round: 1,
    topic: "Confidence is a skill",
    points: 74,
    notes: "Natural speaker with clear structure."
  }
];

let students = normalizeStudents(loadStudents());

const topicPool = [
  { genre: "funny", level: "beginner", title: "If my backpack could talk, what would it say?", ideas: ["Describe your backpack.", "Tell us what it sees every day.", "Make it complain in a funny way."] },
  { genre: "funny", level: "beginner", title: "The funniest rule I would add to school", ideas: ["Explain the rule.", "Say how students would react.", "Tell us why it would be fun."] },
  { genre: "funny", level: "intermediate", title: "A day when everything went wrong but became funny", ideas: ["Start with the problem.", "Describe the funniest moment.", "Explain what you learned."] },
  { genre: "funny", level: "advanced", title: "Why comedy can teach serious lessons", ideas: ["Explain how comedy works.", "Give an example.", "End with a strong message."] },

  { genre: "personal", level: "beginner", title: "A person who makes me feel confident", ideas: ["Who is this person?", "What do they do?", "How do they help you?"] },
  { genre: "personal", level: "beginner", title: "Something I am proud of", ideas: ["Name the thing.", "Explain why it matters.", "Say how it made you feel."] },
  { genre: "personal", level: "intermediate", title: "A moment that changed the way I think", ideas: ["Describe the moment.", "Explain your old thinking.", "Explain your new thinking."] },
  { genre: "personal", level: "advanced", title: "How small moments can shape who we become", ideas: ["Choose a real moment.", "Explain the effect.", "Connect it to your personality."] },

  { genre: "storytelling", level: "beginner", title: "The door that opened by itself", ideas: ["Where was the door?", "What was behind it?", "What happened next?"] },
  { genre: "storytelling", level: "beginner", title: "The lost ticket", ideas: ["Who lost it?", "Why was it important?", "How did they find it?"] },
  { genre: "storytelling", level: "intermediate", title: "The student who found a secret note", ideas: ["Where was the note?", "What did it say?", "What changed after that?"] },
  { genre: "storytelling", level: "advanced", title: "A story where the villain is actually right", ideas: ["Introduce the villain.", "Explain their reason.", "Surprise the audience."] },

  { genre: "debate", level: "beginner", title: "Should students choose their own homework?", ideas: ["Say yes or no.", "Give two reasons.", "End with your opinion."] },
  { genre: "debate", level: "beginner", title: "Is it better to study alone or with friends?", ideas: ["Choose your side.", "Give examples.", "Mention one opposite opinion."] },
  { genre: "debate", level: "intermediate", title: "Is social media helpful or harmful for students?", ideas: ["Explain both sides.", "Give real examples.", "Choose your opinion."] },
  { genre: "debate", level: "advanced", title: "Should schools focus more on creativity than exams?", ideas: ["Define creativity.", "Discuss exams.", "Give a balanced conclusion."] },

  { genre: "technology", level: "beginner", title: "My favorite app and why I use it", ideas: ["Name the app.", "Explain what it does.", "Say why you like it."] },
  { genre: "technology", level: "beginner", title: "A robot I would like to have", ideas: ["Describe the robot.", "Say what it can do.", "Explain how it helps you."] },
  { genre: "technology", level: "intermediate", title: "How technology helps students learn", ideas: ["Give examples.", "Mention one problem.", "Suggest a smart use."] },
  { genre: "technology", level: "advanced", title: "Can artificial intelligence replace teachers?", ideas: ["Explain what AI can do.", "Explain what teachers do better.", "Give your opinion."] },

  { genre: "movies", level: "beginner", title: "A movie character I would like to meet", ideas: ["Name the character.", "Explain why.", "Say what you would ask them."] },
  { genre: "movies", level: "beginner", title: "My favorite movie scene", ideas: ["Describe the scene.", "Explain what happened.", "Say why you remember it."] },
  { genre: "movies", level: "intermediate", title: "What makes a movie unforgettable?", ideas: ["Talk about story.", "Talk about acting.", "Give an example."] },
  { genre: "movies", level: "advanced", title: "How movies can change the way people think", ideas: ["Give a movie example.", "Explain the message.", "Connect it to real life."] },

  { genre: "sports", level: "beginner", title: "My favorite sport", ideas: ["Name the sport.", "Explain how it is played.", "Say why you like it."] },
  { genre: "sports", level: "beginner", title: "A player I admire", ideas: ["Name the player.", "Describe their skill.", "Explain what you learn from them."] },
  { genre: "sports", level: "intermediate", title: "What sports teach us about teamwork", ideas: ["Explain teamwork.", "Give an example.", "Connect it to life."] },
  { genre: "sports", level: "advanced", title: "Is talent more important than discipline in sports?", ideas: ["Explain talent.", "Explain discipline.", "Choose your opinion."] },

  { genre: "imagination", level: "beginner", title: "If I could invent a new school subject", ideas: ["Name the subject.", "Explain what students learn.", "Describe the first lesson."] },
  { genre: "imagination", level: "beginner", title: "If I had a magic button", ideas: ["What does it do?", "When would you press it?", "What problem could happen?"] },
  { genre: "imagination", level: "intermediate", title: "A city where everyone has a superpower", ideas: ["Describe the city.", "Choose your power.", "Explain the problem in the city."] },
  { genre: "imagination", level: "advanced", title: "Imagine a world where nobody can lie", ideas: ["Describe daily life.", "Explain the good side.", "Explain the difficult side."] },

  { genre: "mystery", level: "beginner", title: "The missing homework mystery", ideas: ["Who lost it?", "Where did they search?", "What was the surprise?"] },
  { genre: "mystery", level: "beginner", title: "The strange box under the chair", ideas: ["Who found it?", "What was inside?", "Who did it belong to?"] },
  { genre: "mystery", level: "intermediate", title: "A strange sound in the classroom", ideas: ["Describe the sound.", "Build suspense.", "Reveal the truth."] },
  { genre: "mystery", level: "advanced", title: "A mystery where every clue points to the wrong person", ideas: ["Create clues.", "Mislead the audience.", "Reveal the real answer."] },

  { genre: "future", level: "beginner", title: "My dream job", ideas: ["Name the job.", "Explain why you like it.", "Say what skills you need."] },
  { genre: "future", level: "beginner", title: "My dream house", ideas: ["Describe it.", "Where is it?", "Who lives there with you?"] },
  { genre: "future", level: "intermediate", title: "How I imagine my life in 10 years", ideas: ["Talk about work.", "Talk about lifestyle.", "Talk about your goals."] },
  { genre: "future", level: "advanced", title: "The future belongs to people who can communicate", ideas: ["Explain communication.", "Give future examples.", "End with advice."] },

  { genre: "confidence", level: "beginner", title: "One thing I am good at", ideas: ["Name the thing.", "Explain how you learned it.", "Say how it makes you feel."] },
  { genre: "confidence", level: "beginner", title: "Something I was scared to try", ideas: ["What was it?", "Why were you scared?", "What happened after trying?"] },
  { genre: "confidence", level: "intermediate", title: "How to feel confident before speaking", ideas: ["Give preparation tips.", "Talk about body language.", "Mention practice."] },
  { genre: "confidence", level: "advanced", title: "Confidence is not loud, it is steady", ideas: ["Explain the quote.", "Give examples.", "Connect it to presentations."] },

  { genre: "school", level: "beginner", title: "My favorite place at school", ideas: ["Name the place.", "Describe it.", "Explain why you like it."] },
  { genre: "school", level: "beginner", title: "The best school day ever", ideas: ["When was it?", "What happened?", "Why was it special?"] },
  { genre: "school", level: "intermediate", title: "What makes a class exciting?", ideas: ["Talk about teachers.", "Talk about activities.", "Give your ideal class."] },
  { genre: "school", level: "advanced", title: "Schools should teach life skills, not only subjects", ideas: ["Give examples of life skills.", "Explain why they matter.", "Balance your opinion."] },

  { genre: "acting", level: "beginner", title: "If I played a character on stage", ideas: ["Choose a character.", "Describe their personality.", "Act one line."] },
  { genre: "acting", level: "beginner", title: "A character who is the opposite of me", ideas: ["Describe yourself.", "Describe the character.", "Explain how you would act it."] },
  { genre: "acting", level: "intermediate", title: "How acting helps us understand people", ideas: ["Explain emotions.", "Talk about characters.", "Connect it to real life."] },
  { genre: "acting", level: "advanced", title: "The stage teaches courage before it teaches performance", ideas: ["Explain courage.", "Give acting examples.", "Connect it to confidence."] }
];

topicPool.push(
  { genre: "personal", level: "beginner", title: "The first time I felt brave", ideas: ["When did it happen?", "What were you afraid of?", "What changed after it?"] },
  { genre: "personal", level: "intermediate", title: "A mistake that taught me something important", ideas: ["What was the mistake?", "How did you feel?", "What lesson did you learn?"] },
  { genre: "personal", level: "advanced", title: "Why our hardest moments can become our strongest memories", ideas: ["Describe a hard moment.", "Explain how it changed you.", "Share the message behind it."] },

  { genre: "school", level: "beginner", title: "A school day I will never forget", ideas: ["When did it happen?", "What happened first?", "Why do you still remember it?"] },
  { genre: "school", level: "intermediate", title: "The difference between a teacher and an inspiring teacher", ideas: ["Describe both.", "Give examples.", "Explain what students need most."] },
  { genre: "school", level: "advanced", title: "How schools can help students find their real talents", ideas: ["Explain the problem.", "Give solutions.", "Describe the ideal school."] },

  { genre: "confidence", level: "beginner", title: "How I feel before I speak in front of people", ideas: ["Describe the feeling.", "Explain what helps.", "Say what you want to improve."] },
  { genre: "confidence", level: "intermediate", title: "Why practice makes fear smaller", ideas: ["Explain fear.", "Give an example.", "Describe how practice helps."] },
  { genre: "confidence", level: "advanced", title: "Confidence is built in private before it appears in public", ideas: ["Explain the meaning.", "Give examples.", "Connect it to presentations."] },

  { genre: "acting", level: "beginner", title: "A character I would love to act", ideas: ["Who is the character?", "What do they feel?", "How would you perform them?"] },
  { genre: "acting", level: "intermediate", title: "How actors show emotions without saying many words", ideas: ["Talk about face.", "Talk about body language.", "Give a scene example."] },
  { genre: "acting", level: "advanced", title: "Why the stage can reveal who we really are", ideas: ["Explain the stage.", "Talk about courage.", "Give a deep message."] },

  { genre: "debate", level: "beginner", title: "Should students get rewards for good behavior?", ideas: ["Choose yes or no.", "Give reasons.", "Mention one example."] },
  { genre: "debate", level: "intermediate", title: "Should phones be allowed in class?", ideas: ["Give the good side.", "Give the bad side.", "Choose your opinion."] },
  { genre: "debate", level: "advanced", title: "Do grades show real intelligence?", ideas: ["Define intelligence.", "Discuss grades.", "Give a balanced opinion."] },

  { genre: "future", level: "beginner", title: "One goal I want to achieve this year", ideas: ["What is the goal?", "Why do you want it?", "How will you work for it?"] },
  { genre: "future", level: "intermediate", title: "What I want people to remember me for", ideas: ["Describe your values.", "Talk about your dream.", "Explain your message."] },
  { genre: "future", level: "advanced", title: "The future is not predicted, it is created", ideas: ["Explain the quote.", "Give examples.", "End with advice."] },

  { genre: "technology", level: "beginner", title: "If I could create an app", ideas: ["What would it do?", "Who would use it?", "Why is it helpful?"] },
  { genre: "technology", level: "intermediate", title: "How the internet changed learning", ideas: ["Talk about the past.", "Talk about now.", "Mention advantages and problems."] },
  { genre: "technology", level: "advanced", title: "Is technology making people smarter or lazier?", ideas: ["Explain both sides.", "Give examples.", "Choose your opinion."] },

  { genre: "storytelling", level: "beginner", title: "The day the classroom lights went off", ideas: ["When did it happen?", "What did everyone do?", "What was the surprise?"] },
  { genre: "storytelling", level: "intermediate", title: "The message that arrived too late", ideas: ["Who sent it?", "Why was it late?", "What happened because of it?"] },
  { genre: "storytelling", level: "advanced", title: "A story that starts with the ending", ideas: ["Begin with the final moment.", "Go back in time.", "Reveal how it happened."] }
);

topicPool.push(
  // FUNNY
  { genre: "funny", level: "beginner", title: "If my teacher became a student for one day", ideas: ["What would happen first?", "How would students react?", "What funny lesson would they learn?"] },
  { genre: "funny", level: "beginner", title: "The day my shoes started talking", ideas: ["What did they say?", "Where did it happen?", "How did people react?"] },
  { genre: "funny", level: "intermediate", title: "A normal day that turned into a comedy movie", ideas: ["When did it start?", "What went wrong?", "What was the funniest moment?"] },
  { genre: "funny", level: "intermediate", title: "If animals had social media", ideas: ["What would they post?", "Which animal would be famous?", "What drama would happen?"] },
  { genre: "funny", level: "advanced", title: "Why embarrassing moments become funny memories later", ideas: ["Describe an embarrassing moment.", "Explain how feelings change over time.", "Share the lesson behind it."] },

  // PERSONAL
  { genre: "personal", level: "beginner", title: "A gift I will never forget", ideas: ["Who gave it to you?", "When did it happen?", "Why was it special?"] },
  { genre: "personal", level: "beginner", title: "A place that makes me feel safe", ideas: ["Where is it?", "What does it look like?", "Why do you feel safe there?"] },
  { genre: "personal", level: "intermediate", title: "A time I surprised myself", ideas: ["What happened?", "What did you think before?", "What changed after?"] },
  { genre: "personal", level: "intermediate", title: "Someone who changed my life in a small way", ideas: ["Who was it?", "What did they do?", "How did it affect you?"] },
  { genre: "personal", level: "advanced", title: "The version of myself I am trying to become", ideas: ["Describe your goal.", "Explain what you need to change.", "Share what motivates you."] },

  // STORYTELLING
  { genre: "storytelling", level: "beginner", title: "The magic pencil", ideas: ["Who found it?", "What could it do?", "What problem did it cause?"] },
  { genre: "storytelling", level: "beginner", title: "The student who disappeared during break", ideas: ["Where did they go?", "Who noticed first?", "What was the surprise?"] },
  { genre: "storytelling", level: "intermediate", title: "The invitation with no name", ideas: ["Where was it found?", "Who was invited?", "What happened at the event?"] },
  { genre: "storytelling", level: "intermediate", title: "The day time stopped for five minutes", ideas: ["When did it happen?", "Who could still move?", "What did they do?"] },
  { genre: "storytelling", level: "advanced", title: "A story told by an object in the room", ideas: ["Choose the object.", "What has it seen?", "What secret does it know?"] },

  // DEBATE
  { genre: "debate", level: "beginner", title: "Should students have longer breaks?", ideas: ["Choose your opinion.", "Give two reasons.", "Explain how it helps students."] },
  { genre: "debate", level: "beginner", title: "Is it better to read books or watch videos?", ideas: ["Choose one.", "Give examples.", "Mention the other side."] },
  { genre: "debate", level: "intermediate", title: "Should every student learn acting?", ideas: ["Explain why acting helps.", "Mention confidence.", "Give your final opinion."] },
  { genre: "debate", level: "intermediate", title: "Are competitions good for students?", ideas: ["Talk about motivation.", "Talk about pressure.", "Give a balanced answer."] },
  { genre: "debate", level: "advanced", title: "Should confidence be graded in schools?", ideas: ["Explain confidence.", "Discuss if it can be measured.", "Give your opinion with examples."] },

  // TECHNOLOGY
  { genre: "technology", level: "beginner", title: "If my phone could give me advice", ideas: ["What advice would it give?", "Would it be helpful?", "Would it be annoying?"] },
  { genre: "technology", level: "beginner", title: "A machine I wish existed", ideas: ["What does it do?", "Who needs it?", "How would it change life?"] },
  { genre: "technology", level: "intermediate", title: "How online learning changed students", ideas: ["Talk about before.", "Talk about now.", "Mention good and bad sides."] },
  { genre: "technology", level: "intermediate", title: "The best and worst thing about smartphones", ideas: ["Give one benefit.", "Give one problem.", "Explain your opinion."] },
  { genre: "technology", level: "advanced", title: "Will humans control technology or will technology control humans?", ideas: ["Explain both ideas.", "Give real examples.", "End with a warning or advice."] },

  // MOVIES
  { genre: "movies", level: "beginner", title: "A character I would choose as my best friend", ideas: ["Who is the character?", "Why do you like them?", "What would you do together?"] },
  { genre: "movies", level: "beginner", title: "A movie world I would like to visit", ideas: ["Which world?", "What would you see?", "Would it be safe or dangerous?"] },
  { genre: "movies", level: "intermediate", title: "The difference between a hero and a real hero", ideas: ["Describe movie heroes.", "Describe real-life heroes.", "Compare them."] },
  { genre: "movies", level: "intermediate", title: "Why villains are sometimes interesting", ideas: ["Describe a villain.", "Explain their reason.", "Say what makes them memorable."] },
  { genre: "movies", level: "advanced", title: "How one scene can say more than a full speech", ideas: ["Choose a scene.", "Talk about acting and silence.", "Explain the message."] },

  // SPORTS
  { genre: "sports", level: "beginner", title: "A sport I want to try", ideas: ["Name the sport.", "Why do you want to try it?", "What skills do you need?"] },
  { genre: "sports", level: "beginner", title: "The most exciting match I watched", ideas: ["When was it?", "Who was playing?", "Why was it exciting?"] },
  { genre: "sports", level: "intermediate", title: "How losing can make athletes stronger", ideas: ["Talk about losing.", "Explain what they learn.", "Connect it to life."] },
  { genre: "sports", level: "intermediate", title: "Why teamwork is more important than one star player", ideas: ["Explain teamwork.", "Give an example.", "End with your opinion."] },
  { genre: "sports", level: "advanced", title: "Pressure can create champions or break them", ideas: ["Explain pressure.", "Give sports examples.", "Connect it to confidence."] },

  // IMAGINATION
  { genre: "imagination", level: "beginner", title: "If I could fly for one day", ideas: ["Where would you go?", "Who would you visit?", "What problem could happen?"] },
  { genre: "imagination", level: "beginner", title: "If my classroom became a spaceship", ideas: ["Where would it go?", "Who would be the captain?", "What would happen first?"] },
  { genre: "imagination", level: "intermediate", title: "A world where children make the rules", ideas: ["What rules would change?", "What would be better?", "What problems might happen?"] },
  { genre: "imagination", level: "intermediate", title: "If dreams could be recorded and watched", ideas: ["Who would watch them?", "Would it be fun or scary?", "What privacy problems could happen?"] },
  { genre: "imagination", level: "advanced", title: "A society where people are born with one special talent", ideas: ["Describe the society.", "Explain the problem.", "Talk about fairness and identity."] },

  // MYSTERY
  { genre: "mystery", level: "beginner", title: "The empty chair in the classroom", ideas: ["Who usually sits there?", "Why was it empty?", "What clue appeared?"] },
  { genre: "mystery", level: "beginner", title: "The note inside the school bag", ideas: ["Who found it?", "What did it say?", "Who wrote it?"] },
  { genre: "mystery", level: "intermediate", title: "The photo that changed every time someone looked at it", ideas: ["Where was the photo?", "What changed?", "What did it reveal?"] },
  { genre: "mystery", level: "intermediate", title: "The student who knew the answer before the question", ideas: ["How did they know?", "What did people think?", "What was the truth?"] },
  { genre: "mystery", level: "advanced", title: "A mystery where the smallest detail solves everything", ideas: ["Hide the clue early.", "Make people ignore it.", "Reveal its meaning at the end."] },

  // FUTURE
  { genre: "future", level: "beginner", title: "The job I would create for myself", ideas: ["What is the job?", "Why does it fit you?", "How would you start?"] },
  { genre: "future", level: "beginner", title: "A skill I want to learn before I grow up", ideas: ["Name the skill.", "Why do you need it?", "How will it help your future?"] },
  { genre: "future", level: "intermediate", title: "What schools may look like in 2050", ideas: ["Describe classrooms.", "Talk about teachers.", "Mention technology and creativity."] },
  { genre: "future", level: "intermediate", title: "A letter from my future self", ideas: ["What advice would you give?", "What changed?", "What should you remember?"] },
  { genre: "future", level: "advanced", title: "The future will reward creativity more than memorization", ideas: ["Explain creativity.", "Compare it with memorization.", "Give examples from work and life."] },

  // CONFIDENCE
  { genre: "confidence", level: "beginner", title: "The first time I spoke in front of people", ideas: ["When did it happen?", "How did you feel?", "What did you learn?"] },
  { genre: "confidence", level: "beginner", title: "A sentence I want to tell myself when I feel nervous", ideas: ["What is the sentence?", "Why does it help?", "When would you use it?"] },
  { genre: "confidence", level: "intermediate", title: "Why eye contact makes speaking stronger", ideas: ["Explain eye contact.", "Talk about audience connection.", "Give practice tips."] },
  { genre: "confidence", level: "intermediate", title: "How body language can show confidence before words", ideas: ["Talk about posture.", "Talk about movement.", "Give examples."] },
  { genre: "confidence", level: "advanced", title: "Fear does not disappear; we learn how to walk with it", ideas: ["Explain the quote.", "Give a personal or general example.", "End with advice."] },

  // SCHOOL
  { genre: "school", level: "beginner", title: "My favorite classroom activity", ideas: ["What is the activity?", "When do you do it?", "Why do you enjoy it?"] },
  { genre: "school", level: "beginner", title: "A rule I would change at school", ideas: ["What is the rule?", "Why would you change it?", "What is your better idea?"] },
  { genre: "school", level: "intermediate", title: "Why students need activities, not only lessons", ideas: ["Talk about learning.", "Talk about confidence.", "Give examples."] },
  { genre: "school", level: "intermediate", title: "What makes students excited to learn?", ideas: ["Talk about teachers.", "Talk about games or projects.", "Describe your perfect class."] },
  { genre: "school", level: "advanced", title: "Education should prepare students for life, not only exams", ideas: ["Explain the problem.", "Give life skill examples.", "Suggest changes."] },

  // ACTING / DRAMA
  { genre: "acting", level: "beginner", title: "If I had to act as a queen or king", ideas: ["How would you walk?", "How would you speak?", "What would your first order be?"] },
  { genre: "acting", level: "beginner", title: "A character who is very shy", ideas: ["How do they stand?", "How do they speak?", "What makes them change?"] },
  { genre: "acting", level: "intermediate", title: "How facial expressions can tell a story", ideas: ["Choose emotions.", "Show examples.", "Explain why faces matter on stage."] },
  { genre: "acting", level: "intermediate", title: "The difference between acting sad and feeling sad", ideas: ["Explain acting.", "Talk about control.", "Give performance examples."] },
  { genre: "acting", level: "advanced", title: "Great acting begins when the audience forgets you are acting", ideas: ["Explain the meaning.", "Talk about honesty on stage.", "Give a strong example."] }
);


// DRAMAGIC EXPANDED TOPIC BANK — added to make the generator richer and less vague.
topicPool.push(...[
  {
    "genre": "funny",
    "level": "beginner",
    "title": "The day our class pet became the teacher",
    "ideas": [
      "Describe the class pet and its serious teacher face.",
      "Explain the first funny rule it gives the class.",
      "End with how the real teacher reacts."
    ]
  },
  {
    "genre": "funny",
    "level": "beginner",
    "title": "My alarm clock joined the school WhatsApp group",
    "ideas": [
      "Say what the alarm clock keeps sending.",
      "Describe how students and parents react.",
      "End with the funniest message it sends."
    ]
  },
  {
    "genre": "funny",
    "level": "beginner",
    "title": "If my lunchbox judged my food choices",
    "ideas": [
      "Give the lunchbox a funny personality.",
      "Make it comment on one snack or meal.",
      "End with a funny promise you make to it."
    ]
  },
  {
    "genre": "funny",
    "level": "intermediate",
    "title": "A school announcement that everyone misunderstood",
    "ideas": [
      "Explain the announcement and why it was confusing.",
      "Describe three different reactions from students.",
      "Reveal what the announcement really meant."
    ]
  },
  {
    "genre": "funny",
    "level": "intermediate",
    "title": "The group project where nobody understood the project",
    "ideas": [
      "Introduce the team and their strange ideas.",
      "Describe how the project gets worse and funnier.",
      "End with what the teacher thinks of it."
    ]
  },
  {
    "genre": "funny",
    "level": "intermediate",
    "title": "If emojis became real people in our classroom",
    "ideas": [
      "Choose three emojis and give each one a personality.",
      "Describe the chaos they create during class.",
      "End with the emoji that saves the day."
    ]
  },
  {
    "genre": "funny",
    "level": "advanced",
    "title": "Why small misunderstandings can become unforgettable comedy",
    "ideas": [
      "Explain how one unclear word can start a funny problem.",
      "Give a detailed school or family example.",
      "End with why comedy feels better after the embarrassment passes."
    ]
  },
  {
    "genre": "funny",
    "level": "advanced",
    "title": "The science of timing: why a pause can make people laugh",
    "ideas": [
      "Explain timing using a simple joke or scene.",
      "Show how silence, face reactions, and surprise work together.",
      "End with how speakers can use timing without overacting."
    ]
  },
  {
    "genre": "funny",
    "level": "advanced",
    "title": "A speech where the speaker tries too hard to sound smart",
    "ideas": [
      "Create a speaker who uses big words incorrectly.",
      "Show how the audience slowly realizes the problem.",
      "End with a lesson about being clear instead of showing off."
    ]
  },
  {
    "genre": "personal",
    "level": "beginner",
    "title": "The first compliment I still remember",
    "ideas": [
      "Say who gave you the compliment.",
      "Explain what you were doing at that moment.",
      "Describe why it stayed in your heart."
    ]
  },
  {
    "genre": "personal",
    "level": "beginner",
    "title": "A small habit that makes my day better",
    "ideas": [
      "Name the habit and when you do it.",
      "Explain how it changes your mood.",
      "Tell the audience why they could try it too."
    ]
  },
  {
    "genre": "personal",
    "level": "beginner",
    "title": "The object in my room that tells my story",
    "ideas": [
      "Choose one object and describe it.",
      "Explain where it came from.",
      "Say what it shows about your personality."
    ]
  },
  {
    "genre": "personal",
    "level": "intermediate",
    "title": "A time I wanted to quit but continued anyway",
    "ideas": [
      "Describe the challenge clearly.",
      "Explain what made you continue.",
      "Share what changed after you did not quit."
    ]
  },
  {
    "genre": "personal",
    "level": "intermediate",
    "title": "Someone believed in me before I believed in myself",
    "ideas": [
      "Introduce the person and what they noticed in you.",
      "Explain how their support affected your actions.",
      "End with what you would tell them now."
    ]
  },
  {
    "genre": "personal",
    "level": "intermediate",
    "title": "The day I learned that being quiet is not weakness",
    "ideas": [
      "Describe a moment when you were quiet.",
      "Explain what people misunderstood.",
      "Show how quiet people can still be strong."
    ]
  },
  {
    "genre": "personal",
    "level": "advanced",
    "title": "The difference between the person people see and the person I am building",
    "ideas": [
      "Explain what people usually notice about you.",
      "Describe the private effort they do not see.",
      "End with the person you are trying to become."
    ]
  },
  {
    "genre": "personal",
    "level": "advanced",
    "title": "How one sentence from someone can stay with you for years",
    "ideas": [
      "Share or paraphrase the sentence.",
      "Explain the situation around it.",
      "Analyze how words can shape confidence or fear."
    ]
  },
  {
    "genre": "personal",
    "level": "advanced",
    "title": "Why growth sometimes feels uncomfortable before it feels exciting",
    "ideas": [
      "Describe a difficult change or new skill.",
      "Explain why discomfort happens.",
      "End with advice for people starting something new."
    ]
  },
  {
    "genre": "storytelling",
    "level": "beginner",
    "title": "The elevator that stopped on a secret floor",
    "ideas": [
      "Say who was inside the elevator.",
      "Describe the secret floor.",
      "Explain what the character finds there."
    ]
  },
  {
    "genre": "storytelling",
    "level": "beginner",
    "title": "The birthday cake with a hidden message",
    "ideas": [
      "Describe the party and the cake.",
      "Reveal the hidden message.",
      "Tell what happens after everyone reads it."
    ]
  },
  {
    "genre": "storytelling",
    "level": "beginner",
    "title": "The school bell that rang at the wrong time",
    "ideas": [
      "Say when the bell rang.",
      "Describe how everyone reacted.",
      "Reveal why it rang."
    ]
  },
  {
    "genre": "storytelling",
    "level": "intermediate",
    "title": "A student receives tomorrow’s newspaper today",
    "ideas": [
      "Explain how the student finds the newspaper.",
      "Choose one headline that scares or excites them.",
      "Show what they do to change tomorrow."
    ]
  },
  {
    "genre": "storytelling",
    "level": "intermediate",
    "title": "The rehearsal where the wrong person became the hero",
    "ideas": [
      "Describe the play rehearsal.",
      "Explain the mistake that happens.",
      "Show how an unexpected character saves the scene."
    ]
  },
  {
    "genre": "storytelling",
    "level": "intermediate",
    "title": "The map drawn on the back of an exam paper",
    "ideas": [
      "Say who finds the map.",
      "Explain why the map is strange.",
      "End with what they discover."
    ]
  },
  {
    "genre": "storytelling",
    "level": "advanced",
    "title": "A story where the narrator slowly realizes they caused the problem",
    "ideas": [
      "Begin with the narrator blaming someone else.",
      "Add clues that reveal the truth.",
      "End with responsibility and change."
    ]
  },
  {
    "genre": "storytelling",
    "level": "advanced",
    "title": "A story told through three voice notes found on a phone",
    "ideas": [
      "Describe each voice note and who recorded it.",
      "Let every note reveal a new part of the mystery.",
      "End with the final voice note changing the meaning of everything."
    ]
  },
  {
    "genre": "storytelling",
    "level": "advanced",
    "title": "A character has one minute to say the truth before the lights go out",
    "ideas": [
      "Set the place and the urgent situation.",
      "Explain what truth they are hiding.",
      "End with the choice they make in the last seconds."
    ]
  },
  {
    "genre": "debate",
    "level": "beginner",
    "title": "Should every class have five minutes of drama practice?",
    "ideas": [
      "Say your opinion clearly.",
      "Explain how drama practice can help speaking.",
      "Mention one possible problem and answer it."
    ]
  },
  {
    "genre": "debate",
    "level": "beginner",
    "title": "Should students be allowed to choose their seats?",
    "ideas": [
      "Choose yes or no.",
      "Give two reasons from classroom life.",
      "End with a fair rule suggestion."
    ]
  },
  {
    "genre": "debate",
    "level": "beginner",
    "title": "Is a kind teacher better than a strict teacher?",
    "ideas": [
      "Explain what kind and strict mean.",
      "Give examples of both.",
      "Choose the type you learn better with."
    ]
  },
  {
    "genre": "debate",
    "level": "intermediate",
    "title": "Should schools replace some exams with performances or projects?",
    "ideas": [
      "Explain what exams measure.",
      "Explain what performances and projects can show.",
      "Give a balanced conclusion."
    ]
  },
  {
    "genre": "debate",
    "level": "intermediate",
    "title": "Do students learn more from correction or encouragement?",
    "ideas": [
      "Define correction and encouragement.",
      "Give a classroom example for each.",
      "Explain the best balance."
    ]
  },
  {
    "genre": "debate",
    "level": "intermediate",
    "title": "Should teamwork marks be separate from individual marks?",
    "ideas": [
      "Explain why teamwork can be unfair sometimes.",
      "Explain why teamwork is still important.",
      "Suggest a fair scoring system."
    ]
  },
  {
    "genre": "debate",
    "level": "advanced",
    "title": "Does public speaking matter more than writing in the future?",
    "ideas": [
      "Compare speaking and writing in work and life.",
      "Discuss technology and communication.",
      "Give a nuanced final opinion."
    ]
  },
  {
    "genre": "debate",
    "level": "advanced",
    "title": "Should students be taught how to fail?",
    "ideas": [
      "Explain why failure is usually feared.",
      "Give examples of learning from failure.",
      "Suggest how schools can teach resilience."
    ]
  },
  {
    "genre": "debate",
    "level": "advanced",
    "title": "Is confidence a personal skill or a social responsibility?",
    "ideas": [
      "Explain how people build confidence individually.",
      "Discuss how families, schools, and friends affect confidence.",
      "End with who should help and how."
    ]
  },
  {
    "genre": "technology",
    "level": "beginner",
    "title": "A classroom robot that only tells the truth",
    "ideas": [
      "Describe what the robot looks like.",
      "Say what honest things it says in class.",
      "Explain whether students like it or fear it."
    ]
  },
  {
    "genre": "technology",
    "level": "beginner",
    "title": "If my notebook could save voice notes",
    "ideas": [
      "Explain how the notebook works.",
      "Say how it helps you study.",
      "Mention one funny or annoying problem."
    ]
  },
  {
    "genre": "technology",
    "level": "beginner",
    "title": "The best device for a student’s bag",
    "ideas": [
      "Choose one device or invention.",
      "Describe how it helps at school.",
      "Explain why it should be safe and simple."
    ]
  },
  {
    "genre": "technology",
    "level": "intermediate",
    "title": "How AI can help shy students practise speaking",
    "ideas": [
      "Explain the speaking problem shy students face.",
      "Give examples of AI practice tools.",
      "Mention why real human feedback is still important."
    ]
  },
  {
    "genre": "technology",
    "level": "intermediate",
    "title": "The danger of believing everything you see online",
    "ideas": [
      "Explain fake information with a simple example.",
      "Describe how students can check facts.",
      "End with a rule for smart internet use."
    ]
  },
  {
    "genre": "technology",
    "level": "intermediate",
    "title": "Should students record themselves to improve speaking?",
    "ideas": [
      "Explain how recording reveals pronunciation and confidence.",
      "Mention the uncomfortable feeling at first.",
      "Give tips for using recordings kindly."
    ]
  },
  {
    "genre": "technology",
    "level": "advanced",
    "title": "When technology gives everyone a voice, who teaches people how to use that voice?",
    "ideas": [
      "Discuss social media, videos, and public platforms.",
      "Explain the need for communication skills and responsibility.",
      "End with a connection to presentation training."
    ]
  },
  {
    "genre": "technology",
    "level": "advanced",
    "title": "The future problem is not information; it is attention",
    "ideas": [
      "Explain how information is easy to find now.",
      "Discuss distraction and focus.",
      "Suggest how students can protect attention."
    ]
  },
  {
    "genre": "technology",
    "level": "advanced",
    "title": "Could virtual stages replace real stages?",
    "ideas": [
      "Explain online performance and virtual reality.",
      "Compare it with the feeling of a live audience.",
      "Give your opinion about what cannot be replaced."
    ]
  },
  {
    "genre": "movies",
    "level": "beginner",
    "title": "A movie scene I would like to act on stage",
    "ideas": [
      "Name or describe the type of scene.",
      "Explain which character you would play.",
      "Say how you would use your voice and face."
    ]
  },
  {
    "genre": "movies",
    "level": "beginner",
    "title": "The character who would be terrible at school",
    "ideas": [
      "Choose a character type.",
      "Explain what they would do in class.",
      "End with the lesson they need to learn."
    ]
  },
  {
    "genre": "movies",
    "level": "beginner",
    "title": "If my life had a movie trailer",
    "ideas": [
      "Describe the opening shot.",
      "Say what music would play.",
      "Mention one exciting line from the trailer."
    ]
  },
  {
    "genre": "movies",
    "level": "intermediate",
    "title": "Why the best movie characters are not perfect",
    "ideas": [
      "Explain flaws in characters.",
      "Give a character example without needing the whole movie.",
      "Connect imperfection to real people."
    ]
  },
  {
    "genre": "movies",
    "level": "intermediate",
    "title": "A scene can become powerful because of silence",
    "ideas": [
      "Describe a silent or quiet scene.",
      "Explain facial expression and body language.",
      "Connect it to acting on stage."
    ]
  },
  {
    "genre": "movies",
    "level": "intermediate",
    "title": "If the villain told the story, what would change?",
    "ideas": [
      "Explain the original hero view.",
      "Show what the villain might say.",
      "End with how perspective changes judgment."
    ]
  },
  {
    "genre": "movies",
    "level": "advanced",
    "title": "Cinema teaches empathy by making us live inside another person’s choices",
    "ideas": [
      "Explain empathy through characters.",
      "Analyze how story, music, and acting affect feelings.",
      "End with why this matters in real life."
    ]
  },
  {
    "genre": "movies",
    "level": "advanced",
    "title": "Why a simple movie line can become part of culture",
    "ideas": [
      "Explain what makes a line memorable.",
      "Discuss timing, emotion, and repetition.",
      "Connect famous lines to identity or shared memories."
    ]
  },
  {
    "genre": "movies",
    "level": "advanced",
    "title": "Do movies reflect society or shape society?",
    "ideas": [
      "Explain both sides.",
      "Give examples like heroes, beauty standards, courage, or justice.",
      "End with a balanced opinion."
    ]
  },
  {
    "genre": "sports",
    "level": "beginner",
    "title": "The first sport I would teach an alien",
    "ideas": [
      "Choose the sport.",
      "Explain the rules very simply.",
      "Describe the alien’s funny first try."
    ]
  },
  {
    "genre": "sports",
    "level": "beginner",
    "title": "A captain I would trust",
    "ideas": [
      "Describe the captain’s qualities.",
      "Explain how they treat the team.",
      "Say why trust matters in a match."
    ]
  },
  {
    "genre": "sports",
    "level": "beginner",
    "title": "My perfect sports day",
    "ideas": [
      "Choose the place and sport.",
      "Say who plays with you.",
      "Describe the best moment of the day."
    ]
  },
  {
    "genre": "sports",
    "level": "intermediate",
    "title": "The moment before a penalty kick",
    "ideas": [
      "Describe the pressure before the kick.",
      "Explain what the player thinks and feels.",
      "Connect it to speaking in front of people."
    ]
  },
  {
    "genre": "sports",
    "level": "intermediate",
    "title": "Why the bench players still matter",
    "ideas": [
      "Explain what bench players do.",
      "Talk about support, preparation, and teamwork.",
      "End with a life lesson about unseen effort."
    ]
  },
  {
    "genre": "sports",
    "level": "intermediate",
    "title": "A coach’s words can change a whole match",
    "ideas": [
      "Describe a difficult moment in a match.",
      "Give the coach one powerful sentence.",
      "Explain how the team changes after hearing it."
    ]
  },
  {
    "genre": "sports",
    "level": "advanced",
    "title": "The difference between winning a trophy and becoming a champion",
    "ideas": [
      "Define trophy and champion differently.",
      "Discuss discipline, character, and consistency.",
      "End with a message about values."
    ]
  },
  {
    "genre": "sports",
    "level": "advanced",
    "title": "Why pressure reveals preparation",
    "ideas": [
      "Explain pressure in sports and performance.",
      "Give an example of someone prepared versus unprepared.",
      "Connect it to presentation skills."
    ]
  },
  {
    "genre": "sports",
    "level": "advanced",
    "title": "Should athletes be role models outside the game?",
    "ideas": [
      "Explain why people follow athletes.",
      "Discuss responsibility and personal freedom.",
      "Give a balanced conclusion."
    ]
  },
  {
    "genre": "imagination",
    "level": "beginner",
    "title": "If my classroom had a secret magic door",
    "ideas": [
      "Describe where the door appears.",
      "Say where it leads.",
      "Explain what the class does next."
    ]
  },
  {
    "genre": "imagination",
    "level": "beginner",
    "title": "A pencil that writes what people really think",
    "ideas": [
      "Describe who finds the pencil.",
      "Say what surprising sentence appears.",
      "End with a problem or lesson."
    ]
  },
  {
    "genre": "imagination",
    "level": "beginner",
    "title": "If clouds delivered messages",
    "ideas": [
      "Explain how the messages appear.",
      "Choose one message you receive.",
      "Say how it changes your day."
    ]
  },
  {
    "genre": "imagination",
    "level": "intermediate",
    "title": "A world where every person has background music",
    "ideas": [
      "Describe how music follows people.",
      "Explain what your music would sound like.",
      "Show a problem this world creates."
    ]
  },
  {
    "genre": "imagination",
    "level": "intermediate",
    "title": "If memories could be kept in jars",
    "ideas": [
      "Describe the jar shop or memory room.",
      "Choose one memory to keep or throw away.",
      "Explain the emotional result."
    ]
  },
  {
    "genre": "imagination",
    "level": "intermediate",
    "title": "A school where subjects are living characters",
    "ideas": [
      "Give English, Math, or Science a personality.",
      "Describe a conversation between subjects.",
      "End with which subject becomes your friend."
    ]
  },
  {
    "genre": "imagination",
    "level": "advanced",
    "title": "A world where everyone can hear the narrator of their own life",
    "ideas": [
      "Explain how the narrator comments on decisions.",
      "Discuss the funny and serious effects.",
      "End with whether this would help or hurt people."
    ]
  },
  {
    "genre": "imagination",
    "level": "advanced",
    "title": "What if courage was a visible color around people?",
    "ideas": [
      "Describe what different colors mean.",
      "Show how society judges people by courage colors.",
      "End with the truth about invisible bravery."
    ]
  },
  {
    "genre": "imagination",
    "level": "advanced",
    "title": "A future museum displays emotions instead of objects",
    "ideas": [
      "Describe exhibits like fear, joy, regret, or hope.",
      "Choose one exhibit and explain its story.",
      "End with what visitors learn about being human."
    ]
  },
  {
    "genre": "mystery",
    "level": "beginner",
    "title": "The locker that only opens at 3:03",
    "ideas": [
      "Describe who notices the locker.",
      "Say what happens at exactly 3:03.",
      "Reveal what is inside."
    ]
  },
  {
    "genre": "mystery",
    "level": "beginner",
    "title": "The missing microphone before the show",
    "ideas": [
      "Explain why the microphone is important.",
      "List two clues.",
      "Reveal who took it and why."
    ]
  },
  {
    "genre": "mystery",
    "level": "beginner",
    "title": "A message written on the classroom window",
    "ideas": [
      "Describe the message.",
      "Say who sees it first.",
      "End with the surprising meaning."
    ]
  },
  {
    "genre": "mystery",
    "level": "intermediate",
    "title": "Every clock in school stopped at the same minute",
    "ideas": [
      "Describe the exact minute and the first reaction.",
      "Give three clues from different places.",
      "Reveal the reason behind the stopped clocks."
    ]
  },
  {
    "genre": "mystery",
    "level": "intermediate",
    "title": "The applause coming from an empty theatre",
    "ideas": [
      "Set the scene after rehearsal.",
      "Describe the sound and the fear.",
      "Reveal whether it is scary, funny, or emotional."
    ]
  },
  {
    "genre": "mystery",
    "level": "intermediate",
    "title": "The student who kept receiving answers in dreams",
    "ideas": [
      "Explain the dream pattern.",
      "Show how it helps and creates suspicion.",
      "End with the real source of the answers."
    ]
  },
  {
    "genre": "mystery",
    "level": "advanced",
    "title": "A mystery where the audience knows one clue the detective misses",
    "ideas": [
      "Give the audience a hidden clue early.",
      "Show the detective following the wrong path.",
      "Use the clue to create a satisfying reveal."
    ]
  },
  {
    "genre": "mystery",
    "level": "advanced",
    "title": "The final rehearsal reveals a secret from years ago",
    "ideas": [
      "Connect an old event to the current play.",
      "Use a prop, line, or costume as the clue.",
      "End with how the truth changes the characters."
    ]
  },
  {
    "genre": "mystery",
    "level": "advanced",
    "title": "A voice note arrives from someone who is standing beside you",
    "ideas": [
      "Create the impossible situation.",
      "Suggest realistic and strange explanations.",
      "Reveal the truth in a way that changes the relationship."
    ]
  },
  {
    "genre": "future",
    "level": "beginner",
    "title": "My first day in my dream job",
    "ideas": [
      "Name the job and workplace.",
      "Describe what you do first.",
      "Say how you feel at the end of the day."
    ]
  },
  {
    "genre": "future",
    "level": "beginner",
    "title": "A skill I want to master this summer",
    "ideas": [
      "Name the skill.",
      "Explain why it matters to you.",
      "Say how you will practise it step by step."
    ]
  },
  {
    "genre": "future",
    "level": "beginner",
    "title": "The city I want to live in one day",
    "ideas": [
      "Describe the city.",
      "Explain what people do there.",
      "Say why it fits your future."
    ]
  },
  {
    "genre": "future",
    "level": "intermediate",
    "title": "What I want my future self to thank me for",
    "ideas": [
      "Choose one habit or decision you can start now.",
      "Explain how it helps later.",
      "End with a promise to yourself."
    ]
  },
  {
    "genre": "future",
    "level": "intermediate",
    "title": "The job that does not exist yet but should",
    "ideas": [
      "Invent the job title.",
      "Explain the problem this job solves.",
      "Describe the skills needed for it."
    ]
  },
  {
    "genre": "future",
    "level": "intermediate",
    "title": "How communication skills can open doors in any career",
    "ideas": [
      "Give career examples.",
      "Explain speaking, listening, and confidence.",
      "Connect it to school life now."
    ]
  },
  {
    "genre": "future",
    "level": "advanced",
    "title": "In the future, your voice may be your most valuable skill",
    "ideas": [
      "Explain why ideas need communication.",
      "Discuss leadership, interviews, presentations, and teamwork.",
      "End with practical advice for today."
    ]
  },
  {
    "genre": "future",
    "level": "advanced",
    "title": "The careers of tomorrow will belong to learners, not memorizers",
    "ideas": [
      "Compare memorizing information with learning how to adapt.",
      "Give examples from technology and work.",
      "End with what schools should change."
    ]
  },
  {
    "genre": "future",
    "level": "advanced",
    "title": "A letter from 2040 warning today’s students",
    "ideas": [
      "Create a future problem.",
      "Write the warning clearly.",
      "End with what students should start doing now."
    ]
  },
  {
    "genre": "confidence",
    "level": "beginner",
    "title": "The brave voice inside me",
    "ideas": [
      "Describe when this voice appears.",
      "Say what it tells you.",
      "Explain how you can listen to it more."
    ]
  },
  {
    "genre": "confidence",
    "level": "beginner",
    "title": "A time I raised my hand even though I was nervous",
    "ideas": [
      "Describe the class moment.",
      "Explain what you felt before speaking.",
      "Say what happened after you spoke."
    ]
  },
  {
    "genre": "confidence",
    "level": "beginner",
    "title": "My confidence toolbox",
    "ideas": [
      "Choose three tools like breathing, practice, or smiling.",
      "Explain how each one helps.",
      "End with the tool you need most."
    ]
  },
  {
    "genre": "confidence",
    "level": "intermediate",
    "title": "Why a strong opening makes the whole speech easier",
    "ideas": [
      "Explain the fear at the start.",
      "Give examples of strong openings.",
      "Show how the speaker feels after starting well."
    ]
  },
  {
    "genre": "confidence",
    "level": "intermediate",
    "title": "The difference between acting confident and becoming confident",
    "ideas": [
      "Explain actions that look confident.",
      "Discuss practice and real growth.",
      "Give a practical example from presentations."
    ]
  },
  {
    "genre": "confidence",
    "level": "intermediate",
    "title": "How feedback can build confidence instead of breaking it",
    "ideas": [
      "Explain bad feedback and good feedback.",
      "Give examples of helpful teacher comments.",
      "End with how students should receive correction."
    ]
  },
  {
    "genre": "confidence",
    "level": "advanced",
    "title": "Confidence is a relationship between preparation and self-trust",
    "ideas": [
      "Define preparation and self-trust.",
      "Explain what happens when one is missing.",
      "End with a practical confidence routine."
    ]
  },
  {
    "genre": "confidence",
    "level": "advanced",
    "title": "Why confidence without kindness can become arrogance",
    "ideas": [
      "Compare confidence and arrogance.",
      "Give examples in class or on stage.",
      "Explain how humility makes confidence stronger."
    ]
  },
  {
    "genre": "confidence",
    "level": "advanced",
    "title": "The audience is not your enemy: changing the way we see listeners",
    "ideas": [
      "Explain why speakers fear judgment.",
      "Show how the audience can become support.",
      "Give techniques for connecting with listeners."
    ]
  },
  {
    "genre": "school",
    "level": "beginner",
    "title": "The classroom job I would choose",
    "ideas": [
      "Choose a job like helper, leader, designer, or speaker.",
      "Explain what you would do.",
      "Say why this job fits your personality."
    ]
  },
  {
    "genre": "school",
    "level": "beginner",
    "title": "A school trip I would plan",
    "ideas": [
      "Choose the place.",
      "Explain three activities.",
      "Say what students would learn there."
    ]
  },
  {
    "genre": "school",
    "level": "beginner",
    "title": "The best corner in my classroom",
    "ideas": [
      "Describe the corner.",
      "Say what students do there.",
      "Explain why it feels special."
    ]
  },
  {
    "genre": "school",
    "level": "intermediate",
    "title": "A class becomes better when students feel safe to make mistakes",
    "ideas": [
      "Explain why mistakes scare students.",
      "Describe how teachers and friends can help.",
      "Give an example of learning from a mistake."
    ]
  },
  {
    "genre": "school",
    "level": "intermediate",
    "title": "Should schools have a confidence report beside the grade report?",
    "ideas": [
      "Explain what a confidence report could include.",
      "Mention benefits and risks.",
      "Suggest a fair way to use it."
    ]
  },
  {
    "genre": "school",
    "level": "intermediate",
    "title": "The difference between a quiet classroom and a focused classroom",
    "ideas": [
      "Define both types.",
      "Explain why silence does not always mean learning.",
      "Describe the ideal learning atmosphere."
    ]
  },
  {
    "genre": "school",
    "level": "advanced",
    "title": "School culture can make students brave or invisible",
    "ideas": [
      "Explain school culture with examples.",
      "Discuss participation, mistakes, and encouragement.",
      "Suggest how to build a brave classroom."
    ]
  },
  {
    "genre": "school",
    "level": "advanced",
    "title": "Why creativity should be treated as a core skill, not a reward after work",
    "ideas": [
      "Explain how creativity helps learning.",
      "Compare traditional lessons with creative tasks.",
      "End with a school design idea."
    ]
  },
  {
    "genre": "school",
    "level": "advanced",
    "title": "A school should measure growth, not only performance",
    "ideas": [
      "Compare growth and performance.",
      "Give examples like confidence, speaking, and teamwork.",
      "Suggest how teachers can track progress fairly."
    ]
  },
  {
    "genre": "acting",
    "level": "beginner",
    "title": "A character who always tells dramatic stories",
    "ideas": [
      "Describe the character’s voice and movement.",
      "Tell one small event in a dramatic way.",
      "End by showing how people react."
    ]
  },
  {
    "genre": "acting",
    "level": "beginner",
    "title": "Acting as someone who just found a secret",
    "ideas": [
      "Show the face reaction.",
      "Explain what the secret is.",
      "Say whether the character hides it or tells someone."
    ]
  },
  {
    "genre": "acting",
    "level": "beginner",
    "title": "A character who enters the stage late",
    "ideas": [
      "Describe how they enter.",
      "Explain why they are late.",
      "Act one excuse they give."
    ]
  },
  {
    "genre": "acting",
    "level": "intermediate",
    "title": "How a character changes from nervous to brave in one scene",
    "ideas": [
      "Describe the nervous body language at the start.",
      "Show the moment that changes the character.",
      "Explain the brave ending."
    ]
  },
  {
    "genre": "acting",
    "level": "intermediate",
    "title": "The power of entering a scene with a clear objective",
    "ideas": [
      "Explain what the character wants.",
      "Show how the objective affects voice and movement.",
      "Give a scene example."
    ]
  },
  {
    "genre": "acting",
    "level": "intermediate",
    "title": "A scene where the words are happy but the body is sad",
    "ideas": [
      "Explain the contradiction.",
      "Show how face and posture reveal truth.",
      "Discuss why this makes acting deeper."
    ]
  },
  {
    "genre": "acting",
    "level": "advanced",
    "title": "A great performer makes the audience feel the thought before hearing the line",
    "ideas": [
      "Explain how thinking appears through pauses and eyes.",
      "Discuss subtext and emotional preparation.",
      "Give an example of a line with hidden meaning."
    ]
  },
  {
    "genre": "acting",
    "level": "advanced",
    "title": "The difference between performing loudly and performing truthfully",
    "ideas": [
      "Compare volume with emotional honesty.",
      "Explain when loud acting works and when it feels fake.",
      "End with advice for young actors."
    ]
  },
  {
    "genre": "acting",
    "level": "advanced",
    "title": "Why every character believes they are the hero of their own story",
    "ideas": [
      "Explain character motivation.",
      "Apply it to heroes, villains, and comic characters.",
      "Show how this idea helps actors perform better."
    ]
  }
]);

function init() {
  const savedRole = localStorage.getItem("presentacy_role");
  const savedClass = localStorage.getItem("presentacy_class");
  const savedStudentId = localStorage.getItem("presentacy_student");

  if (savedRole) roleSelect.value = savedRole;
  if (savedClass) classSelect.value = savedClass;

  populateStudentSelect();

  if (savedStudentId && students.some((student) => student.id === savedStudentId)) {
    studentSelect.value = savedStudentId;
  }

  setupEvents();
  updateAccess();
  renderAll();
  openTabFromHash();
}

function setupEvents() {
  roleSelect.addEventListener("change", () => {
    localStorage.setItem("presentacy_role", roleSelect.value);
    updateAccess();
    renderAll();
  });

  helpTopicBtn.addEventListener("click", showTopicHelp);
  scoringForm.addEventListener("submit", handleSaveScore);

  if (resetCurrentScoreBtn) {
    resetCurrentScoreBtn.addEventListener("click", resetCurrentStudentScore);
  }

  classSelect.addEventListener("change", () => {
    localStorage.setItem("presentacy_class", classSelect.value);
    populateStudentSelect();
    renderAll();
  });

  studentSelect.addEventListener("change", () => {
    localStorage.setItem("presentacy_student", studentSelect.value);
    syncScoreStudentSelect();
    renderAll();
  });

  if (scoreClassSelect) {
    scoreClassSelect.addEventListener("change", () => {
      classSelect.value = scoreClassSelect.value;
      localStorage.setItem("presentacy_class", scoreClassSelect.value);
      populateStudentSelect();
      renderAll();
      switchTab("scoring");
    });
  }

  if (scoreStudentSelect) {
    scoreStudentSelect.addEventListener("change", () => {
      studentSelect.value = scoreStudentSelect.value;
      localStorage.setItem("presentacy_student", scoreStudentSelect.value);
      renderAll();
      switchTab("scoring");
    });
  }

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tab));
  });

  tabTargetButtons.forEach((button) => {
    button.addEventListener("click", () => switchTab(button.dataset.tabTarget));
  });

  window.addEventListener("hashchange", openTabFromHash);

  boardButtons.forEach((button) => {
    button.addEventListener("click", () => {
      boardButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      activeBoard = button.dataset.board;
      renderLeaderboard();
    });
  });

  generateTopicBtn.addEventListener("click", generateTopic);
  saveTopicBtn.addEventListener("click", saveGeneratedTopic);
  copyTopicBtn.addEventListener("click", copyGeneratedTopic);

  startTimerBtn.addEventListener("click", startTimer);
  resetTimerBtn.addEventListener("click", resetTimer);

  pickNextBtn.addEventListener("click", pickNextPresenter);

  challengePointsButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const points = Number(button.dataset.points);
      const reason = button.dataset.reason;
      addPointsToSelected(points, reason);
    });
  });

  addStudentForm.addEventListener("submit", handleAddStudent);
  updateStudentForm.addEventListener("submit", handleUpdateStudent);
  resetDemoBtn.addEventListener("click", resetDemo);
}

function updateAccess() {
  const role = roleSelect.value;
  const allowed = role === "student" || role === "teacher" || role === "ceo";
  const isManager = role === "teacher" || role === "ceo";

  lockedView.classList.toggle("hidden", allowed);
  presentacyApp.classList.toggle("hidden", !allowed);

  document.body.dataset.presentacyRole = role;
  document.body.classList.toggle("presentacy-manager", isManager);
  document.body.classList.toggle("presentacy-dramagician", role === "student");

  document.querySelectorAll(".teacher-only, .teacher-action").forEach((item) => {
    item.classList.toggle("hidden", !isManager);
  });

  refreshVisibleTabs();

  const activeSection = document.querySelector(".tab-section.active");
  if (activeSection && !canAccessTab(activeSection.id)) {
    switchTab("overview");
  }

  roleBadge.textContent = isManager ? "Teacher View" : role === "student" ? "Dramagician View" : `${capitalize(role)} View`;
}

function getAllowedTabsForRole(role = roleSelect.value) {
  if (role === "teacher" || role === "ceo") {
    return ["overview", "leaderboard", "topic", "scoring"];
  }

  if (role === "student") {
    return ["overview", "leaderboard", "topic"];
  }

  return [];
}

function canAccessTab(tabName) {
  return getAllowedTabsForRole().includes(tabName);
}

function refreshVisibleTabs() {
  const allowedTabs = getAllowedTabsForRole();

  tabButtons.forEach((button) => {
    const allowed = allowedTabs.includes(button.dataset.tab);
    button.classList.toggle("hidden", !allowed);
  });
}

function openTabFromHash() {
  const hashTab = window.location.hash.replace("#", "").trim();

  if (hashTab && canAccessTab(hashTab)) {
    switchTab(hashTab);
  }
}

function switchTab(tabName) {
  if (!canAccessTab(tabName)) {
    tabName = "overview";
  }

  tabButtons.forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });

  tabSections.forEach((section) => {
    section.classList.toggle("active", section.id === tabName);
  });

  if (history.replaceState) {
    history.replaceState(null, "", `#${tabName}`);
  }
}

function populateStudentSelect() {
  syncScoreClassSelect();
  const availableStudents = getStudentsForSelectedClass();
  const previousId = studentSelect.value || localStorage.getItem("presentacy_student") || "";

  studentSelect.innerHTML = "";

  availableStudents.forEach((student) => {
    const option = document.createElement("option");
    option.value = student.id;
    option.textContent = `${student.name} — ${student.className}`;
    studentSelect.appendChild(option);
  });

  if (!availableStudents.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No Dramagicians yet";
    studentSelect.appendChild(option);
    localStorage.removeItem("presentacy_student");
    syncScoreStudentSelect();
    return;
  }

  const stillAvailable = availableStudents.some((student) => student.id === previousId);
  const nextStudentId = stillAvailable ? previousId : availableStudents[0].id;

  studentSelect.value = nextStudentId;
  localStorage.setItem("presentacy_student", nextStudentId);
  syncScoreStudentSelect();
}

function syncScoreClassSelect() {
  if (!scoreClassSelect || !classSelect) return;

  const selectedClass = classSelect.value || localStorage.getItem("presentacy_class") || "all";
  scoreClassSelect.value = selectedClass;
}

function syncScoreStudentSelect() {
  if (!scoreStudentSelect) return;

  const availableStudents = getStudentsForSelectedClass();
  const selectedId = studentSelect.value || localStorage.getItem("presentacy_student") || "";

  scoreStudentSelect.innerHTML = "";

  if (!availableStudents.length) {
    const option = document.createElement("option");
    option.value = "";
    option.textContent = "No Dramagicians yet";
    scoreStudentSelect.appendChild(option);
    scoreStudentSelect.disabled = true;
    return;
  }

  availableStudents.forEach((student) => {
    const option = document.createElement("option");
    option.value = student.id;
    option.textContent = `${student.name} — ${student.className}`;
    scoreStudentSelect.appendChild(option);
  });

  scoreStudentSelect.value = availableStudents.some((student) => student.id === selectedId)
    ? selectedId
    : availableStudents[0].id;
  scoreStudentSelect.disabled = false;
}

function getStudentsForSelectedClass() {
  const selectedClass = classSelect.value;

  if (selectedClass === "all") {
    return [...students];
  }

  return students.filter((student) => student.classId === selectedClass);
}

function getSelectedStudent() {
  const selectedId = studentSelect.value || localStorage.getItem("presentacy_student") || "";
  const foundStudent = students.find((student) => student.id === selectedId);

  if (foundStudent) {
    return foundStudent;
  }

  return getStudentsForSelectedClass()[0] || null;
}

function renderAll() {
  updateAccess();
  populateStudentSelect();
  renderOverview();
  renderScoring();
  renderPresenters();
  renderLeaderboard();
}

function renderOverview() {
  const student = getSelectedStudent();

  if (!student) {
    myStudentName.textContent = "No Dramagician selected";
    myStatusText.textContent = "Choose a Dramagician to view progress.";
    myClassTag.textContent = "No class";
    myRoundTag.textContent = "Round 1";
    myPoints.textContent = "0 Points";
    myRank.textContent = "No Rank";
    myRankText.textContent = "No ranking yet.";
    classRankTag.textContent = "Class";
    dramagicRankTag.textContent = "Dramagic";
    currentTopicText.textContent = "No topic selected yet.";
    teacherNotesText.textContent = "No notes yet.";
    myProgressBar.style.width = "0%";
    if (notesInput) notesInput.value = "";
    return;
  }

  const classRank = getRank(student, "class");
  const dramagicRank = getRank(student, "dramagic");
  const completedPresentations = getPresentationCount(student);
  const baseStatus = completedPresentations
    ? `${student.name} has completed ${completedPresentations} presentation${completedPresentations === 1 ? "" : "s"}.`
    : `${student.name} has not presented yet.`;

  const scoreStatus = student.presentationScore
    ? ` Presentation score: ${formatAverageScore(student.presentationScore)}.`
    : "";

  myStudentName.textContent = student.name;
  myStatusText.textContent = `${baseStatus}${scoreStatus}`;
  myClassTag.textContent = student.className;
  myRoundTag.textContent = `${completedPresentations} presentation${completedPresentations === 1 ? "" : "s"}`;
  myPoints.textContent = `${student.points} Points`;
  myRank.textContent = `#${classRank} in class`;
  myRankText.textContent = `${student.name} is #${classRank} in ${student.className} and #${dramagicRank} in all Dramagic.`;
  classRankTag.textContent = `Class #${classRank}`;
  dramagicRankTag.textContent = `Dramagic #${dramagicRank}`;
  currentTopicText.textContent = student.topic || "No topic selected yet.";
  teacherNotesText.textContent = student.scoreFeedback || student.notes || "No notes yet.";

  const progress = Math.min(100, Math.round((student.points / 100) * 100));
  myProgressBar.style.width = `${progress}%`;

  if (notesInput) notesInput.value = student.notes || "";
}

function renderPresenters() {
  const list = getStudentsForSelectedClass();
  const waiting = list.filter((student) => !student.presented);
  const presented = list.filter((student) => student.presented);

  waitingList.innerHTML = "";
  presentedList.innerHTML = "";

  waiting.forEach((student) => waitingList.appendChild(createStudentRow(student, false)));
  presented.forEach((student) => presentedList.appendChild(createStudentRow(student, true)));

  waitingCount.textContent = waiting.length;
  presentedCount.textContent = presented.length;

  if (!waiting.length) {
    waitingList.innerHTML = `<p class="empty-mini">Everyone in this class has presented.</p>`;
  }

  if (!presented.length) {
    presentedList.innerHTML = `<p class="empty-mini">No one has presented yet.</p>`;
  }
}

function createStudentRow(student, isPresented) {
  const row = document.createElement("div");
  row.className = "student-row";

  const role = roleSelect.value;
  const isManager = role === "teacher" || role === "ceo";

  row.innerHTML = `
    <div class="student-info">
      <strong>${escapeHtml(student.name)}</strong>
      <span>${escapeHtml(student.className)} • ${student.points} points</span>
      <span>${student.topic ? "Topic: " + escapeHtml(student.topic) : "No topic yet"}</span>
    </div>

    <div class="student-actions">
      <span class="student-chip">${isPresented ? "Presented" : "Waiting"}</span>
      ${
        isManager
          ? `
            <button class="small-btn green" data-action="mark" data-id="${student.id}">
              ${isPresented ? "Undo" : "Mark"}
            </button>
            <button class="small-btn" data-action="select" data-id="${student.id}">
              Select
            </button>
          `
          : ""
      }
    </div>
  `;

  row.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const studentId = button.dataset.id;

      if (action === "mark") {
        togglePresented(studentId);
      }

      if (action === "select") {
        studentSelect.value = studentId;
        localStorage.setItem("presentacy_student", studentId);
        renderAll();
        switchTab("overview");
      }
    });
  });

  return row;
}

function renderLeaderboard() {
  const list = activeBoard === "class"
    ? getStudentsForSelectedClass()
    : [...students];

  const sorted = list.sort((a, b) => b.points - a.points);

  leaderboardList.innerHTML = "";

  sorted.forEach((student, index) => {
    const row = document.createElement("div");
    row.className = "leaderboard-row";

    row.innerHTML = `
      <div class="rank-number">#${index + 1}</div>

      <div class="leaderboard-name">
        <strong>${escapeHtml(student.name)}</strong>
        <span>${escapeHtml(student.className)} • ${student.presented ? "Presented" : "Waiting turn"}</span>
      </div>

      <div class="leaderboard-points">${student.points} pts</div>
    `;

    leaderboardList.appendChild(row);
  });

  if (!sorted.length) {
    leaderboardList.innerHTML = `<p class="empty-mini">No students to rank yet.</p>`;
  }
}


function pickTopicWithoutRecentRepeat(pool, level, genre) {
  const safePool = Array.isArray(pool) && pool.length ? pool : topicPool;
  const historyKey = `presentacy_topic_history_${level}_${genre}`;
  let recentTitles = [];

  try {
    const savedHistory = JSON.parse(localStorage.getItem(historyKey));
    recentTitles = Array.isArray(savedHistory) ? savedHistory : [];
  } catch {
    recentTitles = [];
  }

  const freshPool = safePool.filter((topic) => !recentTitles.includes(topic.title));
  const activePool = freshPool.length ? freshPool : safePool;
  const selected = activePool[Math.floor(Math.random() * activePool.length)];

  const maxHistory = Math.min(18, Math.max(6, Math.floor(safePool.length / 2)));
  const nextHistory = [
    selected.title,
    ...recentTitles.filter((title) => title !== selected.title)
  ].slice(0, maxHistory);

  try {
    localStorage.setItem(historyKey, JSON.stringify(nextHistory));
  } catch {
    // If localStorage is unavailable, the generator still works normally.
  }

  return selected;
}

function generateTopic() {
  const level = topicLevel.value;
  let genre = topicGenre.value;

  let pool = topicPool.filter((topic) => {
    const genreMatches = genre === "random" || topic.genre === genre;
    const levelMatches = topic.level === level;
    return genreMatches && levelMatches;
  });

  if (!pool.length) {
    pool = topicPool.filter((topic) => genre === "random" || topic.genre === genre);
  }

  if (!pool.length) {
    pool = topicPool;
  }

  const selected = pickTopicWithoutRecentRepeat(pool, level, genre);

  generatedTopic = selected;

  generatedTopicTitle.textContent = selected.title;
  generatedTopicMeta.textContent = `${capitalize(selected.level)} • ${formatGenre(selected.genre)}`;

  generatedTopicIdeas.innerHTML = "";
  selected.ideas.forEach((idea) => {
    const li = document.createElement("li");
    li.textContent = idea;
    generatedTopicIdeas.appendChild(li);
  });

  topicHelpBox.classList.add("hidden");
}

function saveGeneratedTopic() {
  if (!generatedTopic) {
    alert("Generate a topic first.");
    return;
  }

  const student = getSelectedStudent();

  if (!student) {
    alert("Choose a Dramagician first.");
    return;
  }

  student.topic = generatedTopic.title;
  saveStudents();
  renderAll();
  switchTab("overview");
}

function copyGeneratedTopic() {
  if (!generatedTopic) {
    alert("Generate a topic first.");
    return;
  }

  const text = `${generatedTopic.title}\n\nIdeas:\n- ${generatedTopic.ideas.join("\n- ")}`;

  navigator.clipboard.writeText(text)
    .then(() => alert("Topic copied."))
    .catch(() => alert("Could not copy. You can copy it manually."));
}

function startTimer() {
  if (timerInterval) return;

  timerInterval = setInterval(() => {
    timerSeconds -= 1;
    updateTimerDisplay();

    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      alert("Time is up. Great practice!");
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  timerSeconds = 60;
  updateTimerDisplay();
}

function updateTimerDisplay() {
  const minutes = String(Math.floor(timerSeconds / 60)).padStart(2, "0");
  const seconds = String(timerSeconds % 60).padStart(2, "0");
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function pickNextPresenter() {
  const waiting = getStudentsForSelectedClass().filter((student) => !student.presented);

  if (!waiting.length) {
    nextPresenterBox.classList.remove("hidden");
    nextPresenterName.textContent = "Everyone presented";
    nextPresenterClass.textContent = "Start a new round when ready.";
    return;
  }

  const selected = waiting[Math.floor(Math.random() * waiting.length)];

  nextPresenterBox.classList.remove("hidden");
  nextPresenterName.textContent = selected.name;
  nextPresenterClass.textContent = selected.className;

  studentSelect.value = selected.id;
  localStorage.setItem("presentacy_student", selected.id);
  syncScoreStudentSelect();
  renderOverview();
}

function togglePresented(studentId) {
  const student = students.find((item) => item.id === studentId);

  if (!student) return;

  student.presented = !student.presented;

  if (student.presented) {
    student.points += 15;
    student.presentationCount = Math.max(getPresentationCount(student), 1);
  }

  saveStudents();
  renderAll();
}

function addPointsToSelected(points, reason) {
  const student = getSelectedStudent();

  if (!student) {
    alert("Choose a Dramagician first.");
    return;
  }

  student.points += points;

  if (reason) {
    const oldNotes = student.notes ? student.notes + " " : "";
    student.notes = `${oldNotes}+${points} points: ${reason}.`;
  }

  saveStudents();
  renderAll();
  alert(`${points} points added to ${student.name}.`);
}

function handleAddStudent(event) {
  event.preventDefault();

  const name = newStudentName.value.trim();
  const classId = newStudentClass.value;

  if (!name) return;

  const newStudent = {
    id: "s" + Date.now(),
    name,
    classId,
    className: getClassName(classId),
    presented: false,
    round: 1,
    topic: "",
    points: 0,
    notes: "",
    scores: getEmptyScores(),
    presentationScore: 0,
    scoreFeedback: "",
    scoreHistory: [],
    presentationCount: 0
  };

  students.push(newStudent);
  saveStudents();

  classSelect.value = classId;
  localStorage.setItem("presentacy_class", classId);

  populateStudentSelect();
  studentSelect.value = newStudent.id;
  localStorage.setItem("presentacy_student", newStudent.id);

  addStudentForm.reset();
  renderAll();
  switchTab("overview");
}

function handleUpdateStudent(event) {
  event.preventDefault();

  const student = getSelectedStudent();

  if (!student) {
    alert("Choose a Dramagician first.");
    return;
  }

  const points = Number(pointsInput.value || 0);
  const reason = reasonInput.value.trim();
  const notes = notesInput.value.trim();

  if (points) {
    student.points += points;
  }

  if (notes) {
    student.notes = notes;
  }

  if (points && reason) {
    student.notes = `${student.notes ? student.notes + " " : ""}+${points} points: ${reason}.`;
  }

  saveStudents();

  pointsInput.value = "";
  reasonInput.value = "";

  renderAll();
  switchTab("overview");
}

function getRank(student, type) {
  const list = type === "class"
    ? students.filter((item) => item.classId === student.classId)
    : students;

  const sorted = [...list].sort((a, b) => b.points - a.points);
  return sorted.findIndex((item) => item.id === student.id) + 1;
}

function getClassName(classId) {
  const classNames = {
    "kids-a": "Kids A",
    "kids-b": "Kids B",
    teens: "Teens",
    adults: "Adults",
    all: "All Classes"
  };

  return classNames[classId] || "Class";
}

function loadStudents() {
  const saved = localStorage.getItem("presentacy_students");

  if (!saved) {
    return structuredClone(defaultStudents);
  }

  try {
    return JSON.parse(saved);
  } catch {
    return structuredClone(defaultStudents);
  }
}

function saveStudents() {
  localStorage.setItem("presentacy_students", JSON.stringify(students));
}

function resetDemo() {
  students = structuredClone(defaultStudents);
  localStorage.removeItem("presentacy_students");
  populateStudentSelect();
  renderAll();
  switchTab("overview");
}

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function formatGenre(value) {
  const names = {
    funny: "Funny",
    personal: "Personal",
    storytelling: "Storytelling",
    debate: "Debate",
    technology: "Technology",
    movies: "Movies",
    sports: "Sports",
    imagination: "Imagination",
    mystery: "Mystery",
    future: "Dreams & Future",
    confidence: "Confidence",
    school: "School Life",
    acting: "Drama / Acting"
  };

  return names[value] || capitalize(value);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

init();

function showTopicHelp() {
  if (!generatedTopic) {
    alert("Generate a topic first.");
    return;
  }

  topicHelpTitle.textContent = `Help for: ${generatedTopic.title}`;

  const openings = buildOpeningIdeas(generatedTopic);
  const structure = buildTopicStructure(generatedTopic);
  const hints = buildTopicHints(generatedTopic);
  const background = buildBackgroundHints(generatedTopic);
  const talkingPoints = buildTopicTalkingPoints(generatedTopic);
  const phrases = buildUsefulPhrases(generatedTopic);
  const endings = buildEndingIdeas(generatedTopic);

  renderList(topicHelpOpenings, openings);
  renderList(topicHelpStructure, structure);
  renderList(topicHelpHints, hints);
  renderList(topicHelpBackground, background);
  renderList(topicHelpTalkingPoints, talkingPoints);
  renderList(topicHelpPhrases, phrases);
  renderList(topicHelpEndings, endings);

  topicHelpBox.classList.remove("hidden");
}

function buildOpeningIdeas(topic) {
  return [
    `You can start with a scene: "It was a normal day, but something happened that changed everything."`,
    `You can start with a personal line: "This topic reminds me of a moment when I had to think, choose, or be brave."`,
    `You can start with imagination: "Imagine standing in this situation and not knowing what to do next."`,
    `You can start with a strong opinion: "I believe this topic matters because it connects to confidence, choices, and how we grow."`,
    `You can start simply and clearly: "Today, I want to talk about ${topic.title}."`
  ];
}

function buildTopicStructure(topic) {
  return [
    "Opening: Introduce the topic and catch the audience’s attention.",
    "Background: Explain what the audience needs to know before your main points.",
    `Point 1: ${topic.ideas?.[0] || "Explain your first clear idea."}`,
    `Point 2: ${topic.ideas?.[1] || "Add another reason, example, or story."}`,
    `Point 3: ${topic.ideas?.[2] || "Add a personal example, problem, or lesson."}`,
    "Ending: Finish with a final opinion, advice, message, or question."
  ];
}

function buildBackgroundHints(topic) {
  const genre = topic.genre;

  const general = [
    `This topic can happen in everyday life, especially in moments when people need to choose, speak, try, or react.`,
    `The background can be simple: a normal person faces a situation that teaches them something.`,
    `The main cause can be fear, curiosity, pressure, ambition, kindness, or a mistake.`,
    `After the situation, something changes: the person understands themselves better, improves, or learns how to deal with others.`,
    `The topic can connect to presentation skills because speaking well is not only about words; it is about confidence, emotion, and clear ideas.`
  ];

  const byGenre = {
    personal: [
      `This can be based on a real memory from your life, especially a moment when you changed or learned something.`,
      `The background can be a time when you were younger, more nervous, or unsure of yourself.`,
      `The change after the event can be emotional: you became more confident, more careful, or more grateful.`
    ],
    storytelling: [
      `The story can begin in a normal place like school, home, class, backstage, or the street.`,
      `The background should show what life was like before the problem appeared.`,
      `The main event should create a change, like a secret being revealed or a character becoming braver.`
    ],
    debate: [
      `The background is that people usually disagree about this topic because they see it from different sides.`,
      `One side may focus on freedom, creativity, or comfort, while the other side may focus on rules, safety, or responsibility.`,
      `A strong debate speech should explain the problem first, then give a clear opinion.`
    ],
    technology: [
      `The background is that technology has changed how people learn, speak, play, and communicate.`,
      `The cause is usually people wanting faster, easier, or smarter ways to do things.`,
      `The change after technology is huge: life becomes easier, but people may also become distracted or dependent.`
    ],
    confidence: [
      `The background is usually a nervous moment before speaking, performing, trying something new, or being judged.`,
      `The cause of fear can be mistakes, people watching, forgetting words, or not feeling ready.`,
      `The change happens when the person practices and realizes that confidence grows slowly.`
    ],
    acting: [
      `The background can be a stage moment where the character has a feeling they need to show.`,
      `The cause of the scene can be conflict, surprise, sadness, excitement, fear, or a big decision.`,
      `After acting the scene, the audience should understand the emotion without needing too much explanation.`
    ]
  };

  return [...(byGenre[genre] || []), ...general];
}

function buildTopicTalkingPoints(topic) {
  const title = topic.title.toLowerCase();
  const genre = topic.genre;

  const generalIdeas = [
    `You can make the topic happen during a normal day, then show how one small moment changes everything.`,
    `You can explain that the main reason behind this topic is usually pressure, curiosity, fear, hope, or wanting to improve.`,
    `You can add a personal example, even if it is simple, because personal examples make the speech feel real.`,
    `You can show what changed after the situation: the person became braver, learned something, understood others better, or saw life differently.`,
    `You can connect the topic to Dramagic by talking about confidence, voice, body language, teamwork, or standing in front of people.`
  ];

  const genreIdeas = {
    funny: [
      `You can start with a normal situation, like school, class, home, or a family moment, then suddenly make one silly thing happen.`,
      `The funny part can come from people reacting too seriously to something small.`,
      `You can add a character who misunderstands everything, because misunderstanding makes the story funnier.`,
      `You can make the ending funny by showing that the whole problem was smaller than everyone thought.`
    ],

    personal: [
      `You can speak about a real moment from your life, like the first time you tried something new or felt nervous.`,
      `The background can be a time when you were younger, less confident, or unsure what to do.`,
      `You can explain how someone helped you, even with one sentence or one action.`,
      `You can end by showing how this memory made you stronger, calmer, or more confident.`
    ],

    storytelling: [
      `You can build the story like a short movie: normal beginning, strange problem, difficult choice, then a clear ending.`,
      `The story can happen at school, backstage, during a party, on the way home, or in a place that feels mysterious.`,
      `You can give the main character one clear goal, like finding something, helping someone, or hiding a secret.`,
      `You can make the lesson about honesty, bravery, friendship, confidence, or thinking before acting.`
    ],

    debate: [
      `You can choose one clear opinion at the beginning so the audience understands your side.`,
      `You can give a real-life example from school, students, families, or social media.`,
      `You can mention the opposite opinion briefly, then explain why your opinion is stronger.`,
      `You can end with a solution, not only an opinion, because solutions make debates stronger.`
    ],

    technology: [
      `You can explain how people did this thing before technology, then compare it with life today.`,
      `You can talk about one benefit, like saving time or helping students learn faster.`,
      `You can also mention one problem, like distraction, laziness, privacy, or depending too much on devices.`,
      `You can end by saying technology is useful when humans control it wisely.`
    ],

    movies: [
      `You can talk about a character, a scene, or a message from a movie, not just the story.`,
      `The background can be what happened before the important scene, so the audience understands the emotion.`,
      `You can explain why the character’s choice was brave, wrong, funny, or inspiring.`,
      `You can connect the movie to real life by saying what people can learn from it.`
    ],

    sports: [
      `You can talk about training before the big moment, because sports stories are usually built through effort.`,
      `You can explain that losing is not only failure; it can be the reason someone becomes stronger.`,
      `You can mention teamwork, discipline, pressure, patience, or believing in yourself.`,
      `You can connect sports to presentations because both need practice, confidence, and courage.`
    ],

    imagination: [
      `You can create a world with one special rule, then explain how people live with that rule.`,
      `The background can be a normal world that suddenly changes because of magic, invention, or a strange event.`,
      `You can describe colors, sounds, places, and people to help the audience imagine it clearly.`,
      `You can end by connecting the imaginary idea to a real lesson about life.`
    ],

    mystery: [
      `You can begin with something normal, then add one strange detail that nobody understands.`,
      `The mystery can happen in a classroom, backstage, at a party, at home, or inside a strange message.`,
      `You can give small clues slowly instead of explaining everything at the beginning.`,
      `You can make the ending surprising but logical, so the audience feels satisfied.`
    ],

    future: [
      `You can compare life now with the future you imagine.`,
      `The background can be a problem people have today, then your future idea becomes the solution.`,
      `You can talk about skills people will need, like communication, creativity, confidence, and teamwork.`,
      `You can end by saying the future is built by what we practice today.`
    ],

    confidence: [
      `You can start with a nervous moment, because confidence speeches become stronger when they begin with fear.`,
      `You can explain that confidence does not mean never being scared; it means speaking even when you feel nervous.`,
      `You can mention body language, eye contact, breathing, preparation, and practice.`,
      `You can end with advice to the audience, like “Start small, but start.”`
    ],

    school: [
      `You can describe a real school situation that many students understand.`,
      `The background can be a normal class, exam day, activity day, or a moment with friends or teachers.`,
      `You can explain how students feel: excited, bored, nervous, proud, pressured, or curious.`,
      `You can end with one idea that would make school better, kinder, or more creative.`
    ],

    acting: [
      `You can explain the character first: what they want, what they feel, and what they are hiding.`,
      `You can use facial expressions and voice changes while speaking, not only words.`,
      `The background can be a scene on stage where the character faces a problem or makes a choice.`,
      `You can end by explaining how acting teaches people to understand emotions and become braver.`
    ]
  };

  return [...(genreIdeas[genre] || []), ...generalIdeas];
}

function buildTopicHints(topic) {
  const genreHints = {
    funny: [
      "Add one unexpected detail that surprises the audience.",
      "Use facial expressions and pauses to make the funny part stronger.",
      "Talk about what people expected, then what actually happened.",
      "Describe the reaction of people around you."
    ],
    personal: [
      "Use a real memory or feeling.",
      "Say what happened before and after the moment.",
      "Explain what this taught you about yourself.",
      "Speak naturally, like you are telling your own story."
    ],
    storytelling: [
      "Create a beginning, problem, and ending.",
      "Use time words like suddenly, later, after that, finally.",
      "Make the audience imagine the place.",
      "Show what the character feels, not only what they do."
    ],
    debate: [
      "Choose your opinion clearly.",
      "Give reasons, not just feelings.",
      "Mention the opposite opinion respectfully.",
      "Use examples from school, family, society, or daily life."
    ],
    technology: [
      "Explain the technology simply.",
      "Talk about how people used to do this before technology.",
      "Mention benefits and problems.",
      "Give an example from your own life."
    ],
    movies: [
      "Describe the scene or character clearly.",
      "Explain what happened before the important moment.",
      "Talk about the emotion or message.",
      "Connect the movie to real life."
    ],
    sports: [
      "Talk about effort, discipline, pressure, or teamwork.",
      "Mention a real player, match, or training moment.",
      "Explain what sports teach outside the game.",
      "Use energetic voice and body language."
    ],
    imagination: [
      "Create rules for your imaginary world.",
      "Describe the place with colors, sounds, and feelings.",
      "Add a problem that makes the idea interesting.",
      "End with what you would learn from this imaginary situation."
    ],
    mystery: [
      "Start slowly and build suspense.",
      "Give clues one by one.",
      "Use words like strange, silent, hidden, suddenly.",
      "Reveal the answer at the end, not the beginning."
    ],
    future: [
      "Compare now and the future.",
      "Mention what could change in school, work, or life.",
      "Explain your dream or prediction.",
      "End with what people should do to prepare."
    ],
    confidence: [
      "Talk about fear first, then growth.",
      "Give tips that actually help before speaking.",
      "Use strong body language while presenting.",
      "End with advice for anyone who feels nervous."
    ],
    school: [
      "Use real examples from school life.",
      "Explain how students feel.",
      "Mention teachers, friends, rules, or activities.",
      "Suggest one improvement or solution."
    ],
    acting: [
      "Use your voice differently for emotions.",
      "Show feelings with your face and body.",
      "Explain what the character wants.",
      "Add a small acting moment during your speech."
    ]
  };

  return genreHints[topic.genre] || [
    "Explain the topic clearly.",
    "Give an example.",
    "Say why it matters.",
    "End with your opinion or lesson."
  ];
}

function buildUsefulPhrases(topic) {
  return [
    `Today, I want to talk about "${topic.title}".`,
    "This topic is important because...",
    "Before I explain my opinion, let me give some background.",
    "This happened when...",
    "At that time...",
    "The reason this happened is...",
    "One example of this is...",
    "This changed the way I think because...",
    "The lesson here is...",
    "To conclude, I believe that..."
  ];
}

function buildEndingIdeas(topic) {
  return [
    "End with your opinion: “That is why I believe...”",
    "End with advice: “So my advice is...”",
    "End with a lesson: “The most important thing I learned is...”",
    "End with a question: “So now I want to ask you...”",
    "End with confidence: “This topic reminds us that our voice matters.”"
  ];
}

function buildTopicHints(topic) {
  const genreHints = {
    funny: [
      "Add one unexpected or silly detail.",
      "Use facial expressions to make the audience laugh.",
      "End with a funny final sentence."
    ],
    personal: [
      "Use a real feeling or personal memory.",
      "Explain why this topic matters to you.",
      "Speak naturally, like you are telling your own story."
    ],
    storytelling: [
      "Start with a strong first sentence.",
      "Create a problem or surprise.",
      "End with a clear ending or twist."
    ],
    debate: [
      "Choose your opinion clearly.",
      "Give reasons, not just feelings.",
      "Mention the other side, then explain why you disagree."
    ],
    technology: [
      "Explain the technology in simple words.",
      "Give one benefit and one problem.",
      "Connect it to students or daily life."
    ],
    movies: [
      "Describe the scene or character clearly.",
      "Explain the emotion behind it.",
      "Connect the movie idea to real life."
    ],
    sports: [
      "Talk about effort, discipline, or teamwork.",
      "Give a real example.",
      "Explain what people can learn from sports."
    ],
    imagination: [
      "Describe the imaginary world with details.",
      "Add one problem in the story.",
      "Make the audience imagine it with you."
    ],
    mystery: [
      "Do not reveal everything at the beginning.",
      "Use suspense words like suddenly, quietly, or strangely.",
      "Make the ending surprising but clear."
    ],
    future: [
      "Describe your dream clearly.",
      "Explain what steps you need to reach it.",
      "End with a hopeful or powerful sentence."
    ],
    confidence: [
      "Talk about fear and how to overcome it.",
      "Use strong body language while speaking.",
      "End with advice for the audience."
    ],
    school: [
      "Use examples from real school life.",
      "Explain what students feel.",
      "Suggest one improvement or idea."
    ],
    acting: [
      "Use voice changes and facial expressions.",
      "Show the character’s feelings.",
      "Add a small performance moment."
    ]
  };

  return genreHints[topic.genre] || [
    "Explain your idea clearly.",
    "Give examples.",
    "End with a strong final sentence."
  ];
}

function buildUsefulPhrases(topic) {
  return [
    `Today, I want to talk about "${topic.title}".`,
    "The first thing I want to say is...",
    "For example...",
    "Another important point is...",
    "In my opinion...",
    "To conclude, I believe that..."
  ];
}

function renderList(element, items) {
  element.innerHTML = "";

  items.forEach((item) => {
    const li = document.createElement("li");
    li.textContent = item;
    element.appendChild(li);
  });
}

function getEmptyScores() {
  const scores = {};

  scoringCriteria.forEach((criteria) => {
    scores[criteria.key] = 0;
  });

  return scores;
}

function getPresentationCount(student) {
  if (!student) return 0;

  const explicit = Number(student.presentationCount ?? student.presentationsCount ?? 0);
  const historyCount = Array.isArray(student.scoreHistory) ? student.scoreHistory.length : 0;
  const presentedCount = student.presented ? 1 : 0;

  return Math.max(explicit, historyCount, presentedCount, 0);
}

function getLatestScoreText(student) {
  if (!student) return "No score yet";

  const latest = Array.isArray(student.scoreHistory) && student.scoreHistory.length
    ? student.scoreHistory[0]
    : null;

  if (latest) {
    return formatAverageScore(latest.average || 0);
  }

  return student.presentationScore ? formatAverageScore(student.presentationScore) : "No score yet";
}

function normalizeStudents(list) {
  return list.map((student) => {
    const normalizedScores = {
      ...getEmptyScores()
    };

    scoringCriteria.forEach((criteria) => {
      const rawValue = student.scores?.[criteria.key] ?? 0;
      normalizedScores[criteria.key] = rawValue ? clampScore(rawValue, 0) : 0;
    });

    const scoreStats = getScoreStats(normalizedScores);

    const normalizedHistory = Array.isArray(student.scoreHistory)
      ? student.scoreHistory.map((entry) => {
          const historyScores = {};
          scoringCriteria.forEach((criteria) => {
            const rawValue = entry.scores?.[criteria.key] ?? 0;
            historyScores[criteria.key] = rawValue ? clampScore(rawValue, 0) : 0;
          });

          const historyStats = getScoreStats(historyScores);

          return {
            ...entry,
            scores: historyScores,
            average: historyStats.average,
            total: historyStats.total
          };
        })
      : [];

    return {
      ...student,
      scores: normalizedScores,
      presentationScore: Number(scoreStats.average || 0),
      scoreFeedback: student.scoreFeedback || "",
      scoreHistory: normalizedHistory,
      presentationCount: getPresentationCount({ ...student, scoreHistory: normalizedHistory })
    };
  });
}

function renderScoring() {
  const student = getSelectedStudent();
  const role = roleSelect.value;
  const isManager = role === "teacher" || role === "ceo";

  criteriaGrid.innerHTML = "";

  scoringCriteria.forEach((criteria, index) => {
    const card = document.createElement("article");
    card.className = "criteria-card rubric-row";

    card.innerHTML = `
      <span>${index + 1}</span>
      <div>
        <h3>${criteria.icon} ${criteria.name}</h3>
        <p>${criteria.description}</p>
      </div>
    `;

    criteriaGrid.appendChild(card);
  });

  const teacherScorePanel = document.querySelector(".teacher-score-panel");
  if (teacherScorePanel) {
    teacherScorePanel.classList.toggle("hidden", !isManager);
  }

  if (!student) {
    if (scoringStudentName) scoringStudentName.textContent = "No Dramagician selected";
    if (scoringStudentMeta) scoringStudentMeta.textContent = "Choose a Dramagician from the dropdown above.";
    if (scoringPanelTitle) scoringPanelTitle.textContent = "Score this presentation";
    if (scorePresentationCount) scorePresentationCount.textContent = "0";
    if (scorePresentationNext) scorePresentationNext.textContent = "Presentation #1";
    if (scoreLatestScore) scoreLatestScore.textContent = "No score yet";
    scoreTotal.textContent = "0 / 4";
    if (scoreTotal100) scoreTotal100.textContent = `0 / ${SCORE_TOTAL_MAX}`;
    scoringSliders.innerHTML = "";
    scoreFeedbackInput.value = "";
    renderScoreHistory(null);
    return;
  }

  if (!student.scores) {
    student.scores = getEmptyScores();
  }

  const completedPresentations = getPresentationCount(student);
  const nextPresentation = completedPresentations + 1;
  const statusText = student.presented ? "Already presented this round" : "Waiting for this round";

  if (scoringStudentName) scoringStudentName.textContent = student.name;
  if (scoringStudentMeta) {
    scoringStudentMeta.textContent = `${student.className} • ${statusText} • Topic: ${student.topic || "No topic yet"}`;
  }
  if (scoringPanelTitle) scoringPanelTitle.textContent = `Score Presentation #${nextPresentation}`;
  if (scorePresentationCount) scorePresentationCount.textContent = String(completedPresentations);
  if (scorePresentationNext) scorePresentationNext.textContent = `Presentation #${nextPresentation}`;
  if (scoreLatestScore) scoreLatestScore.textContent = getLatestScoreText(student);

  scoringSliders.innerHTML = "";

  scoringCriteria.forEach((criteria, index) => {
    const savedValue = Number(student.scores?.[criteria.key] || 0);
    const value = savedValue ? clampScore(savedValue, 1) : 1;

    const row = document.createElement("div");
    row.className = `score-row score-button-row ${savedValue ? "saved-score-row" : ""}`;
    row.dataset.scoreKey = criteria.key;
    row.dataset.scoreValue = String(value);

    const levelButtons = Object.entries(SCORE_LEVELS).map(([level, label]) => {
      const numericLevel = Number(level);
      const isSelected = numericLevel === value;
      return `
        <button
          type="button"
          class="score-choice-btn ${isSelected ? "active" : ""}"
          data-score-key="${criteria.key}"
          data-score-value="${numericLevel}"
          aria-pressed="${isSelected ? "true" : "false"}"
          ${!isManager ? "disabled" : ""}
        >
          <strong>${numericLevel}</strong>
          <span>${label}</span>
        </button>
      `;
    }).join("");

    row.innerHTML = `
      <div class="score-row-top">
        <span>${index + 1}. ${criteria.icon} ${criteria.name}</span>
        <strong id="scoreValue-${criteria.key}">${formatScoreValue(value)}</strong>
      </div>

      <div class="score-choice-grid" role="group" aria-label="Score ${criteria.name}">
        ${levelButtons}
      </div>
    `;

    scoringSliders.appendChild(row);
  });

  scoringSliders.querySelectorAll(".score-choice-btn").forEach((button) => {
    button.addEventListener("click", () => {
      const row = button.closest(".score-row");
      if (!row) return;

      const value = clampScore(button.dataset.scoreValue, 1);
      row.dataset.scoreValue = String(value);

      row.querySelectorAll(".score-choice-btn").forEach((choice) => {
        const selected = Number(choice.dataset.scoreValue) === value;
        choice.classList.toggle("active", selected);
        choice.setAttribute("aria-pressed", selected ? "true" : "false");
      });

      const valueLabel = document.getElementById(`scoreValue-${button.dataset.scoreKey}`);
      if (valueLabel) valueLabel.textContent = formatScoreValue(value);

      row.classList.add("saved-score-row");
      updateScorePreview();
    });
  });

  scoreFeedbackInput.value = student.scoreFeedback || "";
  scoreFeedbackInput.disabled = !isManager;

  renderScoreHistory(student);
  updateScorePreview();
}

function renderScoreHistory(student) {
  if (!scoreHistoryList || !scoreHistoryCount) return;

  if (!student || !student.scoreHistory || !student.scoreHistory.length) {
    scoreHistoryCount.textContent = "0";
    scoreHistoryList.innerHTML = `<p class="empty-mini">No saved scores yet.</p>`;
    return;
  }

  scoreHistoryCount.textContent = String(student.scoreHistory.length);

  scoreHistoryList.innerHTML = student.scoreHistory.slice(0, 5).map((item) => {
    const dateText = item.date ? new Date(item.date).toLocaleString([], {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    }) : "Saved score";

    return `
      <article class="score-history-item">
        <strong>Presentation #${item.presentationNumber || "?"} • ${formatAverageScore(item.average || 0)} • ${Number(item.total || 0)} / ${SCORE_TOTAL_MAX}</strong>
        <span>${dateText}${item.savedBy ? " • " + escapeHtml(item.savedBy) : ""}</span>
        ${item.feedback ? `<p>${escapeHtml(item.feedback)}</p>` : ""}
      </article>
    `;
  }).join("");
}

function getScoreStats(scores) {
  const safeScores = scores || getEmptyScores();
  let total = 0;
  let scoredCount = 0;

  scoringCriteria.forEach((criteria) => {
    const rawValue = Number(safeScores[criteria.key] || 0);
    if (rawValue > 0) {
      total += clampScore(rawValue, 1);
      scoredCount += 1;
    }
  });

  const average = scoredCount ? Number((total / scoredCount).toFixed(1)) : 0;

  return { total, average };
}

function updateScorePreview() {
  const rows = scoringSliders.querySelectorAll(".score-row[data-score-key]");

  if (!rows.length) {
    scoreTotal.textContent = "0 / 4";
    if (scoreTotal100) scoreTotal100.textContent = `0 / ${SCORE_TOTAL_MAX}`;
    return;
  }

  let total = 0;

  rows.forEach((row) => {
    total += clampScore(row.dataset.scoreValue, 1);
  });

  const averageNumber = Number((total / rows.length).toFixed(1));
  scoreTotal.textContent = formatAverageScore(averageNumber);
  if (scoreTotal100) scoreTotal100.textContent = `${total} / ${SCORE_TOTAL_MAX}`;
}

function handleSaveScore(event) {
  event.preventDefault();

  const student = getSelectedStudent();

  if (!student) {
    alert("Choose a Dramagician first.");
    return;
  }

  const role = roleSelect.value;
  const isManager = role === "teacher" || role === "ceo";

  if (!isManager) {
    alert("Only teachers and CEO can save scores.");
    return;
  }

  const scoreRows = scoringSliders.querySelectorAll(".score-row[data-score-key]");
  let total = 0;

  if (!scoreRows.length) {
    alert("No score sheet was found. Please refresh the page and try again.");
    return;
  }

  if (!student.scores) {
    student.scores = getEmptyScores();
  }

  scoreRows.forEach((row) => {
    const value = clampScore(row.dataset.scoreValue, 1);
    student.scores[row.dataset.scoreKey] = value;
    total += value;
  });

  const average = Number((total / scoreRows.length).toFixed(1));
  const presentationNumber = getPresentationCount(student) + 1;

  student.presentationCount = presentationNumber;
  student.presentationScore = average;
  student.scoreFeedback = scoreFeedbackInput.value.trim();
  student.presented = true;
  student.round = Math.max(Number(student.round || 1), presentationNumber + 1);

  if (!Array.isArray(student.scoreHistory)) {
    student.scoreHistory = [];
  }

  student.scoreHistory.unshift({
    date: new Date().toISOString(),
    presentationNumber,
    average,
    total,
    scores: { ...student.scores },
    feedback: student.scoreFeedback,
    savedBy: capitalize(role)
  });

  student.scoreHistory = student.scoreHistory.slice(0, 10);

  saveStudents();
  localStorage.setItem("presentacy_student", student.id);

  renderAll();
  switchTab("scoring");

  alert(`Presentation #${presentationNumber} score saved for ${student.name}. Average: ${formatAverageScore(average)}.`);
}

function resetCurrentStudentScore() {
  const student = getSelectedStudent();

  if (!student) {
    alert("Choose a Dramagician first.");
    return;
  }

  const role = roleSelect.value;
  const isManager = role === "teacher" || role === "ceo";

  if (!isManager) {
    alert("Only teachers and CEO can reset scores.");
    return;
  }

  const sure = confirm(`Reset all saved scores and presentation history for ${student.name}?`);

  if (!sure) return;

  student.scores = getEmptyScores();
  student.presentationScore = 0;
  student.scoreFeedback = "";
  student.scoreHistory = [];
  student.presentationCount = 0;

  saveStudents();
  localStorage.setItem("presentacy_student", student.id);

  renderAll();
  switchTab("scoring");
}

function getAllowedTabsForRole(role = roleSelect.value) {
  if (role === "teacher" || role === "ceo") return ["overview","leaderboard","history","topic","scoring"];
  if (role === "student") return ["overview","leaderboard","history","topic"];
  if (role === "parent") return ["overview","leaderboard","history"];
  return [];
}

function updateAccess() {
  const role = roleSelect.value;
  const allowed = role !== "guest";
  const isManager = role === "teacher" || role === "ceo";
  lockedView.classList.toggle("hidden", allowed);
  presentacyApp.classList.toggle("hidden", !allowed);
  document.querySelectorAll(".teacher-only, .teacher-action").forEach((item)=>item.classList.toggle("hidden", !isManager));
  refreshVisibleTabs();
  const activeSection=document.querySelector(".tab-section.active");
  if(activeSection && !canAccessTab(activeSection.id)) switchTab("overview");
  roleBadge.textContent = role==="parent" ? "Parent View" : (isManager ? "Teacher View" : "Dramagician View");
}

function renderLeaderboard() {
  const list = activeBoard === "class" ? getStudentsForSelectedClass() : [...students];
  const sorted = [...list].sort((a,b)=>b.points-a.points);
  leaderboardList.innerHTML="";
  sorted.forEach((student,index)=>{
    const row=document.createElement("div");
    row.className="leaderboard-row";
    row.innerHTML=`<div class="rank-number">#${index+1}</div>
      <div class="leaderboard-name">
        <strong>${escapeHtml(student.name)}</strong>
        <span>${escapeHtml(student.className)}</span>
      </div>
      <div class="leaderboard-points">${student.points} pts</div>`;
    leaderboardList.appendChild(row);
  });
  if(!sorted.length) leaderboardList.innerHTML=`<p class="empty-mini">No students to rank yet.</p>`;
}

function renderStudentHistory() {
  const studentHistoryList = document.getElementById("studentHistoryList");
  const studentHistoryCount = document.getElementById("studentHistoryCount");

  if (!studentHistoryList) return;

  const student = getSelectedStudent();

  if (!student || !Array.isArray(student.scoreHistory) || !student.scoreHistory.length) {
    studentHistoryList.innerHTML = '<p class="empty-mini">No presentations yet.</p>';
    if (studentHistoryCount) studentHistoryCount.textContent = '0';
    return;
  }

  if (studentHistoryCount) studentHistoryCount.textContent = String(student.scoreHistory.length);

  studentHistoryList.innerHTML = student.scoreHistory.map((item) => {
    const scores = item.scores || {};
    const rubricRows = scoringCriteria.map((criterion) => {
      const value = scores[criterion.key] || 0;
      return `<li><strong>${escapeHtml(criterion.name)}</strong><span>${escapeHtml(formatScoreValue(value))}</span></li>`;
    }).join("");

    return `
      <article class="history-item">
        <strong>Presentation #${escapeHtml(item.presentationNumber || "")}</strong>
        <p>${escapeHtml(formatLedgerDate(item.date))}</p>
        <p>Average: ${escapeHtml(formatAverageScore(item.average))}</p>
        <p>${escapeHtml(item.feedback || "No feedback")}</p>
        <ul class="history-rubric-list">${rubricRows}</ul>
      </article>`;
  }).join('');
}

const oldRenderAll = renderAll;
renderAll = function(){
  updateAccess();
  populateStudentSelect();
  renderOverview();
  renderScoring();
  renderPresenters();
  renderLeaderboard();
  renderStudentHistory();
}


/* =====================================================
   DRAMAGIC FIX — Global Dramagic points
   Presentacy points connect to attendance adjustments.
   Wordle/game points are intentionally separate.
===================================================== */
var DRAMAGIC_ATTENDANCE_POINTS_KEY = "dramagic_attendance_point_adjustments";

function readAttendancePointAdjustmentsForPresentacy() {
  try {
    const saved = JSON.parse(localStorage.getItem(DRAMAGIC_ATTENDANCE_POINTS_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function classIdToAttendanceLetter(classId) {
  const map = { "kids-a": "A", "kids-b": "B", teens: "C", adults: "D" };
  return map[classId] || "";
}

function normalizeScoreLookup(value) {
  return String(value || "").trim().toLowerCase();
}

function attendanceItemMatchesPresentacyStudent(student, item) {
  if (!student || !item) return false;

  const studentName = normalizeScoreLookup(student.name);
  const itemName = normalizeScoreLookup(item.studentName);
  const classLetter = String(classIdToAttendanceLetter(student.classId || "")).trim().toUpperCase();
  const itemClass = String(item.classLetter || "").trim().toUpperCase();

  const possibleStudentCodes = [
    student.attendanceStudentId,
    student.attendanceId,
    student.studentId,
    student.studentCode,
    student.code
  ].filter(Boolean).map((value) => String(value).trim().toUpperCase());

  const possibleAttendanceCodes = [
    item.studentId,
    item.studentCode,
    item.code
  ].filter(Boolean).map((value) => String(value).trim().toUpperCase());

  const hasExactCodeMatch = possibleStudentCodes.some((code) => possibleAttendanceCodes.includes(code));
  if (hasExactCodeMatch) return true;

  if (!studentName || !itemName || studentName !== itemName) return false;

  // Backend will use one real student id. For the frontend demo, some lists still
  // have different demo class names for the same Dramagician, so exact class match
  // is preferred but name-only fallback is allowed to stop deductions disappearing.
  if (classLetter && itemClass && classLetter === itemClass) return true;
  return true;
}

function getAttendanceAdjustmentForPresentacyStudent(student) {
  return readAttendancePointAdjustmentsForPresentacy().reduce((total, item) => {
    return attendanceItemMatchesPresentacyStudent(student, item)
      ? total + Number(item.pointDelta || 0)
      : total;
  }, 0);
}

function getDramagicPointsForStudent(student) {
  return Number(student?.points || 0) + getAttendanceAdjustmentForPresentacyStudent(student);
}

function formatDramagicPoints(student) {
  const base = Number(student?.points || 0);
  const adjustment = getAttendanceAdjustmentForPresentacyStudent(student);
  const total = base + adjustment;
  if (!adjustment) return `${total} Points`;
  return `${total} Points (${base}${adjustment > 0 ? "+" : ""}${adjustment})`;
}

function renderOverview() {
  const student = getSelectedStudent();

  if (!student) {
    myStudentName.textContent = "No Dramagician selected";
    myStatusText.textContent = "Choose a Dramagician to view progress.";
    myClassTag.textContent = "No class";
    myRoundTag.textContent = "0 presentations";
    myPoints.textContent = "0 Points";
    myRank.textContent = "No Rank";
    myRankText.textContent = "No ranking yet.";
    classRankTag.textContent = "Class";
    dramagicRankTag.textContent = "Dramagic";
    currentTopicText.textContent = "No topic selected yet.";
    teacherNotesText.textContent = "No notes yet.";
    myProgressBar.style.width = "0%";
    if (notesInput) notesInput.value = "";
    return;
  }

  const classRank = getRank(student, "class");
  const dramagicRank = getRank(student, "dramagic");
  const completedPresentations = getPresentationCount(student);
  const baseStatus = completedPresentations
    ? `${student.name} has completed ${completedPresentations} presentation${completedPresentations === 1 ? "" : "s"}.`
    : `${student.name} has not presented yet.`;
  const scoreStatus = student.presentationScore
    ? ` Presentation score: ${formatAverageScore(student.presentationScore)}.`
    : "";
  const attendanceAdjustment = getAttendanceAdjustmentForPresentacyStudent(student);
  const adjustmentStatus = attendanceAdjustment
    ? ` Attendance adjustment: ${attendanceAdjustment} point${Math.abs(attendanceAdjustment) === 1 ? "" : "s"}.`
    : "";
  const totalPoints = getDramagicPointsForStudent(student);

  myStudentName.textContent = student.name;
  myStatusText.textContent = `${baseStatus}${scoreStatus}${adjustmentStatus}`;
  myClassTag.textContent = student.className;
  myRoundTag.textContent = `${completedPresentations} presentation${completedPresentations === 1 ? "" : "s"}`;
  myPoints.textContent = formatDramagicPoints(student);
  myRank.textContent = `#${classRank} in class`;
  myRankText.textContent = `${student.name} is #${classRank} in ${student.className} and #${dramagicRank} in all Dramagic.`;
  classRankTag.textContent = `Class #${classRank}`;
  dramagicRankTag.textContent = `Dramagic #${dramagicRank}`;
  currentTopicText.textContent = student.topic || "No topic selected yet.";
  teacherNotesText.textContent = student.scoreFeedback || student.notes || "No notes yet.";
  myProgressBar.style.width = `${Math.min(100, Math.max(0, Math.round((totalPoints / 100) * 100)))}%`;

  if (notesInput) notesInput.value = student.notes || "";
}

function renderLeaderboard() {
  const list = activeBoard === "class" ? getStudentsForSelectedClass() : [...students];
  const sorted = [...list].sort((a, b) => getDramagicPointsForStudent(b) - getDramagicPointsForStudent(a));
  leaderboardList.innerHTML = "";

  sorted.forEach((student, index) => {
    const row = document.createElement("div");
    row.className = "leaderboard-row";
    const adjustment = getAttendanceAdjustmentForPresentacyStudent(student);
    const total = getDramagicPointsForStudent(student);
    const pointsNote = adjustment ? `<small class="points-adjustment-note">Base ${Number(student.points || 0)} ${adjustment > 0 ? "+" : ""}${adjustment}</small>` : "";
    row.innerHTML = `
      <div class="rank-number">#${index + 1}</div>
      <div class="leaderboard-name">
        <strong>${escapeHtml(student.name)}</strong>
        <span>${escapeHtml(student.className)}</span>
        ${pointsNote}
      </div>
      <div class="leaderboard-points">${total} pts</div>
    `;
    leaderboardList.appendChild(row);
  });

  if (!sorted.length) leaderboardList.innerHTML = `<p class="empty-mini">No students to rank yet.</p>`;
}

function getRank(student, type) {
  const list = type === "class"
    ? students.filter((item) => item.classId === student.classId)
    : students;
  const sorted = [...list].sort((a, b) => getDramagicPointsForStudent(b) - getDramagicPointsForStudent(a));
  return sorted.findIndex((item) => item.id === student.id) + 1;
}

function createStudentRow(student, isPresented) {
  const row = document.createElement("div");
  row.className = "student-row";
  const role = roleSelect.value;
  const isManager = role === "teacher" || role === "ceo";
  row.innerHTML = `
    <div class="student-info">
      <strong>${escapeHtml(student.name)}</strong>
      <span>${escapeHtml(student.className)} • ${getDramagicPointsForStudent(student)} Dramagic points</span>
      <span>${student.topic ? "Topic: " + escapeHtml(student.topic) : "No topic yet"}</span>
    </div>
    <div class="student-actions">
      <span class="student-chip">Presentacy</span>
      ${isManager ? `
        <button class="small-btn green" data-action="mark" data-id="${student.id}">${isPresented ? "Undo" : "Mark"}</button>
        <button class="small-btn" data-action="select" data-id="${student.id}">Select</button>
      ` : ""}
    </div>
  `;
  row.querySelectorAll("[data-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const action = button.dataset.action;
      const studentId = button.dataset.id;
      if (action === "mark") togglePresented(studentId);
      if (action === "select") {
        studentSelect.value = studentId;
        localStorage.setItem("presentacy_student", studentId);
        renderAll();
        switchTab("overview");
      }
    });
  });
  return row;
}

window.addEventListener("storage", function (event) {
  if (event.key === DRAMAGIC_ATTENDANCE_POINTS_KEY) renderAll();
});
window.addEventListener("dramagicPointsChanged", renderAll);

/* =====================================================
   DRAMAGIC FIX — Real role from login + Total Scores file
   CEO/Teacher can score. Parent/Dramagician can view scores.
   Wordle/game points stay separate.
===================================================== */
function readDramagicSessionForPresentacy() {
  try {
    return JSON.parse(localStorage.getItem("dramagic_demo_session")) || null;
  } catch {
    return null;
  }
}

function presentacyClassIdFromLetter(letter) {
  const value = String(letter || "").trim().toUpperCase();
  const map = { A: "kids-a", B: "kids-b", C: "teens", D: "adults", E: "kids-a", F: "kids-b" };
  return map[value] || "kids-a";
}

function getSessionStudentIdForPresentacy(session) {
  if (!session) return "";
  if (session.presentacyStudentId) return session.presentacyStudentId;
  if (session.role === "parent" && Array.isArray(session.children) && session.children.length) {
    const savedChild = localStorage.getItem("dramagic_selected_parent_child_id") || "";
    const selectedChild = session.children.find((child) => child.studentId === savedChild || child.presentacyStudentId === savedChild) || session.children[0];
    return selectedChild?.presentacyStudentId || "";
  }
  const sessionName = String(session.linkedStudentName || session.full_name || session.name || "").trim().toLowerCase();
  const matched = students.find((student) => String(student.name || "").trim().toLowerCase() === sessionName);
  return matched?.id || "";
}

function applyLoggedInRoleToPresentacy() {
  const session = readDramagicSessionForPresentacy();
  const savedRole = localStorage.getItem("presentacy_role");
  const savedClass = localStorage.getItem("presentacy_class");
  const savedStudentId = localStorage.getItem("presentacy_student");

  const role = String(session?.role || savedRole || "student").toLowerCase();
  if (roleSelect && ["student", "teacher", "ceo", "parent", "guest"].includes(role)) {
    roleSelect.value = role;
  }

  let classId = savedClass || classSelect?.value || "kids-a";
  if (session?.role === "student" && session.classLetter) classId = presentacyClassIdFromLetter(session.classLetter);
  if (session?.role === "parent" && Array.isArray(session.children) && session.children.length) {
    const savedChild = localStorage.getItem("dramagic_selected_parent_child_id") || "";
    const selectedChild = session.children.find((child) => child.studentId === savedChild || child.presentacyStudentId === savedChild) || session.children[0];
    classId = presentacyClassIdFromLetter(selectedChild?.classLetter || session.classLetter || "A");
  }
  if (session?.role === "ceo") classId = savedClass || "all";

  if (classSelect) classSelect.value = classId;
  populateStudentSelect();

  const sessionStudentId = getSessionStudentIdForPresentacy(session);
  const desiredStudentId = sessionStudentId || savedStudentId || studentSelect?.value || "";
  if (desiredStudentId && students.some((student) => student.id === desiredStudentId)) {
    if (studentSelect) studentSelect.value = desiredStudentId;
    localStorage.setItem("presentacy_student", desiredStudentId);
  }

  syncScoreClassSelect();
  syncScoreStudentSelect();
}

function getAllowedTabsForRole(role = roleSelect.value) {
  if (role === "teacher" || role === "ceo") return ["overview", "leaderboard", "history", "totalScores", "topic", "scoring"];
  if (role === "student") return ["overview", "leaderboard", "history", "totalScores", "topic"];
  if (role === "parent") return ["overview", "leaderboard", "history", "totalScores"];
  return [];
}

function updateAccess() {
  const role = roleSelect.value;
  const allowed = role !== "guest";
  const isManager = role === "teacher" || role === "ceo";

  lockedView.classList.toggle("hidden", allowed);
  presentacyApp.classList.toggle("hidden", !allowed);
  document.body.dataset.presentacyRole = role;
  document.body.classList.toggle("presentacy-manager", isManager);
  document.body.classList.toggle("presentacy-dramagician", role === "student");

  document.querySelectorAll(".teacher-only, .teacher-action").forEach((item) => item.classList.toggle("hidden", !isManager));
  refreshVisibleTabs();

  const activeSection = document.querySelector(".tab-section.active");
  if (activeSection && !canAccessTab(activeSection.id)) switchTab(role === "parent" ? "overview" : "overview");

  roleBadge.textContent = role === "parent" ? "Parent View" : (isManager ? (role === "ceo" ? "CEO View" : "Teacher View") : "Dramagician View");
}

function getAttendanceAdjustmentRowsForPresentacyStudent(student) {
  return readAttendancePointAdjustmentsForPresentacy()
    .filter((item) => attendanceItemMatchesPresentacyStudent(student, item))
    .sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
}

function readHomeworkPointRowsForPresentacyStudent(student) {
  // Future-ready placeholder. When homework/class points are approved from Supabase,
  // save rows under this key with studentName/classLetter/pointDelta/reason/date.
  try {
    const saved = JSON.parse(localStorage.getItem("dramagic_homework_point_adjustments"));
    if (!Array.isArray(saved)) return [];
    return saved.filter((item) => attendanceItemMatchesPresentacyStudent(student, item));
  } catch {
    return [];
  }
}

function formatLedgerDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function renderTotalScores() {
  const totalScoreSummary = document.getElementById("totalScoreSummary");
  const totalScoreLedgerList = document.getElementById("totalScoreLedgerList");
  const totalScoreLedgerCount = document.getElementById("totalScoreLedgerCount");
  if (!totalScoreSummary || !totalScoreLedgerList) return;

  const student = getSelectedStudent();
  if (!student) {
    totalScoreSummary.querySelectorAll("h3").forEach((item) => item.textContent = "0");
    totalScoreLedgerList.innerHTML = `<p class="empty-mini">Choose a Dramagician to view the score file.</p>`;
    if (totalScoreLedgerCount) totalScoreLedgerCount.textContent = "0";
    return;
  }

  const presentacyPoints = Number(student.points || 0);
  const attendanceRows = getAttendanceAdjustmentRowsForPresentacyStudent(student);
  const attendanceAdjustment = attendanceRows.reduce((sum, item) => sum + Number(item.pointDelta || 0), 0);
  const homeworkRows = readHomeworkPointRowsForPresentacyStudent(student);
  const homeworkPoints = homeworkRows.reduce((sum, item) => sum + Number(item.pointDelta || 0), 0);
  const totalPoints = presentacyPoints + attendanceAdjustment + homeworkPoints;
  const summaryValues = [totalPoints, presentacyPoints, attendanceAdjustment, homeworkPoints];

  totalScoreSummary.querySelectorAll("h3").forEach((item, index) => {
    const value = summaryValues[index] || 0;
    item.textContent = value > 0 && index > 1 ? `+${value}` : String(value);
  });

  const ledgerRows = [];
  ledgerRows.push({
    title: "Presentacy / approved progress",
    meta: "Main Dramagic points from presentation progress and approved class work.",
    note: `${student.className} • Current base points`,
    points: presentacyPoints,
    kind: "positive"
  });

  if (Array.isArray(student.scoreHistory) && student.scoreHistory.length) {
    student.scoreHistory.forEach((item) => {
      ledgerRows.push({
        title: `Presentation #${item.presentationNumber}`,
        meta: `Average: ${formatAverageScore(item.average)} • Total rubric: ${Number(item.total || 0)} / ${SCORE_TOTAL_MAX}`,
        note: item.feedback || "No feedback added.",
        points: null,
        kind: "neutral",
        date: item.date
      });
    });
  }

  attendanceRows.forEach((item) => {
    ledgerRows.push({
      title: "Attendance deduction",
      meta: item.reason || "Late attendance deduction",
      note: `Session ${item.sessionNumber || ""} • ${formatLedgerDate(item.date)}`,
      points: Number(item.pointDelta || 0),
      kind: "negative",
      date: item.date
    });
  });

  homeworkRows.forEach((item) => {
    ledgerRows.push({
      title: item.title || "Homework / class progress",
      meta: item.reason || "Approved homework/class score",
      note: formatLedgerDate(item.date),
      points: Number(item.pointDelta || 0),
      kind: Number(item.pointDelta || 0) < 0 ? "negative" : "positive",
      date: item.date
    });
  });

  if (!ledgerRows.length) {
    totalScoreLedgerList.innerHTML = `<p class="empty-mini">No score records yet.</p>`;
    if (totalScoreLedgerCount) totalScoreLedgerCount.textContent = "0";
    return;
  }

  if (totalScoreLedgerCount) totalScoreLedgerCount.textContent = String(ledgerRows.length);
  totalScoreLedgerList.innerHTML = ledgerRows.map((row) => {
    const pointClass = row.points === null ? "neutral" : (Number(row.points) < 0 ? "negative" : "");
    const pointText = row.points === null ? "Score" : `${Number(row.points) > 0 ? "+" : ""}${Number(row.points)} pts`;
    return `
      <article class="score-ledger-row">
        <div>
          <strong>${escapeHtml(row.title)}</strong>
          <span>${escapeHtml(row.meta || "")}</span>
          <small>${escapeHtml(row.note || "")}</small>
        </div>
        <div class="score-ledger-points ${pointClass}">${escapeHtml(pointText)}</div>
      </article>
    `;
  }).join("");
}

function renderAll() {
  updateAccess();
  populateStudentSelect();
  renderOverview();
  renderScoring();
  renderPresenters();
  renderLeaderboard();
  renderStudentHistory();
  renderTotalScores();
}

window.addEventListener("storage", function (event) {
  if (event.key === "dramagic_demo_session") {
    applyLoggedInRoleToPresentacy();
    renderAll();
  }
});

applyLoggedInRoleToPresentacy();
renderAll();
openTabFromHash();



/* =====================================================
   DRAMAGIC HARD FIX — Presentacy role must follow login session
   Problem fixed:
   - Hidden Preview Mode / presentacy_role localStorage could keep the page as "student"
     even when the real logged-in session is CEO.
   - This bridge makes the real auth session the source of truth.
===================================================== */
(function () {
  const SESSION_KEYS = [
    "dramagic_demo_session",
    "dramagic_session",
    "dramagic_current_user",
    "dramagic_user"
  ];

  function readAnySession() {
    for (const key of SESSION_KEYS) {
      try {
        const raw = localStorage.getItem(key);
        if (!raw) continue;
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed === "object") {
          return parsed;
        }
      } catch {
        // Ignore broken localStorage values.
      }
    }

    return null;
  }

  function normalizedRole(value) {
    const role = String(value || "").trim().toLowerCase();
    return ["student", "teacher", "ceo", "parent", "guest"].includes(role) ? role : "student";
  }

  function classIdFromLetter(letter) {
    const value = String(letter || "").trim().toUpperCase();
    const map = { A: "kids-a", B: "kids-b", C: "teens", D: "adults", E: "kids-a", F: "kids-b" };
    return map[value] || "kids-a";
  }

  function getSessionStudentId(session) {
    if (!session) return "";
    if (session.presentacyStudentId) return session.presentacyStudentId;

    if (session.role === "parent" && Array.isArray(session.children) && session.children.length) {
      const savedChild = localStorage.getItem("dramagic_selected_parent_child_id") || "";
      const selectedChild =
        session.children.find((child) => child.studentId === savedChild || child.presentacyStudentId === savedChild) ||
        session.children[0];

      return selectedChild?.presentacyStudentId || "";
    }

    const sessionName = String(session.linkedStudentName || session.full_name || session.name || "").trim().toLowerCase();
    const matched = Array.isArray(students)
      ? students.find((student) => String(student.name || "").trim().toLowerCase() === sessionName)
      : null;

    return matched?.id || "";
  }

  function forceLoginRole() {
    const session = readAnySession();
    const role = normalizedRole(session?.role || localStorage.getItem("presentacy_role") || "student");

    if (roleSelect && roleSelect.value !== role) {
      roleSelect.value = role;
    }

    localStorage.setItem("presentacy_role", role);

    if (session && classSelect) {
      let nextClass = classSelect.value || "kids-a";

      if (role === "ceo" || role === "teacher") {
        nextClass = localStorage.getItem("presentacy_class") || (role === "ceo" ? "all" : "kids-a");
      }

      if (role === "student" && session.classLetter) {
        nextClass = classIdFromLetter(session.classLetter);
      }

      if (role === "parent" && Array.isArray(session.children) && session.children.length) {
        const savedChild = localStorage.getItem("dramagic_selected_parent_child_id") || "";
        const selectedChild =
          session.children.find((child) => child.studentId === savedChild || child.presentacyStudentId === savedChild) ||
          session.children[0];

        nextClass = classIdFromLetter(selectedChild?.classLetter || session.classLetter || "A");
      }

      if (classSelect.value !== nextClass) {
        classSelect.value = nextClass;
      }

      if (typeof populateStudentSelect === "function") {
        populateStudentSelect();
      }

      const sessionStudentId = getSessionStudentId(session);
      if (sessionStudentId && studentSelect && Array.isArray(students) && students.some((student) => student.id === sessionStudentId)) {
        studentSelect.value = sessionStudentId;
        localStorage.setItem("presentacy_student", sessionStudentId);
      }
    }

    if (typeof syncScoreClassSelect === "function") syncScoreClassSelect();
    if (typeof syncScoreStudentSelect === "function") syncScoreStudentSelect();

    return role;
  }

  getAllowedTabsForRole = function (role = forceLoginRole()) {
    if (role === "teacher" || role === "ceo") {
      return ["overview", "leaderboard", "history", "totalScores", "topic", "scoring"];
    }

    if (role === "student") {
      return ["overview", "leaderboard", "history", "totalScores", "topic"];
    }

    if (role === "parent") {
      return ["overview", "leaderboard", "history", "totalScores"];
    }

    return [];
  };

  canAccessTab = function (tabName) {
    return getAllowedTabsForRole().includes(tabName);
  };

  refreshVisibleTabs = function () {
    const allowedTabs = getAllowedTabsForRole();

    tabButtons.forEach((button) => {
      const allowed = allowedTabs.includes(button.dataset.tab);
      button.classList.toggle("hidden", !allowed);
    });
  };

  updateAccess = function () {
    const role = forceLoginRole();
    const allowed = role !== "guest";
    const isManager = role === "teacher" || role === "ceo";

    if (lockedView) lockedView.classList.toggle("hidden", allowed);
    if (presentacyApp) presentacyApp.classList.toggle("hidden", !allowed);

    document.body.dataset.presentacyRole = role;
    document.body.classList.toggle("presentacy-manager", isManager);
    document.body.classList.toggle("presentacy-dramagician", role === "student");

    document.querySelectorAll(".teacher-only, .teacher-action").forEach((item) => {
      item.classList.toggle("hidden", !isManager);
    });

    refreshVisibleTabs();

    const activeSection = document.querySelector(".tab-section.active");
    if (activeSection && !canAccessTab(activeSection.id)) {
      switchTab("overview");
    }

    if (roleBadge) {
      roleBadge.textContent =
        role === "parent"
          ? "Parent View"
          : isManager
            ? role === "ceo" ? "CEO View" : "Teacher View"
            : "Dramagician View";
    }
  };

  const originalSwitchTab = typeof switchTab === "function" ? switchTab : null;
  switchTab = function (tabName) {
    forceLoginRole();

    if (!canAccessTab(tabName)) {
      tabName = "overview";
    }

    tabButtons.forEach((button) => {
      button.classList.toggle("active", button.dataset.tab === tabName);
    });

    tabSections.forEach((section) => {
      section.classList.toggle("active", section.id === tabName);
    });

    if (history.replaceState) {
      history.replaceState(null, "", `#${tabName}`);
    }

    updateAccess();
  };

  const originalRenderAll = typeof renderAll === "function" ? renderAll : null;
  renderAll = function () {
    forceLoginRole();
    updateAccess();
    if (typeof populateStudentSelect === "function") populateStudentSelect();
    if (typeof renderOverview === "function") renderOverview();
    if (typeof renderScoring === "function") renderScoring();
    if (typeof renderPresenters === "function") renderPresenters();
    if (typeof renderLeaderboard === "function") renderLeaderboard();
    if (typeof renderStudentHistory === "function") renderStudentHistory();
    if (typeof renderTotalScores === "function") renderTotalScores();
  };

  if (scoringForm) {
    scoringForm.addEventListener(
      "submit",
      function () {
        forceLoginRole();
      },
      true
    );
  }

  window.DramagicPresentacyRoleFix = {
    readSession: readAnySession,
    force: forceLoginRole,
    role: () => forceLoginRole()
  };

  forceLoginRole();
  renderAll();

  if (location.hash && canAccessTab(location.hash.replace("#", ""))) {
    switchTab(location.hash.replace("#", ""));
  } else if (forceLoginRole() === "ceo" || forceLoginRole() === "teacher") {
    // Keep the full page available; do not force scoring open automatically.
    updateAccess();
  }

  window.addEventListener("storage", function (event) {
    if (SESSION_KEYS.includes(event.key) || event.key === "presentacy_role") {
      renderAll();
    }
  });
})();


/* =====================================================
   DRAMAGIC FIX — CEO/Teacher score viewer selector
   Managers should not be locked to Laila or the hidden preview student.
   This visible selector controls My Score, Presentations, Total Scores,
   Topic Generator context, and Add Score.
===================================================== */
(function () {
  const viewerPanel = document.getElementById("managerScoreViewer");
  const viewerClassSelect = document.getElementById("viewerClassSelect");
  const viewerStudentSelect = document.getElementById("viewerStudentSelect");

  if (!viewerPanel || !viewerClassSelect || !viewerStudentSelect) return;

  function readSessionRoleForViewer() {
    try {
      const session = JSON.parse(localStorage.getItem("dramagic_demo_session")) || null;
      return String(session?.role || roleSelect?.value || "student").toLowerCase();
    } catch {
      return String(roleSelect?.value || "student").toLowerCase();
    }
  }

  function isViewerManager() {
    const role = readSessionRoleForViewer();
    return role === "ceo" || role === "teacher";
  }

  function getStudentsForViewerClass() {
    const selectedClass = viewerClassSelect.value || "all";
    if (selectedClass === "all") return Array.isArray(students) ? [...students] : [];
    return Array.isArray(students) ? students.filter((student) => student.classId === selectedClass) : [];
  }

  function setSelectedStudentEverywhere(studentId) {
    if (!studentId) return;

    if (studentSelect) studentSelect.value = studentId;
    if (scoreStudentSelect) scoreStudentSelect.value = studentId;
    if (viewerStudentSelect) viewerStudentSelect.value = studentId;

    localStorage.setItem("presentacy_student", studentId);
    if (typeof syncScoreStudentSelect === "function") syncScoreStudentSelect();
  }

  function refreshManagerScoreViewer(keepSelected = true) {
    const manager = isViewerManager();
    viewerPanel.classList.toggle("hidden", !manager);
    if (!manager) return;

    const realRole = readSessionRoleForViewer();
    if (roleSelect && roleSelect.value !== realRole) roleSelect.value = realRole;

    const currentClass = classSelect?.value || localStorage.getItem("presentacy_class") || "all";
    if (viewerClassSelect.value !== currentClass) {
      viewerClassSelect.value = currentClass;
    }

    const previousStudentId = keepSelected
      ? (viewerStudentSelect.value || studentSelect?.value || localStorage.getItem("presentacy_student") || "")
      : "";

    const availableStudents = getStudentsForViewerClass();
    viewerStudentSelect.innerHTML = "";

    if (!availableStudents.length) {
      const option = document.createElement("option");
      option.value = "";
      option.textContent = "No Dramagicians in this class";
      viewerStudentSelect.appendChild(option);
      viewerStudentSelect.disabled = true;
      return;
    }

    availableStudents.forEach((student) => {
      const option = document.createElement("option");
      option.value = student.id;
      option.textContent = `${student.name} — ${student.className}`;
      viewerStudentSelect.appendChild(option);
    });

    viewerStudentSelect.disabled = false;
    const nextStudentId = availableStudents.some((student) => student.id === previousStudentId)
      ? previousStudentId
      : availableStudents[0].id;

    setSelectedStudentEverywhere(nextStudentId);
  }

  function rerenderSelectedScoreFile() {
    if (typeof renderOverview === "function") renderOverview();
    if (typeof renderScoring === "function") renderScoring();
    if (typeof renderLeaderboard === "function") renderLeaderboard();
    if (typeof renderStudentHistory === "function") renderStudentHistory();
    if (typeof renderTotalScores === "function") renderTotalScores();
  }

  viewerClassSelect.addEventListener("change", function () {
    if (classSelect) classSelect.value = viewerClassSelect.value;
    if (scoreClassSelect) scoreClassSelect.value = viewerClassSelect.value;
    localStorage.setItem("presentacy_class", viewerClassSelect.value);

    if (typeof populateStudentSelect === "function") populateStudentSelect();
    refreshManagerScoreViewer(false);
    rerenderSelectedScoreFile();
  });

  viewerStudentSelect.addEventListener("change", function () {
    setSelectedStudentEverywhere(viewerStudentSelect.value);
    rerenderSelectedScoreFile();
  });

  const originalGetSelectedStudentForViewer = typeof getSelectedStudent === "function" ? getSelectedStudent : null;
  getSelectedStudent = function () {
    if (isViewerManager()) {
      const selectedId = viewerStudentSelect.value || studentSelect?.value || localStorage.getItem("presentacy_student") || "";
      const found = Array.isArray(students) ? students.find((student) => student.id === selectedId) : null;
      if (found) return found;
    }

    return originalGetSelectedStudentForViewer ? originalGetSelectedStudentForViewer() : null;
  };

  const originalUpdateAccessForViewer = typeof updateAccess === "function" ? updateAccess : null;
  updateAccess = function () {
    if (originalUpdateAccessForViewer) originalUpdateAccessForViewer();
    refreshManagerScoreViewer(true);
  };

  const originalSwitchTabForViewer = typeof switchTab === "function" ? switchTab : null;
  switchTab = function (tabName) {
    if (originalSwitchTabForViewer) originalSwitchTabForViewer(tabName);
    refreshManagerScoreViewer(true);
    rerenderSelectedScoreFile();
  };

  const originalRenderAllForViewer = typeof renderAll === "function" ? renderAll : null;
  renderAll = function () {
    if (originalRenderAllForViewer) originalRenderAllForViewer();
    refreshManagerScoreViewer(true);
    rerenderSelectedScoreFile();
  };

  if (scoreClassSelect) {
    scoreClassSelect.addEventListener("change", function () {
      if (!isViewerManager()) return;
      viewerClassSelect.value = scoreClassSelect.value || "all";
      refreshManagerScoreViewer(false);
      rerenderSelectedScoreFile();
    });
  }

  if (scoreStudentSelect) {
    scoreStudentSelect.addEventListener("change", function () {
      if (!isViewerManager()) return;
      setSelectedStudentEverywhere(scoreStudentSelect.value);
      rerenderSelectedScoreFile();
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    refreshManagerScoreViewer(true);
    rerenderSelectedScoreFile();
  });

  refreshManagerScoreViewer(true);
  rerenderSelectedScoreFile();

  window.DramagicPresentacyViewer = {
    refresh: refreshManagerScoreViewer,
    selectedStudent: () => getSelectedStudent()
  };
})();
