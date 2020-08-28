import AbstractView from "./abstract.js";
import {dateTimeFormat} from "../utils.js";

class TripDay extends AbstractView {
  constructor(count, date) {
    super();
    this._count = count;
    this._date = date;
  }

  _createTripDayTemplate(count, date) {
    const month = date.toDateString().split(` `)[1].toUpperCase();
    const day = date.toDateString().split(` `)[2];

    return `<li class="trip-days__item  day">
        <div class="day__info">
          <span class="day__counter">${count}</span>
          <time class="day__date" datetime="${dateTimeFormat(date)}">${month} ${day}</time>
        </div>

        <ul class="trip-events__list"></ul>
      </li>`;
  }

  get _template() {
    return this._createTripDayTemplate(this._count, this._date);
  }
}

export default TripDay;
