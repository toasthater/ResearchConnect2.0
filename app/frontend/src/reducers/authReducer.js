import { FETCH_USER, DONE_LOADING } from '../actions/types';

export default function(state = null, action) {
    switch (action.type) {
        case FETCH_USER:
            return action.payload || false ;
        case DONE_LOADING:
            return action.payload || false ;
        default:
            return state;
    } 
}