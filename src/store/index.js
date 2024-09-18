import { createStore } from 'redux';

// Basic reducer for testing
const initialState = {};
const rootReducer = (state = initialState, action) => state;

const store = createStore(rootReducer);

export default store;
