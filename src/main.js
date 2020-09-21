import TripInfoView from "./view/trip-info.js";
import TripMenuView from "./view/trip-menu.js";
import StatisticsView from "./view/statistics.js";
import {generateTrip} from "./mock/trip.js";
import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import TripsModel from "./model/trips.js";
import FilterModel from "./model/filter.js";
import {render, RenderPosition} from "./utils/render.js";
import {MenuItem, UpdateType, FilterType} from "./const.js";

const TRIP_COUNT = 20;

const trips = new Array(TRIP_COUNT)
  .fill()
  .map(generateTrip);

const tripsModel = new TripsModel();
tripsModel.trips = trips;

const filterModel = new FilterModel();

const siteHeaderElement = document.querySelector(`.trip-main`);
const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);
const siteMainElement = document.querySelector(`.trip-events`);
const tripMenuComponent = new TripMenuView();

render(siteHeaderElement, new TripInfoView(), RenderPosition.AFTERBEGIN);
render(tripControlsElement.children[0], tripMenuComponent, RenderPosition.AFTEREND);

const tripPresenter = new TripPresenter(siteMainElement, tripsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, tripsModel);

const handleTripNewFormClose = () => {
  tripMenuComponent.menuItem = MenuItem.TABLE;
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_EVENT:
      tripMenuComponent.menuItem = MenuItem.TABLE;
      tripPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init();
      tripPresenter.createTrip(handleTripNewFormClose);
      break;
    case MenuItem.TABLE:
      tripMenuComponent.menuItem = MenuItem.TABLE;
      tripPresenter.init();
      break;
    case MenuItem.STATS:
      tripMenuComponent.menuItem = MenuItem.STATS;
      siteMainElement.classList.add(`trip-events--hidden`);
      tripPresenter.destroy();
      break;
  }
};

tripMenuComponent.menuClickHandler = handleSiteMenuClick;

filterPresenter.init();
// tripPresenter.init();
siteMainElement.classList.add(`trip-events--hidden`);

render(siteMainElement, new StatisticsView(tripsModel.trips), RenderPosition.AFTEREND);

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  handleSiteMenuClick(evt.target.dataset.value);
});
