import TripSortView from "../view/trip-sort.js";
import TripListView from "../view/trip-list.js";
import TripDayView from "../view/trip-day.js";
import LoadingView from "../view/loading.js";
import NoTripView from "../view/no-trips.js";
import WaypointPresenter, {State as WaypointPresenterViewState} from "./waypoint.js";
import TripNewPresenter from "./trip-new.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortTripTime, sortTripPrice, sortByTimeIn} from "../utils/trip.js";
import {filter} from "../utils/filter.js";
import {SortType, UpdateType, UserAction} from "../const.js";

class Trip {
  constructor(eventsContainer, tripsModel, filterModel, offersModel, destinationsModel, api) {
    this._tripsModel = tripsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._eventsContainer = eventsContainer;
    this._currentSortType = SortType.DEFAULT;
    this._tripPresenter = {};
    this._isLoading = true;
    this._api = api;

    this._tripSortComponent = null;
    this._tripDayComponent = null;

    this._tripListComponent = new TripListView();
    this._noTripComponent = new NoTripView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init() {
    this._tripsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
    this._offersModel.addObserver(this._handleModelEvent);
    this._destinationsModel.addObserver(this._handleModelEvent);

    this._tripNewPresenter = new TripNewPresenter(this._eventsContainer, this._handleViewAction, this._offers, this._destinations);

    this._renderEvents();
  }

  destroy() {
    this._clearEvents({resetSortType: true});

    this._tripsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
    this._offersModel.removeObserver(this._handleModelEvent);
    this._destinationsModel.removeObserver(this._handleModelEvent);
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

  get _destinations() {
    return this._destinationsModel.destinations;
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
        this._tripPresenter[update.id].setViewState(WaypointPresenterViewState.SAVING);
        this._api.updateTrip(update)
          .then((response) => {
            this._tripsModel.updateTrip(updateType, response);
          })
          .catch(() => {
            this._tripPresenter[update.id].setViewState(WaypointPresenterViewState.ABORTING);
          });
        break;
      case UserAction.ADD_TRIP:
        this._tripNewPresenter.setSaving();
        this._api.addTrip(update)
          .then((response) => {
            this._tripsModel.addTrip(updateType, response);
          })
          .catch(() => {
            this._tripNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_TRIP:
        this._tripPresenter[update.id].setViewState(WaypointPresenterViewState.DELETING);
        this._api.deleteTrip(update)
          .then(() => {
            this._tripsModel.deleteTrip(updateType, update);
          })
          .catch(() => {
            this._tripPresenter[update.id].setViewState(WaypointPresenterViewState.ABORTING);
          });
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
        this._renderEvents();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
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
    waypointPresenter.init(trip, this._offers, this._destinations);
    this._tripPresenter[trip.id] = waypointPresenter;
  }

  _renderTripList() {
    render(this._eventsContainer, this._tripListComponent, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    render(this._eventsContainer, this._loadingComponent, RenderPosition.BEFOREEND);
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
    remove(this._loadingComponent);
    remove(this._tripListComponent);
    remove(this._tripDayComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderEvents() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

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
