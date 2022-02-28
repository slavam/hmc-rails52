import React, {Component} from 'react';
import Select from 'react-select';
// console.log(React.version);
export default class WindSearchForm extends Component{
  constructor(props) {
    super(props);
    this.state = {
      station: {label: 'Донецк', value: 1},
      year: 1991, 
      month: {label: 'Январь', value: 1}
    };
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSearchSubmit(this.state.station.value, this.state.year, this.state.month.value);
  }
  handleStationSelected = (val) => {
    this.setState({station: val});
  }
  handleMonthSelected = (val) =>{
    this.setState({month: val});
  }
  handleYearChange = (e) =>{
    this.setState({year: e.target.value});
  }
  render() {
    return (
        <div className="col-md-12">
          <form className="searchForm" onSubmit={(event) => this.handleSubmit(event)}>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Станция</th>
                  <th>Год</th>
                  <th>Месяц</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><Select value={this.state.station} onChange={this.handleStationSelected} options={this.props.stations}/></td>
                  <td><input type="number" name="input-year" value={this.state.year} onChange={(event) => this.handleYearChange(event)} min="1991" /></td>
                  <td><Select value={this.state.month} onChange={this.handleMonthSelected} options={this.props.months}/></td>
                </tr>
              </tbody>
            </table>
            <input type="submit" value="Найти" />
          </form>
        </div>
    );
  }
}