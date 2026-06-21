/* =====================================================
   DRAMAGIC WORDLE
   - Presentation, theatre, drama, and performance 5-letter words
   - Daily learner word is different per logged-in Dramagician
   - Dramagicians get one word per day
   - Teacher / CEO can practise unlimited words
   - No speed pressure: fixed points for winning
===================================================== */

const WORDS = [
  "ACTED", "ACTOR", "ADAPT", "ADLIB", "AISLE", "ALIEN", "AMUSE", "ANGEL", "ANGRY", "APRON",
  "ARENA", "ARIAS", "ASIDE", "AUDIO", "BARDS", "BATON", "BEAMS", "BEAST", "BEATS", "BLACK",
  "BLEND", "BLOCK", "BOARD", "BOOTH", "BRAVE", "BRAVO", "BREAK", "CASTS", "CHAIR", "CHANT",
  "CHARM", "CHART", "CHASE", "CHEER", "CHIEF", "CHILD", "CHOIR", "CLAIM", "CLAPS", "CLASS",
  "CLEAR", "CLICK", "CLOWN", "COMIC", "COUNT", "CRAFT", "CROWD", "CROWN", "DANCE", "DEBUT",
  "DRAMA", "DRESS", "DRILL", "DRUMS", "EAGER", "ENTER", "EVENT", "EXITS", "EXTRA", "FACES",
  "FACTS", "FAIRY", "FARCE", "FIGHT", "FINAL", "FLATS", "FLOOR", "FOCUS", "FOLEY", "FORUM",
  "FRAME", "FRONT", "FUNNY", "GENRE", "GHOST", "GIANT", "GLARE", "GRACE", "GRAPH", "GROUP",
  "GUIDE", "GUILD", "HALLS", "HAPPY", "HEART", "HOUSE", "HUMAN", "IDEAS", "IMAGE", "INTRO",
  "ISSUE", "JOKER", "JUDGE", "KNIFE", "LAUGH", "LEADS", "LEVEL", "LIGHT", "LINES", "LISTS",
  "LOBBY", "LOGIC", "MAGIC", "MASKS", "MEDIA", "MIMES", "MIMIC", "MODEL", "MOTIF", "MOVES",
  "MOVIE", "MUSIC", "NOTES", "NURSE", "OPERA", "OUTRO", "PACES", "PANEL", "PAPER", "PAUSE",
  "PHOTO", "PIANO", "PIECE", "PITCH", "PLACE", "PLAYS", "POEMS", "POISE", "POINT", "POSES",
  "PRESS", "PROOF", "PROPS", "PROUD", "QUEEN", "QUICK", "QUIET", "QUOTE", "RADIO", "RAISE",
  "REACT", "RECAP", "REELS", "RIVAL", "ROLES", "ROUND", "ROYAL", "SADLY", "SCENE", "SCORE",
  "SEATS", "SHARP", "SHIFT", "SHINE", "SHORT", "SHOUT", "SHOWS", "SKILL", "SKITS", "SLIDE",
  "SMILE", "SONGS", "SOUND", "SPACE", "SPEAK", "SPOTS", "STAGE", "STAND", "START", "STILL",
  "STORY", "STYLE", "TABLE", "TEARS", "TENSE", "THEME", "TIMED", "TIMER", "TITLE", "TONES",
  "TOPIC", "TRACK", "TRUST", "TRUSS", "UNITY", "VALUE", "VERSE", "VIDEO", "VIEWS", "VOICE",
  "WINGS", "WITCH", "WORDS", "WORLD", "WORRY", "WRITE", "YOUNG"
].filter((word, index, list) => word.length === 5 && list.indexOf(word) === index);

const BOARD_ROWS = 6;
const WORD_LENGTH = 5;
const DAILY_WIN_POINTS = 1;
const STORAGE_PREFIX = "dramagic_wordle_v4_saved_points";
const LEADERBOARD_KEY = `${STORAGE_PREFIX}_leaderboard`;

