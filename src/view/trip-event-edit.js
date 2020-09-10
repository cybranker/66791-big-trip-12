import SmartView from "./smart.js";
import {generateEventType} from "../mock/event-type.js";
import {SENTENCE, OFFERS_MAP} from "../const.js";
import {getRandomInteger, generateOffers, generateDescription, generatePhotos} from "../mock/trip.js";
import {upperFirst, getEventWithActionName, getEventWithoutActionName, humanizeTaskDate} from "../utils/trip.js";
import flatpickr from "flatpickr";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_TRIP = {
  event: `Taxi to`,
  city: ``,
  offers: {},
  description: ``,
  photos: [],
  timeIn: new Date().setHours(0, 0),
  timeOut: new Date().setHours(0, 0),
  price: ``,
  isFavorite: false
};

class TripEventEdit extends SmartView {
  constructor(trip = BLANK_TRIP) {
    super();
    this._data = trip;
    this._datepickerTimeIn = null;
    this._datepickerTimeOut = null;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._timeInChangeHandler = this._timeInChangeHandler.bind(this);
    this._timeOutChangeHandler = this._timeOutChangeHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._eventDestinationChangeHandler = this._eventDestinationChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  reset(trip) {
    this.updateData(
        trip
    );
  }

  _createEventTypeGroupsTemplate(events, eventCheck) {
    return Object.entries(events).map(([groupName, eventTypes]) => {
      return `<fieldset class="event__type-group">
          <legend class="visually-hidden">${upperFirst(groupName)}</legend>
          ${eventTypes.map((eventType) => {
    const eventTypeLowerCase = eventType.toLowerCase();
    const eventTypeChecked = eventTypeLowerCase === eventCheck ? `checked` : ``;

    return `<div class="event__type-item">
      <input id="event-type-${eventTypeLowerCase}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${eventTypeLowerCase}" ${eventTypeChecked}>
      <label class="event__type-label  event__type-label--${eventTypeLowerCase}" for="event-type-${eventTypeLowerCase}-1">${eventType}</label>
    </div>`;
  }).join(``)}
</fieldset>`;
    }).join(``);
  }

  _createFavoriteTemplate(favorite) {
    return `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" ${favorite ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>`;
  }

  _createEventPhotosTemplate(photos) {
    return photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join(``);
  }

  _createEventOffersTemplate(offers, offersChecked) {
    return Object.entries(offers).map(([name, offer]) => `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-${name}-1" type="checkbox" name="event-offer-${name}" ${name in offersChecked ? `checked` : ``}>
      <label class="event__offer-label" for="event-offer-${name}-1">
        <span class="event__offer-title">${offer.name}</span>
        &plus;
        &euro;&nbsp;<span class="event__offer-price">${offer.price}</span>
      </label>
    </div>`).join(``);
  }

  _createTripEventEditTemplate(data) {
    const {event, city, offers, description, photos, timeIn, timeOut, price, isFavorite} = data;

    const eventTypeGroupsTemplate = this._createEventTypeGroupsTemplate(generateEventType(), getEventWithoutActionName(event));
    const favoriteTemplate = this._createFavoriteTemplate(isFavorite);
    const offersTemplate = this._createEventOffersTemplate(OFFERS_MAP, offers);
    const photosTemplate = this._createEventPhotosTemplate(photos);

    return `<li class="trip-events__item">
      <form class="event  event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${getEventWithoutActionName(event)}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              ${eventTypeGroupsTemplate}
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${event}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${city}" list="destination-list-1">
            <datalist id="destination-list-1">
              <option value="Amsterdam"></option>
              <option value="Geneva"></option>
              <option value="Chamonix"></option>
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">
              From
            </label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeTaskDate(timeIn, `2-digit`).split(`, `).join(` `)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">
              To
            </label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeTaskDate(timeOut, `2-digit`).split(`, `).join(` `)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${!city ? `disabled` : ``}>Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          ${favoriteTemplate}

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        ${city ? `<section class="event__details">
          <section class="event__section  event__section--offers">
            <h3 class="event__section-title  event__section-title--offers">Offers</h3>

            <div class="event__available-offers">
              ${offersTemplate}
            </div>
          </section>

          <section class="event__section  event__section&#45;&#45;destination">
            <h3 class="event__section-title  event__section-title&#45;&#45;destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${photosTemplate}
              </div>
            </div>
          </section>
        </section>` : ``}
      </form>
    </li>`;
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._data);
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }

  get _template() {
    return this._createTripEventEditTemplate(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.formSubmitHandler = this._callback.formSubmit;
  }

  _setDatepicker() {
    if (this._datepickerTimeIn) {
      this._datepickerTimeIn.destroy();
      this._datepickerTimeIn = null;
    }

    if (this._datepickerTimeOut) {
      this._datepickerTimeOut.destroy();
      this._datepickerTimeOut = null;
    }

    this._datepickerTimeIn = flatpickr(
        this.element.querySelector(`input[name="event-start-time"]`),
        {
          enableTime: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.timeIn,
          onChange: this._timeInChangeHandler
        }
    );

    this._datepickerTimeIn = flatpickr(
        this.element.querySelector(`input[name="event-end-time"]`),
        {
          enableTime: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._data.timeOut,
          onChange: this._timeOutChangeHandler
        }
    );
  }

  _setInnerHandlers() {
    this.element
      .querySelector(`.event__type-list`)
      .addEventListener(`change`, this._eventTypeChangeHandler);
    this.element
      .querySelector(`input[name="event-destination"]`)
      .addEventListener(`change`, this._eventDestinationChangeHandler);
  }

  _timeInChangeHandler([userData]) {
    this.updateData({
      timeIn: userData
    });
  }

  _timeOutChangeHandler([userData]) {
    this.updateData({
      timeOut: userData
    });
  }

  _eventTypeChangeHandler(evt) {
    evt.preventDefault();

    if (evt.target && evt.target.matches(`[name="event-type"]`)) {
      this.updateData({
        event: getEventWithActionName(evt.target.value)
      });
    }
  }

  _eventDestinationChangeHandler(evt) {
    evt.preventDefault();
    this.updateData({
      city: evt.target.value,
      offers: Object.fromEntries(generateOffers(OFFERS_MAP)),
      description: generateDescription(SENTENCE),
      photos: generatePhotos(getRandomInteger(1, 6))
    });
  }

  set formSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.element.querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }

  set favoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.element.querySelector(`.event__favorite-btn`).addEventListener(`click`, this._favoriteClickHandler);
  }
}

export default TripEventEdit;
