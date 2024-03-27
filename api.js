"use strict";

const apiKey = "35ed0c94238ea1bdb6878fa345ef893b";

export const fetchData = (URL, callback) => {
  fetch(`${URL}&appid=${apiKey}`)
    .then((response) => response.json())
    .then((data) => callback(data));
};

export const url = {
  currentWeather(lat, lon) {
    return `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric`;
  },
  forecast(lat, lon) {
    return `api.openweathermap.org/data/2.5/forecast?${lat}&${lon}&units=metric`;
  },
  airPollution(lat, lon) {
    return `http://api.openweathermap.org/data/2.5/air_pollution?${lat}&${lon}`;
  },
  reverseGeo(lat, lon) {
    return `http://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=5`;
  },
  geo(query){
    return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=5`;
  }
};
