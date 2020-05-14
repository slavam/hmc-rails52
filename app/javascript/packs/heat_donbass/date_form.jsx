import React from 'react';

export default class DateForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      calcDate:  this.props.calcDate
    };
  }
  handleSubmit(e) {
    e.preventDefault();
    var calcDate = this.state.calcDate.trim();
    if (!calcDate) {
      return;
    }
    this.props.onDateSubmit(calcDate);
  }
  dateChange(e){
    this.setState({calcDate: e.target.value});
  }
  render() {
    return (
    <div className="col-md-12">
      <form className="dateForm" onSubmit={(event) => this.handleSubmit(event)}>
        <input type="date" name="input-date" value={this.state.calcDate} onChange={(event) => this.dateChange(event)} required={true} autoComplete="on" />
        <input type="submit" value="Пересчитать" />
      </form>
    </div>
    );
  }
}
