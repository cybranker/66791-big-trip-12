import {createTripInfoTemplate} from "./view/trip-info.js";
import {createTripMenuTemplate} from "./view/trip-menu.js";
import {createTripFiltersTemplate} from "./view/trip-filters.js";
import {createTripSortTemplate} from "./view/trip-sort.js";
import {createTripEventEditTemplate} from "./view/trip-event-edit.js";
import {createTripListTemplate} from "./view/trip-list.js";
import {createTripDayTemplate} from "./view/trip-day.js";
import {createTripEventTemplate} from "./view/trip-event.js";

const TRIP_COUNT = 3;

const render = (container, template, place) => container.insertAdjacentHTML(place, template);

const siteHeaderElement = document.querySelector(`.trip-main`);
const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);
const siteMainElement = document.querySelector(`.trip-events`);

render(siteHeaderElement, createTripInfoTemplate(), `afterbegin`);
render(tripControlsElement.children[0], createTripMenuTemplate(), `afterend`);
render(tripControlsElement, createTripFiltersTemplate(), `beforeend`);

render(siteMainElement, createTripSortTemplate(), `beforeend`);
render(siteMainElement, createTripEventEditTemplate(), `beforeend`);
render(siteMainElement, createTripListTemplate(), `beforeend`);

const tripListElement = siteMainElement.querySelector(`.trip-days`);

render(tripListElement, createTripDayTemplate(), `beforeend`);

const tripEventsListElement = tripListElement.querySelector(`.trip-events__list`);

for (let i = 0; i < TRIP_COUNT; i++) {
  render(tripEventsListElement, createTripEventTemplate(), `beforeend`);
}
