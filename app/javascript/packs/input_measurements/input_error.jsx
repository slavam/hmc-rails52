import React from 'react';

export default class InputError extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      message: 'Input is invalid'
    };
  }
  render(){ 
    var errorClass = classNames(this.props.className, {
      'error_container':   true,
      'visible':           this.props.visible,
      'invisible':         !this.props.visible
    });
    return (
      <div className={errorClass}>
        <span style={{color: 'red'}}>{this.props.errorMessage}</span>
      </div>
    );
  }
}