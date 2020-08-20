import {upperFirst, createElement} from "../utils.js";

class Filter {
  constructor(filters) {
    this._filters = filters;
    this._element = null;
  }

  _createTripFilterItemTemplate(filter, isChecked) {
    const {name} = filter;

    return `<div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${name}">${upperFirst(name)}</label>
  </div>`;
  }

  _createTripFiltersTemplate(filterItems) {
    const tripFilterItemsTemplate = filterItems
      .map((filter, index) => this._createTripFilterItemTemplate(filter, index === 0))
      .join(``);

    return `<form class="trip-filters" action="#" method="get">
      ${tripFilterItemsTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this._createTripFiltersTemplate(this._filters));
    }

    return this._element;
  }

  set element(value) {
    this._element = value;
  }
}

export default Filter;
