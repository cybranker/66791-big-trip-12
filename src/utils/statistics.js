import {generateEventType} from "../mock/event-type.js";
import {getEventWithoutActionName} from "./trip.js";

const TripLabel = {
  'taxi': `🚕 TAXI`,
  'bus': `🚌 BUS`,
  'train': `🚆 TRAIN`,
  'ship': `🚢 SHIP`,
  'transport': `🚊 TRANSPORT`,
  'drive': `🚗 DRIVE`,
  'flight': `✈ FLY`,
  'check-in': `🏨 CHECK`,
  'sightseeing': `🏛️ SIGHTSEEING`,
  'restaurant': `🍴 RESTAURANT`
};

const sortResult = (obj) => Object.fromEntries(
    Object.entries(obj)
      .sort((a, b) => b[1] - a[1])
);

const getMoneyStat = (trips) => {
  const moneyStats = {};

  trips.forEach((it) => {
    if (moneyStats[getEventWithoutActionName(it.event)]) {
      moneyStats[getEventWithoutActionName(it.event)] += it.price;
    } else {
      moneyStats[getEventWithoutActionName(it.event)] = it.price;
    }
  });

  return sortResult(moneyStats);
};

export {
  TripLabel,
  getMoneyStat
};
