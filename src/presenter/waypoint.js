import TripEventView from "../view/trip-event.js";
import TripEventEditView from "../view/trip-event-edit.js";
import {render, RenderPosition, replace} from "../utils/render.js";

class Waypoint {
  constructor(tripEventsListContainer) {
    this._tripEventsListContainer = tripEventsListContainer;

    this._tripEventComponent = null;
    this._tripEventEditComponent = null;

    this._handleEditClick = this._handleEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(trip) {
    this._trip = trip;

    this._tripEventComponent = new TripEventView(trip);
    this._tripEventEditComponent = new TripEventEditView(trip);

    this._tripEventComponent.editClickHandler = this._handleEditClick;
    this._tripEventEditComponent.formSubmitHandler = this._handleFormSubmit;

    render(this._tripEventsListContainer, this._tripEventComponent, RenderPosition.BEFOREEND);
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

  _handleFormSubmit() {
    this._replaceFormToTrip();
  }
}

export default Waypoint;
