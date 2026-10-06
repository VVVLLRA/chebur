// ====== ТОВАРЫ ======
// x, y — положение карточки на десктопном холсте (px макета 1512).
// src — картинка товара; ix, iy — её отступ от левого верхнего угла бежевой панели,
// iw, ih — размер картинки (всё в px макета, масштабируется само).
const PRODUCTS = [
  // кухня
  { cat: "kitchen", name: "чебурек",            x: 102,  y: 1663, src: "img/image-2.webp",              ix: -37, iy: -92,  iw: 440, ih: 489 },
  { cat: "kitchen", name: "посикунчик",         x: 597,  y: 1663, src: "img/image.webp",                ix: 18,  iy: -26,  iw: 384, ih: 391 },
  { cat: "kitchen", name: "бублик",             x: 1085, y: 1663, src: "img/image-photoroom-71-2.webp", ix: -39, iy: -51,  iw: 442, ih: 416 },
  { cat: "kitchen", name: "самса",              x: -9,   y: 2349, src: "img/image-photoroom-71-8.webp", ix: -12, iy: -113, iw: 539, ih: 488 },
  { cat: "kitchen", name: "пирожок",            x: 486,  y: 2349, src: "img/object.webp",               ix: -13, iy: -61,  iw: 415, ih: 425 },
  { cat: "kitchen", name: "хинкали",            x: 974,  y: 2349, src: "img/image-36.webp",             ix: -18, iy: -47,  iw: 421, ih: 411 },
  // бар
  { cat: "bar", name: "пиво светлое",           x: 102,  y: 3196, src: "img/image-photoroom-45-7.webp", ix: -72, iy: -104, iw: 552, ih: 478 },
  { cat: "bar", name: "пиво тёмное",            x: 597,  y: 3196, src: "img/image-photoroom-57-1.webp", ix: -78, iy: -125, iw: 578, ih: 494 },
  { cat: "bar", name: "сидр яблочный",          x: 1085, y: 3196, src: "img/image-photoroom-58-1.webp", ix: -54, iy: -125, iw: 460, ih: 488 },
  { cat: "bar", name: "настойка малиновая",     x: -9,   y: 3890, src: "img/nastoyka-raspberry.webp",   ix: 9,   iy: -89,  iw: 458, ih: 453 },
  { cat: "bar", name: "настойка черничная",     x: 486,  y: 3890, src: "img/nastoyka-blueberry.webp",   ix: 9,   iy: -89,  iw: 458, ih: 453 },
  { cat: "bar", name: "настойка цукатная",      x: 974,  y: 3890, src: "img/nastoyka-candied.webp",     ix: 9,   iy: -85,  iw: 458, ih: 453 },
  // мерч
  { cat: "merch", name: "авоська коричневая",   x: 102,  y: 4804, src: "img/image-45.webp",             ix: -22, iy: -97,  iw: 453, ih: 462 },
  { cat: "merch", name: "авоська жёлтая",       x: 597,  y: 4804, src: "img/image-46.webp",             ix: -21, iy: -86,  iw: 421, ih: 450 },
  { cat: "merch", name: "авоська белая",        x: 1085, y: 4804, src: "img/image-48.webp",             ix: -54, iy: -97,  iw: 461, ih: 462 },
  { cat: "merch", name: "платок чебур",                x: -9,  y: 5498, src: "img/scarf-cheburek.png",    ix: -3, iy: -127, iw: 410, ih: 491 },
  { cat: "merch", name: "платок чёрно-белый",          x: 486, y: 5498, src: "img/scarf-black-white.png", ix: -3, iy: -96, iw: 410, ih: 460 },
  { cat: "merch", name: "платок бело-чёрный",          x: 974, y: 5498, src: "img/scarf-pattern.png",     ix: 17, iy: -72, iw: 390, ih: 436 },
];

const $ = (id) => document.getElementById(id);
const cartItems = $("cartItems");
const cartEmpty = $("cartEmpty");
const orderBtn = $("orderBtn");
const modal = $("modal");

