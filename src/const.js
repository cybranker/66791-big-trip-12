const SortType = {
  DEFAULT: `sort-event`,
  TIME: `sort-time`,
  PRICE: `sort-price`
};

const UserAction = {
  UPDATE_TRIP: `UPDATE_TRIP`,
  ADD_TRIP: `ADD_TRIP`,
  DELETE_TRIP: `DELETE_TRIP`
};

const UpdateType = {
  PATCH: `PATCH`,
  MINOR: `MINOR`,
  MAJOR: `MAJOR`,
  INIT: `INIT`
};

const FilterType = {
  EVERYTHING: `everything`,
  FUTURE: `future`,
  PAST: `past`
};

const MenuItem = {
  ADD_NEW_EVENT: `ADD_NEW_EVENT`,
  TABLE: `TABLE`,
  STATS: `STATS`
};

export {
  SortType,
  UserAction,
  UpdateType,
  FilterType,
  MenuItem
};
