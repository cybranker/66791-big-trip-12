import TripSortView from "../view/trip-sort.js";
import TripEventEditView from "../view/trip-event-edit.js";
import TripListView from "../view/trip-list.js";
import TripDayView from "../view/trip-day.js";
import TripEventView from "../view/trip-event.js";
import NoTripView from "../view/no-trips.js";
import {render, RenderPosition, replace} from "../utils/render.js";

class Trip {
  constructor(eventsContainer, count) {
    this._eventsContainer = eventsContainer;
    this._renderedTripCount = count;

    this._tripSortComponent = new TripSortView();
    this._tripListComponent = new TripListView();
    this._noTripComponent = new NoTripView();
  }

  init(eventsTrips) {
    this._eventsTrips = eventsTrips.slice();

    this._renderEvents();
  }

  _renderSort() {
    render(this._eventsContainer, this._tripSortComponent, RenderPosition.BEFOREEND);
  }

  _renderTripDay(element, count, timeIn) {
    this._tripDayComponent = new TripDayView(count + 1, timeIn);

    render(element, this._tripDayComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip(element, trip) {
    const tripEventComponent = new TripEventView(trip);
    const tripEventEditComponent = new TripEventEditView(trip);

    const replaceTripToForm = () => {
      replace(tripEventEditComponent, tripEventComponent);
    };

    const replaceFormToTrip = () => {
      replace(tripEventComponent, tripEventEditComponent);
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

    render(element, tripEventComponent, RenderPosition.BEFOREEND);
  }

  _renderTripList() {
    render(this._eventsContainer, this._tripListComponent, RenderPosition.BEFOREEND);
  }

  _renderNoTrip() {
    render(this._eventsContainer, this._noTripComponent, RenderPosition.BEFOREEND);
  }

  _renderTrips() {
    const tripListElement = this._eventsContainer.querySelector(`.trip-days`);

    let tripDay = this._eventsTrips[0].timeIn.toDateString();
    let tripDayCount = 0;
    this._renderTripDay(tripListElement, tripDayCount, this._eventsTrips[0].timeIn);

    let tripEventsListElement = tripListElement.querySelectorAll(`.trip-events__list`)[tripDayCount];
    this._renderTrip(tripEventsListElement, this._eventsTrips[0]);

    for (let i = 1; i < this._renderedTripCount; i++) {
      if (tripDay !== this._eventsTrips[i].timeIn.toDateString()) {
        tripDay = this._eventsTrips[i].timeIn.toDateString();
        tripDayCount++;
        this._renderTripDay(tripListElement, tripDayCount, this._eventsTrips[i].timeIn);
      }

      tripEventsListElement = tripListElement.querySelectorAll(`.trip-events__list`)[tripDayCount];
      this._renderTrip(tripEventsListElement, this._eventsTrips[i]);
    }
  }

  _renderEvents() {
    if (this._eventsTrips.length === 0) {
      this._renderNoTrip();
      return;
    }

    this._renderSort();
    this._renderTripList();
    this._renderTrips();
  }
}

export default Trip;
