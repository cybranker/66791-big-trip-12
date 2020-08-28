import AbstractView from "./abstract.js";

class TripList extends AbstractView {
  _createTripListTemplate() {
    return `<ul class="trip-days"></ul>`;
  }

  get _template() {
    return this._createTripListTemplate();
  }
}

export default TripList;
