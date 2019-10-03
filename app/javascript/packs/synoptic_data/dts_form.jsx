import React from 'react';
import Select from 'react-select';

export default class DtsForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      observationDate: this.props.observationDate,
      termR: {value: '0', label: '0'},
      station: { value: '1',  label: 'Донецк' }
    };
    this.dateChange = this.dateChange.bind(this);
    this.handleStationSelected = this.handleStationSelected.bind(this);
    this.handleTermSelected = this.handleTermSelected.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }
  handleStationSelected(val){
    this.setState({station: val});
  }
  handleTermSelected(val){
    this.setState({termR: val});
  }
  dateChange(e){
    this.setState({observationDate: e.target.value});
  }
  handleFormSubmit(e){
    e.preventDefault();
    this.props.onFormSubmit(this.state.observationDate, this.state.termR.value, this.state.station.value);
  }
  render(){
    const stations = [];
    this.props.stations.forEach((s) => stations.push({value: s.id, label: s.name}));
    const terms = [{value: '0', label: '0'},
      {value: '3', label: '3'},
      {value: '6', label: '6'},
      {value: '9', label: '9'},
      {value: '12', label: '12'},
      {value: '15', label: '15'},
      {value: '18', label: '18'},
      {value: '21', label: '21'}];
    return(
            <div>
        <h4>Задайте параметры</h4>
        <form className="telegramForm" onSubmit={this.handleFormSubmit}>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Дата наблюдения</th>
                <th>Срок</th>
                <th>Метеостанция</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="date" value={this.state.observationDate} onChange={this.dateChange} /></td>
                <td><Select value={this.state.termR} onChange={this.handleTermSelected} options={terms}/></td>
                <td><Select value={this.state.station} onChange={this.handleStationSelected} options={stations}/></td>
              </tr>
            </tbody>
          </table>
          <input type="submit" value="Дальше" />
        </form>  
      </div>
    );
  }
}