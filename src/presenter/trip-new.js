import TripEventEditView from "../view/trip-event-edit.js";
import {remove, render, RenderPosition} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

class TripNew {
  constructor(eventsContainer, changeData, offers, destinations) {
    this._eventsContainer = eventsContainer;
    this._changeData = changeData;
    this._offers = offers;
    this._destinations = destinations;

    this._tripEventEditComponent = null;
    this._destroyCallback = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    this._destroyCallback = callback;

    if (this._tripEventEditComponent !== null) {
      return;
    }

    this._tripEventEditComponent = new TripEventEditView(UserAction.ADD_TRIP, this._offers, this._destinations);
    this._tripEventEditComponent.formSubmitHandler = this._handleFormSubmit;
    this._tripEventEditComponent.deleteClickHandler = this._handleDeleteClick;

    render(this._eventsContainer.querySelector(`.trip-events__trip-sort`), this._tripEventEditComponent, RenderPosition.AFTEREND);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._tripEventEditComponent === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._tripEventEditComponent);
    this._tripEventEditComponent = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._tripEventEditComponent.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    const resetFormState = () => {
      this._tripEventEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };

    this._tripEventEditComponent.shake(resetFormState);
  }

  _handleFormSubmit(trip) {
    this._changeData(
        UserAction.ADD_TRIP,
        UpdateType.MINOR,
        trip
    );
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
