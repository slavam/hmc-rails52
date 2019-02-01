import React from 'react';
import ReactDOM from 'react-dom';
import AgroMeteoForm from './agro_meteo_form';

const AgroMeteoTable = ({telegrams, stations, period, decade, temperatureMonth, precipitationMonth}) => {
  let table = [];
  if(period == 'warm')
    telegrams.forEach((t) => {
      table.push( <tr key={t.id}>
                    <td>{stations[t.station_id]}</td>
                    <td>{t.temperature_dec_avg_delta}</td>
                    <td>{t.temperature_dec_avg}</td>
                    <td>{t.temperature_dec_max}</td>
                    <td>{t.temperature_dec_min}</td>
                    <td>{t.hot_dec_day_num}</td>
                    <td>{t.temperature_dec_min_soil}</td>
                    <td>{t.dry_dec_day_num}</td>
                    <td>{t.precipitation_dec}</td>
                    <td>{t.precipitation_dec_percent}</td>
                    <td>{t.percipitation_dec_max}</td>
                    <td>{t.wet_dec_day_num}</td>
                    <td>{t.percipitation5_dec_day_num}</td>
                    <td>{t.wind_speed_dec_max}</td>
                    <td>{t.wind_speed_dec_max_day_num}</td>
                    <td>{t.temperature_dec_max_soil}</td>
                    <td>{t.sunshine_duration_dec}</td>
                    <td>{t.freezing_dec_day_num}</td>
                    <td>{t.temperature_dec_avg_soil10}</td>
                    <td>{t.temperature25_soil10_dec_day_num}</td>
                    <td>{t.dew_dec_day_num}</td>
                    <td>{t.saturation_deficit_dec_avg}</td>
                    <td>{t.relative_humidity_dec_avg}</td>
                    {decade == 3 ? <td>{temperatureMonth[t.station_id]}</td> : <td></td>}
                    {decade == 3 ? <td>{precipitationMonth[t.station_id]}</td> : <td></td>}
                  </tr>);
    });
  else
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
                    <td>{t.temperature_dec_max_soil}</td>
                    <td>{t.precipitation_dec}</td>
                    <td>{t.precipitation_dec_percent}</td>
                    <td>{t.percipitation_dec_max}</td>
                    <td>{t.wet_dec_day_num}</td>
                    <td>{t.percipitation5_dec_day_num}</td>
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
  let ths = [];
  if(period == 'warm'){
    ths = [
      "Метеостанция",
      "Отклонение от среднего многолетнего",
      "Средняя за декаду,°С",
      "Максимальная за декаду,°С",
      "Минимальная за декаду,°С",
      "Число суток за декаду с максимальной температурой за сутки 30°С и выше",
      "Минимальная за декаду температура почвы,°С",
      "Число дней с относительной влажностью воздуха 30% и менее",
      "Количество осадков за декаду (мм)",
      "Количество осадков за декаду в процентах от среднего многолетнего",
      "Суточный максимум (мм)",
      "Количество дней за декаду с количеством осадков за сутки 1 мм и более",
      "Количество дней за декаду с количеством осадков за сутки 5 мм и более",
      "Максимальная скорость ветра за декаду (м/с)",
      "Количество дней за декаду с максимальной скоростью ветра за сутки 15 м/с и более",
      "Максимальная температура поверхности почвы (°С)",
      "Число часов солнечного сияния",
      "Число суток с заморозками в воздухе или на почве",
      "Средняя температура почвы на глубине 10 см (°С)",
      "Число суток с температурой почвы на глубине 10 см 25°С и более",
      "Число суток с росой",
      "Средний дефицит насыщения за декаду (гПа)",
      "Средняя относительная влажность воздуха за декаду (%)"
    ];
    if(decade == 3){
      ths.push("Средняя за месяц температура воздуха, °С");
      ths.push("Сумма осадков за месяц, мм");
    }
  }else
    ths = [
      "Метеостанция",
      "Отклонение от среднего многолетнего",
      "Средняя за декаду,°С",
      "Максимальная за декаду,°С",
      "Минимальная за декаду,°С",
      "Число дней с относительной влажностью воздуха 30% и менее",
      "Минимальная за декаду температура почвы,°С",
      "Число суток с температурой на поверхности почвы -20°С и ниже",
      "Максимальная за декаду температура почвы,°С", // 1
      "Количество осадков за декаду (мм)",
      "Количество осадков за декаду в процентах от среднего многолетнего",
      "Суточный максимум осадков за декаду (мм)", //2
      "Количество дней за декаду с количеством осадков за сутки 1 мм и более",
      "Количество дней за декаду с количеством осадков за сутки 5 мм и более", //3
      "Максимальная скорость ветра за декаду (м/с)", 
      "Количество дней за декаду с максимальной скоростью ветра за сутки 15 м/с и более",
      "Количество дней за декаду с пылевыми бурями",
      "Средняя высота снежного покрова на последний день декады (см)",
      "Характеристика залегания",
      "Средняя плотность (г/см<sup>3</sup>)",
      "Число промеров с высотой 0 см",
      "Число промеров с высотой 1-3 см",
      "Число промеров с высотой более 30 см",
      "Распределение ледяной корки, баллы",
      "Средняя толщина ледяной корки (мм)",
      "Глубина оттаивания грунта (см)",
      "Глубина промерзания грунта (см)",
      "Название прибора",
      "Минимальная температура почвы на глубине узла кущения,°С ",
      "Высота снежного покрова в день с минимальной температурой на глубине узла кущения (см)"
    ];
    let head = [];
    ths.forEach((t, i) => head.push(<th key={i}>{t}</th>));
  return (
    <div>
    <font size = "2" face="times">
    <table className="table table-hover">
      <thead>
        <tr>
          {head}
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
      temperatureMonth: this.props.temperatureMonth,
      precipitationMonth: this.props.precipitationMonth,
      year: this.props.year,
      month: this.props.month,
      decade: this.props.decade
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleSubmit(params){
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "/agro_dec_observations/agro_meteo_data?year="+params.year+"&month="+params.month+"&decade="+params.decade+"&period="+this.props.period
      }).done((data) => {
        this.setState({telegrams: data.telegrams, year: params.year, month: params.month, decade: params.decade, temperatureMonth: data.temperatureMonth, precipitationMonth: data.precipitationMonth});
      }).fail((res) => {
        this.setState({errors: ["Проблемы с чтением данных из БД"]});
      }); 
  }
  
  render(){
    let desiredLink = "/agro_dec_observations/agro_meteo_data.pdf?year="+this.state.year+"&month="+this.state.month+"&decade="+this.state.decade+"&period="+this.props.period;
    let periodName = this.props.period == 'warm' ? 'теплый' : 'холодный';
    return(
      <div>
        <h3>Параметры расчета</h3>
        <AgroMeteoForm year={this.state.year} month={this.state.month} decade={this.state.decade} onParamsSubmit={this.handleSubmit}/>
        <h3>Таблица метеорологических данных декадных агрометеорологических телеграмм ({periodName} период года)</h3>
        <h3>Декада {this.state.decade} Месяц {this.state.month} Год {this.state.year}</h3>
        <AgroMeteoTable telegrams={this.state.telegrams} stations={this.props.stations} period={this.props.period} decade={this.state.decade} temperatureMonth={this.state.temperatureMonth} precipitationMonth={this.state.precipitationMonth}/>
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
    const period = JSON.parse(node.getAttribute('period'));
    const temperatureMonth = JSON.parse(node.getAttribute('temperatureMonth'));
    const precipitationMonth = JSON.parse(node.getAttribute('precipitationMonth'));
    
    ReactDOM.render(
      <AgroMeteoDataDec telegrams={telegrams} year={year} month={month} decade={decade} stations={stations} period={period} temperatureMonth={temperatureMonth} precipitationMonth={precipitationMonth}/>,
      document.getElementById('form_and_report')
    );
  }
})