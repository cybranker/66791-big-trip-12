import TripInfoView from "./view/trip-info.js";
import TripMenuView from "./view/trip-menu.js";
import TripFilterView from "./view/trip-filters.js";
import {generateTrip} from "./mock/trip.js";
import {generateFilter} from "./mock/filter.js";
import TripPresenter from "./presenter/trip.js";
import TripsModel from "./model/trips.js";
import {render, RenderPosition} from "./utils/render.js";

const TRIP_COUNT = 20;

const trips = new Array(TRIP_COUNT)
  .fill()
  .map(generateTrip)
  .sort((a, b) => {
    a = new Date(a.timeIn);
    b = new Date(b.timeIn);

    return a - b;
  });
const filters = generateFilter();

const tripsModel = new TripsModel();
tripsModel.trips = trips;

const siteHeaderElement = document.querySelector(`.trip-main`);
const tripControlsElement = siteHeaderElement.querySelector(`.trip-controls`);
const siteMainElement = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(siteMainElement, TRIP_COUNT, tripsModel);

render(siteHeaderElement, new TripInfoView(), RenderPosition.AFTERBEGIN);
render(tripControlsElement.children[0], new TripMenuView(), RenderPosition.AFTEREND);
render(tripControlsElement, new TripFilterView(filters), RenderPosition.BEFOREEND);

tripPresenter.init();
