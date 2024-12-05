import React, { useState } from "react";
import store from "./store";
import { Provider } from "react-redux";
import './App.css'
import GridComponentRender from "./components/GridStack/GridComponentRender";
import DraggableFormElement from "./components/GridStack/DraggableFormElement";

const initialElements = [
  { id: '1', type: 'TextField', label: 'Text Field', properties: {showLabel:true} },
  { id: '2', type: 'TextArea', label: 'Text Area', properties: {showLabel:true}},
  { id: '3', type: 'NestedGrid', label: 'Nested Grid',properties: {showLabel:true} },  // Add Nested Grid element
  { id: '4', type: 'TableDyanamic', label: 'Text Area', properties: {showLabel:true} },
];

function App() {  

  return (
    <Provider store={store}>
      <div className="App">
        {/* <ExcelLikeGrid /> */}
        <div className="main-grid">
          <div className="left-menu">
            <strong>Form Elements</strong>
            {initialElements.map((element, index) => (
              <DraggableFormElement element={element} key={index} index={index} />
            ))}

          </div>

          <div className="app-drop-box">
            {/* <button onClick={() => addTable(true)}>Show table</button> */}
            {/* <GridComponent /> */}
            <GridComponentRender  />
          </div>
        </div>
      </div>
    </Provider>
  );
}

export default App;