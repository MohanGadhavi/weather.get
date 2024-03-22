"use strict";

export const weekDaysNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export const getDate = (dateUnix, timezone) => {
  const date = new Date((dateUnix + timezone) * 1000);
  const weekDaysName = weekDaysNames[date.getUTCDate()];
  const monthName = monthNames[date.getUTCMonth()];

  return `${weekDaysName} ${date.getUTC()}, ${monthName}`;
};

export const getTime = (timeUnix, timezone) => {
  const date = new Date((timeUnix + timezone) * 1000);
  const hours = data.getUTCHours();
  const minutes = date.getUTCMinutes();
  const period = hours >= 12 ? "PM" : "AM";

  return `${hours % 12 || 12}:${minutes} ${period}`;
};

export const getHours = (timeUnix, timezone) => {
  const date = new Date((timeUnix + timezone) * 1000);
  const hours = data.getUTCHours();
  const period = hours >= 12 ? "PM" : "AM";

  return `${hours % 12 || 12} ${period}`;
};

export const mps_to_kmph = (mps) => {
  return mps * 3.6;
};

export const apiText = {
  1: {
    level: "Good",
    message:
      "Air quality is considered satisfactory, and air pollution poses tittle or no risk",
  },
  2: {
    level: "Good",
    message:
      "Air quality is acceptable; however, for some polltants there may be a moderate health consern for a very small number of people who are usually sensitive to air pollution.",
  },
  3: {
    level: "Moderate",
    message:
      "Members of sensitive groups may experience health effects; The general public is not likely to be affected.",
  },
  4: {
    level: "Poor",
    message:
      "Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.",
  },
  5: {
    level: "Very Poor",
    message:
      "Health warning of emergency condition. The entire population is more likely to be affected.",
  },
};
