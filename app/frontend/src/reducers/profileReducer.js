import { FETCH_FACULTY_MEMBER, FETCH_STUDENT } from '../actions/types';

export default function(state = null, action) {
    switch (action.type) {
        case FETCH_STUDENT:
            return (action.payload) ? action.payload : null ;
        case FETCH_FACULTY_MEMBER:
            return action.payload ;
        default:
            return state;
    } 
}