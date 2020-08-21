import {createElement} from "../utils.js";

class TripList {
  constructor() {
    this._element = null;
  }

  _createTripListTemplate() {
    return `<ul class="trip-days"></ul>`;
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this._createTripListTemplate());
    }

    return this._element;
  }

  set element(value) {
    this._element = value;
  }
}

export default TripList;
