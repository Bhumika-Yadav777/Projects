const bells = new Audio("./sounds/bell.wav");

const startBtn = document.querySelector(".btn-start");
const stopBtn = document.querySelector(".btn-stop");
const resetBtn = document.querySelector(".btn-reset");

const session = document.querySelector(".minutes");

let myInterval;
let state = true;
let totalSeconds = 25 * 60;

const appTimer = () => {
  if (state) {
    state = false;

    const updateSeconds = () => {
      const minuteDiv = document.querySelector(".minutes");
      const secondDiv = document.querySelector(".seconds");

      let minutesLeft = Math.floor(totalSeconds / 60);
      let secondsLeft = totalSeconds % 60;

      minuteDiv.textContent = minutesLeft;
      secondDiv.textContent =
        secondsLeft < 10
          ? "0" + secondsLeft
          : secondsLeft;

      if (totalSeconds <= 0) {
        bells.play();
        clearInterval(myInterval);
        state = true;
        return;
      }

      totalSeconds--;
    };

    updateSeconds();
    myInterval = setInterval(updateSeconds, 1000);
  }
};

const stopTimer = () => {
  clearInterval(myInterval);
  state = true;
};

const resetTimer = () => {
  clearInterval(myInterval);

  totalSeconds = 25 * 60;

  document.querySelector(".minutes").textContent = "25";
  document.querySelector(".seconds").textContent = "00";

  state = true;
};

startBtn.addEventListener("click", appTimer);
stopBtn.addEventListener("click", stopTimer);
resetBtn.addEventListener("click", resetTimer);