import {createElement} from "../utils/render.js";

class Abstract {
  constructor() {
    if (new.target === Abstract) {
      throw new Error(`Can't instantiate Abstract, only concrete one.`);
    }

    this._element = null;
    this._callback = {};
  }

  get _template() {
    throw new Error(`Abstract getter not implemented: _template `);
  }

  get element() {
    if (!this._element) {
      this._element = createElement(this._template);
    }

    return this._element;
  }

  set element(value) {
    this._element = value;
  }
}

export default Abstract;
