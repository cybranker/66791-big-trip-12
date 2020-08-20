import {upperFirst} from "../utils.js";

const createTripFilterItemTemplate = (filter, isChecked) => {
  const {name} = filter;

  return `<div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${isChecked ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${name}">${upperFirst(name)}</label>
  </div>`;
};

const createTripFiltersTemplate = (filterItems) => {
  const tripFilterItemsTemplate = filterItems
    .map((filter, index) => createTripFilterItemTemplate(filter, index === 0))
    .join(``);

  return `<form class="trip-filters" action="#" method="get">
      ${tripFilterItemsTemplate}

      <button class="visually-hidden" type="submit">Accept filter</button>
    </form>`;
};

export {createTripFiltersTemplate};
