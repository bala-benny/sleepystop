let distance = 5; // simulated km
let interval;
let alarmTimeout;

function startTrip() {
  let speed = document.getElementById("speed").value;
  let mode = document.getElementById("mode").value;
  let safety = document.getElementById("safety").checked;

  if (safety) alert("📍 Location shared with trusted contact.");

  let timeToStop = (distance / speed) * 3600;
  document.getElementById("status").innerHTML = "Trip Started 💖";

  interval = setInterval(() => {
    timeToStop--;
    document.getElementById("status").innerHTML =
      "⏳ Time Remaining: " + Math.floor(timeToStop) + " sec";

    if (timeToStop === 300) alertUser("5 minutes left!", mode);
    if (timeToStop === 120) alertUser("2 minutes left!", mode);
    if (timeToStop === 30) alertUser("30 seconds left!", mode);

    if (timeToStop <= 0) {
      clearInterval(interval);
      document.getElementById("status").innerHTML =
        "🎉 You reached your stop!";
      giveBadge();
    }
  }, 1000);
}

function alertUser(message, mode) {
  if (mode === "funny") message = "🌸 Hey sleepyhead! " + message;
  if (mode === "aggressive") message = "🚨 STOP COMING UP! " + message;

  document.getElementById("popup-message").innerText = message;
  document.getElementById("popup").classList.remove("hidden");

  alarmTimeout = setTimeout(() => {
    navigator.vibrate([300, 100, 300]);
    document.body.style.background = "#ffd6e0";
  }, 30000);
}

function dismissAlert() {
  document.getElementById("popup").classList.add("hidden");
  clearTimeout(alarmTimeout);
  document.body.style.background = "";
}

function giveBadge() {
  document.getElementById("badge").innerHTML =
    "🎀 Badge Unlocked: SleepyStop Star 🌟";
}