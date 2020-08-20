import {dateTimeFormat, createElement} from "../utils.js";

class TripDay {
  constructor(count, date) {
    this._count = count;
    this._date = date;
    this._element = null;
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

  get element() {
    if (!this._element) {
      this._element = createElement(this._createTripDayTemplate(this._count, this._date));
    }

    return this._element;
  }

  set element(value) {
    this._element = value;
  }
}

export default TripDay;
