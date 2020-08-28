import AbstractView from "./abstract.js";

class NoTrip extends AbstractView {
  _createNoTripTemplate() {
    return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
  }

  get _template() {
    return this._createNoTripTemplate();
  }
}

export default NoTrip;
