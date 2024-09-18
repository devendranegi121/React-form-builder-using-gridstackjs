 

import { ReactFormBuilder, ElementStore, Registry } from 'react-form-builder2';
import './App.css';
import React, {  useEffect, useState } from 'react';
import * as variables from './variables';

const MyInput = React.forwardRef((props, ref) => {
  const { name, defaultValue, disabled } = props;
  console.log("props", props)
  return <div><input ref={ref} name={name} defaultValue={defaultValue} disabled={disabled} /> </div>;
});
Registry.register('MyInput', MyInput);

 
function formBuilder2() { 

  const [stateData, setStateData]= useState()

  const items=[
    {
      
      key: 'MyInput',
      element: 'CustomElement',
      component: MyInput,
      type: 'custom',
      forwardRef: true,
      bare: true,
      field_name: 'my_input_',
      name: 'My Input',
      icon: 'fa fa-cog',
      props: { test: 'test_input' },
      label: 'Label Input',
    }
  ]

  useEffect(()=>{
    ElementStore.subscribe(state => setStateData(state.data));
  },[])

  const showData=()=>{
  }

  const handleUpdate =(e)=>{
    console.log("333333333333333333333333333", e)
  }

  console.log("stateData", stateData)

  return (
    <div className="formBuilder2">
      <ReactFormBuilder 
      //toolbarItems={items} 
      variables={variables}
      onChange={handleUpdate}
  />

      <button onClick={showData}>Show data </button>

    </div>
  );
}

export default formBuilder2;
