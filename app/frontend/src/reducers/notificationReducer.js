import { NOTIFICATION } from "../actions/types";

export default function (state = null, action) {
  switch (action.type) {
    case NOTIFICATION:
      return action.payload ? action.payload : null;
    default:
      return state;
  }
}
