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

const sortTripTime = (tripA, tripB) => {
  const tripATime = new Date(tripA.timeOut - tripA.timeIn);
  const tripBTime = new Date(tripB.timeOut - tripB.timeIn);

  return tripBTime - tripATime;
};

const sortTripPrice = (tripA, tripB) => {
  const tripAPrice = tripA.price;
  const tripBPrice = tripB.price;

  return tripBPrice - tripAPrice;
};

export {
  getEventWithoutActionName,
  upperFirst,
  humanizeTaskDate,
  dateTimeFormat,
  sortTripTime,
  sortTripPrice
};
