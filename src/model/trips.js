import Observer from "../utils/observer.js";
import {getEventWithActionName, getEventWithoutActionName} from "../utils/trip.js";

class Trips extends Observer {
  constructor() {
    super();
    this._trips = [];
  }

  set trips(params) {
    this._trips = params[1].slice();

    this._notify(params[0]);
  }

  get trips() {
    return this._trips;
  }

  updateTrip(updateType, update) {
    const index = this._trips.findIndex((trip) => trip.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update unexisting trip`);
    }

    this._trips = [
      ...this._trips.slice(0, index),
      update,
      ...this._trips.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addTrip(updateType, update) {
    this._trips = [
      update,
      ...this._trips
    ];

    this._notify(updateType, update);
  }

  deleteTrip(updateType, update) {
    const index = this._trips.findIndex((trip) => trip.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete unexisting trip`);
    }

    this._trips = [
      ...this._trips.slice(0, index),
      ...this._trips.slice(index + 1)
    ];

    this._notify(updateType);
  }

  static adaptToClient(trip) {
    const adaptedTrip = Object.assign(
        {},
        trip,
        {
          city: trip.destination.name,
          description: trip.destination.description,
          event: getEventWithActionName(trip.type),
          isFavorite: trip.is_favorite,
          photos: trip.destination.pictures,
          price: trip.base_price,
          timeIn: trip.date_from !== null ? new Date(trip.date_from) : trip.date_from,
          timeOut: trip.date_to !== null ? new Date(trip.date_to) : trip.date_to
        }
    );

    delete adaptedTrip.base_price;
    delete adaptedTrip.date_from;
    delete adaptedTrip.date_to;
    delete adaptedTrip.destination;
    delete adaptedTrip.is_favorite;
    delete adaptedTrip.type;

    return adaptedTrip;
  }

  static adaptToServer(trip) {
    const adaptedTrip = Object.assign(
        {},
        trip,
        {
          'base_price': trip.price,
          'date_from': trip.timeIn instanceof Date ? trip.timeIn.toISOString() : null,
          'date_to': trip.timeOut instanceof Date ? trip.timeOut.toISOString() : null,
          'destination': {
            'description': trip.description,
            'name': trip.city,
            'pictures': trip.photos
          },
          'is_favorite': trip.isFavorite,
          'type': getEventWithoutActionName(trip.event)
        }
    );

    delete adaptedTrip.city;
    delete adaptedTrip.description;
    delete adaptedTrip.event;
    delete adaptedTrip.isFavorite;
    delete adaptedTrip.photos;
    delete adaptedTrip.price;
    delete adaptedTrip.timeIn;
    delete adaptedTrip.timeOut;

    return adaptedTrip;
  }
}

export default Trips;