const board = document.getElementById("wordleBoard");
const keyboard = document.getElementById("keyboard");
const messageBox = document.getElementById("messageBox");
const totalGamePoints = document.getElementById("totalGamePoints");
const gamesPlayed = document.getElementById("gamesPlayed");
const gamesWon = document.getElementById("gamesWon");
const currentStreak = document.getElementById("currentStreak");
const todayPoints = document.getElementById("todayPoints");
const newPracticeBtn = document.getElementById("newPracticeBtn");
const wordleSubtitle = document.getElementById("wordleSubtitle");
const wordleLeaderboardList = document.getElementById("wordleLeaderboardList");

let currentUser = getCurrentGameUser();
let isPracticeMode = isStaffRole(currentUser.role);
let userKey = makeUserKey(currentUser);
let stats = loadStats();
let dailyState = loadDailyState();

let answer = "";
let currentRow = 0;
let currentGuess = "";
let gameOver = false;
let keyboardState = {};
let submittedRows = [];

document.addEventListener("DOMContentLoaded", initGame);

function initGame() {
  if (newPracticeBtn) {
    newPracticeBtn.hidden = !isPracticeMode;
    newPracticeBtn.addEventListener("click", startNewPracticeWord);
  }


  document.addEventListener("keydown", handlePhysicalKeyboard);
  startRound();
  renderStats();
  renderLeaderboard();
}

function startRound(forcePracticeWord = false) {
  keyboardState = {};
  currentGuess = "";
  submittedRows = [];
  gameOver = false;

  if (isPracticeMode) {
    answer = forcePracticeWord ? pickRandomWord(answer) : pickRandomWord("");
    currentRow = 0;
    if (wordleSubtitle) {
      wordleSubtitle.textContent = "Teacher / CEO practice mode. Generate as many words as needed for explaining the game. Practice wins save 1 point on this device. The leaderboard stays for Dramagicians only.";
    }
  } else {
    answer = getDailyWordForUser();
    dailyState = loadDailyState();

    if (!dailyState || dailyState.answer !== answer) {
      dailyState = makeFreshDailyState(answer);
      saveDailyState();
    }

    submittedRows = Array.isArray(dailyState.rows) ? dailyState.rows : [];
    currentRow = submittedRows.length;
    gameOver = Boolean(dailyState.complete) || currentRow >= BOARD_ROWS;

    if (wordleSubtitle) {
      wordleSubtitle.textContent = "Your personal daily word. One word per day, so take your time.";
    }
  }

  renderBoard();
  restoreSubmittedRows();
  renderKeyboard();

  if (!isPracticeMode && dailyState.complete) {
    const message = dailyState.won
      ? `Today's word is finished. Great work! Come back tomorrow for a new word.`
      : `Today's word is finished. The word was ${answer}. Come back tomorrow for a new word.`;
    showMessage(message, dailyState.won ? "good" : "warn");
    return;
  }

  showMessage(isPracticeMode
    ? "Practice word ready. Type a word or tap the keyboard."
    : "Today's word is ready. Take your time and think calmly."
  );
}

function startNewPracticeWord() {
  if (!isPracticeMode) {
    showMessage("Dramagicians get one daily word. Come back tomorrow for a new one.", "warn");
    return;
  }

  startRound(true);
}

function getDailyWordForUser() {
  const today = getLocalDateKey();
  const seed = `${today}|${userKey}|${currentUser.full_name || ""}|${currentUser.email || ""}`;
  return WORDS[hashString(seed) % WORDS.length];
}

function pickRandomWord(previousWord = "") {
  if (WORDS.length === 1) return WORDS[0];

  let next = previousWord;
  let safety = 0;
  while (next === previousWord && safety < 20) {
    const randomIndex = getRandomIndex(WORDS.length);
    next = WORDS[randomIndex];
    safety += 1;
  }

  return next;
}

function getRandomIndex(max) {
  if (window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  }

  return Math.floor(Math.random() * max);
}

