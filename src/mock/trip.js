import {generateEventType} from "./event-type.js";

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

const generateEvent = (events) => {
  const eventsKeys = Object.keys(events);

  const randomKey = getRandomInteger(0, eventsKeys.length - 1);
  const randomIndex = getRandomInteger(0, events[eventsKeys[randomKey]].length - 1);
  const randomEvent = events[eventsKeys[randomKey]][randomIndex];

  let action = `to`;

  if (eventsKeys[randomKey] === `activity`) {
    if (randomEvent !== `Check-in`) {
      action = `in`;
    } else {
      action = ``;
    }
  }

  return `${randomEvent} ${action}`;
};

const generateCity = () => {
  const cities = [
    `Amsterdam`,
    `Geneva`,
    `Chamonix`,
    `Saint Petersburg`,
    `Paris`,
    `New York`
  ];

  const randomIndex = getRandomInteger(0, cities.length - 1);

  return cities[randomIndex];
};

const generateOffers = () => {
  const isOffers = Boolean(getRandomInteger(0, 1));

  if (!isOffers) {
    return [];
  }

  const offersMap = {
    luggage: {
      name: `Add luggage`,
      price: 30
    },
    comfort: {
      name: `Switch to comfort`,
      price: 100
    },
    meal: {
      name: `Add meal`,
      price: 15
    },
    seats: {
      name: `Choose seats`,
      price: 5
    },
    train: {
      name: `Travel by train`,
      price: 40
    }
  };

  const offers = Object.entries(offersMap);

  return getArrayRandomLength(offers, getRandomInteger(0, offers.length - 1));
};

const generateDescription = () => {
  const sentence = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ];

  return getArrayRandomLength(sentence, getRandomInteger(0, 4)).join(` `);
};

const generatePhotos = (quantity = 1) => {
  const arr = [];

  for (let i = 0; i < quantity; i++) {
    arr.push(`http://picsum.photos/248/152?r=${Math.random()}`);
  }

  return arr;
};

const generateTime = (date) => {
  const maxDaysGap = 4;
  const daysGap = getRandomInteger(0, maxDaysGap);
  let currentDate;

  if (date) {
    currentDate = date;
    const currentDateHours = getRandomInteger(currentDate.getHours(), 23);
    const currentDateMinutes = getRandomInteger(currentDate.getMinutes(), 59);

    currentDate.setHours(currentDateHours, currentDateMinutes);
  } else {
    currentDate = new Date();

    currentDate.setHours(getRandomInteger(0, 23), getRandomInteger(0, 59));
  }

  currentDate.setDate(currentDate.getDate() + daysGap);

  return new Date(currentDate);
};

const generateTrip = () => {
  const timeIn = generateTime();
  const timeOut = generateTime(new Date(timeIn));

  return {
    event: generateEvent(generateEventType()),
    city: generateCity(),
    offers: Object.fromEntries(generateOffers()),
    description: generateDescription(),
    photos: generatePhotos(getRandomInteger(1, 6)),
    timeIn,
    timeOut,
    price: getRandomInteger(10, 1000),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};

export {generateTrip};
