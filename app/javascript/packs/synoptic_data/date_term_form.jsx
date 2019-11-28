import React from 'react';
import Select from 'react-select';

export default class DateTermForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      observationDate: this.props.observationDate,
      termR: {value: '0', label: '00'},
      setStationsR: {value: 'set2500', label: 'Микрокольцевая (1:2500)'}
    };
    this.dateChange = this.dateChange.bind(this);
    this.handleTermSelected = this.handleTermSelected.bind(this);
    this.handleSetSelected = this.handleSetSelected.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }
  handleSetSelected(val){
    this.setState({setStationsR: val});
  }
  handleTermSelected(val){
    this.setState({termR: val});
  }
  dateChange(e){
    this.setState({observationDate: e.target.value});
  }
  handleFormSubmit(e){
    e.preventDefault();
    this.props.onDateTermSubmit(this.state.observationDate, this.state.termR.value, this.state.setStationsR.value);
  }
  render(){
    const terms = [{value: '0', label: '00'},
      {value: '3', label: '03'},
      {value: '6', label: '06'},
      {value: '9', label: '09'},
      {value: '12', label: '12'},
      {value: '15', label: '15'},
      {value: '18', label: '18'},
      {value: '21', label: '21'}];
    const setStations =[
      {value: 'set2500', label: 'Микрокольцевая (1:2500)'},
      {value: 'set5000', label: 'Кольцевая (1:5000)'},
      {value: 'set10000', label: 'Синоптическая (1:10000)'}
    ];
    return(
      <div>
        <h4>Задайте дату, срок и набор станций</h4>
        <form className="telegramForm" onSubmit={this.handleFormSubmit}>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Дата наблюдения</th>
                <th>Срок</th>
                <th>Набор станций</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><input type="date" value={this.state.observationDate} onChange={this.dateChange} /></td>
                <td><Select value={this.state.termR} onChange={this.handleTermSelected} options={terms}/></td>
                <td><Select value={this.state.setStationsR} onChange={this.handleSetSelected} options={setStations}/></td>
                <td><input type="submit" value="Обновить" /></td>
              </tr>
            </tbody>
          </table>
        </form>  
      </div>
    );
  }
}