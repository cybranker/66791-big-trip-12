import AbstractView from "./abstract.js";
import {upperFirst} from "../utils/trip.js";

class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  _createTripFilterItemTemplate(filter, currentFilterType) {
    const {type, name} = filter;

    return `<div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${type}" ${type === currentFilterType ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${name}">${upperFirst(name)}</label>
  </div>`;
  }

  _createTripFiltersTemplate(filterItems, currentFilterType) {
    const tripFilterItemsTemplate = filterItems
      .map((filter) => this._createTripFilterItemTemplate(filter, currentFilterType))
      .join(``);

    return `<form class="trip-filters" action="#" method="get">
      ${tripFilterItemsTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
  }

  get _template() {
    return this._createTripFiltersTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.value);
  }

  set filterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.element.addEventListener(`change`, this._filterTypeChangeHandler);
  }
}

export default Filter;
