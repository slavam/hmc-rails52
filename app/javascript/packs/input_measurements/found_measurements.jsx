/*jshint esversion: 6 */
import React from 'react';

export default class FoundMeasurements extends React.Component{
  render(){
    return(
      <div>
        <h3>Найденные измерения ({this.props.measurements.length})</h3>
      </div>
    );
  }
}
