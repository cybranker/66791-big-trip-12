import {dateTimeFormat} from "../utils.js";

const createTripDayTemplate = (count, date) => {
  const month = date.toDateString().split(` `)[1].toUpperCase();
  const day = date.toDateString().split(` `)[2];

  return `<li class="trip-days__item  day">
    <div class="day__info">
      <span class="day__counter">${count}</span>
      <time class="day__date" datetime="${dateTimeFormat(date)}">${month} ${day}</time>
    </div>

    <ul class="trip-events__list"></ul>
  </li>`;
};

export {createTripDayTemplate};
