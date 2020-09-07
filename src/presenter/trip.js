import TripSortView from "../view/trip-sort.js";
import TripListView from "../view/trip-list.js";
import TripDayView from "../view/trip-day.js";
import NoTripView from "../view/no-trips.js";
import WaypointPresenter from "./waypoint.js";
import {updateItem} from "../utils/common.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortTripTime, sortTripPrice} from "../utils/trip.js";
import {SortType} from "../const.js";

class Trip {
  constructor(eventsContainer, count) {
    this._eventsContainer = eventsContainer;
    this._renderedTripCount = count;
    this._currentSortType = SortType.DEFAULT;
    this._tripPresenter = {};

    this._tripSortComponent = new TripSortView(this._currentSortType);
    this._tripListComponent = new TripListView();
    this._noTripComponent = new NoTripView();

    this._handleTripChange = this._handleTripChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(eventsTrips) {
    this._eventsTrips = eventsTrips.slice();
    this._sourcedEventsTrips = eventsTrips.slice();

    this._renderEvents();
  }

  _handleTripChange(updateTrip) {
    this._eventsTrips = updateItem(this._eventsTrips, updateTrip);
    this._sourcedEventsTrips = updateItem(this._sourcedEventsTrips, updateTrip);
    this._tripPresenter[updateTrip.id].init(updateTrip);
  }

  _sortTrips(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._eventsTrips.sort(sortTripTime);
        break;
      case SortType.PRICE:
        this._eventsTrips.sort(sortTripPrice);
        break;
      default:
        this._eventsTrips = this._sourcedEventsTrips.slice();
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortTrips(sortType);
    this._clearTrips();
    this._renderTrips();
    this._renderSort();
  }

  _renderSort() {
    remove(this._tripSortComponent);
    this._tripSortComponent = new TripSortView(this._currentSortType);
    render(this._eventsContainer, this._tripSortComponent, RenderPosition.AFTERBEGIN);
    this._tripSortComponent.sortTypeChangeHandler = this._handleSortTypeChange;
  }

  _renderTripDay(element, count, timeIn, sortType) {
    this._tripDayComponent = new TripDayView(count + 1, timeIn, sortType);

    render(element, this._tripDayComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip(element, trip) {
    const waypointPresenter = new WaypointPresenter(element, this._eventsContainer, this._handleTripChange);
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

    let tripDay = this._eventsTrips[0].timeIn.toDateString();
    let tripDayCount = 0;
    this._renderTripDay(tripListElement, tripDayCount, this._eventsTrips[0].timeIn, this._currentSortType);

    let tripEventsListElement = tripListElement.querySelectorAll(`.trip-events__list`)[tripDayCount];
    this._renderTrip(tripEventsListElement, this._eventsTrips[0]);

    for (let i = 1; i < this._renderedTripCount; i++) {
      if (tripDay !== this._eventsTrips[i].timeIn.toDateString()
          && this._currentSortType === SortType.DEFAULT) {
        tripDay = this._eventsTrips[i].timeIn.toDateString();
        tripDayCount++;
        this._renderTripDay(tripListElement, tripDayCount, this._eventsTrips[i].timeIn, this._currentSortType);
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
