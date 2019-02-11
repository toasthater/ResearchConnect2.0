import { combineReducers } from 'redux';
import authReducer from './authReducer';
import loadReducer from './loadReducer';
import searchReducer from './searchReducer';
import profileReducer from './profileReducer';
import {reducer as formReducer} from 'redux-form';

export default combineReducers({
    auth: authReducer,
    profile: profileReducer,
    doneLoading: loadReducer,
    search: searchReducer,
    form: formReducer
});