"use strict";

import { fetchData, url } from "./api.js";

// import { fetchData, url } from "./api";
// import * as module from "./module";

// const addEventOnElements = (elements, eventType, callback) => {
//   for (const element of elements) element.addEventListener(eventType, callback);
// };

const backButton = document.getElementById("backButton");
backButton.addEventListener("click", () => {
  backButton.blur();
  searchInput.value = "";
  searchResults.style.display = "none";
});

const searchBox = document.getElementById("searchBox");
searchBox.addEventListener("click", () => searchInput.focus());

const searchInput = document.getElementById("searchInput");
const searchResults = document.getElementById("searchResults");

let searchTimeout = null;
const searchTimeoutDuration = 500;
searchInput.addEventListener("input", () => {
  searchTimeout ?? clearTimeout(searchTimeout);

  if (!searchInput.value) {
    searchResults.style.display = "none";
    console.log("Joker");
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
        searchResults.innerHTML = `
        <ul>
            <li>Hello</li>
            <li>My</li>
            <li>name</li>
            <li>name</li>
            <li>name</li>
            <li>name</li>
            <li>name</li>
            <li>name</li>
            <li>name</li>
            <li>name</li>
        </ul>
        `;
      });
    }, searchTimeoutDuration);
  }
});