function renderBoard() {
  board.innerHTML = "";

  for (let row = 0; row < BOARD_ROWS; row += 1) {
    const rowElement = document.createElement("div");
    rowElement.className = "wordle-row";

    for (let col = 0; col < WORD_LENGTH; col += 1) {
      const tile = document.createElement("div");
      tile.className = "tile";
      tile.dataset.row = row;
      tile.dataset.col = col;
      rowElement.appendChild(tile);
    }

    board.appendChild(rowElement);
  }
}

function restoreSubmittedRows() {
  submittedRows.forEach((row, rowIndex) => {
    const guess = row.guess || "";
    const result = Array.isArray(row.result) ? row.result : scoreGuess(guess, answer);

    result.forEach((state, index) => {
      const tile = getTile(rowIndex, index);
      const letter = guess[index] || "";
      tile.textContent = letter;
      tile.classList.add(state);
      updateKeyboardState(letter, state);
    });
  });
}

function renderKeyboard() {
  const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

  keyboard.innerHTML = rows.map((letters, rowIndex) => {
    const extraStart = rowIndex === 2 ? `<button class="key wide" type="button" data-key="ENTER">ENTER</button>` : "";
    const extraEnd = rowIndex === 2 ? `<button class="key wide" type="button" data-key="BACKSPACE">⌫</button>` : "";
    const keys = letters.split("").map((letter) => {
      const state = keyboardState[letter] || "";
      return `<button class="key ${state}" type="button" data-key="${letter}">${letter}</button>`;
    }).join("");

    return `<div class="key-row">${extraStart}${keys}${extraEnd}</div>`;
  }).join("");

  keyboard.querySelectorAll("[data-key]").forEach((button) => {
    button.addEventListener("click", () => handleKey(button.dataset.key));
  });
}

function handlePhysicalKeyboard(event) {
  if (event.ctrlKey || event.metaKey || event.altKey) return;

  if (event.key === "Enter") {
    handleKey("ENTER");
    return;
  }

  if (event.key === "Backspace") {
    handleKey("BACKSPACE");
    return;
  }

  const letter = event.key.toUpperCase();
  if (/^[A-Z]$/.test(letter)) handleKey(letter);
}

function handleKey(key) {
  if (gameOver) return;

  if (key === "ENTER") {
    submitGuess();
    return;
  }

  if (key === "BACKSPACE") {
    currentGuess = currentGuess.slice(0, -1);
    updateCurrentRow();
    return;
  }

  if (/^[A-Z]$/.test(key) && currentGuess.length < WORD_LENGTH) {
    currentGuess += key;
    updateCurrentRow();
  }
}

function updateCurrentRow() {
  for (let col = 0; col < WORD_LENGTH; col += 1) {
    const tile = getTile(currentRow, col);
    if (!tile) return;
    tile.textContent = currentGuess[col] || "";
    tile.classList.toggle("filled", Boolean(currentGuess[col]));
  }
}

function submitGuess() {
  if (currentGuess.length !== WORD_LENGTH) {
    showMessage("Write 5 letters first.", "warn");
    return;
  }

  const result = scoreGuess(currentGuess, answer);
  result.forEach((state, index) => {
    const tile = getTile(currentRow, index);
    const letter = currentGuess[index];
    tile.classList.remove("filled");
    tile.classList.add(state);
    updateKeyboardState(letter, state);
  });

  submittedRows.push({ guess: currentGuess, result });
  renderKeyboard();

  if (!isPracticeMode) {
    dailyState.rows = submittedRows;
    saveDailyState();
  }

  if (currentGuess === answer) {
    finishRound(true);
    return;
  }

  currentRow += 1;
  currentGuess = "";

  if (currentRow >= BOARD_ROWS) {
    finishRound(false);
    return;
  }

  showMessage("Good try. Keep thinking calmly.");
}

