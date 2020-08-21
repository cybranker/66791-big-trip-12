import {createElement} from "../utils.js";

class TripInfo {
  constructor() {
    this._element = null;
  }

  _createTripInfoTemplate() {
    return `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

        <p class="trip-info__dates">Mar 18&nbsp;&mdash;&nbsp;20</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">1230</span>
      </p>
    </section>`;
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this._createTripInfoTemplate());
    }

    return this._element;
  }

  set element(value) {
    this._element = value;
  }
}

export default TripInfo;
