import { combineReducers} from "redux";
import combatants from "./combatants.reducers";
import timekeeper from "./timekeeper.reducers";
import config from "./config.reducers";
import squares from "./squares.reducers";
import logging from "./logging.reducers";
import hover from "./hover.reducers";

export default combineReducers({
  combatants, timekeeper, config, squares, logging, hover
})
