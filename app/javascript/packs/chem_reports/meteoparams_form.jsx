import React from 'react';
import StationSelect from '../search_telegrams/station_select';

export default class MeteoparamsForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      year:  this.props.year,
      month: this.props.month,
      stationId: this.props.stationId,
      stationName: '',
      errors: [] 
    };
    this.handleStationSelected = this.handleStationSelected.bind(this);
    this.dateChange = this.dateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleStationSelected(value){
    let idStation = -1;
    let stationName = '';
    this.props.stations.some( s => {
      idStation = s.id;
      stationName = s.name;
      return +value == s.id; //s.code;
    });
    this.setState({stationId: idStation, stationName: stationName});
  }
  dateChange(e) {
    var date = e.target.value;
    var year = date.substr(0,4);
    var month = date.substr(5,2);
    this.setState({year: year, month: month});
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onFormSubmit({year: this.state.year, month: this.state.month, stationId: this.state.stationId, stationName: this.state.stationName});
  }
  render() {
    var yearMonth = this.state.year+'-'+this.state.month;
    return (
      <form className="paramsForm" onSubmit={this.handleSubmit}>
        <table className= "table table-hover">
          <thead>
            <tr>
              <th>Метеостанция</th>
              <th>Период</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <StationSelect options={this.props.stations} onUserInput={this.handleStationSelected} defaultValue={this.state.stationId}/>
              </td>
              <td>
                <input type="month" value={yearMonth} min="2000-01" max="2030-01" onChange={this.dateChange}/>
              </td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Пересчитать" />
      </form>
    );
  }  
}