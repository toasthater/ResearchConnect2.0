import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './authReducer';
import loadReducer from './loadReducer';
import searchReducer from './searchReducer';
import profileReducer from './profileReducer';
import postReducer from './postReducer';
import departmentReducer from './departmentReducer';
import notificationReducer from './notificationReducer';

export default combineReducers({
  auth: authReducer,
  profile: profileReducer,
  loadState: loadReducer,
  notification: notificationReducer,
  search: searchReducer,
  form: formReducer,
  post: postReducer,
  department: departmentReducer,
});
