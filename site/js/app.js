// Ржачный JavaScript для котиков
const img = document.getElementById('cat-img');
const memeText = document.getElementById('meme');
const memeInput = document.getElementById('meme-input');
const jokesList = document.getElementById('jokes-list');
const thumbs = document.getElementById('thumbs');
const confetti = document.getElementById('confetti');
const ctx = confetti.getContext('2d');

const jokes = [
  '— Киса, ты кто по жизни? — Пушистый контролёр качества коробок.',
  'Кот — это жидкость: принимает форму любой коробки.',
  'Если на клавиатуре лежит кот — значит, документ уже сохранён. Навсегда.',
  'Зачем кот ест цветы? Для баланса: немного вегана в его крепком мяском сердце.',
  'Будильник не нужен, если у тебя есть миска, пустая в 06:00.',
  'Кот складывает лапки — а ты складывай задачи. Учись у мастера.',
  'Крошки на столе — это система координат кота.',
  'Кот видит в 5 утра тень от холодильника и такой: время охоты!',
  'Диета кота: ем, сплю, ещё раз проверяю миску. Повторять без конца.'
];

// Добавить несколько шуток при загрузке
function pushJoke() {
  const text = jokes[Math.floor(Math.random() * jokes.length)];
  const li = document.createElement('li');
  li.textContent = '😹 ' + text;
  jokesList.prepend(li);
}
for (let i=0; i<3; i++) pushJoke();

// Загрузка нового котика
async function fetchCat() {
  try {
    const r = await fetch('https://api.thecatapi.com/v1/images/search');
    const data = await r.json();
    if (Array.isArray(data) && data[0]?.url) {
      img.src = data[0].url;
      return;
    }
    throw new Error('No URL in The Cat API response');
  } catch (e) {
    // Fallback на placekitten
    const w = 600 + Math.floor(Math.random()*300);
    const h = 400 + Math.floor(Math.random()*200);
    img.src = `https://placekitten.com/${w}/${h}`;
  }
}

document.getElementById('btn-new').addEventListener('click', fetchCat);

// Подпись к мемчику
document.getElementById('btn-meme').addEventListener('click', () => {
  const text = memeInput.value.trim() || 'КОТИК ЛУЧШЕ ВСЕХ! 🐱';
  memeText.textContent = text.toUpperCase();
});

// Клик по картинке — маленькая тряска
img.addEventListener('click', () => {
  img.style.transition = 'transform .08s ease';
  img.style.transform = 'scale(1.04) rotate(.6deg)';
  setTimeout(() => {
    img.style.transform = '';
    img.style.transition = 'transform .3s ease';
  }, 120);
});

// Галерея миниатюр
function makeThumbs() {
  thumbs.innerHTML = '';
  for (let i=0; i<6; i++) {
    const w = 160 + Math.floor(Math.random()*60);
    const h = 110 + Math.floor(Math.random()*50);
    const t = document.createElement('img');
    t.src = `https://placekitten.com/${w}/${h}`;
    t.alt = 'Кот-мини';
    t.addEventListener('click', () => img.src = t.src);
    thumbs.appendChild(t);
  }
}
makeThumbs();

// Сохранение мема как изображения (через Canvas)
document.getElementById('btn-save').addEventListener('click', async () => {
  // Создаём canvas в памяти, рисуем картинку и текст
  const cv = document.createElement('canvas');
  const W = 800, H = 500;
  cv.width = W; cv.height = H;
  const c = cv.getContext('2d');

  // Загружаем текущее изображение (обход CORS может не сработать для некоторых доменов)
  try {
    const im = await loadImage(img.src);
    c.drawImage(im, 0, 0, W, H);
  } catch {
    // Если CORS не позволил — фоновая плашка
    c.fillStyle = '#22253e';
    c.fillRect(0,0,W,H);
  }

  // Текст мема
  const text = (memeText.textContent || 'КОТИК МЯУ').toUpperCase();
  c.font = 'bold 32px system-ui, -apple-system, Segoe UI, Roboto';
  c.textAlign = 'center';
  c.textBaseline = 'bottom';

  // Обводка для читабельности
  c.lineWidth = 6;
  c.strokeStyle = 'rgba(0,0,0,.6)';
  wrapTextStrokeFill(c, text, W/2, H-16, W-40, 36);

  // Скачать
  const a = document.createElement('a');
  a.download = 'meow-meme.png';
  a.href = cv.toDataURL('image/png');
  a.click();
});

function wrapTextStrokeFill(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  const lines = [];
  for (let n=0; n<words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && n > 0) {
      lines.push(line);
      line = words[n] + ' ';
    } else {
      line = testLine;
    }
  }
  lines.push(line);
  const totalH = lines.length * lineHeight;
  let yy = y - totalH + lineHeight;
  for (const l of lines) {
    ctx.strokeText(l.trim(), x, yy);
    ctx.fillStyle = '#fff';
    ctx.fillText(l.trim(), x, yy);
    yy += lineHeight;
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.crossOrigin = 'anonymous';
    im.onload = () => resolve(im);
    im.onerror = reject;
    im.src = url;
  });
}

// Пати‑режим: конфетти‑лапки
let party = false;
const paws = [];
const PAW_EMOJI = '🐾';
const MAX = 90;

function resizeCanvas(){
  confetti.width = window.innerWidth;
  confetti.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function spawnPaws(n=1){
  for (let i=0; i<n; i++) {
    paws.push({
      x: Math.random()*confetti.width,
      y: -20,
      vy: 1 + Math.random()*2.5,
      rot: Math.random()*Math.PI*2,
      vr: (Math.random()-0.5)*0.03,
      size: 14 + Math.random()*16,
      alpha: 0.8 + Math.random()*0.2
    });
  }
  if (paws.length > MAX) paws.splice(0, paws.length - MAX);
}

function draw(){
  if (!party) return;
  ctx.clearRect(0,0,confetti.width, confetti.height);
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  paws.forEach(p => {
    p.y += p.vy;
    p.rot += p.vr;
    ctx.save();
    ctx.globalAlpha = p.alpha;
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.font = `${p.size}px serif`;
    ctx.fillText(PAW_EMOJI, 0, 0);
    ctx.restore();
  });
  // Удаляем вышедшие за экран
  for (let i=paws.length-1; i>=0; i--) {
    if (paws[i].y > confetti.height + 40) paws.splice(i,1);
  }
  requestAnimationFrame(draw);
}

document.getElementById('btn-party').addEventListener('click', () => {
  party = !party;
  if (party) {
    spawnPaws(50);
    const iv = setInterval(() => party && spawnPaws(8), 180);
    confetti.dataset.timer = iv;
    draw();
  } else {
    clearInterval(confetti.dataset.timer);
    ctx.clearRect(0,0,confetti.width, confetti.height);
  }
});

// Стартовая загрузка котика лучше не блокировать UI
setTimeout(fetchCat, 200);
