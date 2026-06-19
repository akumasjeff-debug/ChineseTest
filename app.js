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

// 高信心量詞配對（從題目原文可推得）
const CLASSIFIERS = [
  { word: '雨鞋', answer: '雙' },
  { word: '珍珠', answer: '顆' },
  { word: '生日卡片', answer: '張' },
  { word: '黑天鵝', answer: '隻' },
];
const CLASSIFIER_OPTIONS = ['雙', '顆', '張', '隻'];

// 單字注音對照表（涵蓋題庫內所有出現過的字）
const ZHUYIN = {
  作: 'ㄗㄨㄛˋ', 夢: 'ㄇㄥˋ', 黑: 'ㄏㄟ', 雲: 'ㄩㄣˊ', 躺: 'ㄊㄤˇ', 在: 'ㄗㄞˋ', 自: 'ㄗˋ', 己: 'ㄐㄧˇ',
  變: 'ㄅㄧㄢˋ', 成: 'ㄔㄥˊ', 天: 'ㄊㄧㄢ', 鵝: 'ㄜˊ', 棉: 'ㄇㄧㄢˊ', 花: 'ㄏㄨㄚ', 糖: 'ㄊㄤˊ',
  得: 'ㄉㄜˊ', 更: 'ㄍㄥˋ', 漂: 'ㄆㄧㄠˋ', 亮: 'ㄌㄧㄤˋ', 妹: 'ㄇㄟˋ', 的: '˙ㄉㄜ', 紅: 'ㄏㄨㄥˊ',
  雨: 'ㄩˇ', 鞋: 'ㄒㄧㄝˊ', 一: 'ㄧ', 雙: 'ㄕㄨㄤ', 穿: 'ㄔㄨㄢ', 上: 'ㄕㄤˋ', 滴: 'ㄉㄧ', 玩: 'ㄨㄢˊ',
  遊: 'ㄧㄡˊ', 戲: 'ㄒㄧˋ', 顆: 'ㄎㄜ', 小: 'ㄒㄧㄠˇ', 珍: 'ㄓㄣ', 珠: 'ㄓㄨ', 落: 'ㄌㄨㄛˋ', 下: 'ㄒㄧㄚˋ',
  水: 'ㄕㄨㄟˇ', 面: 'ㄇㄧㄢˋ', 大: 'ㄉㄚˋ', 魚: 'ㄩˊ', 缸: 'ㄍㄤ', 金: 'ㄐㄧㄣ', 游: 'ㄧㄡˊ', 過: 'ㄍㄨㄛˋ',
  去: 'ㄑㄩˋ', 來: 'ㄌㄞˊ', 太: 'ㄊㄞˋ', 陽: 'ㄧㄤˊ', 國: 'ㄍㄨㄛˊ', 王: 'ㄨㄤˊ', 要: 'ㄧㄠˋ', 掃: 'ㄙㄠˇ',
  除: 'ㄔㄨˊ', 洗: 'ㄒㄧˇ', 淨: 'ㄐㄧㄥˋ', 高: 'ㄍㄠ', 低: 'ㄉㄧ', 馬: 'ㄇㄚˇ', 路: 'ㄌㄨˋ', 很: 'ㄏㄣˇ',
  認: 'ㄖㄣˋ', 真: 'ㄓㄣ', 樹: 'ㄕㄨˋ', 葉: 'ㄧㄝˋ', 子: 'ㄗˇ', 刷: 'ㄕㄨㄚ', 七: 'ㄑㄧ', 彩: 'ㄘㄞˇ',
  虹: 'ㄏㄨㄥˊ', 送: 'ㄙㄨㄥˋ', 給: 'ㄍㄟˇ', 他: 'ㄊㄚ', 們: '˙ㄇㄣ', 跑: 'ㄆㄠˇ', 跳: 'ㄊㄧㄠˋ',
  說: 'ㄕㄨㄛ', 笑: 'ㄒㄧㄠˋ', 每: 'ㄇㄟˇ', 件: 'ㄐㄧㄢˋ', 事: 'ㄕˋ', 情: 'ㄑㄧㄥˊ', 草: 'ㄘㄠˇ', 地: 'ㄉㄧˋ',
  化: 'ㄏㄨㄚˋ', 好: 'ㄏㄠˇ', 有: 'ㄧㄡˇ', 趣: 'ㄑㄩˋ', 拉: 'ㄌㄚ', 著: '˙ㄓㄜ', 長: 'ㄔㄤˊ', 線: 'ㄒㄧㄢˋ',
  放: 'ㄈㄤˋ', 風: 'ㄈㄥ', 箏: 'ㄓㄥ', 升: 'ㄕㄥ', 神: 'ㄕㄣˊ', 奇: 'ㄑㄧˊ', 課: 'ㄎㄜˋ', 時: 'ㄕˊ',
  知: 'ㄓ', 道: 'ㄉㄠˋ', 嗎: '˙ㄇㄚ', 記: 'ㄐㄧˋ', 今: 'ㄐㄧㄣ', 是: 'ㄕˋ', 生: 'ㄕㄥ', 日: 'ㄖˋ',
  快: 'ㄎㄨㄞˋ', 樂: 'ㄌㄜˋ', 謝: 'ㄒㄧㄝˋ', 第: 'ㄉㄧˋ', 次: 'ㄘˋ', 這: 'ㄓㄜˋ', 學: 'ㄒㄩㄝˊ', 我: 'ㄨㄛˇ',
  收: 'ㄕㄡ', 到: 'ㄉㄠˋ', 張: 'ㄓㄤ', 卡: 'ㄎㄚˇ', 片: 'ㄆㄧㄢˋ', 祝: 'ㄓㄨˋ', 福: 'ㄈㄨˊ', 燈: 'ㄉㄥ',
  前: 'ㄑㄧㄢˊ', 點: 'ㄉㄧㄢˇ', 半: 'ㄅㄢˋ', 不: 'ㄅㄨˋ', 清: 'ㄑㄧㄥ', 楚: 'ㄔㄨˇ', 停: 'ㄊㄧㄥˊ', 誰: 'ㄕㄟˊ',
  慢: 'ㄇㄢˋ', 分: 'ㄈㄣ', 出: 'ㄔㄨ', 休: 'ㄒㄧㄡ', 息: 'ㄒㄧˊ', 會: 'ㄏㄨㄟˋ', 兒: 'ㄦˊ', 吧: '˙ㄅㄚ',
  加: 'ㄐㄧㄚ', 油: 'ㄧㄡˊ',
};

