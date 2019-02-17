import {  DONE_LOADING, PARTIAL_LOADING } from '../actions/types';

export default function(state = null, action) {
    switch (action.type) {
        case DONE_LOADING:
            return action.payload ? 1 : 0;
        case PARTIAL_LOADING:
            return action.payload ? 2 : 0;
        default:
            return state;
    } 
}