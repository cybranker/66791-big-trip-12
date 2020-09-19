import TripEventEditView from "../view/trip-event-edit.js";
import {generateId} from "../mock/trip.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

class TripNew {
  constructor(eventsContainer, changeData) {
    this._eventsContainer = eventsContainer;
    this._changeData = changeData;

    this._tripEventEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if (this._tripEventEditComponent !== null) {
      return;
    }

    this._tripEventEditComponent = new TripEventEditView(UserAction.ADD_TRIP);
    this._tripEventEditComponent.formSubmitHandler = this._handleFormSubmit;
    this._tripEventEditComponent.deleteClickHandler = this._handleDeleteClick;

    render(this._eventsContainer.querySelector(`.trip-events__trip-sort`), this._tripEventEditComponent, RenderPosition.AFTEREND);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._tripEventEditComponent === null) {
      return;
    }

    remove(this._tripEventEditComponent);
    this._tripEventEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFormSubmit(trip) {
    this._changeData(
        UserAction.ADD_TRIP,
        UpdateType.MINOR,
        Object.assign({id: generateId()}, trip)
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}

export default TripNew;
