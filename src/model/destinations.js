import Observer from "../utils/observer.js";

class Destinations extends Observer {
  constructor() {
    super();
    this._destinations = [];
  }

  set destinations(params) {
    this._destinations = params[1].slice();

    this._notify(params[0]);
  }

  get destinations() {
    return this._destinations;
  }
}

export default Destinations;
