const pages = document.querySelectorAll(".page");
const startBtn = document.getElementById("startBtn");
const scoresBtn = document.getElementById("scoresBtn");
const rulesBtn = document.getElementById("rulesBtn");
const lvlBtns = document.querySelectorAll(".lvlBtn");
const backBtns = document.querySelectorAll(".backBtn");
const grid = document.getElementById("grid");
const lvlName = document.getElementById("lvlName");
const timeTxt = document.getElementById("timeTxt");
const movesTxt = document.getElementById("movesTxt");
const matchTxt = document.getElementById("matchTxt");
const restartBtn = document.getElementById("restartBtn");
const leaveBtn = document.getElementById("leaveBtn");
const scoreList = document.getElementById("scoreList");
const clearBtn = document.getElementById("clearBtn");
const winPop = document.getElementById("winPop");
const finalTxt = document.getElementById("finalTxt");
const recordTxt = document.getElementById("recordTxt");
const againBtn = document.getElementById("againBtn");
const menuBtn = document.getElementById("menuBtn");
const levels = {
  easy: {
    name: "EASY",
    size: 4,
    wild: false
  },
  medium: {
    name: "MEDIUM",
    size: 5,
    wild: true
  },
  hard: {
    name: "HARD",
    size: 6,
    wild: false
  },
  master: {
    name: "MASTER",
    size: 7,
    wild: true
  },
  grand: {
    name: "GRAND MASTER",
    size: 8,
    wild: false
  }
};
const symbols = [
  "◆", "●", "▲", "★", "✦", "✚", "⬢", "☾",
  "☀", "⚡", "♢", "⬡", "✿", "♟", "♜", "♞",
  "♣", "♦", "♥", "♠", "✺", "❖", "✹", "☯",
  "☼", "☁", "☄", "⚙", "⌁", "∞", "∆", "◈"
];
let curLvl = "easy";
let firstCard = null;
let secondCard = null;
let locked = false;
let matches = 0;
let moves = 0;
let secs = 0;
let timer = null;
function showPage(pageId) {
  pages.forEach(function(page) {
    page.classList.remove("active-page");
  });
  var p = document.getElementById(pageId);
  p.classList.add("active-page");
}
function getScores() {
  const savedScores = localStorage.getItem("neonMemoryScores");
  if (savedScores) {
    return JSON.parse(savedScores);
  }
  return {
    easy: null,
    medium: null,
    hard: null,
    master: null,
    grand: null
  };
}
function saveScore(time) {
  const scores = getScores();
  if (scores[curLvl] === null || time < scores[curLvl]) {
    scores[curLvl] = time;
    localStorage.setItem("neonMemoryScores", JSON.stringify(scores));
    return true;
  }
  return false;
}
function timeStr(seconds) {
  var mins = Math.floor(seconds / 60);
  var secs2 = seconds % 60;
  mins = String(mins).padStart(2, "0");
  secs2 = String(secs2).padStart(2, "0");
  return mins + ":" + secs2;
}
function startTimer() {
  stopTimer();
  timer = setInterval(function() {
    secs++;
    timeTxt.textContent = timeStr(secs);
  }, 1000);
}
function stopTimer() {
  if (timer !== null) {
    clearInterval(timer);
    timer = null;
  }
}
function resetGame() {
  stopTimer();
  firstCard = null;
  secondCard = null;
  locked = false;
  matches = 0;
  moves = 0;
  secs = 0;
  var zero = "00:00";
  timeTxt.textContent = zero;
  movesTxt.textContent = "0";
  matchTxt.textContent = "0";
}
function shuffle(cards) {
  for (let i = cards.length - 1; i > 0; i--) {
    var r = Math.floor(Math.random() * (i + 1));
    var temp = cards[i];
    cards[i] = cards[r];
    cards[r] = temp;
  }
  return cards;
}
function makeCards(size, needsWild) {
  const numberOfCards = size * size;
  const numberOfPairs = Math.floor(numberOfCards / 2);
  let cards = [];
  for (let i = 0; i < numberOfPairs; i++) {
    cards.push(symbols[i]);
    cards.push(symbols[i]);
  }
  if (needsWild) {
    cards.push("WILD");
  }
  return shuffle(cards);
}
function draw() {
  const level = levels[curLvl];
  grid.innerHTML = "";
  grid.className = "grid" + level.size;
  const cards = makeCards(level.size, level.wild);
  cards.forEach(function(symbol) {
    const card = document.createElement("button");
    card.className = "card";
    card.dataset.symbol = symbol;
    card.innerHTML =
      '<div class="inside">' +
        '<div class="front"></div>' +
        '<div class="back">' + symbol + '</div>' +
      '</div>';
    card.addEventListener("click", function() {
      flip(card);
	});
    grid.appendChild(card);
  });
}
function flip(card) {
  if (locked) {
    return;
  }
  if (card === firstCard) {
    return;
  }
  if (card.classList.contains("found")) {
    return;
  }
  card.classList.add("show");
  if (firstCard === null) {
    firstCard = card;
    return;
  }
  secondCard = card;
  moves++;
  movesTxt.textContent = moves;
  checkCards();
}
function checkCards() {
  const firstSymbol = firstCard.dataset.symbol;
  const secondSymbol = secondCard.dataset.symbol;
  if (firstSymbol === "WILD" || secondSymbol === "WILD") {
    wildMove();
    return;
  }
  if (firstSymbol === secondSymbol) {
    matched();
  } else {
    notMatch();
  }
}
function matched() {
  firstCard.classList.add("found");
  secondCard.classList.add("found");
  matches++;
  matchTxt.textContent = matches;
  clearCards();
  var level = levels[curLvl];
  var total = level.size * level.size;
  var needed = Math.floor(total / 2);
  if (matches == needed) {
    won();
  }
}
function notMatch() {
  locked = true;
  setTimeout(function() {
    firstCard.classList.remove("show");
    secondCard.classList.remove("show");
    clearCards();
  }, 700);
}
function wildMove() {
  locked = true;
  setTimeout(function() {
    firstCard.classList.add("found");
    secondCard.classList.add("found");
    matches++;
    matchTxt.textContent = matches;
    clearCards();
    const level = levels[curLvl];
    const neededMatches = Math.floor((level.size * level.size) / 2);
    if (matches === neededMatches) {
      won();
	}
  }, 300);
}
function clearCards() {
  firstCard = null;
  secondCard = null;
  locked = false;
}
function startGame(level) {
  curLvl = level;
  lvlName.textContent = levels[level].name;
  resetGame();
  draw();
  showPage("gamePage");
  startTimer();
}
function won() {
  stopTimer();
  const wasNewRecord = saveScore(secs);
  finalTxt.textContent = "Time: " + timeStr(secs);
  if (wasNewRecord) {
    recordTxt.textContent = "NEW PERSONAL RECORD!";
  } else {
    recordTxt.textContent = "Good run!";
  }
  winPop.classList.remove("hidden");
}
function closePop() {
  winPop.classList.add("hidden");
}
function loadScores() {
  const scores = getScores();
  const names = [
    ["easy", "Easy"],
    ["medium", "Medium"],
    ["hard", "Hard"],
    ["master", "Master"],
    ["grand", "Grand Master"]
  ];
  scoreList.innerHTML = "";
  names.forEach(function(level) {
    const row = document.createElement("div");
    row.className = "score";
    let savedTime = "--:--";
    if (scores[level[0]] !== null) {
      savedTime = timeStr(scores[level[0]]);
	}
    var name = level[1];
    var txt = savedTime;
    row.innerHTML = "<strong>" + name + "</strong>";
    row.innerHTML += "<span>" + txt + "</span>";
    scoreList.appendChild(row);
  });
}
startBtn.addEventListener("click", function() {
  showPage("levelPage");
});
scoresBtn.addEventListener("click", function() {
  loadScores();
  showPage("scoresPage");
});
rulesBtn.addEventListener("click", function() {
  showPage("rulesPage");
});
lvlBtns.forEach(function(button) {
  button.addEventListener("click", function() {
    startGame(button.dataset.level);
  });
});
backBtns.forEach(function(button) {
  button.addEventListener("click", function() {
    stopTimer();
    closePop();
    showPage(button.dataset.go);
  });
});
restartBtn.addEventListener("click", function() {
  startGame(curLvl);
});
leaveBtn.addEventListener("click", function() {
  stopTimer();
  showPage("homePage");
});
againBtn.addEventListener("click", function() {
  closePop();
  startGame(curLvl);
});
menuBtn.addEventListener("click", function() {
  closePop();
  showPage("homePage");
});
clearBtn.addEventListener("click", function() {
  localStorage.removeItem("neonMemoryScores");
  loadScores();
});
