import TripInfoView from "./view/trip-info.js";
import TripMenuView from "./view/trip-menu.js";
import {generateTrip} from "./mock/trip.js";
import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import TripsModel from "./model/trips.js";
import FilterModel from "./model/filter.js";
import {render, RenderPosition} from "./utils/render.js";

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

render(siteHeaderElement, new TripInfoView(), RenderPosition.AFTERBEGIN);
render(tripControlsElement.children[0], new TripMenuView(), RenderPosition.AFTEREND);

const tripPresenter = new TripPresenter(siteMainElement, tripsModel, filterModel);
const filterPresenter = new FilterPresenter(tripControlsElement, filterModel, tripsModel);

filterPresenter.init();
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createTrip();
});
