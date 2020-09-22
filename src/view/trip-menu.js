import AbstractView from "./abstract.js";
import {MenuItem} from "../const.js";

class TripMenu extends AbstractView {
  constructor() {
    super();

    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  _createTripMenuTemplate() {
    return `<nav class="trip-controls__trip-tabs  trip-tabs">
      <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-value="${MenuItem.TABLE}">Table</a>
      <a class="trip-tabs__btn" href="#" data-value="${MenuItem.STATS}">Stats</a>
    </nav>`;
  }

  get _template() {
    return this._createTripMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.value);
  }

  set menuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.element.addEventListener(`click`, this._menuClickHandler);
  }

  set menuItem(menuItem) {
    Array.from(document.querySelectorAll(`.trip-tabs__btn`)).forEach((it) => it.classList.remove(`trip-tabs__btn--active`));
    const item = this.element.querySelector(`[data-value="${menuItem}"]`);

    if (item !== null) {
      item.classList.add(`trip-tabs__btn--active`);
    }
  }
}

export default TripMenu;
