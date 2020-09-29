import Observer from "../utils/observer.js";

class Offers extends Observer {
  constructor() {
    super();
    this._offers = [];
  }

  set offers(params) {
    this._offers = params[1].slice();

    this._notify(params[0]);
  }

  get offers() {
    return this._offers;
  }
}

export default Offers;
