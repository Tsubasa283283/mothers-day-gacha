// ===== カプセルデータ（ここを書き換えてください） =====
const capsules = [
  { id:  1, title: "いつもありがとう",   rarity: "normal", message: "いつも見守ってくれてありがとう。\n普段はなかなか素直に言えないけど、マミーがいてくれることが、僕にとって大きな安心になっています。", collected: false },
  { id:  2, title: "料理の魔法",         rarity: "normal", message: "実家で食べていたご飯が、どれだけありがたかったのか、一人暮らしをしてからよく分かるようになりました。\n何気ない食卓の時間も、今思えば大切な思い出です。", collected: false },
  { id:  3, title: "優しい声",           rarity: "normal", message: "何気なくかけてくれる言葉に、何度も支えられてきました。\nマミーの声には、不思議と安心できる力があります。", collected: false },
  { id:  4, title: "あの日の思い出",     rarity: "normal", message: "一緒に過ごした何気ない時間が、今でもふと思い出になることがあります。\n特別な日だけじゃなく、普通の日々の中に、たくさんの幸せがありました。", collected: false },
  { id:  5, title: "心配性なマミーへ",   rarity: "normal", message: "正直マミーの心配性がすごくてもういいよって思うくらい気にかけてくれることがたくさんありました。でもその度にちゃんと愛されてるなぁと感じます。", collected: false },
  { id:  6, title: "マミーの笑顔",       rarity: "normal", message: "マミーが笑っていると、家の空気が明るくなる気がします。\nこれからも、無理しすぎず、たくさん笑っていてほしいです。", collected: false },
  { id:  7, title: "心強かった日",       rarity: "normal", message: "不安な時や迷った時、マミーがいてくれるだけで心強かったです。\nちゃんと味方でいてくれる人がいることは、僕にとって本当に大きな支えでした。", collected: false },
  { id:  8, title: "一緒にいた時間",     rarity: "normal", message: "一緒に過ごした時間は、派手ではなくても、僕の中にちゃんと残っています。\nシフォンとの時間、車で話す時間、ネトフリ一緒に見る時間、マミーとどっかご飯食べに行く時間。\nその積み重ねが、今の僕を作ってくれたんだと思います。", collected: false },
  { id:  9, title: "なんでもない日",     rarity: "normal", message: "なんでもない日常の中に、マミーの優しさがたくさんありました。\n当たり前みたいに過ごしていた時間ほど、物理的な距離が離れた今は大切に感じます。", collected: false },
  { id: 10, title: "大切な話",           rarity: "rare",   message: "マミーが教えてくれたことや、何気なく話してくれたことは、今でも僕の中に残っています。\nこれからの人生でも、立ち止まった時は、その言葉を少しずつ思い出しながら進んでいきたいと思います。", collected: false },
  { id: 11, title: "ずっと言えなかった", rarity: "rare",   message: "照れくさくて、ちゃんと言えなかったけど、本当に感謝しています。\nいまでも、友達と家族の話になって、インスタの弁当の投稿を見せてすごいって言われると僕も嬉しい。\nマミーがいてくれたから、僕はここまで来ることができました。", collected: false },
  { id: 12, title: "世界一のマミーへ",   rarity: "rare",   message: "いつもありがとう。\n完璧な言葉では伝えきれないけど、僕にとってマミーは世界で一人だけの大切な存在です。\nこれからも元気で、たくさん笑っていてください。心配かけないようにできるだけ健康にも気をつけます。", collected: false },
];

// ===== 最後の手紙（ここを書き換えてください） =====
const finalLetter = {
  greeting: "マミーへ",
  body:
`全部のカプセルを集めてくれてありがとう。

ここに、すべてのカプセルを集めた
マミーへの長めの手紙本文を書きます。

いつもありがとう。大好きだよ。`,
  sign: "あなたの子より",
  date: "2026年 母の日に",
};

// ===== State =====
let drawCount = 0;
let lastDrawnId = null;

// ===== Init =====
document.addEventListener("DOMContentLoaded", () => {
  renderGrid();
  updateStatus();
  bindEvents();
});

function bindEvents() {
  document.getElementById("gachaBtn").addEventListener("click", draw);

  // トレイのカプセルをクリックすると手紙を開く
  document.getElementById("trayCap").addEventListener("click", () => {
    const tray = document.getElementById("trayCap");
    const id = parseInt(tray.dataset.id);
    if (!id) return;
    const fresh = tray.dataset.fresh === "1";
    tray.dataset.fresh = "0";
    openLetter(id, fresh);
  });

  // 手紙モーダルを閉じる
  document.getElementById("letterClose").addEventListener("click", closeLetterModal);
  document.getElementById("letterOverlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) closeLetterModal();
  });

  // 最後の手紙
  document.getElementById("finalBtn").addEventListener("click", showFinalLetter);
  document.getElementById("finalClose").addEventListener("click", () => {
    document.getElementById("finalOverlay").hidden = true;
  });
  document.getElementById("finalOverlay").addEventListener("click", (e) => {
    if (e.target === e.currentTarget) document.getElementById("finalOverlay").hidden = true;
  });
}

// ===== Gacha =====
function draw() {
  const capsule = selectCapsule();
  const isNew = !capsule.collected;

  capsule.collected = true;
  drawCount++;
  lastDrawnId = capsule.id;

  document.getElementById("gachaBtn").disabled = true;

  animateMachine(capsule, isNew, () => {
    document.getElementById("gachaBtn").disabled = false;
    updateStatus();
    renderGrid();
    if (isNew) flashGridItem(capsule.id);
    // コンプリートは最後の新規カプセル取得時のみ
    if (isNew && capsules.every(c => c.collected)) {
      setTimeout(celebrate, 200);
    }
  });
}

