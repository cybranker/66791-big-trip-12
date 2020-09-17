import {generateEventType} from "./event-type.js";
import {getRandomInteger, getArrayRandomLength} from "../utils/common.js";
import {CITIES, SENTENCE, OFFERS_MAP} from "../const.js";

const generateId = () => Date.now() + parseInt(Math.random() * 10000, 10);

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

const generateCity = (cities) => {
  const randomIndex = getRandomInteger(0, cities.length - 1);

  return cities[randomIndex];
};

const generateOffers = (offersMap) => {
  const isOffers = Boolean(getRandomInteger(0, 1));

  if (!isOffers) {
    return [];
  }

  const offers = Object.entries(offersMap);

  return getArrayRandomLength(offers, getRandomInteger(0, offers.length - 1));
};

const generateDescription = (sentence) => getArrayRandomLength(sentence, getRandomInteger(0, 4)).join(` `);

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
    id: generateId(),
    event: generateEvent(generateEventType()),
    city: generateCity(CITIES),
    offers: Object.fromEntries(generateOffers(OFFERS_MAP)),
    description: generateDescription(SENTENCE),
    photos: generatePhotos(getRandomInteger(1, 6)),
    timeIn,
    timeOut,
    price: getRandomInteger(10, 1000),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};

export {
  generateId,
  getRandomInteger,
  generateOffers,
  generateDescription,
  generatePhotos,
  generateTrip
};
