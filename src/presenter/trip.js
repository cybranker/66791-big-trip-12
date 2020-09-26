import TripSortView from "../view/trip-sort.js";
import TripListView from "../view/trip-list.js";
import TripDayView from "../view/trip-day.js";
import NoTripView from "../view/no-trips.js";
import WaypointPresenter from "./waypoint.js";
import TripNewPresenter from "./trip-new.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortTripTime, sortTripPrice, sortByTimeIn} from "../utils/trip.js";
import {filter} from "../utils/filter.js";
import {SortType, UpdateType, UserAction} from "../const.js";

class Trip {
  constructor(eventsContainer, tripsModel, filterModel, offersModel) {
    this._tripsModel = tripsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;

    this._eventsContainer = eventsContainer;
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

    this._tripNewPresenter = new TripNewPresenter(this._eventsContainer, this._handleViewAction);
  }

  init() {
    this._tripsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);

    this._renderEvents();
  }

  destroy() {
    this._clearEvents({resetSortType: true});

    this._tripsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
    this._offersModel.removeObserver(this._handleModelEvent);
  }

  createTrip(callback) {
    this._tripNewPresenter.init(callback);
  }

  get _trips() {
    const filterType = this._filterModel.getFilter();
    const trips = this._tripsModel.trips;
    const filtredTrips = filter[filterType](trips);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filtredTrips.slice().sort(sortTripTime);
      case SortType.PRICE:
        return filtredTrips.slice().sort(sortTripPrice);
    }

    return filtredTrips;
  }

  get _offers() {
    return this._offersModel.offers;
  }

  _handleModeChange() {
    this._tripNewPresenter.destroy();
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
        this._clearEvents({resetSortType: true});
        // this._renderEvents();
        break;
      case UpdateType.INIT:
        this._clearEvents();
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
    waypointPresenter.init(trip, this._offers);
    this._tripPresenter[trip.id] = waypointPresenter;
  }

  _renderTripList() {
    render(this._eventsContainer, this._tripListComponent, RenderPosition.BEFOREEND);
  }

  _renderNoTrip() {
    render(this._eventsContainer, this._noTripComponent, RenderPosition.BEFOREEND);
  }

  _renderTrips() {
    const tripListElement = this._eventsContainer.querySelector(`.trip-days`);

    let tripDay = sortByTimeIn(this._trips)[0].timeIn.toDateString();
    let tripDayCount = 0;

    this._renderTripDay(tripListElement, tripDayCount, this._trips[0].timeIn, this._currentSortType);

    let tripEventsListElement = tripListElement.querySelectorAll(`.trip-events__list`)[tripDayCount];
    this._renderTrip(tripEventsListElement, this._trips[0]);

    for (let i = 1; i < this._trips.length; i++) {
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

  _clearEvents({resetSortType = false} = {}) {
    this._tripNewPresenter.destroy();
    Object
      .values(this._tripPresenter)
      .forEach((presenter) => presenter.destroy());
    this._tripPresenter = {};

    remove(this._tripSortComponent);
    remove(this._noTripComponent);
    remove(this._tripListComponent);
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
