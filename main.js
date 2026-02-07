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
    { name: "朱桂君", file: "1.m4a" },
    { name: "代璐", file: "2.m4a" },
    { name: "符宝月", file: "3.m4a" },
    { name: "杨雨悦", file: "4.m4a" },
    { name: "王景慧", file: "5.m4a" },
    { name: "杜海帆", file: "6.m4a" },
    { name: "吴茹琪", file: "7.m4a" },
];

let currentVoice = 0;
const voicePlayer = document.getElementById("voicePlayer");
const voiceTitle = document.getElementById("voiceTitle");
const voiceCounter = document.getElementById("voiceCounter");

function updateVoiceUI() {
    voiceTitle.innerText = `来自 ${voices[currentVoice].name}`;
    voiceCounter.innerText = `${currentVoice + 1} / ${voices.length}`;
    voicePlayer.src = `voices/${voices[currentVoice].file}`;
    voicePlayer.volume = 0.85; // ⭐ 提高语音音量
}

function playVoice() {
    bgm.volume = 0.02;   // 背景音乐变小
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
            setTimeout(() => {
                // ⭐ 再跳到真实烟花页面
                window.location.href = "https://nianbroken.github.io/Firework_Simulator/";
            }, 3000);
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