function hasRepeatChar(word) {
  for (let i = 0; i < word.length - 1; i++) {
    if (word[i] === word[i + 1]) return true;
  }
  return false;
}
const REDUP_WORDS = WORDS.filter(hasRepeatChar);
const ALL_CHARS = Object.keys(ZHUYIN);

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

function genZhuyinQuestion() {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  const char = word[Math.floor(Math.random() * word.length)];
  const answer = ZHUYIN[char];
  const distractorChars = pickRandom(ALL_CHARS.filter(c => ZHUYIN[c] !== answer), 3);
  const options = shuffle([answer, ...distractorChars.map(c => ZHUYIN[c])]);
  return { type: 'zhuyin', word, char, answer, options, key: `zhuyin:${char}` };
}
function genClassifierQuestion() {
  const item = CLASSIFIERS[Math.floor(Math.random() * CLASSIFIERS.length)];
  return { type: 'classifier', word: item.word, answer: item.answer, options: shuffle(CLASSIFIER_OPTIONS), key: `classifier:${item.word}` };
}
function genRedupQuestion() {
  const correct = REDUP_WORDS[Math.floor(Math.random() * REDUP_WORDS.length)];
  const distractors = pickRandom(WORDS.filter(w => !hasRepeatChar(w) && w !== correct), 3);
  return { type: 'redup', answer: correct, options: shuffle([correct, ...distractors]), key: `redup:${correct}` };
}

function genQuestion() {
  const types = [genZhuyinQuestion, genClassifierQuestion, genRedupQuestion];
  return types[Math.floor(Math.random() * types.length)]();
}

function genQuestionSet() {
  const set = [];
  const seenKeys = [];
  let guard = 0;
  while (set.length < TOTAL_QUESTIONS && guard < TOTAL_QUESTIONS * 30) {
    guard++;
    const q = genQuestion();
    if (seenKeys.includes(q.key)) continue; // 避免同一題（同一個字/詞）重複出現
    seenKeys.push(q.key);
    set.push(q);
  }
  return set;
}

