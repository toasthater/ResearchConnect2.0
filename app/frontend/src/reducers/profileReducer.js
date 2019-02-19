import { FETCH_PROFILE } from '../actions/types';

export default function(state = null, action) {
    switch (action.type) {
        case FETCH_PROFILE:
            return (action.payload) ? action.payload : null ;
        default:
            return state;
    } 
}