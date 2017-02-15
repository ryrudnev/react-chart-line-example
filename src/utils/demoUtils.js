export const monthMap = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь',
];

export const getFormattedDate = (date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  let day = date.getDate().toString();
  day = day.length > 1 ? day : `0${day}`;
  return `${day} ${monthMap[month]} ${year}`;
};

export const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min)) + min;

export const getRandomFloat = (min, max, fixed = 2) => (Math.random() * (max - min) + min).toFixed(fixed);

export const addDays = (date, days) => {
  const newDate = new Date(date.valueOf())
  newDate.setDate(newDate.getDate() + days);
  return newDate;
};

export const getDatesFromRange = (startDate, stopDate) => {
  const result = [];
  let currentDate = startDate;
  while (currentDate <= stopDate) {
    result.push(new Date(currentDate))
    currentDate = addDays(currentDate, 1);
  }
  return result;
};

export const getDayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

export const createDateFromDay = (year, day) => {
  const date = new Date(year, 0);
  return new Date(date.setDate(day));
};

export const toUpperCaseFirst = (str) => str.charAt(0).toUpperCase() + str.slice(1);
