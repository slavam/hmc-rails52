import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';

export default class DateTermStation extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      observationId: null,
      observationDate: this.props.observationDate,
      termR: {value: '0', label: '0'},
      station: { value: '1',  label: 'Донецк' }
    };
    this.dateChange = this.dateChange.bind(this);
    this.handleStationSelected = this.handleStationSelected.bind(this);
    this.handleTermSelected = this.handleTermSelected.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(){
    $.ajax({
      type: 'GET',
      dataType: 'html',
      url: "/synoptic_observations/test_telegram?observation_date="+this.state.observationDate+"&term="+this.state.termR.value+"&station_id="+this.state.station.value
      }).done((data) => {
        this.setState({observationId: data.observation_id});
        // alert("id="+data.observation_id)
      }).fail((res) => {
        this.setState({errors: ["Проблемы с чтением данных из БД"]});
    }); 
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
  render(){
    let desiredLink = "/synoptic_observations/edit_synoptic_data?id="+this.state.observationId;
    let editLink = this.state.observationId ? <a href={desiredLink}>Изменить</a> : '';
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
        <form className="telegramForm" onSubmit={this.handleSubmit}>
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
        {editLink}
      </div>
    );
  }
}

$(() => {
  const node = document.getElementById('search_params');
  if(node){
    const observationDate = JSON.parse(node.getAttribute('observationDate'));
    const stations = JSON.parse(node.getAttribute('stations'));
    const term = JSON.parse(node.getAttribute('term'));
  
    ReactDOM.render(
      <DateTermStation observationDate={observationDate} stations={stations} term={term}  />,
      document.getElementById('form_and_result')
    );
  } 
})