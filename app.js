// 國語小練習 — 純 HTML/JS，無外部依賴，題型每次隨機混合
const WORDS = [
  '作夢', '黑雲', '躺在', '自己', '變成', '黑天鵝', '棉花糖', '變得', '更漂亮', '妹妹的紅雨鞋',
  '一雙', '穿上', '雨滴', '玩遊戲', '一顆顆', '小珍珠', '一落下', '水面', '大魚缸', '紅金魚',
  '游過去', '來', '太陽', '國王', '要大掃除', '洗淨', '高高低低', '馬路', '很認真', '大樹',
  '葉子', '刷亮', '七彩的虹', '送給他們', '跑跑跳跳', '說說笑笑', '每件事情', '躺在', '草地', '變化',
  '好有趣', '拉著', '長長的', '線', '放風箏', '升得', '高', '好神奇', '下課時', '知道',
  '嗎', '記得', '今天是', '生日快樂', '謝謝', '第一次', '這', '放學時', '我', '收到',
  '一張', '生日卡片', '祝福', '跑', '路燈', '在我', '前面', '快一點', '一半', '到',
  '不太', '清楚', '停下來', '誰快', '誰慢', '分不出', '休息', '一會兒', '路燈', '吧', '加油',
];

// 這份清單其實是5篇不同短文片段接在一起，排序題只能在同一段落內出題，不能跨段
// [起點, 終點]（皆為 WORDS 的索引，閉區間）
const SEGMENTS = [
  [0, 22],   // 夢見自己變成黑天鵝、棉花糖、小珍珠、紅金魚...
  [23, 36],  // 國王大掃除：洗淨馬路、刷亮樹葉、彩虹送人
  [37, 47],  // 躺草地放風箏
  [48, 62],  // 收到生日卡片
  [63, 80],  // 跟路燈賽跑
];

// 高信心量詞配對（從題目原文可推得）
const CLASSIFIERS = [
  { word: '雨鞋', answer: '雙' },
  { word: '珍珠', answer: '顆' },
  { word: '生日卡片', answer: '張' },
  { word: '黑天鵝', answer: '隻' },
];
const CLASSIFIER_OPTIONS = ['雙', '顆', '張', '隻'];

function hasRepeatChar(word) {
  for (let i = 0; i < word.length - 1; i++) {
    if (word[i] === word[i + 1]) return true;
  }
  return false;
}
const REDUP_WORDS = WORDS.filter(hasRepeatChar);
const PLAIN_WORDS = WORDS.filter(w => !hasRepeatChar(w));

const TOTAL_QUESTIONS = 10;
let state = { index: 0, score: 0, questions: [] };

function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
function pickRandom(arr, n) {
  return shuffle(arr).slice(0, n);
}

function genOrderQuestion() {
  const [segStart, segEnd] = SEGMENTS[Math.floor(Math.random() * SEGMENTS.length)];
  const segLen = segEnd - segStart + 1;
  const len = Math.min(Math.floor(Math.random() * 2) + 4, segLen); // 4-5 個詞，不超過該段長度
  const start = segStart + Math.floor(Math.random() * (segLen - len + 1));
  const correct = WORDS.slice(start, start + len);
  return { type: 'order', correct, shuffled: shuffle(correct) };
}
function genClassifierQuestion() {
  const item = CLASSIFIERS[Math.floor(Math.random() * CLASSIFIERS.length)];
  return { type: 'classifier', word: item.word, answer: item.answer, options: shuffle(CLASSIFIER_OPTIONS) };
}
function genRedupQuestion() {
  const correct = REDUP_WORDS[Math.floor(Math.random() * REDUP_WORDS.length)];
  const distractors = pickRandom(PLAIN_WORDS.filter(w => w !== correct), 3);
  return { type: 'redup', answer: correct, options: shuffle([correct, ...distractors]) };
}

function genQuestion() {
  const types = [genOrderQuestion, genClassifierQuestion, genRedupQuestion];
  return types[Math.floor(Math.random() * types.length)]();
}

const app = document.getElementById('app');

function renderStart() {
  app.innerHTML = `
    <h1>📚 國語小練習</h1>
    <div class="sub">每次題目都不一樣，加油！</div>
    <div class="card">
      <div class="btn primary" id="startBtn">開始練習 ▶️</div>
      <div class="sub" id="adminLink" style="margin-top:14px; text-decoration:underline; cursor:pointer;">🔧 題庫總覽（家長／老師用）</div>
    </div>
  `;
  document.getElementById('startBtn').onclick = startQuiz;
  document.getElementById('adminLink').onclick = renderAdmin;
}

