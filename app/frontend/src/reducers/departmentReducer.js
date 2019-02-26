import { FETCH_DEPARTMENT } from '../actions/types';

export default function(state = null, action) {
    switch (action.type) {
        case FETCH_DEPARTMENT:
            return action.payload ? action.payload : null;
        default:
            return state;
    } 
}