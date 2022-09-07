const base_url = `https://geo.ipify.org/api/v2/country,city?apiKey=at_TPM8R5D6J6hS1Y6Kyvi2pyzMmIo5R`;

const form = document.getElementById("form");
const input = document.getElementById("ipInput");
const button = document.getElementById("submitButton");

const ipOutput = document.getElementById("ipOutput");
const locOutput = document.getElementById("locOutput");
const timeOutput = document.getElementById("timeOutput");
const ispOutput = document.getElementById("ispOutput");

const error = document.getElementById("error");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  fetchLocation(input.value);
});

let map;

// Being used for both init and custom IP
const fetchLocation = async (ipAdress = "") => {
  let response;

  if (ipAdress) {
    response = await (await fetch(base_url + `&ipAddress=${ipAdress}`)).json();
  } else {
    response = await (await fetch(base_url)).json();
  }

  if (response.code === 422) {
    error.style.display = "block";
  } else {
    error.style.display = "none";

    ipOutput.innerText = response.ip;
    locOutput.innerText = `${response.location.region}, ${response.location.city}`;
    timeOutput.innerText = `UTC ${response.location.timezone}`;
    ispOutput.innerText = response.isp;
  }

  fetchMap(response.location.lat, response.location.lng);
};

const fetchMap = (lat, lng) => {
  map.setView([lat, lng], 14);

  let icon = L.icon({
    iconUrl: "images/icon-location.svg",
    iconSize: [40, 48],
  });

  L.marker([lat, lng], { icon }).addTo(map);
};

// Init function
(function () {
  map = L.map("map", { zoomControl: false, scrollWheelZoom: false });

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "© OpenStreetMap",
  }).addTo(map);

  fetchLocation();
})();
