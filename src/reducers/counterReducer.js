// reducers/widgetsMapDetails.js
const initialState = [];
  
  const widgetsMapDetails = (state = initialState, action) => {
    switch (action.type) {
     
      case 'UPDATE_WIDGETS':
        return { ...state, count: action.payload };
      default:
        return state;
    }
  };
  
  export default widgetsMapDetails;
  