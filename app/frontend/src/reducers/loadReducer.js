import {  DONE_LOADING } from '../actions/types';

export default function(state = null, action) {
    switch (action.type) {
        case DONE_LOADING:
            return action.payload || false ;
        default:
            return state;
    } 
}