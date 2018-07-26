import React from 'react';
import StationSelect from '../search_telegrams/station_select';

export default class ObservationsForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      dateFrom: this.props.dateFrom,
      dateTo: this.props.dateTo,
      cityId: this.props.cityId
    };
    this.dateFromChange = this.dateFromChange.bind(this);
    this.dateToChange = this.dateToChange.bind(this);
    this.handleCityChange = this.handleCityChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  dateFromChange(e){
    this.setState({dateFrom: e.target.value});
  }
  dateToChange(e){
    this.setState({dateTo: e.target.value});
  }
  handleCityChange(value){
    this.setState({cityId: +value});
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onParamsSubmit(this.state.dateFrom, this.state.dateTo, this.state.cityId);
  }
  render(){
    return(
      <form className="observationsForm" onSubmit={this.handleSubmit}>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Дата с</th>
              <th>Дата по</th>
              <th>Город</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="date" name="input-date-from" value={this.state.dateFrom} onChange={this.dateFromChange} required="true" autoComplete="on" /></td>
              <td><input type="date" name="input-date-to" value={this.state.dateTo} onChange={this.dateToChange} required="true" autoComplete="on" /></td>
              <td><StationSelect options={this.props.cities} onUserInput={this.handleCityChange} defaultValue={this.state.cityId}/></td>
              {/*<td><SelectCity cities={this.props.cities} onCityChange={this.handleCityChange} /></td>*/}
            </tr>
          </tbody>
        </table>
        
        <input type="submit" value="Пересчитать" />
      </form>
    );
  }
}
