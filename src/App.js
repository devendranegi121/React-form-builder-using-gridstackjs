import React, { useState } from "react";
import store from "./store";
import { Provider } from "react-redux";
import './App.css'
import GridComponent from "./components/GridStack/GridComponent";
import DraggableFormElement from "./components/GridStack/DraggableFormElement";
import MultiGridPage from "./components/GridStack/MultiGridPage";
import TableDyanamic from "./components/TableDyanamic";
import GridComponentRender from "./components/GridStack/GridComponentRender";

const initialElements = [
  { id: '1', type: 'TextField', label: 'Text Field', properties: {showLabel:true} },
  { id: '2', type: 'TextArea', label: 'Text Area', properties: {showLabel:true}},
  { id: '3', type: 'NestedGrid', label: 'Nested Grid',properties: {showLabel:true} },  // Add Nested Grid element
  { id: '4', type: 'TableDyanamic', label: 'Text Area', properties: {showLabel:true} },
];

function App() {

  const [showTable, setShowTable] = useState();

  const addTable = (status) => {
    setShowTable(status)
  }

  return (
    <Provider store={store}>
      <div className="App">
        <div className="main-grid">
          <div className="left-menu">
            <strong>Form Elements</strong>
            {initialElements.map((element, index) => (
              <DraggableFormElement element={element} key={index} index={index} />
            ))}

          </div>

          <div className="app-drop-box">
            <button onClick={() => addTable(true)}>Show table</button>
            {/* <GridComponent /> */}
            <GridComponentRender  />
            {showTable && <TableDyanamic setShowTable={setShowTable} />}

            <MultiGridPage initialElements={initialElements} />
          </div>

          
        </div>
      </div>

    </Provider>
  );
}

export default App;