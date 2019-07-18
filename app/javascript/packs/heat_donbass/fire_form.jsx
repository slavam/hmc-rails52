import React from 'react';
import Select from 'react-select';

export default class FireForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dateFrom:  this.props.dateFrom,
      dateTo: this.props.dateTo,
      station: { value: '1',  label: 'Донецк' }
    };
    this.handleStationSelected = this.handleStationSelected.bind(this);
    this.dateFromChange = this.dateFromChange.bind(this);
    this.dateToChange = this.dateToChange.bind(this);
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onFireFormSubmit(this.state.dateFrom, this.state.dateTo, this.state.station.value);
  }
  dateFromChange(e){
    this.setState({dateFrom: e.target.value});
  }
  dateToChange(e){
    this.setState({dateTo: e.target.value});
  }
  handleStationSelected(val){
    this.setState({station: val});
  }
  render() {
    const stations = [];
    this.props.stations.forEach((s) => stations.push({value: s.id, label: s.name}));
    
    return (
    <div className="col-md-12">
      <form className="dateForm" onSubmit={(event) => this.handleSubmit(event)}>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Дата с</th>
              <th>Дата по</th>
              <th>Метеостанция</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="date" name="dateFrom" value={this.state.dateFrom} onChange={this.dateFromChange} /></td>
              <td><input type="date" name="dateTo" value={this.state.dateTo} onChange={this.dateToChange} /></td>
              <td><Select value={this.state.station} onChange={this.handleStationSelected} options={stations}/></td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Пересчитать" />
      </form>
    </div>
    );
  }
}