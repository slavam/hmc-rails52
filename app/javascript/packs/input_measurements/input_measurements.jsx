import React from 'react';
import ReactDOM from 'react-dom';
import InputError from './input_error';
import TermSynopticSelect from '../search_telegrams/term_synoptic_select';
import StationSelect from '../search_telegrams/station_select';
import OnePollution from './one_pollution';

const PollutionsTable = ({concentrations, onClickDeletePollution}) => {
  var rows = [];
  var size = Object.keys(concentrations).length;
  if (size == 0)
    return (<div></div>);
  else
    Object.keys(concentrations).forEach( k => rows.push(<OnePollution pollution={concentrations[k]} material_id={k} key={k} size={size} onClickDeletePollution={onClickDeletePollution} />));
  return (
    <div>
      <h4>Вещества</h4>
      <table className="table">
        <thead>
          <tr>
            <th>Название</th>
            <th>Значение</th>
            <th>Концентрация</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    </div>
  );
};

export default class InputMeasurements extends React.Component{
  constructor(props) {
    super(props);
    var vs = {};
    var cs = {};
    Object.keys(this.props.concentrations).forEach((k) => vs[k] = this.props.concentrations[k].value);
    Object.keys(this.props.concentrations).forEach((k) => cs[k] = this.props.concentrations[k].concentration);
    this.state = {
      weather: this.props.weather,
      date: this.props.date,
      term: this.props.term,
      postId: this.props.postId,
      postName: '',
      concentrations: this.props.concentrations,
      values: vs,
      concs: cs,
      value: '',
      error: this.props.error
    };
    this.dateChange = this.dateChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleTermSelected = this.handleTermSelected.bind(this);
    this.handlePostSelected = this.handlePostSelected.bind(this);
    this.handleValueChange = this.handleValueChange.bind(this);
    this.get_weather = this.get_weather.bind(this);
    this.deletePollution = this.deletePollution.bind(this);
  }
  handleTermSelected(value){
    this.state.term = value;
    this.get_weather();
  }
  handlePostSelected(value){
    this.state.postId = value;
    // this.state.postName = opName;
    this.get_weather();
  }
  get_weather(){
    var date = this.state.date;
    $.ajax({
      type: 'GET',
      url: "get_weather_and_concentrations?date="+date+"&term="+this.state.term+"&post_id="+this.state.postId
      }).done(function(data) {
        var vs = {};
        var cs = {};
        if (Object.keys(data.concentrations).length > 0)
          Object.keys(data.concentrations).forEach( k => {vs[k] = data.concentrations[k].value; cs[k] = data.concentrations[k].concentration});
        this.setState({
          weather: data.weather,
          concentrations: data.concentrations,
          values: vs,
          concs: cs,
          error: data.error
        });
      }.bind(this))
      .fail(function(res) {
        this.setState({weather: null, error: "Погода не найдена"});
      }.bind(this));
  }
  handleSubmit(e) {
    // var size = Object.keys(this.state.values).length;
    e.preventDefault();
    var that = this;
    var measurement = {};
    // if (!this.state.weather.wind_direction) {
    // if (this.state.weather == null) {
    if (this.state.weather == null || Object.keys(this.state.weather).length === 0) {
      alert('Нет данных о погоде!');
      return;
    }
    if (Object.keys(this.state.values).length === 0) {
      alert('Нет данных о концентрациях!');
      return;
    }
    measurement.date = this.state.date.trim();
    measurement.post_id = this.state.postId;
    measurement.term = this.state.term;
    measurement.wind_direction = this.state.weather.wind_direction;
    measurement.wind_speed = this.state.weather.wind_speed;
    measurement.temperature = this.state.weather.temperature;
    measurement.phenomena = this.state.weather.phenomena;
    measurement.relative_humidity = this.state.weather.relative_humidity;
    measurement.partial_pressure = this.state.weather.partial_pressure;
    measurement.atmosphere_pressure = this.state.weather.atmosphere_pressure;
    this.state.error = '';
    $.ajax({
      type: 'POST',
      // url: "save_pollutions",
      url: "create_or_update",
      data: {measurement: measurement, values: this.state.values}
      }).done(function(data) {
        var cs = {};
        if (Object.keys(data.concentrations).length > 0) {
          Object.keys(data.concentrations).forEach((k) => cs[k] = data.concentrations[k].concentration);
        }
        that.setState({error: data.error, concentrations: data.concentrations, concs: cs});
      }.bind(this))
      .fail(function(res) {
        that.setState({values: {}, value: '', error: "Ошибка при сохранении данных. Дублирование записи."});
        // that.setState({errors: res.errors});
      });
  }
  handleValueChange(e){
    this.state.values[e.target.name] = e.target.value;
    this.setState({value: e.target.value});
  }
  dateChange(e) {
    this.state.date = e.target.value;
    this.get_weather();
  }
  deletePollution(pollutionId){
    var that = this;
    $.ajax({
      type: 'DELETE',
      url: "/pollution_values/delete_value/"+pollutionId //value_delete?=record_id="+pollutionId
    }).done(function(data){
      var vs = {};
      var cs = {};
      Object.keys(data.concentrations).forEach((k) => vs[k] = data.concentrations[k].value);
      Object.keys(data.concentrations).forEach((k) => cs[k] = data.concentrations[k].concentration);
      that.setState({values: vs, concs: cs, concentrations: data.concentrations, error: data.error});
    }.bind(this))
    .fail(function(res){});
  }

