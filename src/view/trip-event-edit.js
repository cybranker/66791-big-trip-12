import SmartView from "./smart.js";
import {generateEventType} from "../mock/event-type.js";
import {UserAction} from "../const.js";
import {upperFirst, getEventWithActionName, getEventWithoutActionName, humanizeTaskDate} from "../utils/trip.js";
import flatpickr from "flatpickr";
import he from "he";

import "../../node_modules/flatpickr/dist/flatpickr.min.css";

const BLANK_TRIP = {
  event: `Taxi to`,
  city: ``,
  offers: [],
  description: ``,
  photos: [],
  timeIn: new Date(new Date().setHours(0, 0)),
  timeOut: new Date(new Date().setHours(0, 0)),
  price: `0`,
  isFavorite: false
};

class TripEventEdit extends SmartView {
  constructor(userAction, offers, destinations, trip = BLANK_TRIP) {
    super();
    this._data = trip;
    this._allOffers = offers;
    this._allDestinations = destinations;
    this._userAction = userAction;
    this._datepickerTimeIn = null;
    this._datepickerTimeOut = null;
    this._offers = trip.offers;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._formDeleteClickHandler = this._formDeleteClickHandler.bind(this);
    this._formRollupClickHandler = this._formRollupClickHandler.bind(this);
    this._timeInChangeHandler = this._timeInChangeHandler.bind(this);
    this._timeOutChangeHandler = this._timeOutChangeHandler.bind(this);
    this._favoriteChangeHandler = this._favoriteChangeHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);
    this._eventDestinationChangeHandler = this._eventDestinationChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDatepicker();
  }

  removeElement() {
    super.removeElement();

    if (this._datepickerTimeIn) {
      this._datepickerTimeIn.destroy();
      this._datepickerTimeIn = null;
    }

    if (this._datepickerTimeOut) {
      this._datepickerTimeOut.destroy();
      this._datepickerTimeOut = null;
    }
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
    return `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" value="${favorite}" name="event-favorite" ${favorite ? `checked` : ``}>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>`;
  }

  _createEventPhotosTemplate(photos) {
    return photos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join(``);
  }

  _createEventOffersTemplate(offers, offersChecked, eventType) {
    let offersTemplate = ``;

    offers.forEach((it) => {
      if (it.type === eventType && it.offers.length > 0) {
        const eventOffersTemplate = it.offers.map((offer, index) => {
          const {title, price} = offer;

          return `<div class="event__offer-selector">
            <input class="event__offer-checkbox  visually-hidden" id="event-offer-${eventType}-${index}" type="checkbox" value="${price}" data-title="${title}" name="event-offer-${eventType}-${index}" ${offersChecked.some((offerCheck) => offerCheck.title === title) ? `checked` : ``}>
            <label class="event__offer-label" for="event-offer-${eventType}-${index}">
              <span class="event__offer-title">${title}</span>
              &plus;
              &euro;&nbsp;<span class="event__offer-price">${price}</span>
            </label>
          </div>`;
        }).join(``);

        offersTemplate = `<section class="event__details">
      <section class="event__section  event__section--offers">
      <h3 class="event__section-title  event__section-title--offers">Offers</h3>

      <div class="event__available-offers">
        ${eventOffersTemplate}
      </div>
      </section>`;
      }
    });

    return offersTemplate;
  }

  _createDestinationTemplate(destinations) {
    return destinations.map((destination) => `<option value="${destination.name}"></option>`).join(``);
  }

  _createTripEventEditTemplate(data, allOffers, allDestinations) {
    const {event, city, offers, description, photos, timeIn, timeOut, price, isFavorite} = data;
    const isActionAddTrip = this._userAction === UserAction.ADD_TRIP;

    const eventTypeGroupsTemplate = this._createEventTypeGroupsTemplate(generateEventType(), getEventWithoutActionName(event));
    const favoriteTemplate = isActionAddTrip ? `` : this._createFavoriteTemplate(isFavorite);
    const offersTemplate = this._createEventOffersTemplate(allOffers, offers, getEventWithoutActionName(event));
    const photosTemplate = this._createEventPhotosTemplate(photos);
    const destinationsTemplate = this._createDestinationTemplate(allDestinations);

    const template = `<form class="${isActionAddTrip ? `trip-events__item` : ``} event  event--edit" action="#" method="post">
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
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${he.encode(city)}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${destinationsTemplate}
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
            <input class="event__input  event__input--price" id="event-price-1" type="number" name="event-price" value="${price}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit" ${!city ? `disabled` : ``}>Save</button>
          <button class="event__reset-btn" type="reset">${isActionAddTrip ? `Cancel` : `Delete`}</button>

          ${favoriteTemplate}

          ${isActionAddTrip ? `` : `<button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>`}
        </header>

        ${offersTemplate}

        ${city ? `<section class="event__section  event__section&#45;&#45;destination">
            <h3 class="event__section-title  event__section-title&#45;&#45;destination">Destination</h3>
            <p class="event__destination-description">${description}</p>

            <div class="event__photos-container">
              <div class="event__photos-tape">
                ${photosTemplate}
              </div>
            </div>
          </section>
        </section>` : ``}
      </form>`;

    return isActionAddTrip ? template : `<li class="trip-events__item">${template}</li>`;
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(this._data);
  }

  get _template() {
    return this._createTripEventEditTemplate(this._data, this._allOffers, this._allDestinations);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setDatepicker();
    this.formSubmitHandler = this._callback.formSubmit;
    this.deleteClickHandler = this._callback.deleteClick;
    this.rollupClickHandler = this._callback.rollupClick;
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
    this.element
      .querySelector(`.event__input--price`)
      .addEventListener(`change`, this._priceChangeHandler);

    if (this.element.querySelector(`.event__available-offers`)) {
      this.element
        .querySelector(`.event__available-offers`)
        .addEventListener(`change`, this._offersChangeHandler);
    }

    if (this.element.querySelector(`.event__favorite-btn`)) {
      this.element
        .querySelector(`.event__favorite-checkbox`)
        .addEventListener(`change`, this._favoriteChangeHandler);
    }
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

  _favoriteChangeHandler(evt) {
    evt.preventDefault();

    this.updateData({
      isFavorite: evt.target.checked ? true : false
    });
  }

  _eventTypeChangeHandler(evt) {
    evt.preventDefault();

    if (evt.target && evt.target.matches(`[name="event-type"]`)) {
      this._offers = [];

      this.updateData({
        event: getEventWithActionName(evt.target.value),
        offers: this._offers
      });
    }
  }

  _offersChangeHandler(evt) {
    evt.preventDefault();
    let offerPrice = null;

    if (evt.target && evt.target.matches(`.event__offer-checkbox`)) {
      if (evt.target.checked) {
        offerPrice = parseInt(evt.target.value, 10);

        this._offers.push({
          title: evt.target.dataset.title,
          price: offerPrice
        });
      } else {
        const index = this._offers.findIndex((it) => it.title === evt.target.dataset.title);
        offerPrice = -parseInt(evt.target.value, 10);

        if (index !== -1) {
          this._offers.splice(index, 1);
        }
      }

      this.updateData({
        offers: this._offers,
        price: this._data.price + offerPrice
      });
    }
  }

  _priceChangeHandler(evt) {
    evt.preventDefault();

    this.updateData({
      price: evt.target.value
    });
  }

  _eventDestinationChangeHandler(evt) {
    evt.preventDefault();

    const cityName = evt.target.value;

    if (cityName) {
      const {name, description, pictures} = this._allDestinations.filter((destinationCheck) => destinationCheck.name === cityName)[0];

      this.updateData({
        city: name,
        description,
        photos: pictures
      });
    } else {
      this.updateData({
        city: cityName
      });
    }
  }

  set formSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    const element = (this._userAction === UserAction.ADD_TRIP) ? this.element : this.element.querySelector(`form`);
    element.addEventListener(`submit`, this._formSubmitHandler);
  }

  _formDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(this._data);
  }

  _formRollupClickHandler(evt) {
    evt.preventDefault();
    this._callback.rollupClick(evt);
  }

  set deleteClickHandler(callback) {
    this._callback.deleteClick = callback;
    this.element.querySelector(`.event__reset-btn`).addEventListener(`click`, this._formDeleteClickHandler);
  }

  set rollupClickHandler(callback) {
    this._callback.rollupClick = callback;
    this.element.querySelector(`.event__rollup-btn`).addEventListener(`click`, this._formRollupClickHandler);
  }
}

export default TripEventEdit;
