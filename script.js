document.addEventListener("DOMContentLoaded", function () {
  console.log("SleepyStop JS Loaded ✅");
});
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
let watchID;

async function startTracking() {
document.getElementById("status").innerHTML =
  "🔄 Finding your location...";
  const placeInput = document.getElementById("placeName");

  if (!placeInput || !placeInput.value) {
    alert("Enter destination place!");
    return;
  }

  destinationCoords = await getCoordinates(placeInput.value);

  if (!destinationCoords) return;

  if (!navigator.geolocation) {
    alert("Geolocation not supported!");
    return;
  }

  if (watchID) {
    navigator.geolocation.clearWatch(watchID);
  }

  watchID = navigator.geolocation.watchPosition(
    (position) => {

      const currentLat = position.coords.latitude;
      const currentLon = position.coords.longitude;
      if (!destinationCoords) return;

      const distance = calculateDistance(
        currentLat,
        currentLon,
        destinationCoords.lat,
        destinationCoords.lon
      );
      if (isNaN(distance)) return;

      document.getElementById("status").innerHTML =
        "📍 Distance: " + distance.toFixed(2) + " km";

      // 🔥 Auto alert when near
      if (distance <= 0.1) {
        alertUser("🎉 You reached near destination!", "funny");
        stopTracking();
      }

    },
    (error) => {
      alert("GPS Permission Denied");
    },
    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );
}
function calculateDistance(lat1, lon1, lat2, lon2) {

  const R = 6371; // Earth radius in km

  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
}
async function getCoordinates(place) {

  let response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${place}`
  );

  let data = await response.json();

  if (data.length === 0) {
    alert("Place not found!");
    return null;
  }

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon)
  };
}

let destinationCoords;

async function startTracking() {

  let place = document.getElementById("placeName").value;

  if (!place) {
    alert("Enter destination place!");
    return;
  }

  destinationCoords = await getCoordinates(place);

  if (!destinationCoords) return;

  if (!navigator.geolocation) {
    alert("GPS not supported");
    return;
  }

  watchID = navigator.geolocation.watchPosition(

    (position) => {

      let currentLat = position.coords.latitude;
      let currentLon = position.coords.longitude;

      let distance = calculateDistance(
        currentLat,
        currentLon,
        destinationCoords.lat,
        destinationCoords.lon
      );

      document.getElementById("status").innerHTML =
        "📍 Distance: " + distance.toFixed(2) + " km";

      if (distance <= 0.1) {

        alert("🎉 You reached near destination!");

        stopTracking();
      }

    },

    (error) => {
      alert("GPS Permission Denied");
    },

    {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    }
  );
}
function stopTracking() {

  if (watchID) {
    navigator.geolocation.clearWatch(watchID);
    watchID = null;
  }

  document.getElementById("status").innerHTML =
    "🛑 Tracking Stopped";
}