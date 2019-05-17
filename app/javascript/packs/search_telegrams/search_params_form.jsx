import React from 'react';
import TermSynopticSelect from './term_synoptic_select';
import StationSelect from './station_select';
// import Select from 'react-select';
export default class SearchParamsForm extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dateFrom: this.props.dateFrom,
      dateTo: this.props.dateTo,
      term: this.props.tlgTerm,
      stormType: this.props.stormType,
      type: this.props.tlgType,
      stationId: this.props.stationId,
      // station: { value: '1',  label: 'Донецк' },
      text: this.props.tlgText,
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
    this.state.stationId = value;
    // this.state.station = value;
  }
  handleTermSelected(value){
    if(this.props.tlgType == 'synoptic')
      this.state.term = value;
    else
      this.state.stormType = value;
  }
  handleTextChange(e) {
    this.setState({text: e.target.value});
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.onTelegramSubmit({dateFrom: this.state.dateFrom, dateTo: this.state.dateTo, stationId: this.state.stationId, term: this.state.term, text: this.state.text, type: this.state.type, stormType: this.state.stormType});
  }

  render() {
    const terms = [
      { value: '99', label: 'Все' },
      { value: '00', label: '00' },
      { value: '03', label: '03' },
      { value: '06', label: '06' },
      { value: '09', label: '09' },
      { value: '12', label: '12' },
      { value: '15', label: '15' },
      { value: '18', label: '18' },
      { value: '21', label: '21' }
    ];
    const types = [
      { value: '99', label: 'Все' },
      { value: 'ЩЭОЗМ', label: 'ЩЭОЗМ' },
      { value: 'ЩЭОЯЮ', label: 'ЩЭОЯЮ' },
    ];
    const optHead = this.props.tlgType == 'synoptic' ? <th>Срок</th> : (this.props.tlgType == 'storm' ? <th>Тип</th> : <td></td>);
    const optInput = (this.props.tlgType == 'synoptic' || this.props.tlgType == 'storm') ?
      <td><TermSynopticSelect options={this.props.tlgType == 'synoptic' ? terms : types} onUserInput={this.handleTermSelected} defaultValue={this.props.tlgType == 'synoptic' ? this.props.tlgTerm : this.props.stormType}/></td> : <td></td>;
    return (
      <form className="telegramForm" onSubmit={this.handleSubmit}>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Дата с</th>
              <th>Дата по</th>
              {optHead}
              <th>Метеостанция</th>
              <th>Текст</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><input type="date" name="input-date-from" value={this.state.dateFrom} onChange={this.dateFromChange} required="true" autoComplete="on" /></td>
              <td><input type="date" name="input-date-to" value={this.state.dateTo} onChange={this.dateToChange} required="true" autoComplete="on" /></td>
              {optInput}
              <td><StationSelect options={this.props.stations} onUserInput={this.handleStationSelected} defaultValue={this.props.stationId} /></td>
              {/*<td><Select value={this.state.station} onChange={this.handleStationSelected} options={this.props.stations}/></td>*/}
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
