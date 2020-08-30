import AbstractView from "./abstract.js";
import {upperFirst} from "../utils/trip.js";

class Filter extends AbstractView {
  constructor(filters) {
    super();
    this._filters = filters;
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

  get _template() {
    return this._createTripFiltersTemplate(this._filters);
  }
}

export default Filter;
