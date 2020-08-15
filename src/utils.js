const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getArrayRandomLength = (arr, len) => {
  const newArr = [];
  let value;

  for (let i = 0; i <= len; i++) {
    value = arr[getRandomInteger(0, arr.length - 1)];

    newArr.push(value);
    arr = arr.filter((it) => it !== value);
  }

  return newArr;
};

const getEventWithoutActionName = (type) => {
  let eventType = type.split(` `)[0].toLowerCase();

  return eventType;
};

const upperFirst = (string) => {
  return string ? string.charAt(0).toUpperCase() + string.slice(1) : ``;
};

const humanizeTaskDate = (date, yearType) => date
  .toLocaleString(`en-GB`, {
    year: yearType,
    month: `numeric`,
    day: `numeric`,
    hour: `2-digit`,
    minute: `2-digit`
  });

const dateTimeFormat = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;

export {getRandomInteger, getArrayRandomLength, getEventWithoutActionName, upperFirst, humanizeTaskDate, dateTimeFormat};
