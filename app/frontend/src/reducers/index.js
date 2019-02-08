import { combineReducers } from 'redux';
import authReducer from './authReducer';
import loadReducer from './loadReducer';
import searchReducer from './searchReducer';

export default combineReducers({
    auth: authReducer,
    doneLoading: loadReducer,
    search: searchReducer
});