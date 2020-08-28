import TripInfoView from "./view/trip-info.js";
import TripMenuView from "./view/trip-menu.js";
import TripFilterView from "./view/trip-filters.js";
import TripSortView from "./view/trip-sort.js";
import TripEventEditView from "./view/trip-event-edit.js";
import TripListView from "./view/trip-list.js";
import TripDayView from "./view/trip-day.js";
import TripEventView from "./view/trip-event.js";
import NoTripView from "./view/no-trips.js";
import {generateTrip} from "./mock/trip.js";
import {generateFilter} from "./mock/filter.js";
import {render, RenderPosition} from "./utils.js";

const TRIP_COUNT = 20;

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

const renderTripDay = (tripListElement, tripDayCount, timeIn) => {
  const tripDayComponent = new TripDayView(tripDayCount + 1, timeIn);

  render(tripListElement, tripDayComponent.element, RenderPosition.BEFOREEND);
};

const renderTrip = (tripEventsListElement, trip) => {
  const tripEventComponent = new TripEventView(trip);
  const tripEventEditComponent = new TripEventEditView(trip);

  const replaceTripToForm = () => {
    tripEventsListElement.replaceChild(tripEventEditComponent.element, tripEventComponent.element);
  };

  const replaceFormToTrip = () => {
    tripEventsListElement.replaceChild(tripEventComponent.element, tripEventEditComponent.element);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToTrip();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  tripEventComponent.editClickHandler = () => {
    replaceTripToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  };

  tripEventEditComponent.formSubmitHandler = () => {
    replaceFormToTrip();
    document.removeEventListener(`keydown`, onEscKeyDown);
  };

  render(tripEventsListElement, tripEventComponent.element, RenderPosition.BEFOREEND);
};

const renderEvents = (eventsContainer, eventsTrips) => {
  if (eventsTrips.length === 0) {
    render(eventsContainer, new NoTripView().element, RenderPosition.BEFOREEND);
    return;
  }

  render(eventsContainer, new TripSortView().element, RenderPosition.BEFOREEND);
  render(eventsContainer, new TripListView().element, RenderPosition.BEFOREEND);

  const tripListElement = siteMainElement.querySelector(`.trip-days`);

  let tripDay = eventsTrips[0].timeIn.toDateString();
  let tripDayCount = 0;
  renderTripDay(tripListElement, tripDayCount, eventsTrips[0].timeIn);

  let tripEventsListElement = tripListElement.querySelectorAll(`.trip-events__list`)[tripDayCount];
  renderTrip(tripEventsListElement, eventsTrips[0]);

  for (let i = 1; i < TRIP_COUNT; i++) {
    if (tripDay !== eventsTrips[i].timeIn.toDateString()) {
      tripDay = eventsTrips[i].timeIn.toDateString();
      tripDayCount++;
      renderTripDay(tripListElement, tripDayCount, eventsTrips[i].timeIn);
    }

    tripEventsListElement = tripListElement.querySelectorAll(`.trip-events__list`)[tripDayCount];
    renderTrip(tripEventsListElement, eventsTrips[i]);
  }
};

render(siteHeaderElement, new TripInfoView().element, RenderPosition.AFTERBEGIN);
render(tripControlsElement.children[0], new TripMenuView().element, RenderPosition.AFTEREND);
render(tripControlsElement, new TripFilterView(filters).element, RenderPosition.BEFOREEND);

renderEvents(siteMainElement, trips);
