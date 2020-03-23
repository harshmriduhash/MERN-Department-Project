import thunk from "redux-thunk";
import { applyMiddleware, compose, createStore } from 'redux';
import rootReducer from './reducers';

const middleware = [thunk];
const initialState = []

const store = createStore(
    rootReducer,
    initialState,
    compose(
        applyMiddleware(...middleware),
        // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
    )
);

export default store;
