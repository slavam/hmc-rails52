import React from 'react';

export default class FindStation extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      code: ''
    };
    this.codeChange = this.codeChange.bind(this);
  }
  codeChange(e){
    this.setState({code: e.target.value}); 
  }
  handleSubmit(e){
    e.preventDefault();
    this.props.onCodeSubmit(this.state.code);
  }
  render(){
    return(
      <div>
        <form className="codeForm" onSubmit={(event) => this.handleSubmit(event)}>
          <label htmlFor="mySearch">Задайте код станции</label>
          <input id="mySearch" type="number" min="1001" max="99999" step="1" value={this.state.code} onChange={(event) => this.codeChange(event)}/>
          <input type="submit" value="Искать" />
        </form>
      </div>
    );
  }
}