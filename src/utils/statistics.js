import moment from "moment";
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

const getTransportStat = (trips) => {
  const transportStat = {};

  trips.forEach((it) => {
    if (transportStat[getEventWithoutActionName(it.event)]) {
      transportStat[getEventWithoutActionName(it.event)] += 1;
    } else {
      transportStat[getEventWithoutActionName(it.event)] = 1;
    }
  });

  return sortResult(transportStat);
};

const getTimeStat = (trips) => {
  const timeStat = {};

  trips.forEach((it) => {
    if (timeStat[getEventWithoutActionName(it.event)]) {
      timeStat[getEventWithoutActionName(it.event)] += moment.duration(moment(it.timeOut).diff(moment(it.timeIn))).hours();
    } else {
      timeStat[getEventWithoutActionName(it.event)] = moment.duration(moment(it.timeOut).diff(moment(it.timeIn))).hours();
    }
  });

  return sortResult(timeStat);
};

export {
  TripLabel,
  getMoneyStat,
  getTransportStat,
  getTimeStat
};
