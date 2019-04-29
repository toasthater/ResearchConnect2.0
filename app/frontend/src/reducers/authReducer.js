import { FETCH_USER, SETUP_USER } from '../actions/types';

export default function (state = null, action) {
  switch (action.type) {
    case FETCH_USER:
      return (action.payload) ? action.payload : false;
    case SETUP_USER:
      return (action.payload) ? action.payload : false;
    default:
      return state;
  }
}
