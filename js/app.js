let time = 25 * 60; // Standard tid: 25 minutter
let timerInterval;
let totalTime;
let isWorkPeriod = true; // Holder styr på om det er arbeid eller pause
const countdownSound = new Audio('lydfiler/timerCountDown11s.mp3');
const alarmSound = new Audio('lydfiler/timerAlarm.mp3');

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

        // Spill lyd de siste 5 sekundene
        if (time <= 10 && time > 0) {
            countdownSound.play(); // Legg til en passende lydfil for nedtelling
        }

        if (time > 0) {
            time--;
        } else {
            clearInterval(timerInterval);
            countdownSound.pause(); // Stopp nedtellingslyden hvis den fortsatt spiller
            countdownSound.currentTime = 0; // Resett lyden
            alarmSound.play(); // Spill alarmlyden
            if (isWorkPeriod) {
                isWorkPeriod = false; // Sett til pauseperiode
                setTimeout(startBreak, 200); // Start pause automatisk etter en liten forsinkelse
            } else {
                alert("Pause ferdig! Tilbake til arbeid!");
                startTimer(); // Start en ny arbeidsperiode
            }
        }
    }, 1000);
}

function startBreak() {
    isWorkPeriod = false; // Bytt til pauseperiode
    let breakTime;
    if (totalTime <= 25 * 60) {
        breakTime = 5 * 60; // 5 minutter pause for 25 minutter
    } else if (totalTime <= 50 * 60) {
        breakTime = 10 * 60; // 10 minutter pause for 50 minutter
    } else {
        breakTime = 15 * 60; // 15 minutter pause for lengre arbeid
    }
    time = breakTime;
    totalTime = breakTime;
    alert("Arbeidsperiode over. Starter pause!");
    startTimer();
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

document.getElementById("pauseButton").addEventListener("click", () => {
    clearInterval(timerInterval);
    updateButtonsState(false); // Aktiver knapper igjen
});

// Knapp for å utsette timeren
document.getElementById("postpone10").addEventListener("click", () => postponeTimer(10));
document.getElementById("postpone20").addEventListener("click", () => postponeTimer(20));
document.getElementById("postpone40").addEventListener("click", () => postponeTimer(40));
