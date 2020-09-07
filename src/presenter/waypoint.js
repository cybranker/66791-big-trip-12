import TripEventView from "../view/trip-event.js";
import TripEventEditView from "../view/trip-event-edit.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

class Waypoint {
  constructor(tripEventsListContainer, eventsContainer, changeData) {
    this._tripEventsListContainer = tripEventsListContainer;
    this._eventsContainer = eventsContainer;
    this._changeData = changeData;

    this._tripEventComponent = null;
    this._tripEventEditComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(trip) {
    this._trip = trip;

    const prevTripEventComponent = this._tripEventComponent;
    const prevTripEventEditComponent = this._tripEventEditComponent;

    this._tripEventComponent = new TripEventView(trip);
    this._tripEventEditComponent = new TripEventEditView(trip);

    this._tripEventComponent.editClickHandler = this._handleEditClick;
    this._tripEventComponent.favoriteClickHandler = this._handleFavoriteClick;
    this._tripEventEditComponent.formSubmitHandler = this._handleFormSubmit;

    if (prevTripEventComponent === null || prevTripEventEditComponent === null) {
      render(this._tripEventsListContainer, this._tripEventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._eventsContainer.querySelector(`.trip-days`).contains(prevTripEventComponent.element)) {
      replace(this._tripEventComponent, prevTripEventComponent);
    }

    if (this._eventsContainer.querySelector(`.trip-days`).contains(prevTripEventEditComponent.element)) {
      replace(this._tripEventEditComponent, prevTripEventEditComponent);
    }

    remove(prevTripEventComponent);
    remove(prevTripEventEditComponent);
  }

  destroy() {
    remove(this._tripEventComponent);
    remove(this._tripEventEditComponent);
  }

  _replaceTripToForm() {
    replace(this._tripEventEditComponent, this._tripEventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceFormToTrip() {
    replace(this._tripEventComponent, this._tripEventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._replaceFormToTrip();
    }
  }

  _handleEditClick() {
    this._replaceTripToForm();
  }

  _handleFavoriteClick() {
    this._changeData(
        Object.assign(
            {},
            this._trip,
            {
              isFavorite: !this._trip.isFavorite
            }
        )
    );
  }

  _handleFormSubmit(trip) {
    this._changeData(trip);
    this._replaceFormToTrip();
  }
}

export default Waypoint;
