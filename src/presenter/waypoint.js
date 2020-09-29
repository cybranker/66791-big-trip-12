import TripEventView from "../view/trip-event.js";
import TripEventEditView from "../view/trip-event-edit.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

class Waypoint {
  constructor(tripEventsListContainer, eventsContainer, changeData, changeMode) {
    this._tripEventsListContainer = tripEventsListContainer;
    this._eventsContainer = eventsContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._tripEventComponent = null;
    this._tripEventEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleRollupClick = this._handleRollupClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(trip, offers, destinations) {
    this._trip = trip;

    const prevTripEventComponent = this._tripEventComponent;
    const prevTripEventEditComponent = this._tripEventEditComponent;

    this._tripEventComponent = new TripEventView(trip);
    this._tripEventEditComponent = new TripEventEditView(UserAction.UPDATE_TRIP, offers, destinations, trip);

    this._tripEventComponent.editClickHandler = this._handleEditClick;
    this._tripEventEditComponent.formSubmitHandler = this._handleFormSubmit;
    this._tripEventEditComponent.deleteClickHandler = this._handleDeleteClick;
    this._tripEventEditComponent.rollupClickHandler = this._handleRollupClick;

    if (prevTripEventComponent === null || prevTripEventEditComponent === null) {
      render(this._tripEventsListContainer, this._tripEventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._tripEventComponent, prevTripEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._tripEventEditComponent, prevTripEventEditComponent);
    }

    remove(prevTripEventComponent);
    remove(prevTripEventEditComponent);
  }

  destroy() {
    remove(this._tripEventComponent);
    remove(this._tripEventEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToTrip();
    }
  }

  _replaceTripToForm() {
    replace(this._tripEventEditComponent, this._tripEventComponent);
    document.addEventListener(`keydown`, this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceFormToTrip() {
    replace(this._tripEventComponent, this._tripEventEditComponent);
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this._tripEventEditComponent.reset(this._trip);
      this._replaceFormToTrip();
    }
  }

  _handleEditClick() {
    this._replaceTripToForm();
  }

  _handleFormSubmit(update) {
    this._changeData(
        UserAction.UPDATE_TRIP,
        UpdateType.MINOR,
        update
    );
    this._replaceFormToTrip();
  }

  _handleDeleteClick(trip) {
    this._changeData(
        UserAction.DELETE_TRIP,
        UpdateType.MINOR,
        trip
    );
  }

  _handleRollupClick() {
    this._tripEventEditComponent.reset(this._trip);
    this._replaceFormToTrip();
  }
}

export default Waypoint;
