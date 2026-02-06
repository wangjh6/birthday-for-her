// ---------- 页面切换 ----------
let musicStarted = false;
function showPage(pageId) {
    const pages = document.querySelectorAll(".page");

    pages.forEach(page => {
        if (page.classList.contains("active")) {
            page.classList.remove("active");
            setTimeout(() => {
                page.style.display = "none";
            }, 600);
        }
    });

    const target = document.getElementById(pageId);
    target.style.display = "block";

    setTimeout(() => {
        target.classList.add("active");
    }, 20);
    // ⭐ 关键：进入照片页时启动自动放映
    if (pageId === "photos" && !musicStarted) {
        bgm.volume = 0.4;
        bgm.play();
        musicStarted = true;
        startSlideshow();
    }
    if (pageId === "secret") {
        startFireworks();
    }

}

// ---------- 背景音乐 ----------
const bgm = document.getElementById("bgm");
const musicBtn = document.getElementById("musicBtn");


// ---------- 照片放映 ----------
// ---------- 自动照片放映 ----------
const totalPhotos = 16;
let currentPhoto = 1;

function startSlideshow() {
    currentPhoto = 1; // ⭐ 每次进入都重置

    const img = document.getElementById("photo");
    const counter = document.getElementById("photoCounter");

    // 初始化第一张
    img.src = `images/1.jpg`;
    counter.innerText = `1 / ${totalPhotos}`;
    img.style.opacity = 1;

    function showNext() {
        // 最后一张播放完 → 进入语音页
        if (currentPhoto >= totalPhotos) {
            setTimeout(() => {
                showPage("wishes");
            }, 1500);
            return;
        }

        // 淡出
        img.style.opacity = 0;

        setTimeout(() => {
            currentPhoto++;
            img.src = `images/${currentPhoto}.jpg`;
            counter.innerText = `${currentPhoto} / ${totalPhotos}`;
            img.style.opacity = 1;

            // 下一张
            setTimeout(showNext, 2000);
        }, 500); // 淡出时间
    }

    // 第一张停留后开始
    setTimeout(showNext, 3000);
}



// ---------- 语音留言 ----------
const voices = [
    { name: "君", file: "1.m4a" },
    { name: "璐", file: "2.m4a" },
    { name: "月", file: "3.m4a" },
    { name: "悦", file: "4.m4a" },
    { name: "慧", file: "5.m4a" }
];

let currentVoice = 0;
const voicePlayer = document.getElementById("voicePlayer");
const voiceTitle = document.getElementById("voiceTitle");
const voiceCounter = document.getElementById("voiceCounter");

function updateVoiceUI() {
    voiceTitle.innerText = `来自 ${voices[currentVoice].name}`;
    voiceCounter.innerText = `${currentVoice + 1} / ${voices.length}`;
    voicePlayer.src = `voices/${voices[currentVoice].file}`;
}

function playVoice() {
    bgm.volume = 0.05;   // 背景音乐变小
    voicePlayer.play();
}
voicePlayer.onended = () => {
    currentVoice++;

    // 如果还有下一条语音
    if (currentVoice < voices.length) {
        updateVoiceUI();

        // 稍微停顿一下再播放，更温柔
        setTimeout(() => {
            voicePlayer.play();
        }, 600);
    } else {
        // 所有语音播放完
        bgm.volume = 0.4; // 恢复背景音乐
        setTimeout(() => {
            showPage("secret");
        }, 2000);
    }
};



function nextVoice() {
    voicePlayer.pause();
    voicePlayer.currentTime = 0;

    currentVoice++;
    if (currentVoice >= voices.length) {
        currentVoice = voices.length - 1;
        return;
    }
    updateVoiceUI();
}

// 初始加载
updateVoiceUI();
// ---------- 🎆 烟花效果 ----------
let fireworksStarted = false;

function startFireworks() {
    if (fireworksStarted) return;
    fireworksStarted = true;

    const canvas = document.getElementById("fireworks");
    const ctx = canvas.getContext("2d");

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    const fireworks = [];

    function random(min, max) {
        return Math.random() * (max - min) + min;
    }

    function createFirework() {
        const x = random(100, canvas.width - 100);
        const y = random(100, canvas.height / 2);
        const particles = [];

        for (let i = 0; i < 40; i++) {
            particles.push({
                x,
                y,
                angle: random(0, Math.PI * 2),
                speed: random(1, 4),
                alpha: 1,
                radius: random(2, 3),
                color: `hsl(${random(0, 360)}, 80%, 60%)`
            });
        }

        fireworks.push(particles);
    }

    function update() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        fireworks.forEach((particles, index) => {
            particles.forEach(p => {
                p.x += Math.cos(p.angle) * p.speed;
                p.y += Math.sin(p.angle) * p.speed;
                p.alpha -= 0.015;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${hexToRgb(p.color)},${p.alpha})`;
                ctx.fill();
            });

            if (particles[0].alpha <= 0) {
                fireworks.splice(index, 1);
            }
        });

        requestAnimationFrame(update);
    }

    function hexToRgb(hsl) {
        const temp = document.createElement("div");
        temp.style.color = hsl;
        document.body.appendChild(temp);
        const rgb = getComputedStyle(temp).color;
        document.body.removeChild(temp);
        return rgb.match(/\d+/g).slice(0, 3).join(",");
    }

    update();

    // 定时生成烟花（温柔，不密集）
    setInterval(createFirework, 900);
}
