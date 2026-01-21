/* =====================
   🎵 音樂系統
===================== */
const bgm = new Audio("assets/bgm.mp3");
bgm.loop = true;
bgm.volume = 0.5;

const winSound = new Audio("assets/win.mp3");
winSound.volume = 0.8;

let bgmStarted = false;

/* 使用者首次互動後啟動 BGM */
function startBGMOnce() {
  if (bgmStarted) return;
  bgmStarted = true;
  bgm.play().catch(() => {});
}



const pegs = document.querySelectorAll(".peg");
const goalText = document.getElementById("goalText");
const message = document.getElementById("message");

/* 蛋資料（大 → 小） */
const blocksData = [
  { size: 4, src: "assets/sancedan.png", scale: 1 },
  { size: 3, src: "assets/hebaodan.png", scale: 0.8 },
  { size: 2, src: "assets/curryfish.png", scale: 0.65 },
  { size: 1, src: "assets/eggbao.png", scale: 0.45 }
];

let selectedBlock = null;
let stage = 1;

/* 初始化 */
blocksData.forEach(data => {
  const img = document.createElement("img");
  img.src = data.src;
  img.className = "block";
  img.dataset.size = data.size;
  img.style.height = `${180 * data.scale}px`;
  img.style.zIndex = data.size * 10;

  img.addEventListener("click", e => {
    e.stopPropagation();
    startBGMOnce();   // 🎵 啟動背景音樂（只會一次）
    if (!img.classList.contains("active")) return;
    selectBlock(img);
  });

  pegs[0].appendChild(img);
});

updateActive();

/* 選取 */
function selectBlock(block) {
  clearSelection();
  selectedBlock = block;
  block.classList.add("selected");
}

/* 點擊 peg */
pegs.forEach((peg, idx) => {
  peg.addEventListener("click", () => moveToPeg(idx));
});

function moveToPeg(idx) {
  if (!selectedBlock) return;

  const peg = pegs[idx];
  const top = peg.querySelector(".block:last-of-type");
  const movingSize = Number(selectedBlock.dataset.size);

  if (top && Number(top.dataset.size) < movingSize) {
    message.textContent = "⚠️ 大蛋不能壓小蛋";
    return;
  }

  peg.appendChild(selectedBlock);
  clearSelection();
  selectedBlock = null;
  message.textContent = "";

  updateActive();
  checkGoal();
}

/* 更新可操作 */
function updateActive() {
  document.querySelectorAll(".block").forEach(b => b.classList.remove("active"));
  pegs.forEach(peg => {
    const top = peg.querySelector(".block:last-of-type");
    if (top) top.classList.add("active");
  });
}

function clearSelection() {
  document.querySelectorAll(".block").forEach(b => b.classList.remove("selected"));
}

/* 任務 */
function countBlocks(peg) {
  return peg.querySelectorAll(".block").length;
}

function checkGoal() {
  if (stage === 1 && countBlocks(pegs[1]) === 4) {
    stage = 2;
    goalText.textContent = "目標二：將蛋塔移動到右邊";
    message.textContent = "✨ 目標一完成";
  }

  if (stage === 2 && countBlocks(pegs[2]) === 4) {
    message.textContent = "塔心已開啟，守護者獻上通行證";
    // 🎵 停止背景音樂
    bgm.pause();
    bgm.currentTime = 0;

    // 🎵 播放破關音樂（一次）
    winSound.play().catch(() => {});
    document.getElementById("congrats").style.display = "flex";
  }
}
