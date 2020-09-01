import AbstractView from "./abstract.js";
import {SortType} from "../const.js";

class TripSort extends AbstractView {
  constructor(currentSortType) {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._currentSortType = currentSortType;
  }

  _createTripSortTemplate() {
    return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
      <span class="trip-sort__item  trip-sort__item--day">${this._currentSortType === SortType.DEFAULT ? `Day` : ``}</span>

      <div class="trip-sort__item  trip-sort__item--event">
        <input id="sort-event" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-event" data-sort-type="${SortType.DEFAULT}" ${this._currentSortType === SortType.DEFAULT ? `checked` : ``}>
        <label class="trip-sort__btn" for="sort-event">Event</label>
      </div>

      <div class="trip-sort__item  trip-sort__item--time">
        <input id="sort-time" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-time" data-sort-type="${SortType.TIME}" ${this._currentSortType === SortType.TIME ? `checked` : ``}>
        <label class="trip-sort__btn  trip-sort__btn--active  trip-sort__btn--by-increase" for="sort-time">
          Time
        </label>
      </div>

      <div class="trip-sort__item  trip-sort__item--price">
        <input id="sort-price" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-price" data-sort-type="${SortType.PRICE}" ${this._currentSortType === SortType.PRICE ? `checked` : ``}>
        <label class="trip-sort__btn" for="sort-price">
          Price
        </label>
      </div>

      <span class="trip-sort__item  trip-sort__item--offers">Offers</span>
    </form>`;
  }

  get _template() {
    return this._createTripSortTemplate();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.getAttribute(`name`) !== `trip-sort`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  set sortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.element.addEventListener(`click`, this._sortTypeChangeHandler);
  }
}

export default TripSort;
