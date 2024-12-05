// reducers/index.js
import { combineReducers } from 'redux';
import widgetsMapDetails from './counterReducer';

const rootReducer = combineReducers({
  counter: widgetsMapDetails, // Add more reducers as needed
});

export default rootReducer;
