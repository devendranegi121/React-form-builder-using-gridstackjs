import React from 'react'
import { GridStack, GridStackItem } from 'react-gridstack'
 
class AppGrid extends React.Component {
  render () {
    <GridStack cellHeight={50} verticalMargin={10}>
      <GridStackItem id="item_1" x={0} y={0} minHeight={2} minWidth={2}>
        First Item
      </GridStackItem>
      <GridStackItem id="item_2" x={0} y={2}>
        Second Item
      </GridStackItem>
    </GridStack>
  }
}

export default AppGrid