function finishRound(won) {
  const earned = won ? DAILY_WIN_POINTS : 0;

  stats.played += 1;
  if (won) {
    stats.won += 1;
    stats.streak += 1;
    stats.points += earned;
  } else {
    stats.streak = 0;
  }

  stats.lastRoundPoints = earned;
  saveStats();
  renderStats();

  if (!isPracticeMode) {
    dailyState.rows = submittedRows;
    dailyState.complete = true;
    dailyState.won = won;
    dailyState.pointsAwarded = earned;
    dailyState.finishedAt = new Date().toISOString();
    saveDailyState();
  }

  gameOver = true;

  if (won) {
    if (isPracticeMode) {
      showMessage(`Practice solved! The word was ${answer}. You earned ${earned} point.`, "good");
    } else {
      showMessage(`Amazing! The word was ${answer}. You earned ${earned} point.`, "good");
    }
  } else {
    showMessage(`Round finished. The word was ${answer}.`, "bad");
  }
}

function scoreGuess(guess, target) {
  const result = Array(WORD_LENGTH).fill("absent");
  const targetLetters = target.split("");

  for (let i = 0; i < WORD_LENGTH; i += 1) {
    if (guess[i] === target[i]) {
      result[i] = "correct";
      targetLetters[i] = null;
    }
  }

  for (let i = 0; i < WORD_LENGTH; i += 1) {
    if (result[i] === "correct") continue;
    const foundIndex = targetLetters.indexOf(guess[i]);
    if (foundIndex !== -1) {
      result[i] = "present";
      targetLetters[foundIndex] = null;
    }
  }

  return result;
}

function updateKeyboardState(letter, state) {
  if (!letter) return;
  const rank = { absent: 1, present: 2, correct: 3 };
  const previous = keyboardState[letter];

  if (!previous || rank[state] > rank[previous]) keyboardState[letter] = state;
}

function getTile(row, col) {
  return board.querySelector(`[data-row="${row}"][data-col="${col}"]`);
}

function showMessage(text, type = "") {
  messageBox.textContent = text;
  messageBox.className = `message-box ${type}`.trim();
}

function loadStats() {
  try {
    const saved = JSON.parse(localStorage.getItem(getStatsKey())) || {};
    return {
      played: Number(saved.played || 0),
      won: Number(saved.won || 0),
      streak: Number(saved.streak || 0),
      points: Number(saved.points || 0),
      lastRoundPoints: Number(saved.lastRoundPoints || 0)
    };
  } catch {
    return { played: 0, won: 0, streak: 0, points: 0, lastRoundPoints: 0 };
  }
}

function saveStats() {
  localStorage.setItem(getStatsKey(), JSON.stringify(stats));
  updateLeaderboardEntry();
}

function renderStats() {
  totalGamePoints.textContent = stats.points;
  gamesPlayed.textContent = stats.played;
  gamesWon.textContent = stats.won;
  currentStreak.textContent = stats.streak;
  todayPoints.textContent = stats.lastRoundPoints;
  renderLeaderboard();
}


function loadLeaderboard() {
  try {
    const saved = JSON.parse(localStorage.getItem(LEADERBOARD_KEY));
    return Array.isArray(saved) ? saved : [];
  } catch {
    return [];
  }
}

function saveLeaderboard(entries) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
}

function updateLeaderboardEntry() {
  // Teacher and CEO practice is for explanation only, so it never affects the game leaderboard.
  if (isPracticeMode || !isDramagicianRole(currentUser.role)) return;

  const displayName = currentUser.full_name || currentUser.username || "Dramagician";
  const entries = loadLeaderboard().filter((entry) => entry.userKey !== userKey);

  if (stats.played > 0 || stats.points > 0 || stats.won > 0) {
    entries.push({
      userKey,
      name: displayName,
      role: currentUser.role,
      points: Number(stats.points || 0),
      played: Number(stats.played || 0),
      won: Number(stats.won || 0),
      streak: Number(stats.streak || 0),
      updatedAt: new Date().toISOString()
    });
  }

  saveLeaderboard(entries);
}

