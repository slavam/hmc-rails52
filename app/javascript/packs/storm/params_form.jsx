/*jshint esversion: 6 */
import React from 'react';
import Select from 'react-select';

export default class ParamsForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dateFrom: this.props.dateFrom,
      dateTo: this.props.dateTo,
      station: {value: this.props.stations[0].id, label: this.props.stations[0].name}
    };
    this.dateFromChange = this.dateFromChange.bind(this);
    this.dateToChange = this.dateToChange.bind(this);
    this.handleStationSelected = this.handleStationSelected.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  dateFromChange(e){
    this.setState({dateFrom: e.target.value});
  }
  dateToChange(e){
    this.setState({dateTo: e.target.value});
  }
  handleStationSelected(value){
    this.setState({station: value});
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onParamsSubmit({dateFrom: this.state.dateFrom, dateTo: this.state.dateTo, stationId: this.state.station.value});
  }

  render() {
    const stations = [];
    this.props.stations.forEach((s) => stations.push({value: s.id, label: s.name}));
    return (
      <form className="params-form" onSubmit={this.handleSubmit}>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Дата явления с</th>
              <th>Дата явления по</th>
              <th>Метеостанция</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="date" name="input-date-from" value={this.state.dateFrom} onChange={this.dateFromChange} autoComplete="on" /></td>
              <td><input type="date" name="input-date-to" value={this.state.dateTo} onChange={this.dateToChange} autoComplete="on" /></td>
              <td><Select value={this.state.station} onChange={this.handleStationSelected} options={stations}/></td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Искать" />
      </form>
    );
  }
}