function withRuby(text) {
  return Array.from(text).map(ch => {
    const zy = ZHUYIN[ch];
    return zy ? `<ruby>${ch}<rt style="font-size:11px;color:#888;">${zy}</rt></ruby>` : ch;
  }).join('');
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
  const wordsHtml = `<div style="line-height:2.2;">${WORDS.map(withRuby).join('、')}</div>`;
  const classifierHtml = CLASSIFIERS.map(c => `<div>一（${c.answer}）${withRuby(c.word)}</div>`).join('');
  const redupHtml = `<div style="line-height:2.2;">${REDUP_WORDS.map(withRuby).join('、')}</div>`;
  app.innerHTML = `
    <h1>🔧 題庫總覽</h1>
    <div class="card">
      <div class="question" style="font-size:18px; text-align:left;">📖 全部詞語（含注音）</div>
      <div style="font-size:20px; color:#444;">${wordsHtml}</div>
    </div>
    <div class="card">
      <div class="question" style="font-size:18px; text-align:left;">📏 量詞配對題</div>
      <div style="font-size:20px; color:#444;">${classifierHtml}</div>
    </div>
    <div class="card">
      <div class="question" style="font-size:18px; text-align:left;">🔁 疊字詞題（正確答案候選）</div>
      <div style="font-size:20px; color:#444;">${redupHtml}</div>
    </div>
    <div class="btn primary" id="backBtn">⬅️ 返回</div>
  `;
  document.getElementById('backBtn').onclick = renderStart;
}

function startQuiz() {
  state = { index: 0, score: 0, questions: genQuestionSet() };
  renderQuestion();
}

function renderQuestion() {
  const q = state.questions[state.index];
  const header = `
    <div class="progress">第 ${state.index + 1} 題 / 共 ${state.questions.length} 題</div>
    <div class="score">目前分數：${state.score}</div>
  `;
  if (q.type === 'zhuyin') renderZhuyinQuestion(header, q);
  else if (q.type === 'classifier') renderClassifierQuestion(header, q);
  else renderRedupQuestion(header, q);
}

function renderZhuyinQuestion(header, q) {
  app.innerHTML = `
    ${header}
    <div class="card">
      <div class="question">「${withRuby(q.word)}」這個詞裡<br>「<span style="color:#2a6fb0; font-size:32px;">${q.char}</span>」的正確注音是？</div>
      <div id="choices"></div>
      <div class="feedback" id="fb"></div>
    </div>
  `;
  renderChoices(q.options, q.answer);
}

function renderClassifierQuestion(header, q) {
  app.innerHTML = `
    ${header}
    <div class="card">
      <div class="question">一（　）${withRuby(q.word)}<br>該填哪個量詞？</div>
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
  renderChoices(q.options.map(withRuby), withRuby(q.answer));
}

function renderChoices(options, answer) {
  const box = document.getElementById('choices');
  let locked = false;
  options.forEach(opt => {
    const el = document.createElement('div');
    el.className = 'choice';
    el.innerHTML = opt;
    el.onclick = () => {
      if (locked) return;
      locked = true;
      const ok = opt === answer;
      el.classList.add(ok ? 'correct' : 'wrong');
      if (!ok) {
        [...box.children].forEach(c => { if (c.innerHTML === answer) c.classList.add('correct'); });
      }
      showFeedback(ok, answer);
    };
    box.appendChild(el);
  });
}

function showFeedback(ok, correctHtml) {
  if (ok) state.score++;
  const fb = document.getElementById('fb');
  fb.className = 'feedback ' + (ok ? 'ok' : 'bad');
  fb.innerHTML = ok ? '✅ 答對了！' : `❌ 正確答案：${correctHtml}`;
  const card = document.querySelector('.card');
  const nextBtn = document.createElement('div');
  nextBtn.className = 'btn primary';
  nextBtn.textContent = state.index + 1 < state.questions.length ? '下一題 ➡️' : '看結果 🎉';
  nextBtn.onclick = () => {
    state.index++;
    if (state.index < state.questions.length) renderQuestion();
    else renderResult();
  };
  card.appendChild(nextBtn);
}

function renderResult() {
  const pct = state.score / state.questions.length;
  const msg = pct >= 0.8 ? '太厲害了！🌟' : pct >= 0.5 ? '不錯喔，繼續加油！💪' : '再練習一次就會更好！😊';
  app.innerHTML = `
    <h1>📚 國語小練習</h1>
    <div class="card">
      <div class="question">完成了！<br>得分：${state.score} / ${state.questions.length}</div>
      <div class="sub">${msg}</div>
      <div class="btn primary" id="againBtn">再玩一次 🔁</div>
    </div>
  `;
  document.getElementById('againBtn').onclick = startQuiz;
}

renderStart();
