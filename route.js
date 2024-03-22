"use strict";

import { updateWeather, error404 } from "./app.js";
const defaulLocation = "#/weather?lat=51.5073219&lon=-0.1276474"; //london

const currentLocation = () => {
  window.navigator.geolocation.getCurrentPosition(
    (res) => {
      const { latitude, longitude } = res.coords;

      updateWeather(`lat=${latitude}, lon=${longitude}`);
    },
    (err) => {
      window.location.hash = defaulLocation;
    }
  );
};

const searchedLocation = (query) => {
  updateWeather(...query.split("&"));
};

const routes = new Map([
  ["/current-location", currentLocation],
  ["/weather", searchedLocation],
]);

const checkHash = () => {
  const requestURL = window.location.hash.slice(1);

  const [route, query] = requestURL.includes
    ? requestURL.split("?")
    : [requestURL];

  routes.get(route) ? routes.get(route)(query) : error404();
};

window.addEventListener("hashchange", checkHash);

window.addEventListener("load", () => {
  if (!window.location.hash) {
    window.location.hash = "#/current-location";
  } else {
    checkHash();
  }
});
