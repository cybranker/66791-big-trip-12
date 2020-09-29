import {createElement} from "../utils/render.js";

const SHAKE_ANIMATION_TIMEOUT = 600;

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

  shake(callback) {
    this.element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      this.element.style.animation = ``;
      callback();
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}

export default Abstract;