function selectCapsule() {
  const uncollected = capsules.filter(c => !c.collected && c.id !== lastDrawnId);
  const others      = capsules.filter(c => c.id !== lastDrawnId);
  // 未入手が70%優先、なければ直前以外から、それもなければ全体から
  const pool =
    uncollected.length > 0 && Math.random() < 0.7 ? uncollected :
    others.length > 0 ? others : capsules;
  return pool[Math.floor(Math.random() * pool.length)];
}

function animateMachine(capsule, isNew, callback) {
  const machine = document.getElementById("gachaMachine");
  const tray    = document.getElementById("trayCap");

  // トレイのカプセルをリセット（アニメ再起動のため）
  tray.className = "tray-cap" + (capsule.rarity === "rare" ? " rare" : "");
  tray.dataset.id    = capsule.id;
  tray.dataset.fresh = isNew ? "1" : "0";
  void tray.offsetWidth; // reflow でアニメをリセット

  machine.classList.add("shake");
  setTimeout(() => {
    machine.classList.remove("shake");
    tray.classList.add("pop");
    setTimeout(callback, 600);
  }, 660);
}

// ===== Grid =====
function renderGrid() {
  const grid = document.getElementById("capsulesGrid");
  grid.innerHTML = "";
  capsules.forEach(c => {
    const div = document.createElement("div");
    div.className = "capsule-item" +
      (c.collected ? " collected" + (c.rarity === "rare" ? " rare" : "") : " locked");
    div.dataset.id = c.id;

    if (c.collected) {
      div.innerHTML =
        `<div class="grid-cap"><div class="cap-top"></div><div class="cap-bottom"></div></div>` +
        `<span class="cap-lbl">${c.title}</span>` +
        (c.rarity === "rare" ? `<span class="cap-rare-lbl">✨ RARE</span>` : "");
      div.addEventListener("click", () => openLetter(c.id, false));
    } else {
      div.innerHTML = `<div class="lock-q">？</div><span class="cap-lbl">???</span>`;
    }
    grid.appendChild(div);
  });
}

function flashGridItem(id) {
  const el = document.querySelector(`.capsule-item[data-id="${id}"]`);
  if (!el) return;
  el.classList.add("new-flash");
  el.addEventListener("animationend", () => el.classList.remove("new-flash"), { once: true });
}

// ===== Status =====
function updateStatus() {
  const n   = capsules.filter(c => c.collected).length;
  const pct = Math.round((n / capsules.length) * 100);
  document.getElementById("collectedCount").textContent = n;
  document.getElementById("drawCount").textContent      = drawCount;
  document.getElementById("progressFill").style.width   = pct + "%";
  document.getElementById("statusPct").textContent      = `コンプリート率 ${pct}%`;
}

// ===== Letter Modal =====
function openLetter(id, isNew) {
  const c     = capsules.find(x => x.id === id);
  const badge = document.getElementById("letterBadge");
  const card  = document.getElementById("letterCard");

  badge.className = "modal-badge";
  card.classList.remove("rare-card");

  if (c.rarity === "rare") {
    badge.textContent = "✨ RARE ✨";
    badge.classList.add("is-rare");
    card.classList.add("rare-card");
  } else if (isNew) {
    badge.textContent = "NEW";
    badge.classList.add("is-new");
  } else {
    badge.textContent = "もう一度読めます";
    badge.classList.add("is-seen");
  }

  document.getElementById("letterTitle").textContent = c.title;
  document.getElementById("letterBody").textContent  = c.message;
  document.getElementById("letterOverlay").hidden    = false;
}

function closeLetterModal() {
  document.getElementById("letterOverlay").hidden = true;
}

// ===== Final Letter =====
function showFinalLetter() {
  document.getElementById("finalLetterContent").innerHTML =
    `<p class="letter-greeting">${finalLetter.greeting}</p>` +
    `<p class="letter-body">${finalLetter.body.replace(/\n/g, "<br>")}</p>` +
    `<p class="letter-sign">${finalLetter.sign}</p>` +
    `<p class="letter-date">${finalLetter.date}</p>`;
  document.getElementById("finalOverlay").hidden = false;
}

// ===== Celebrate =====
function celebrate() {
  // 最後の手紙エリアをアンロック
  document.getElementById("finalLocked").hidden   = true;
  document.getElementById("finalUnlocked").hidden = false;
  document.getElementById("finalUnlocked").scrollIntoView({ behavior: "smooth", block: "center" });

  // 紙吹雪
  const colors = ["#f0a0b8","#fde8ef","#d4a855","#e07898","#ffccd5","#ffd6a5","#ffe4ec"];
  for (let i = 0; i < 40; i++) {
    const el = document.createElement("div");
    el.className = "confetti";
    const sz = 6 + Math.random() * 8;
    el.style.cssText =
      `left:${Math.random() * 100}vw;` +
      `background:${colors[Math.floor(Math.random() * colors.length)]};` +
      `width:${sz}px;height:${sz}px;` +
      `border-radius:${Math.random() > .5 ? "50%" : "3px"};` +
      `animation-duration:${1.5 + Math.random() * 1.5}s;` +
      `animation-delay:${Math.random() * .8}s;`;
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 3800);
  }
}
