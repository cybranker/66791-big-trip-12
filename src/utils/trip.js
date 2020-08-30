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

export {
  getEventWithoutActionName,
  upperFirst,
  humanizeTaskDate,
  dateTimeFormat
};
