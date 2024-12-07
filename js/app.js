let time = 25 * 60; // Standard tid: 25 minutter
let timerInterval;
let totalTime;
let isWorkPeriod = true; // Holder styr på om det er arbeid eller pause
const countdownSound = new Audio('lydfiler/timerCountDown11s.mp3');
const alarmSound = new Audio('lydfiler/timerAlarm.mp3');

// Konfigurer lydvolum
countdownSound.volume = 0;
alarmSound.volume = 1;

function fadeIn(audio) {
    let volume = 0;
    const interval = setInterval(() => {
        if (volume < 1) {
            volume += 0.05;
            audio.volume = Math.min(volume, 1);
        } else {
            clearInterval(interval);
        }
    }, 100); // Øk volumet gradvis hver 100ms
}

function fadeOut(audio, callback) {
    let volume = audio.volume;
    const interval = setInterval(() => {
        if (volume > 0) {
            volume -= 0.05;
            audio.volume = Math.max(volume, 0);
        } else {
            clearInterval(interval);
            audio.pause();
            audio.currentTime = 0;
            if (callback) callback();
        }
    }, 100); // Reduser volumet gradvis hver 100ms
}

function startTimer() {
    const userInput = document.getElementById("timeInput").value;
    totalTime = userInput ? userInput * 60 : 25 * 60; // Total tid i sekunder
    time = totalTime;
    updateButtonsState(true); // Deaktiver knapper under timeren
    timerInterval = setInterval(() => {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        document.getElementById("timer").textContent =
            `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        document.getElementById("progressBar").value = ((totalTime - time) / totalTime) * 100;

        // Spill nedtellingslyden når det er 11 sekunder igjen
        if (time === 11) {
            countdownSound.play();
            fadeIn(countdownSound); // Fade inn lyden
        }

        if (time > 0) {
            time--;
        } else {
            clearInterval(timerInterval);
            fadeOut(countdownSound); // Fade ut nedtellingslyden
            alarmSound.play(); // Spill alarmlyden
            if (isWorkPeriod) {
                setTimeout(() => {
                    isWorkPeriod = false;
                    startBreak();
                }, 200); // Start pause etter alarmen
            } else {
                setTimeout(() => {
                    alert("Pause ferdig! Tilbake til arbeid!");
                    isWorkPeriod = true;
                    startTimer(); // Start ny arbeidsperiode automatisk
                }, 200);
            }
        }
    }, 1000);
}

function startBreak() {
    let breakTime;
    if (totalTime <= 25 * 60) {
        breakTime = 5 * 60; // 5 minutter pause for 25 minutter arbeid
    } else if (totalTime <= 50 * 60) {
        breakTime = 10 * 60; // 10 minutter pause for 50 minutter arbeid
    } else {
        breakTime = 15 * 60; // 15 minutter pause for lengre arbeid
    }
    time = breakTime;
    totalTime = breakTime;
    document.getElementById("timer").textContent = "Pause starter!";
    alarmSound.addEventListener('ended', () => {
        setTimeout(startTimer, 1000); // Start pausetimeren automatisk
    });
}

function pauseTimer() {
    clearInterval(timerInterval);
    fadeOut(countdownSound); // Fade ut nedtellingslyden hvis timeren stoppes
    updateButtonsState(false); // Aktiver knapper igjen
    time = 5 * 60; // Sett en 5-minutters pause
    isWorkPeriod = false;
    startTimer(); // Start pausen
}

function postponeTimer(minutes) {
    time += minutes * 60; // Legger til tid
    totalTime += minutes * 60; // Justerer total tid
    document.getElementById("timer").textContent = formatTime(time);
}

function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

function updateButtonsState(disabled) {
    document.querySelectorAll(".postpone-button").forEach((button) => {
        button.disabled = disabled;
    });
}

document.getElementById("startButton").addEventListener("click", () => {
    isWorkPeriod = true;
    startTimer();
});

document.getElementById("pauseButton").addEvent
