import {createElement} from "../utils.js";

class TripMenu {
  constructor() {
    this._element = null;
  }

  _createTripMenuTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>`;
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this._createTripMenuTemplate());
    }

    return this._element;
  }

  set element(value) {
    this._element = value;
  }
}

export default TripMenu;