let cart = new Map();   // индекс товара -> количество
const ctls = [];        // панели кнопок по индексу товара

function make(tag, cls, html) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html != null) node.innerHTML = html;
  return node;
}

// ====== КАРТОЧКИ ======
PRODUCTS.forEach((p, i) => {
  const img = p.src
    ? `<img class="pimg" src="${p.src}" alt="${p.name}" loading="lazy" decoding="async"
         style="--ix:${p.ix};--iy:${p.iy};--iw:${p.iw};--ih:${p.ih}">`
    : "";

  const card = make("article", "card",
    `<div class="card__in">
       <div class="panel">${img}</div>
       <h3 class="label">${p.name}</h3>
       <div class="ctl">
         <button class="add" type="button" data-a="add">в корзину</button>
         <div class="qty">
           <button type="button" data-a="minus" aria-label="меньше">-</button>
           <span>1</span>
           <button type="button" data-a="plus" aria-label="больше">+</button>
         </div>
       </div>
     </div>`);
  card.style.setProperty("--x", p.x);
  card.style.setProperty("--y", p.y);

  const ctl = card.querySelector(".ctl");
  ctls[i] = ctl;

  ctl.addEventListener("click", (e) => {
    const a = e.target.dataset.a;
    if (!a) return;
    const now = cart.get(i) || 0;
    if (a === "add") setQty(i, 1);                        // первое нажатие: кладём 1 шт
    if (a === "plus") setQty(i, Math.min(now + 1, 99));
    if (a === "minus") setQty(i, now - 1);                // на 0 вернётся «в корзину»
  });

  document.querySelector(`.grid[data-cat="${p.cat}"]`).appendChild(card);
});

// ====== КОЛИЧЕСТВО ======
function setQty(i, qty) {
  const prev = cart.get(i) || 0;
  if (qty <= 0) cart.delete(i); else cart.set(i, qty);
  const ctl = ctls[i];
  ctl.classList.toggle("is-active", qty > 0);
  ctl.querySelector(".qty span").textContent = Math.max(qty, 1);
  renderCart(qty > prev ? i : -1);   // анимируем только тот товар, что прибавился
}

// ====== КОРЗИНА ======
function makeTile(i) {
  const p = PRODUCTS[i];
  const tile = make("div", "tile");
  if (!p.src) {
    tile.classList.add("tile--text");
    tile.textContent = p.name;
    return tile;
  }
  tile.innerHTML = `<img src="${p.src}" alt="${p.name}">`;
  return tile;
}

function renderCart(newIndex = -1) {
  cartItems.innerHTML = "";
  // чем больше разных товаров, тем мельче плитки — всё помещается в корзину
  const n = cart.size;
  cartItems.style.setProperty("--k", n <= 4 ? 1 : n <= 8 ? 0.8 : n <= 12 ? 0.62 : 0.48);
  cart.forEach((qty, i) => {
    const tile = makeTile(i);
    tile.title = PRODUCTS[i].name;
    tile.classList.toggle("is-new", i === newIndex);
    if (qty > 1) tile.appendChild(make("span", "tile__qty", "×" + qty));
    cartItems.appendChild(tile);
  });
  const empty = cart.size === 0;
  cartEmpty.hidden = !empty;
  orderBtn.classList.toggle("is-empty", empty);
}

// ====== ЗАКАЗ ======
orderBtn.addEventListener("click", () => {
  if (cart.size === 0) return;
  modal.hidden = false;
  cart = new Map(); // корзина сбрасывается после заказа
  ctls.forEach((c) => {
    c.classList.remove("is-active");
    c.querySelector(".qty span").textContent = 1;
  });
  renderCart();
});

const closeModal = () => { modal.hidden = true; };
$("modalClose").addEventListener("click", closeModal);
modal.addEventListener("click", (e) => { if (e.target === modal) closeModal(); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

// ====== СТАРТ ======
renderCart();
