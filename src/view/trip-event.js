import AbstractView from "./abstract.js";
import {getEventWithoutActionName, humanizeTaskDate} from "../utils/trip.js";
import {addZerosNumber} from "../utils/common.js";
import moment from "moment";
import he from "he";

const MAX_RENDER_OFFERS_TRIP = 3;

class TripEvent extends AbstractView {
  constructor(trip) {
    super();
    this._trip = trip;

    this._editClickHandler = this._editClickHandler.bind(this);
  }

  _renderOffersTrip(ofrs) {
    const ofrsKeys = Object.keys(ofrs);
    const quantityOffers = ofrsKeys.length <= MAX_RENDER_OFFERS_TRIP ? ofrsKeys.length : MAX_RENDER_OFFERS_TRIP;
    let offersTripTemplate = ``;

    for (let i = 0; i < quantityOffers; i++) {
      offersTripTemplate += `<li class="event__offer">
      <span class="event__offer-title">${ofrs[ofrsKeys[i]].name}</span>
      &plus;
      &euro;&nbsp;<span class="event__offer-price">${ofrs[ofrsKeys[i]].price}</span>
     </li>`;
    }

    return offersTripTemplate;
  }

  _renderDurationStay(timeIn, timeOut) {
    if (!(timeIn instanceof Date) || !(timeOut instanceof Date)) {
      return ``;
    }

    timeIn = moment(timeIn);
    timeOut = moment(timeOut);
    const duration = moment.duration(timeOut.diff(timeIn));
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();

    let durationStay = ``;

    if (days > 0) {
      durationStay = `${addZerosNumber(days)}D ${addZerosNumber(hours)}H ${addZerosNumber(minutes)}M`;
    } else if (days === 0 && hours > 0) {
      durationStay = `${addZerosNumber(hours)}H ${addZerosNumber(minutes)}M`;
    } else {
      durationStay = `${addZerosNumber(minutes)}M`;
    }

    return durationStay;
  }

  _createTripEventTemplate(trip) {
    const {event, city, timeIn, timeOut, price, offers} = trip;

    const tripTimeIn = humanizeTaskDate(timeIn, `numeric`).split(`, `)[1];
    const tripTimeOut = humanizeTaskDate(timeOut, `numeric`).split(`, `)[1];

    return `<li class="trip-events__item">
      <div class="event">
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${getEventWithoutActionName(event)}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${event} ${he.encode(city)}</h3>

        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${tripTimeIn}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${tripTimeOut}</time>
          </p>
          <p class="event__duration">${this._renderDurationStay(timeIn, timeOut)}</p>
        </div>

        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${price}</span>
        </p>

        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${this._renderOffersTrip(offers)}
        </ul>

        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`;
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    this._callback.editClick();
  }

  get _template() {
    return this._createTripEventTemplate(this._trip);
  }

  set editClickHandler(callback) {
    this._callback.editClick = callback;
    this.element.querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }
}

export default TripEvent;
