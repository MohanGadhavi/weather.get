"use strict";
const html = String.raw;

import { fetchData, url } from "./api.js";
import * as module from "./module.js";

const searchBox = document.getElementById("searchBox");
const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");
const backButton = document.getElementById("backButton");

// --- SearchBox and Button behaviour --------------------------------
searchBox.addEventListener("click", () => searchInput.focus());
document.addEventListener("click", function (event) {
  var target = event.target;
  // Check if click target is not within search div or its children
  if (!searchBox.contains(target)) {
    searchResults.style.display = "none";
    searchInput.value = "";
  }
});
backButton.addEventListener("click", () => {
  backButton.blur();
  searchInput.value = "";
  searchResults.style.display = "none";
});

/* --- on input behavior --- */
let searchTimeout = null;
const searchTimeoutDuration = 1000;
searchInput.addEventListener("input", () => {
  searchTimeout ?? clearTimeout(searchTimeout);

  if (!searchInput.value) {
    searchResults.style.display = "none";
    // addSeraching
  }
  //   else {
  //     // removesearching
  //   }

  if (searchInput.value) {
    searchTimeout = setTimeout(() => {
      fetchData(url.geo(searchInput.value), function (location) {
        searchResults.style.display = "block";
        // removeSeraching
        searchResults.innerHTML = html`<ul id="searchList"></ul> `;

        /*Node List*/
        const items = [];

        /*show result list*/
        for (const { name, lat, lon, country, state } of location) {
          const listItem = document.createElement("li");
          listItem.classList.add("listItem");
          listItem.innerHTML = /* HTML*/ html`
            <i class="fa-solid fa-location-dot"></i>
            <div>
              <p>${name}</p>
              <p>${state || ""} ${country}</p>
            </div>
            <a
              href="#/weather?${lat}&${lon}"
              aria-label="${name} weather"
              id="data-search-toggler"
            ></a>
          `;

          searchResults.querySelector("#searchList").appendChild(listItem);
          items.push(listItem.querySelector("#data-search-toggler"));
        }
      });
    }, searchTimeoutDuration);
  }
});

const mainContainer = document.querySelector("[data-main]");
const loading = document.querySelector("[data-loading]");
const currentLocationBtn = document.getElementsByClassName("loactionBox")[0];
currentLocationBtn.addEventListener("click", () => {
  console.log("Hello from current location");
  window.location.hash = "#/current-location";
});
const errorContent = document.getElementsByClassName("errorContent")[0];

export const updateWeather = (lat, lon) => {
  console.log(lat);
  console.log(lon);
  // console.log(lon);
  loading.style.display = "grid";
  mainContainer.style.display = "none";
  // mainContainer.style.overflowY = "hidden";
  errorContent.style.display = "none";

  const currentWeatherSection = document.querySelector(
    "[data-current-weather]"
  );
  const forecastSection = document.querySelector("[data-5d-forecast]");
  const highlightSection = document.querySelector("[data-highlights]");
  const hourlySection = document.querySelector("[data-hourly]");

  currentWeatherSection.innerHTML = "";
  // forecastSection.innerHTML = "";
  // highlightSection.innerHTML = "";
  // hourlySection.innerHTML = "";

  // if (window.location.hash === "#/current-location") {
  // }

  /** --- current weather section --- */
  fetchData(url.currentWeather(lat, lon), (currentWeather) => {
    loading.style.display = "none";
    mainContainer.style.display = "flex";

    const {
      weather,
      dt: dateUnix,
      sys: { sunrise: sunriseUnixUTC, sunset: sunsetUnixUTC },
      main: { temp, feels_like, pressure, humidity },
      visibility,
      timezone,
    } = currentWeather;
    const [{ description, icon }] = weather;

    const card = document.createElement("div");
    card.classList.add("leftChild1", "mainChildCards");
    card.innerHTML = html`
      <h3 class="title-2">Now</h3>
      <div class="result">
        <h1 class="heading">${parseInt(temp)}&degc</h1>
        <i class="fa-solid fa-cloud-sun heading" alt="${description}"></i>
      </div>
      <p class="body-3">${description}</p>
      <hr />
      <div>
        <i class="fa-solid fa-calendar body-3"></i>
        <p class="body-3">${module.getDate(dateUnix, timezone)}</p>
      </div>
      <div>
        <i class="fa-solid fa-location-dot body-3"></i>
        <p class="body-3" data-location></p>
      </div>
    `;

    fetchData(url.reverseGeo(lat, lon), ([{ name, country }]) => {
      card.querySelector("[data-location]").innerHTML = `${name}, ${country}`;
    });

    currentWeatherSection.appendChild(card);

  });
};

export const error404 = () => {
  console.log("Hello error!");
};

// listItem.addEventListener("click", () => {

// });
