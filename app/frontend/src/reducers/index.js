import { combineReducers } from 'redux';
import authReducer from './authReducer';
import loadReducer from './loadReducer';
import searchReducer from './searchReducer';
import profileReducer from './profileReducer';
import postReducer from './postReducer';
import departmentReducer from './departmentReducer';
import { reducer as formReducer } from 'redux-form';

export default combineReducers({
    auth: authReducer,
    profile: profileReducer,
    loadState: loadReducer,
    search: searchReducer,
    form: formReducer,
    post: postReducer,
    department: departmentReducer
});