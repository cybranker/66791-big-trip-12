import TripSortView from "../view/trip-sort.js";
import TripListView from "../view/trip-list.js";
import TripDayView from "../view/trip-day.js";
import NoTripView from "../view/no-trips.js";
import WaypointPresenter from "./waypoint.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortTripTime, sortTripPrice} from "../utils/trip.js";
import {SortType, UpdateType, UserAction} from "../const.js";

class Trip {
  constructor(eventsContainer, count, tripsModel) {
    this._tripsModel = tripsModel;
    this._eventsContainer = eventsContainer;
    this._renderedTripCount = count;
    this._currentSortType = SortType.DEFAULT;
    this._tripPresenter = {};

    this._tripSortComponent = null;
    this._tripDayComponent = null;

    this._tripListComponent = new TripListView();
    this._noTripComponent = new NoTripView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._tripsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderEvents();
  }

  get _trips() {
    switch (this._currentSortType) {
      case SortType.TIME:
        return this._tripsModel.trips.slice().sort(sortTripTime);
      case SortType.PRICE:
        return this._tripsModel.trips.slice().sort(sortTripPrice);
    }

    return this._tripsModel.trips;
  }

  _handleModeChange() {
    Object
      .values(this._tripPresenter)
      .forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_TRIP:
        this._tripsModel.updateTrip(updateType, update);
        break;
      case UserAction.ADD_TRIP:
        this._tripsModel.addTrip(updateType, update);
        break;
      case UserAction.DELETE_TRIP:
        this._tripsModel.deleteTrip(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._tripPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._clearEvents();
        this._renderEvents();
        break;
      case UpdateType.MAJOR:
        this._clearEvents({resetRenderedTripDay: true, resetSortType: true});
        this._renderEvents();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearEvents();
    this._renderEvents();
    this._renderSort({resetSortType: true});
  }

  _renderSort() {
    if (this._tripSortComponent !== null) {
      this._tripSortComponent = null;
    }

    this._tripSortComponent = new TripSortView(this._currentSortType);
    this._tripSortComponent.sortTypeChangeHandler = this._handleSortTypeChange;
    render(this._eventsContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripDay(element, count, timeIn, sortType) {
    if (this._tripDayComponent !== null) {
      this._tripDayComponent = null;
    }

    this._tripDayComponent = new TripDayView(count + 1, timeIn, sortType);

    render(element, this._tripDayComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip(element, trip) {
    const waypointPresenter = new WaypointPresenter(element, this._eventsContainer, this._handleViewAction, this._handleModeChange);
    waypointPresenter.init(trip);
    this._tripPresenter[trip.id] = waypointPresenter;
  }

  _renderTripList() {
    render(this._eventsContainer, this._tripListComponent, RenderPosition.BEFOREEND);
  }

  _renderNoTrip() {
    render(this._eventsContainer, this._noTripComponent, RenderPosition.BEFOREEND);
  }

  _clearTrips() {
    Object
      .values(this._tripPresenter)
      .forEach((presenter) => presenter.destroy());
    this._tripPresenter = {};
  }

  _renderTrips() {
    const tripListElement = this._eventsContainer.querySelector(`.trip-days`);

    let tripDay = this._trips[0].timeIn.toDateString();
    let tripDayCount = 0;

    this._renderTripDay(tripListElement, tripDayCount, this._trips[0].timeIn, this._currentSortType);

    let tripEventsListElement = tripListElement.querySelectorAll(`.trip-events__list`)[tripDayCount];
    this._renderTrip(tripEventsListElement, this._trips[0]);

    for (let i = 1; i < this._renderedTripCount; i++) {
      if (tripDay !== this._trips[i].timeIn.toDateString()
          && this._currentSortType === SortType.DEFAULT) {
        tripDay = this._trips[i].timeIn.toDateString();
        tripDayCount++;

        this._renderTripDay(tripListElement, tripDayCount, this._trips[i].timeIn, this._currentSortType);
      }

      tripEventsListElement = tripListElement.querySelectorAll(`.trip-events__list`)[tripDayCount];
      this._renderTrip(tripEventsListElement, this._trips[i]);
    }
  }

  _clearEvents({resetRenderedTripDay = false, resetSortType = false} = {}) {
    Object
      .values(this._tripPresenter)
      .forEach((presenter) => presenter.destroy());
    this._tripPresenter = {};

    remove(this._tripSortComponent);
    remove(this._noTripComponent);
    remove(this._tripDayComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderEvents() {
    const tripCount = this._trips.length;

    if (tripCount === 0) {
      this._renderNoTrip();
      return;
    }

    this._renderSort();
    this._renderTripList();
    this._renderTrips();
  }
}

export default Trip;
