import React from 'react';

export default class ReportDateForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      reportDate: this.props.reportDate
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.reportDateChange = this.reportDateChange.bind(this);
  }
  reportDateChange(e){
    this.setState({reportDate: e.target.value});
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onDateSubmit(this.state.reportDate);
  }
  render(){
    return(
      <div>
        <h4>Задайте дату</h4>
        <form className="telegramForm" onSubmit={this.handleSubmit}>
          <input type="date" name="input-date-from" value={this.state.reportDate} onChange={this.reportDateChange} required="true" autoComplete="on" />
          <input type="submit" value="Показать" />
        </form>  
      </div>
    );
  }
}