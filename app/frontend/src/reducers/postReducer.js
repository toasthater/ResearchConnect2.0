import { FETCH_POST, POST_DATA } from '../actions/types';

export default function (state = null, action) {
  switch (action.type) {
    case POST_DATA:
      return action.payload ? action.payload : null;
    case FETCH_POST:
      return action.payload ? action.payload : null;
    default:
      return state;
  }
}