function renderAdmin() {
  const segmentsHtml = SEGMENTS.map((seg, i) => {
    const text = WORDS.slice(seg[0], seg[1] + 1).join('、');
    return `<div style="margin-bottom:10px;"><b>段落 ${i + 1}：</b>${text}</div>`;
  }).join('');
  const classifierHtml = CLASSIFIERS.map(c => `<div>一（${c.answer}）${c.word}</div>`).join('');
  const redupHtml = `<div>${REDUP_WORDS.join('、')}</div>`;
  app.innerHTML = `
    <h1>🔧 題庫總覽</h1>
    <div class="card">
      <div class="question" style="font-size:18px; text-align:left;">📑 排序題段落（每題從同一段落內抽4-5個詞）</div>
      <div style="font-size:16px; line-height:1.8; color:#444;">${segmentsHtml}</div>
    </div>
    <div class="card">
      <div class="question" style="font-size:18px; text-align:left;">📏 量詞配對題</div>
      <div style="font-size:16px; line-height:1.8; color:#444;">${classifierHtml}</div>
    </div>
    <div class="card">
      <div class="question" style="font-size:18px; text-align:left;">🔁 疊字詞題（正確答案候選）</div>
      <div style="font-size:16px; line-height:1.8; color:#444;">${redupHtml}</div>
    </div>
    <div class="btn primary" id="backBtn">⬅️ 返回</div>
  `;
  document.getElementById('backBtn').onclick = renderStart;
}

function startQuiz() {
  state = { index: 0, score: 0, questions: Array.from({ length: TOTAL_QUESTIONS }, genQuestion) };
  renderQuestion();
}

function renderQuestion() {
  const q = state.questions[state.index];
  const header = `
    <div class="progress">第 ${state.index + 1} 題 / 共 ${TOTAL_QUESTIONS} 題</div>
    <div class="score">目前分數：${state.score}</div>
  `;
  if (q.type === 'order') renderOrderQuestion(header, q);
  else if (q.type === 'classifier') renderClassifierQuestion(header, q);
  else renderRedupQuestion(header, q);
}

function renderOrderQuestion(header, q) {
  app.innerHTML = `
    ${header}
    <div class="card">
      <div class="question">依照正確順序，把詞語排好！</div>
      <div class="slots" id="slots"></div>
      <div class="chips" id="chips"></div>
      <div class="feedback" id="fb"></div>
    </div>
  `;
  const slotsEl = document.getElementById('slots');
  const chipsEl = document.getElementById('chips');
  const answer = [];
  const slotEls = q.correct.map(() => {
    const s = document.createElement('div');
    s.className = 'slot empty';
    slotsEl.appendChild(s);
    return s;
  });

  let locked = false;
  q.shuffled.forEach((word, i) => {
    const chip = document.createElement('div');
    chip.className = 'chip';
    chip.textContent = word;
    chip.onclick = () => {
      if (locked || chip.classList.contains('used') || answer.length >= q.correct.length) return;
      chip.classList.add('used');
      answer.push(word);
      slotEls[answer.length - 1].textContent = word;
      slotEls[answer.length - 1].className = 'slot';
      if (answer.length === q.correct.length) {
        locked = true;
        const ok = answer.every((w, idx) => w === q.correct[idx]);
        showFeedback(ok, q.correct.join('、'));
      }
    };
    chipsEl.appendChild(chip);
  });
}

function renderClassifierQuestion(header, q) {
  app.innerHTML = `
    ${header}
    <div class="card">
      <div class="question">一（　）${q.word}<br>該填哪個量詞？</div>
      <div id="choices"></div>
      <div class="feedback" id="fb"></div>
    </div>
  `;
  renderChoices(q.options, q.answer);
}

function renderRedupQuestion(header, q) {
  app.innerHTML = `
    ${header}
    <div class="card">
      <div class="question">哪一個是「疊字詞」（重複字）？</div>
      <div id="choices"></div>
      <div class="feedback" id="fb"></div>
    </div>
  `;
  renderChoices(q.options, q.answer);
}

function renderChoices(options, answer) {
  const box = document.getElementById('choices');
  let locked = false;
  options.forEach(opt => {
    const el = document.createElement('div');
    el.className = 'choice';
    el.textContent = opt;
    el.onclick = () => {
      if (locked) return;
      locked = true;
      const ok = opt === answer;
      el.classList.add(ok ? 'correct' : 'wrong');
      if (!ok) {
        [...box.children].forEach(c => { if (c.textContent === answer) c.classList.add('correct'); });
      }
      showFeedback(ok, answer);
    };
    box.appendChild(el);
  });
}

function showFeedback(ok, correctText) {
  if (ok) state.score++;
  const fb = document.getElementById('fb');
  fb.className = 'feedback ' + (ok ? 'ok' : 'bad');
  fb.textContent = ok ? '✅ 答對了！' : `❌ 正確答案：${correctText}`;
  const card = document.querySelector('.card');
  const nextBtn = document.createElement('div');
  nextBtn.className = 'btn primary';
  nextBtn.textContent = state.index + 1 < TOTAL_QUESTIONS ? '下一題 ➡️' : '看結果 🎉';
  nextBtn.onclick = () => {
    state.index++;
    if (state.index < TOTAL_QUESTIONS) renderQuestion();
    else renderResult();
  };
  card.appendChild(nextBtn);
}

function renderResult() {
  const pct = state.score / TOTAL_QUESTIONS;
  const msg = pct >= 0.8 ? '太厲害了！🌟' : pct >= 0.5 ? '不錯喔，繼續加油！💪' : '再練習一次就會更好！😊';
  app.innerHTML = `
    <h1>📚 國語小練習</h1>
    <div class="card">
      <div class="question">完成了！<br>得分：${state.score} / ${TOTAL_QUESTIONS}</div>
      <div class="sub">${msg}</div>
      <div class="btn primary" id="againBtn">再玩一次 🔁</div>
    </div>
  `;
  document.getElementById('againBtn').onclick = startQuiz;
}

renderStart();
