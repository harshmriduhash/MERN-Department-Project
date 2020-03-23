import { combineReducers } from 'redux';
import authReducer from './authReducer';
import departmentReducer from './departmentReducer';
import requestReducer from './requestReducer';


export default combineReducers({
    auth: authReducer,
    department: departmentReducer,
    request:requestReducer
});