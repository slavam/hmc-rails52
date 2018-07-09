import React from 'react';
import TermSynopticSelect from './term_synoptic_select';
import StationSelect from './station_select';
export default class SearchParamsForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dateFrom: this.props.dateFrom,
      dateTo: this.props.dateTo,
      term: '99',
      // stationCode: '0',
      stationId: '0',
      text: '',
      errors: this.props.errors,
    };
    this.dateFromChange = this.dateFromChange.bind(this);
    this.dateToChange = this.dateToChange.bind(this);
    this.handleStationSelected = this.handleStationSelected.bind(this);
    this.handleTermSelected = this.handleTermSelected.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }
  dateFromChange(e){
    this.setState({dateFrom: e.target.value});
  }
  dateToChange(e){
    this.setState({dateTo: e.target.value});
  }
  handleStationSelected(value){
    // this.state.stationCode = value;
    this.state.stationId = value;
  }
  handleTermSelected(value){
    this.state.term = value;
  }
  handleTextChange(e) {
    this.setState({text: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onTelegramSubmit({dateFrom: this.state.dateFrom, dateTo: this.state.dateTo, stationId: this.state.stationId, term: this.state.term, text: this.state.text});
  }

  render() {
    const terms = [
      { value: '99', label: 'Любой' },
      { value: '00', label: '00' },
      { value: '03', label: '03' },
      { value: '06', label: '06' },
      { value: '09', label: '09' },
      { value: '12', label: '12' },
      { value: '15', label: '15' },
      { value: '18', label: '18' },
      { value: '21', label: '21' }
    ];
    return (
      <form className="telegramForm" onSubmit={this.handleSubmit}>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Дата с</th>
              <th>Дата по</th>
              <th>Срок</th>
              <th>Метеостанция</th>
              <th>Текст</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="date" name="input-date-from" value={this.state.dateFrom} onChange={this.dateFromChange} required="true" autoComplete="on" /></td>
              <td><input type="date" name="input-date-to" value={this.state.dateTo} onChange={this.dateToChange} required="true" autoComplete="on" /></td>
              <td><TermSynopticSelect options={terms} onUserInput={this.handleTermSelected} defaultValue="99"/></td>
              <td><StationSelect options={this.props.stations} onUserInput={this.handleStationSelected} defaultValue="0" /></td>
              <td><input type="text" value={this.state.text} onChange={this.handleTextChange}/></td>
            </tr>
          </tbody>
        </table>
        <p>
          <span style={{color: 'red'}}>{this.state.errors[0]}</span>
        </p>
        <input type="submit" value="Искать" />
      </form>
    );
  }        
}