function removeLeaderboardEntry() {
  const entries = loadLeaderboard().filter((entry) => entry.userKey !== userKey);
  saveLeaderboard(entries);
}

function getSortedLeaderboard() {
  const entries = loadLeaderboard();
  return entries
    .filter((entry) => entry && isDramagicianRole(entry.role))
    .sort((a, b) => {
      const pointsDiff = Number(b.points || 0) - Number(a.points || 0);
      if (pointsDiff) return pointsDiff;

      const wonDiff = Number(b.won || 0) - Number(a.won || 0);
      if (wonDiff) return wonDiff;

      const playedDiff = Number(a.played || 0) - Number(b.played || 0);
      if (playedDiff) return playedDiff;

      return String(a.name || "").localeCompare(String(b.name || ""));
    });
}

function renderLeaderboard() {
  if (!wordleLeaderboardList) return;

  const entries = getSortedLeaderboard();

  if (!entries.length) {
    wordleLeaderboardList.innerHTML = `
      <div class="leaderboard-empty">
        Win a daily word to appear on the Wordle leaderboard.
      </div>
    `;
    return;
  }

  wordleLeaderboardList.innerHTML = entries.slice(0, 10).map((entry, index) => {
    const mine = entry.userKey === userKey;
    return `
      <article class="leaderboard-row ${mine ? "mine" : ""}">
        <b>#${index + 1}</b>
        <div>
          <strong>${cleanText(entry.name || "Dramagician")}</strong>
          <span>${Number(entry.won || 0)} win${Number(entry.won || 0) === 1 ? "" : "s"} • ${Number(entry.streak || 0)} streak</span>
        </div>
        <em>${Number(entry.points || 0)} pt${Number(entry.points || 0) === 1 ? "" : "s"}</em>
      </article>
    `;
  }).join("");
}

function cleanText(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function loadDailyState() {
  if (isPracticeMode) return null;
  try {
    return JSON.parse(localStorage.getItem(getDailyStateKey())) || null;
  } catch {
    return null;
  }
}

function saveDailyState() {
  if (isPracticeMode || !dailyState) return;
  localStorage.setItem(getDailyStateKey(), JSON.stringify(dailyState));
}

function makeFreshDailyState(word) {
  return {
    date: getLocalDateKey(),
    answer: word,
    rows: [],
    complete: false,
    won: false,
    pointsAwarded: 0,
    createdAt: new Date().toISOString()
  };
}

function getStatsKey() {
  return `${STORAGE_PREFIX}_stats_${userKey}`;
}

function getDailyStateKey() {
  return `${STORAGE_PREFIX}_daily_${userKey}_${getLocalDateKey()}`;
}


function normalizeRole(role) {
  return String(role || "student").toLowerCase().trim();
}

function isStaffRole(role) {
  return ["teacher", "ceo", "admin"].includes(normalizeRole(role));
}

function isDramagicianRole(role) {
  return ["student", "learner", "dramagician"].includes(normalizeRole(role));
}

function getCurrentGameUser() {
  const fallbacks = [
    "dramagic_demo_session",
    "dramagic_current_user",
    "dramagic_user"
  ];

  for (const key of fallbacks) {
    try {
      const user = JSON.parse(localStorage.getItem(key));
      if (user && typeof user === "object") {
        return {
          id: user.id || user.username || user.email || user.full_name || "device-user",
          username: user.username || "",
          email: user.email || "",
          full_name: user.full_name || user.name || "Dramagic User",
          role: normalizeRole(user.role || "student")
        };
      }
    } catch {
      // Try next key.
    }
  }

  return {
    id: "guest-device",
    username: "guest",
    email: "",
    full_name: "Dramagic User",
    role: "student"
  };
}

function makeUserKey(user) {
  const raw = `${user.id || ""}|${user.email || ""}|${user.full_name || ""}|${user.role || "student"}`;
  return raw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "device-user";
}

function getLocalDateKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function hashString(value) {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash >>> 0);
}