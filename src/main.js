import TripInfoView from "./view/trip-info.js";
import TripMenuView from "./view/trip-menu.js";
import StatisticsView from "./view/statistics.js";
import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import TripsModel from "./model/trips.js";
import FilterModel from "./model/filter.js";
import OffersModel from "./model/offers";
import DestinationsModel from "./model/destinations.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import {MenuItem, UpdateType, FilterType} from "./const.js";
import Api from "./api.js";

const AUTHORIZATION = `Basic XvzOiGqVuxnwYzpcL`;
const END_POINT = `https://12.ecmascript.pages.academy/big-trip`;

const siteHeaderElement = document.querySelector(`.trip-main`);
const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);
const siteMainElement = document.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTHORIZATION);

const tripsModel = new TripsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const tripMenuComponent = new TripMenuView();

const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, tripsModel);
const tripPresenter = new TripPresenter(siteMainElement, tripsModel, filterModel, offersModel, destinationsModel, api);

const handleTripNewFormClose = () => {
  tripMenuComponent.menuItem = MenuItem.TABLE;
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_EVENT:
      remove(statisticsComponent);
      tripMenuComponent.menuItem = MenuItem.TABLE;
      siteMainElement.classList.remove(`trip-events--hidden`);
      tripPresenter.destroy();
      filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
      tripPresenter.init();
      tripPresenter.createTrip(handleTripNewFormClose);
      break;
    case MenuItem.TABLE:
      tripMenuComponent.menuItem = MenuItem.TABLE;
      siteMainElement.classList.remove(`trip-events--hidden`);
      remove(statisticsComponent);
      tripPresenter.init();
      break;
    case MenuItem.STATS:
      tripMenuComponent.menuItem = MenuItem.STATS;
      siteMainElement.classList.add(`trip-events--hidden`);
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(tripsModel.trips);
      render(siteMainElement, statisticsComponent, RenderPosition.AFTEREND);
      break;
  }
};

render(siteHeaderElement, new TripInfoView(), RenderPosition.AFTERBEGIN);

filterPresenter.init();
tripPresenter.init();

api.offers
  .then((offers) => {
    const params = [UpdateType.INIT, offers];

    offersModel.offers = params;
  })
  .catch(() => {
    const params = [UpdateType.INIT, []];

    offersModel.offers = params;
  });

api.destinations
  .then((destinations) => {
    const params = [UpdateType.INIT, destinations];

    destinationsModel.destinations = params;
  })
  .catch(() => {
    const params = [UpdateType.INIT, []];

    destinationsModel.destinations = params;
  });

api.trips
  .then((points) => {
    const params = [UpdateType.INIT, points];

    tripsModel.trips = params;
    render(tripControlsElement.children[0], tripMenuComponent, RenderPosition.AFTEREND);
    tripMenuComponent.menuClickHandler = handleSiteMenuClick;
  })
  .catch(() => {
    const params = [UpdateType.INIT, []];

    tripsModel.trips = params;
    render(tripControlsElement.children[0], tripMenuComponent, RenderPosition.AFTEREND);
    tripMenuComponent.menuClickHandler = handleSiteMenuClick;
  });

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  handleSiteMenuClick(evt.target.dataset.value);
});
