import AbstractView from "./abstract.js";

class TripMenu extends AbstractView {
  _createTripMenuTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
      <a class="trip-tabs__btn" href="#">Stats</a>
    </nav>`;
  }

  get _template() {
    return this._createTripMenuTemplate();
  }
}

export default TripMenu;
