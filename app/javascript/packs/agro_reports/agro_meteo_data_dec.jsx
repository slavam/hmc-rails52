import React from 'react';
import ReactDOM from 'react-dom';
import AgroMeteoForm from './agro_meteo_form';

const AgroMeteoTable = ({telegrams, stations}) => {
  let table = [];
  telegrams.forEach((t) => {
    table.push( <tr key={t.id}>
                  <td>{stations[t.station_id]}</td>
                  <td>{t.temperature_dec_avg_delta}</td>
                  <td>{t.temperature_dec_avg}</td>
                  <td>{t.temperature_dec_max}</td>
                  <td>{t.temperature_dec_min}</td>
                  <td>{t.dry_dec_day_num}</td>
                  <td>{t.temperature_dec_min_soil}</td>
                  <td>{t.cold_soil_dec_day_num}</td>
                  <td>{t.precipitation_dec}</td>
                  <td>{t.precipitation_dec_percent}</td>
                  <td>{t.wet_dec_day_num}</td>
                  <td>{t.wind_speed_dec_max}</td>
                  <td>{t.wind_speed_dec_max_day_num}</td>
                  <td>{t.duster_dec_day_num}</td>
                  <td>{t.height_snow_cover}</td>
                  <td>{t.snow_cover}</td>
                  <td>{t.snow_cover_density}</td>
                  <td>{t.number_measurements_0}</td>
                  <td>{t.number_measurements_3}</td>
                  <td>{t.number_measurements_30}</td>
                  <td>{t.ice_crust}</td>
                  <td>{t.thickness_ice_cake}</td>
                  <td>{t.depth_thawing_soil_2}</td>
                  <td>{t.depth_soil_freezing}</td>
                  <td>{t.thermometer_index}</td>
                  <td>{t.temperature_dec_min_soil3}</td>
                  <td>{t.height_snow_cover_rail}</td>
                </tr>);
  });

  return (
    <div>
    <font size = "2" face="times">
    <table className="table table-hover">
      <thead>
        <tr>
          <th>Метеостанция</th>
          <th>Отклонение от среднего многолетнего</th>
          <th>Средняя за декаду,°С</th>
          <th>Максимальная за декаду,°С</th>
          <th>Минимальная за декаду,°С</th>
          <th>Число дней с относительной влажностью воздуха 30% и менее</th>
          <th>Минимальная за декаду температура почвы,°С</th>
          <th>Число суток с температурой на поверхности почвы -20°С и ниже</th>
          <th>Количество осадков за декаду (мм)</th>
          <th>Количество осадков за декаду в процентах от среднего многолетнего</th>
          <th>Количество дней за декаду с количеством осадков за сутки 1 мм и более</th>
          <th>Максимальная скорость ветра за декаду (м/с)</th>
          <th>Количество дней за декаду с максимальной скоростью ветра за сутки 15 м/с и более</th>
          <th>Количество дней за декаду с пылевыми бурями</th>
          <th>Средняя высота снежного покрова на последний день декады (см)</th>
          <th>Характеристика залегания</th>
          <th>Средняя плотность (г/см<sup>3</sup>)</th>
          <th>Число промеров с высотой 0 см</th>
          <th>Число промеров с высотой 1-3 см</th>
          <th>Число промеров с высотой более 30 см</th>
          <th>Распределение ледяной корки, баллы</th>
          <th>Средняя толщина ледяной корки (мм)</th>
          <th>Глубина оттаивания грунта (см)</th>
          <th>Глубина промерзания грунта (см)</th>
          <th>Название прибора</th>
          <th>Минимальная температура почвы на глубине узла кущения,°С </th>
          <th>Высота снежного покрова в день с минимальной температурой на глубине узла кущения (см)</th>
        </tr>
      </thead>
      <tbody>
        {table}
      </tbody>
    </table>
    </font>
    </div>
  );
};

export default class AgroMeteoDataDec extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      telegrams: this.props.telegrams,
      year: this.props.year,
      month: this.props.month,
      decade: this.props.decade
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    // this.stations = [];
    // this.props.stations.forEach(s => this.stations[s.id] = s.name);
  }
  handleSubmit(params){
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "/agro_dec_observations/agro_meteo_data?year="+params.year+"&month="+params.month+"&decade="+params.decade
      }).done((data) => {
        this.setState({telegrams: data.telegrams, year: params.year, month: params.month, decade: params.decade});
      }).fail((res) => {
        this.setState({errors: ["Проблемы с чтением данных из БД"]});
      }); 
  }
  
  render(){
    let desiredLink = "/agro_dec_observations/agro_meteo_data.pdf?year="+this.state.year+"&month="+this.state.month+"&decade="+this.state.decade;
    return(
      <div>
        <h3>Параметры расчета</h3>
        <AgroMeteoForm year={this.state.year} month={this.state.month} decade={this.state.decade} onParamsSubmit={this.handleSubmit}/>
        <h3>Таблица метеорологических данных декадных агрометеорологических телеграмм (холодный период года)</h3>
        <h3>Декада {this.state.decade} Месяц {this.state.month} Год {this.state.year}</h3>
        <AgroMeteoTable telegrams={this.state.telegrams} stations={this.props.stations}/>
        <a href={desiredLink}>Распечатать</a>
      </div>
    );
  }
}

$(function(){
  const node = document.getElementById('input_params');
  if(node){
    const telegrams = JSON.parse(node.getAttribute('telegrams'));
    const year = JSON.parse(node.getAttribute('year'));
    const month = JSON.parse(node.getAttribute('month'));
    const decade = JSON.parse(node.getAttribute('decade'));
    const stations = JSON.parse(node.getAttribute('stations'));
    
    ReactDOM.render(
      <AgroMeteoDataDec telegrams={telegrams} year={year} month={month} decade={decade} stations={stations}/>,
      document.getElementById('form_and_report')
    );
  }
})