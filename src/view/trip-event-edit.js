import AbstractView from "./abstract.js";
import {generateEventType} from "../mock/event-type.js";
import {OFFERS_MAP} from "../const.js";
import {upperFirst, getEventWithoutActionName, humanizeTaskDate} from "../utils.js";

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

class TripEventEdit extends AbstractView {
  constructor(trip = BLANK_TRIP) {
    super();
    this._trip = trip;

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
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
    return favorite ? `<input id="event-favorite-1" class="event__favorite-checkbox  visually-hidden" type="checkbox" name="event-favorite" checked>
      <label class="event__favorite-btn" for="event-favorite-1">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </label>` : ``;
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

  _createTripEventEditTemplate(trip) {
    const {event, city, offers, description, photos, timeIn, timeOut, price, isFavorite} = trip;

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

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Delete</button>

          ${favoriteTemplate}

          <button class="event__rollup-btn" type="button">
            <span class="visually-hidden">Open event</span>
          </button>
        </header>

        <section class="event__details">
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
        </section>
      </form>
    </li>`;
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit();
  }

  get _template() {
    return this._createTripEventEditTemplate(this._trip);
  }

  set formSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.element.querySelector(`form`).addEventListener(`submit`, this._formSubmitHandler);
  }
}

export default TripEventEdit;
