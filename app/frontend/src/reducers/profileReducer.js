import { FETCH_PROFILE, UPDATE_RESUME, UPDATE_PROFILE } from '../actions/types';

export default function (state = null, action) {
  switch (action.type) {
    case FETCH_PROFILE:
      return action.payload ? action.payload : null;
    case UPDATE_RESUME:
      return action.payload ? action.payload : null;
    case UPDATE_PROFILE:
      return action.payload ? action.payload : null;
    default:
      return state;
  }
}
