import {createElement} from "../utils.js";

class NoTrip {
  constructor() {
    this._element = null;
  }

  _createNoTripTemplate() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this._createNoTripTemplate());
    }

    return this._element;
  }

  set element(value) {
    this._element = value;
  }
}

export default NoTrip;
