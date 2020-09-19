import moment from "moment";
import {FilterType} from "../const.js";

const filter = {
  [FilterType.EVERYTHING]: (trips) => trips,
  [FilterType.FUTURE]: (trips) => trips.filter((trip) => moment(new Date()).isBefore(trip.timeIn)),
  [FilterType.PAST]: (trips) => trips.filter((trip) => moment(new Date()).isAfter(trip.timeOut))
};

export {filter};
