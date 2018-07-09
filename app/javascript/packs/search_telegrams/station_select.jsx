import React from 'react';
export default class StationSelect extends React.Component{
  constructor(props) {
    super(props);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }
  handleOptionChange(event) {
    this.props.onUserInput(event.target.value);
  }
  render(){
    return <select onChange={this.handleOptionChange} defaultValue = {this.props.defaultValue}>
      {
        this.props.options.map(function(op) {
          return <option key={op.id} value={op.id}>{op.name+' ('+op.code+')'}</option>;
        })
      }
    </select>;
  }
}