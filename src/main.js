import {createTripInfoTemplate} from "./view/trip-info.js";
import {createTripMenuTemplate} from "./view/trip-menu.js";
import {createTripFiltersTemplate} from "./view/trip-filters.js";
import {createTripSortTemplate} from "./view/trip-sort.js";
import {createTripEventEditTemplate} from "./view/trip-event-edit.js";
import {createTripListTemplate} from "./view/trip-list.js";
import {createTripDayTemplate} from "./view/trip-day.js";
import {createTripEventTemplate} from "./view/trip-event.js";
import {generateTrip} from "./mock/trip.js";

const TRIP_COUNT = 21;

const trips = new Array(TRIP_COUNT)
  .fill()
  .map(generateTrip)
  .sort((a, b) => {
    a = new Date(a.timeIn);
    b = new Date(b.timeIn);

    return a - b;
  });

const render = (container, template, place) => container.insertAdjacentHTML(place, template);

const siteHeaderElement = document.querySelector(`.trip-main`);
const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);
const siteMainElement = document.querySelector(`.trip-events`);

render(siteHeaderElement, createTripInfoTemplate(), `afterbegin`);
render(tripControlsElement.children[0], createTripMenuTemplate(), `afterend`);
render(tripControlsElement, createTripFiltersTemplate(), `beforeend`);

render(siteMainElement, createTripSortTemplate(), `beforeend`);
render(siteMainElement, createTripListTemplate(), `beforeend`);

const tripListElement = siteMainElement.querySelector(`.trip-days`);

render(tripListElement, createTripDayTemplate(0, trips[0].timeIn), `beforeend`);

let tripEventsListElement = tripListElement.querySelectorAll(`.trip-events__list`)[0];

render(tripEventsListElement, createTripEventEditTemplate(trips[0]), `beforeend`);

let tripDay = trips[1].timeIn.toDateString();
let tripDayCount = 1;
render(tripListElement, createTripDayTemplate(tripDayCount, trips[1].timeIn), `beforeend`);

for (let i = 1; i < TRIP_COUNT; i++) {
  if (tripDay !== trips[i].timeIn.toDateString()) {
    tripDay = trips[i].timeIn.toDateString();
    tripDayCount++;
    render(tripListElement, createTripDayTemplate(tripDayCount, trips[i].timeIn), `beforeend`);
  }

  tripEventsListElement = tripListElement.querySelectorAll(`.trip-events__list`)[tripDayCount];
  render(tripEventsListElement, createTripEventTemplate(trips[i]), `beforeend`);
}
