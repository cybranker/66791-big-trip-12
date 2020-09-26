import Abstract from "./abstract.js";

class Loading extends Abstract {
  _createLoadingTemplate() {
    return `<p class="trip-events__msg">Loading...</p>`;
  }

  get _template() {
    return this._createLoadingTemplate();
  }
}

export default Loading;
