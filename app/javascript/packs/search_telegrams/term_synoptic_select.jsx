import React from 'react';
export default class TermSynopticSelect extends React.Component{
  constructor(props) {
    super(props);
    this.handleOptionChange = this.handleOptionChange.bind(this);
  }
  handleOptionChange(event) {
    this.props.onUserInput(event.target.value, event.target.name);
  }
  render(){
    return <select onChange={this.handleOptionChange} defaultValue = {this.props.defaultValue}>
      {
        this.props.options.map(function(op) {
          return <option key={op.value} value={op.value}>{op.label}</option>;
        })
      }
    </select>;
  }
}