  render(){
    const terms = [
      { value: '01', label: '01' },
      { value: '07', label: '07' },
      { value: '13', label: '13' },
      { value: '19', label: '19' }
      ];
    var ths = [<th key='1001'></th>];
    var tds = [<td key='1002'><b>Значение</b></td>];
    var tds2 = [<td key='1003'><b>Концентрация</b></td>];
    this.props.materials.map( m => {
      ths.push(<th key={m.id}>{m.name}</th>);
      tds.push(<td key={m.id}>
      <input type="number" value={this.state.values[m.id] == null ? '' : this.state.values[m.id]} pattern="[0-9]+([,\.][0-9]+)?" onChange={this.handleValueChange} name={m.id} min="0.0" step="0.001"/>
      </td>);
      tds2.push(<td key={m.id}>{this.state.concs[m.id] == null ? '' : this.state.concs[m.id]}</td>);
    });
    let pressure = (this.state.weather == null || this.state.weather.atmosphere_pressure == null) ? <td></td> : <td>{this.state.weather.atmosphere_pressure} / {(this.state.weather.atmosphere_pressure/1.334).toFixed()}</td>;
    let temperature = '';
    let windSpeed = '';
    let windDirection = '';
    if(this.state.weather){
      temperature = this.state.weather.temperature;
      windSpeed = this.state.weather.wind_speed;
      windDirection = this.state.weather.wind_direction*10;
    }
    return(
      <div>
        <InputError visible="true" errorMessage={this.state.error} />
        <form className="pollutionsForm" onSubmit={this.handleSubmit}>

          <h3>Создать/изменить запись</h3>
          <table className="table table-hover">
            <thead>
              <tr>
                <th>Пост</th>
                <th>Срок</th>
                <th>Дата</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><StationSelect options={this.props.posts} onUserInput={this.handlePostSelected} defaultValue={this.state.postId}/></td>
                <td><TermSynopticSelect options={terms} onUserInput={this.handleTermSelected} defaultValue={this.state.term}/></td>
                <td><input type="date" name="measurement-date" value={this.state.date} onChange={this.dateChange} required={true} autoComplete="on"/></td>
              </tr>
            </tbody>
          </table>
          <table className="table table-hover">
            <thead>
              <tr>
                {ths}
              </tr>
            </thead>
            <tbody>
              <tr>
                {tds}
              </tr>
              <tr>
                {tds2}
              </tr>
            </tbody>
          </table>
          <input type="submit" value="Сохранить" />
        </form>
        <h4>Данные о погоде (дата: {this.state.date}; срок: {this.state.term}; {this.state.postName})</h4>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Температура воздуха, °С</th>
              <th>Скорость ветра, м/с</th>
              <th>Направление ветра, °</th>
              <th>Атмосферное давление, hPa / мм.рт.ст.</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                {temperature}
              </td>
              <td>
                {windSpeed}
              </td>
              <td>
                {windDirection}
              </td>
              {pressure}
            </tr>
          </tbody>
        </table>
        <PollutionsTable concentrations={this.state.concentrations} onClickDeletePollution={this.deletePollution}/>
      </div>
    );
  }
}


$(function(){
  const node = document.getElementById('input_params');
  if(node){
    const date = JSON.parse(node.getAttribute('date'));
    const term = JSON.parse(node.getAttribute('term'));
    const materials = JSON.parse(node.getAttribute('materials'));
    const posts = JSON.parse(node.getAttribute('posts'));
    const postId = JSON.parse(node.getAttribute('postId'));
    const weather = JSON.parse(node.getAttribute('weather'));
    const concentrations = JSON.parse(node.getAttribute('concentrations'));
    const error = JSON.parse(node.getAttribute('error'));

    ReactDOM.render(
      <InputMeasurements date={date} term={term} materials={materials} posts={posts} postId={postId} weather={weather} concentrations={concentrations} error={[error]}/>,
      document.getElementById('form_and_measurement')
    );
  }
})
