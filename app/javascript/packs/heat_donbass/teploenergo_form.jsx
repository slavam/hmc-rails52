import React from 'react';
import Select from 'react-select';

export default class TeploenergoForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      year:  this.props.year,
      monthR: {value: '10', label: 'Октябрь'}
      // month: this.props.month
    };
    this.handleMonthSelected = this.handleMonthSelected.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onFormSubmit(this.state.year, this.state.monthR.value);
  }
  // dateChange(e){
  //   // alert(e.target.value)
  //   this.setState({year: e.target.value.substr(0,4), month: e.target.value.substr(5,2)});
  // }
  yearChange(e){
    this.setState({year: e.target.value});
  }
  handleMonthSelected(val){
    this.setState({monthR: val});
  }
  render() {
    let today = new Date();
    let maxYear = today.getFullYear();
    const months = [
      {value: '10', label: 'Октябрь'},
      {value: '11', label: 'Ноябрь'},
      {value: '12', label: 'Декабрь'},
      {value: '01', label: 'Январь'},
      {value: '02', label: 'Февраль'},
      {value: '03', label: 'Март'},
      {value: '04', label: 'Апрель'}
    ];
    return (
    <div className="col-md-12">
      <h4 align="center">Задайте год и месяц</h4>
      <form className="dateForm" onSubmit={(event) => this.handleSubmit(event)}>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Год</th>
              <th>Месяц</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="number" value={this.state.year} min='2015' max={maxYear} onChange={event => this.yearChange(event)}/></td>
              <td><Select value={this.state.monthR} onChange={this.handleMonthSelected} options={months}/></td>
            </tr>
          </tbody>
        </table>
        {/*<input type="date" name="report-date" min="2017-04-01" max="2017-04-20" required/>
        <span class="validity"></span>
        <input type="month" name="input-date" value={this.state.year+'-'+this.state.month} onChange={(event) => this.dateChange(event)} autoComplete="on" />*/}
        <input type="submit" value="Пересчитать" />
      </form>
    </div>
    );
  }
}