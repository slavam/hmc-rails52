import React from 'react';
import TermSynopticSelect from '../search_telegrams/term_synoptic_select';

export default class AgroDataForm extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      year: this.props.year,
      month: this.props.month, // < 10 ? '0'+this.props.month : this.props.month,
      factor: this.props.factor
    };
    this.handleFactorSelected = this.handleFactorSelected.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  dateChange(e) {
    var date = e.target.value;
    var year = date.substr(0,4);
    var month = date.substr(5,2);
    this.setState({year: year, month: month});
  }
  handleFactorSelected(value){
    this.setState({factor: value});
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.onFormSubmit(this.state);
  }
  
  render(){
    const factors = [
    {value: 'air_avg_temp', label: 'Средняя температура воздуха'}, 
    {value: 'air_max_temp', label: 'Максимальная температура воздуха'}, 
    {value: 'air_min_temp', label: 'Минимальная температура воздуха'},
    {value: 'soil_min_temp', label: 'Минимальная температура почвы'},
    {value: 'percipitation_24', label: 'Осадки за сутки'},
    {value: 'percipitation_night', label: 'Осадки за ночь'},
    {value: 'wind_speed_max', label: 'Максимальная скорость ветра'},
    {value: 'saturation_deficit_max', label: 'Максимальный дефицит насыщения воздуха'},
    {value: 'relative_humidity_min', label: 'Минимальная относительная влажность воздуха'},
    {value: 'saturation_deficit_avg', label: 'Средний дефицит насыщения воздуха'},
  ];
    return(
      <form className="paramsForm" onSubmit={this.handleSubmit}>
        <table className= "table table-hover">
          <thead>
            <tr>
              <th>Данные</th>
              <th>Месяц и год</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><TermSynopticSelect options={factors} onUserInput={this.handleFactorSelected} defaultValue={this.state.factor}/></td>
              <td><input type="month" id="start" name="start" value={this.state.year+'-'+this.state.month} onChange={event => this.dateChange(event)} /></td>
            </tr>
          </tbody>
        </table>
        <input type="submit" value="Пересчитать" />
      </form>
    );
  }
}