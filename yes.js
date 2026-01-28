const hearts = document.getElementById("hearts");
const heartChars = ["💗","💖","💘","💞","💝","💕","💌"];

function spawnHeart() {
  const h = document.createElement("div");
  h.className = "heart";
  h.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];

  h.style.left = (Math.random() * 100) + "vw";
  h.style.fontSize = (14 + Math.random() * 18) + "px";

  const duration = 8 + Math.random() * 8;
  h.style.animationDuration = duration + "s";

  const drift = (Math.random() * 20 - 10).toFixed(1) + "vw";
  h.style.setProperty("--drift", drift);

  hearts.appendChild(h);
  setTimeout(() => h.remove(), duration * 1000 + 200);
}
setInterval(spawnHeart, 250);
for (let i = 0; i < 12; i++) setTimeout(spawnHeart, i * 120);
