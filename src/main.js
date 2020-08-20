import TripInfoView from "./view/trip-info.js";
import TripMenuView from "./view/trip-menu.js";
import TripFilterView from "./view/trip-filters.js";
import TripSortView from "./view/trip-sort.js";
import {createTripEventEditTemplate} from "./view/trip-event-edit.js";
import TripListView from "./view/trip-list.js";
import TripDayView from "./view/trip-day.js";
import {createTripEventTemplate} from "./view/trip-event.js";
import {generateTrip} from "./mock/trip.js";
import {generateFilter} from "./mock/filter.js";
import {renderTemplate, renderElement, RenderPosition} from "./utils.js";

const TRIP_COUNT = 21;

const trips = new Array(TRIP_COUNT)
  .fill()
  .map(generateTrip)
  .sort((a, b) => {
    a = new Date(a.timeIn);
    b = new Date(b.timeIn);

    return a - b;
  });
const filters = generateFilter();

const siteHeaderElement = document.querySelector(`.trip-main`);
const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);
const siteMainElement = document.querySelector(`.trip-events`);

renderElement(siteHeaderElement, new TripInfoView().element, RenderPosition.AFTERBEGIN);
renderElement(tripControlsElement.children[0], new TripMenuView().element, RenderPosition.AFTEREND);
renderElement(tripControlsElement, new TripFilterView(filters).element, RenderPosition.BEFOREEND);

renderElement(siteMainElement, new TripSortView().element, RenderPosition.BEFOREEND);
renderElement(siteMainElement, new TripListView().element, RenderPosition.BEFOREEND);

const tripListElement = siteMainElement.querySelector(`.trip-days`);

renderElement(tripListElement, new TripDayView(0, trips[0].timeIn).element, RenderPosition.BEFOREEND);

let tripEventsListElement = tripListElement.querySelectorAll(`.trip-events__list`)[0];

renderTemplate(tripEventsListElement, createTripEventEditTemplate(trips[0]), `beforeend`);

let tripDay = trips[1].timeIn.toDateString();
let tripDayCount = 1;
renderElement(tripListElement, new TripDayView(tripDayCount, trips[1].timeIn).element, RenderPosition.BEFOREEND);

for (let i = 1; i < TRIP_COUNT; i++) {
  if (tripDay !== trips[i].timeIn.toDateString()) {
    tripDay = trips[i].timeIn.toDateString();
    tripDayCount++;
    renderElement(tripListElement, new TripDayView(tripDayCount, trips[i].timeIn).element, RenderPosition.BEFOREEND);
  }

  tripEventsListElement = tripListElement.querySelectorAll(`.trip-events__list`)[tripDayCount];
  renderTemplate(tripEventsListElement, createTripEventTemplate(trips[i]), `beforeend`);
}
