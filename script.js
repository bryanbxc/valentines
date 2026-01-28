const imageFiles = [
    "img1.jpg",
    "img2.jpg",
    "img3.jpg",
    "img4.jpg",
    "img5.jpg"
  ];
  
  const depth = 280;
  const rotateIntervalMs = 40;
  const degPerTick = 0.16;
  
  // background look for non-front cards
  const bgScale = 0.86;
  const bgOpacity = 0.55;
  const bgBlur = 0.6;
  
  // ====== Hearts falling background ======
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
  
  const chooseWisely = document.getElementById("chooseWisely");
  const carouselWrap = document.getElementById("carouselWrap");
  const carousel = document.getElementById("carousel3d");
  
  let currdeg = 0;
  let carouselBuilt = false;
  let carouselRunning = false;
  
  function startCarousel() {
    if (carouselRunning) return;
    window.carouselPause = setInterval(rotate, rotateIntervalMs);
    carouselRunning = true;
  }
  function stopCarousel() {
    clearInterval(window.carouselPause);
    carouselRunning = false;
  }
  
  function buildCarouselOnce() {
    if (carouselBuilt) return;
  
    const itemCount = imageFiles.length;
    const stepDeg = 360 / itemCount; // 5 => 72deg
  
    imageFiles.forEach((file, i) => {
      const item = document.createElement("div");
      item.className = "item3d";
  
      const angle = i * stepDeg;
  
      // initial background look
      item.style.opacity = String(bgOpacity);
      item.style.filter = `blur(${bgBlur}px)`;
  
      item.style.transform = `
        translate(-50%, -50%)
        rotateY(${angle}deg)
        translateZ(${depth}px)
        scale(${bgScale})
      `;
  
      const img = document.createElement("img");
      img.src = `./images/${file}`;
      img.alt = `carousel image ${i + 1}`;
  
      item.appendChild(img);
      carousel.appendChild(item);
    });
  
    // Desktop hover pause/resume
    carousel.addEventListener("mouseenter", stopCarousel);
    carousel.addEventListener("mouseleave", startCarousel);

    // Mobile: tap to pause/resume (iPhone-friendly)
    carousel.addEventListener("click", () => {
    if (!carouselRunning) startCarousel();
      else stopCarousel();
    });

  
    carouselBuilt = true;
  }
  
  function setFrontCardStyle() {
    const items = carousel.querySelectorAll(".item3d");
    const itemCount = items.length;
    if (!itemCount) return;
  
    const stepDeg = 360 / itemCount;
  
    // normalize to [0, 360)
    const normalized = ((-currdeg % 360) + 360) % 360;
    const frontIndex = Math.round(normalized / stepDeg) % itemCount;
  
    items.forEach((el, i) => {
      const base = el.dataset.baseTransform; // stored once
      if (!base) return;
  
      if (i === frontIndex) {
        el.style.opacity = "1";
        el.style.filter = "blur(0px)";
        el.style.transform = base.replace(/scale\([^)]+\)/, "scale(1)");
      } else {
        el.style.opacity = String(bgOpacity);
        el.style.filter = `blur(${bgBlur}px)`;
        el.style.transform = base.replace(/scale\([^)]+\)/, `scale(${bgScale})`);
      }
    });
  }
  
  function cacheBaseTransforms() {
    const items = carousel.querySelectorAll(".item3d");
    items.forEach((el) => {
      // store the original transform string as the base (includes scale(bgScale))
      el.dataset.baseTransform = el.style.transform;
    });
  }
  
  function rotate() {
    currdeg -= degPerTick;
    carousel.style.transform = `rotateY(${currdeg}deg)`;
    setFrontCardStyle();
  }
  
  function revealCarousel() {
    buildCarouselOnce();
    cacheBaseTransforms();
  
    carouselWrap.classList.add("show");
    carouselWrap.setAttribute("aria-hidden", "false");
  
    // set initial front styling once before movement
    setFrontCardStyle();
    startCarousel();
  }
  
  // click to reveal
  chooseWisely.addEventListener("click", revealCarousel);
  
  chooseWisely.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      revealCarousel();
    }
  });
  
  const yesBtn = document.getElementById("yesBtn");
  const noBtn = document.getElementById("noBtn");
  const message = document.getElementById("message");
  
  const noMessages = [
    "I think you misclicked, ma’am",
    "Erm that button is broken. Pleek try again😁",
    "You're breaking my heart 💔",
    "Your finger slipped fr :p",
    "Bryan Banda destruction button🔴",
    "So you hate me and want to die💔"
  ];
  
  let yesScale = 1;
  let noCount = 0;
  let locked = false;
  
  noBtn.addEventListener("click", () => {
    if (locked) return;
  
    noCount++;
    message.textContent = noMessages[Math.floor(Math.random() * noMessages.length)];
  
    yesScale = Math.min(2.2, yesScale + 0.12);
    yesBtn.style.transform = `scale(${yesScale})`;
  
    const noScale = Math.max(0.78, 1 - noCount * 0.04);
    noBtn.style.transform = `scale(${noScale})`;
  });
  
  yesBtn.addEventListener("click", () => {
    if (locked) return;
    locked = true;
    window.location.href = "./yes.html";
  });
  