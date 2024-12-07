let time = 25 * 60; // Global variabel for total tid
let timerInterval;
const progressBar = document.getElementById("progressBar");
progressBar.style.backgroundColor = time / totalTime > 0.5 ? "green" : "red";


function playSound() {
    const audio = new Audio('alarm.mp3');
    audio.play();
  }

  function startTimer() {
    const userInput = document.getElementById("timeInput").value;
    totalTime = userInput ? userInput * 60 : 25 * 60; // Total tid basert på input
    time = totalTime; // Sett `time` til total tid
    timerInterval = setInterval(() => {
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      document.getElementById("timer").textContent =
        `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
      document.getElementById("progressBar").value = ((totalTime - time) / totalTime) * 100;

      if (time > 0) {
        time--;
      } else {
        clearInterval(timerInterval);
        playSound();
        alert("Tid er ute!");
      }
    }, 1000);
}

document.getElementById("startButton").addEventListener("click", startTimer);
document.getElementById("pauseButton").addEventListener("click", () => {
    clearInterval(timerInterval); // Stopper timeren midlertidig
  });
  