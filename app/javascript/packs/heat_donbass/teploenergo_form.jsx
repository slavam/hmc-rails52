import React from 'react';

export default class TeploenergoForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      year:  this.props.year,
      month: this.props.month
    };
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onFormSubmit(this.state.year, this.state.month);
  }
  dateChange(e){
    // alert(e.target.value)
    this.setState({year: e.target.value.substr(0,4), month: e.target.value.substr(5,2)});
  }
  render() {
    return (
    <div className="col-md-12">
      <form className="dateForm" onSubmit={(event) => this.handleSubmit(event)}>
        <input type="month" name="input-date" value={this.state.year+'-'+this.state.month} onChange={(event) => this.dateChange(event)} autoComplete="on" />
        <input type="submit" value="Пересчитать" />
      </form>
    </div>
    );
  }
}