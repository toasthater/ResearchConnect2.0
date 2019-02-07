import { combineReducers } from 'redux';
import authReducer from './authReducer';
import loadReducer from './loadReducer';

export default combineReducers({
    auth: authReducer,
    doneLoading: loadReducer
});