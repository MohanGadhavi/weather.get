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
  } else {
    if (searchResults.contains(target)) {
      searchResults.style.display = "none";
      searchInput.value = "";
      searchInput.blur();
    }
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
      fetchData(
        url.geo(searchInput.value),
        function (location) {
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
        },
        searchTimeoutDuration
      );
    });
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
  // console.log(lat);
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
  highlightSection.innerHTML = "";
  hourlySection.innerHTML = "";

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
        <!-- <i class="fa-solid fa-cloud-sun heading" alt="${description}"></i> -->
        <img
          src="./assets/weather-icons/${icon}.png"
          alt="${icon} ${description}"
          title="${description}"
        />
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

    /**
     * Air polution index section Section
     */
    fetchData(url.airPollution(lat, lon), (airPollution) => {
      const [
        {
          main: { aqi },
          components: { so2, no2, o3, pm2_5 },
        },
      ] = airPollution.list;

      const card = document.createElement("div");
      card.classList.add("rightChild1", "mainChildCards");
      card.innerHTML = html`
        <h3 class="title-2">Todays Highlights</h3>
        <div>
          <div class="container-big">
            <h4 class="body-3 container-title">Air quality index</h4>
            <label
              class="label label-2 aqi-${aqi}"
              title="${module.aqiText[aqi].message}"
            >
              <h3>${module.aqiText[aqi].level}</h3>
            </label>
            <div>
              <i class="fa-solid fa-wind"></i>
            </div>
            <div>
              <p class="body-3">PM<sub>2.5</sub></p>
              <h2 class="">${Number(pm2_5).toPrecision(3)}</h2>
            </div>
            <div>
              <p class="body-3">SO<sub>2</sub></p>
              <h2 class="">${Number(so2).toPrecision(3)}</h2>
            </div>
            <div>
              <p class="body-3">NO<sub>2</sub></p>
              <h2 class="">${Number(no2).toPrecision(3)}</h2>
            </div>
            <div>
              <p class="body-3">O<sub>3</sub></p>
              <h2 class="">${Number(o3).toPrecision(3)}</h2>
            </div>
          </div>
          <div class="container-big">
            <h4 class="body-3 container-title">Sunrise & Sunset</h4>
            <div class="icons">
              <i class="fa-solid fa-sun"></i>
            </div>
            <div>
              <p class="body-3">Sunrise</p>
              <h1 class="">${module.getTime(sunriseUnixUTC, timezone)}</h1>
            </div>
            <div class="icons">
              <i class="fa-solid fa-moon"></i>
            </div>
            <div>
              <p class="body-3">Sunset</p>
              <h1 class="">${module.getTime(sunsetUnixUTC, timezone)}</h1>
            </div>
          </div>
        </div>
        <div>
          <div class="container-small">
            <h4 class="body-3 container-title">Humidity</h4>
            <i class="fa-solid fa-droplet"></i>
            <h1>${humidity}<span class="title-1">%</span></h1>
          </div>
          <div class="container-small">
            <h4 class="body-3 container-title">Pressure</h4>
            <i class="fa-solid fa-gauge"></i>
            <h1>${pressure}<span class="title-1">hPa</span></h1>
          </div>
          <div class="container-small">
            <h4 class="body-3 container-title">Visibility</h4>
            <i class="fa-solid fa-eye"></i>
            <h1>${visibility / 1000}<span class="title-1">km</span></h1>
          </div>
          <div class="container-small">
            <h4 class="body-3 container-title">Feels Like</h4>
            <i class="fa-solid fa-temperature-half"></i>
            <h1>${parseInt(feels_like)}<sup>o</sup>c</h1>
          </div>
        </div>
      `;

      highlightSection.appendChild(card);
    });

    /**
     * 24H Forecast Section
     */
    fetchData(url.forecast(lat, lon), (forecast) => {
      const {
        list: forecastList,
        city: { timezone },
      } = forecast;

      hourlySection.innerHTML = `
      <h3 class="title-2">Today at</h3>
      <div temp-list></div>
      <div wind-list></div>
      `;

      for (const [index, data] of forecastList.entries()) {
        if (index > 7) break;

        const {
          dt: dateTimeUnix,
          main: { temp },
          weather,
          wind: { deg: windDirection, speed: windSpeed },
        } = data;
        const [{ icon, description }] = weather;

        const tempListItem = document.createElement("div");
        tempListItem.classList.add("child");
        tempListItem.innerHTML = html`
          <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>
          <!-- <i class="fa-solid fa-cloud" title="${icon}, ${description}"></i> -->
          <img
            src="./assets/weather-icons/${icon}.png"
            alt="${icon} ${description}"
            title="${description}"
          />
          <p class="body-3">${parseInt(temp)}<sup>o</sup></p>
        `;
        hourlySection.querySelector("[temp-list]").appendChild(tempListItem);

        const windListItem = document.createElement("div");
        windListItem.classList.add("child");
        windListItem.innerHTML = html`
          <p class="body-3">${module.getHours(dateTimeUnix, timezone)}</p>
          <i
            class="fa-solid fa-location-arrow"
            title="wind direction: ${windDirection}"
            style="transform: rotate(${windDirection - 180 - 45}deg)"
          ></i>
          <p class="body-3">${parseInt(module.mps_to_kmph(windSpeed))} km/hr</p>
        `;
        hourlySection.querySelector("[wind-list]").appendChild(windListItem);
      }

      /**
       * 5Day Forecast Section
       */
      forecastSection.innerHTML = html`
        <h3 class="title-2">5 Days Forecast</h3>
      `;

      for (let i = 7, len = forecastList.length; i < len; i += 8) {
        const {
          main: { temp_max },
          weather,
          dt_txt,
        } = forecastList[i];
        const [{ icon, description }] = weather;
        const date = new Date(dt_txt);

        const fcList = document.createElement("div"); //Forecast list
        fcList.classList.add("fcList");
        fcList.innerHTML = html`
          <div>
            <!-- <i class="fa-solid fa-moon" title="${icon}, ${description}"></i> -->
            <img
              src="./assets/weather-icons/${icon}.png"
              alt="${icon} ${description}"
              title="${description}"
            />
            <p>${parseInt(temp_max)}<sup>o</sup></p>
          </div>
          <p>${date.getDate()} ${module.monthNames[date.getUTCMonth()]}</p>
          <p>${module.weekDaysNames[date.getUTCDay()]}</p>
        `;
        forecastSection.appendChild(fcList);
      }
    });
  });
};

/**
 * Error 404 Section
 */
export const error404 = () => {
  errorContent.style.display = "flex";
  console.log("Hello error!");
};
