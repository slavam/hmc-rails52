import React from 'react';

export default class BackgroundConcentrationsResult extends React.Component {
  render() {
    var rows = [];
    var concentrations = this.props.concentrations;
    if (this.props.concentrations['size'] < 100)
      for (var i = 0; i < this.props.concentrations['size']; i++) {
        rows.push(<tr key={i}><td></td><td>{concentrations['calm'][i]}</td><td>{concentrations['north'][i]}</td><td>{concentrations['east'][i]}</td><td>{concentrations['south'][i]}</td><td>{concentrations['west'][i]}</td></tr>);
      }
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th></th>
            <th>Ветер менее 3 м/с</th>
            <th>Ветер северный</th>
            <th>Ветер восточный</th>
            <th>Ветер южный</th>
            <th>Ветер западный</th>
            <th>Всего</th>
          </tr>
        </thead>
        <tbody>
          {rows}
          <tr>
            <td>Число измерений</td>
            <td>{this.props.concentrations.calm.length}</td>
            <td>{this.props.concentrations.north.length}</td>
            <td>{this.props.concentrations.east.length}</td>
            <td>{this.props.concentrations.south.length}</td>
            <td>{this.props.concentrations.west.length}</td>
            <td>{this.props.concentrations.measurement_total}</td>
          </tr>
          <tr>
            <td>Средняя концентрация за период</td>
            <td>{this.props.concentrations.avg_calm}</td>
            <td>{this.props.concentrations.avg_north}</td>
            <td>{this.props.concentrations.avg_east}</td>
            <td>{this.props.concentrations.avg_south}</td>
            <td>{this.props.concentrations.avg_west}</td>
            <td>{this.props.concentrations.avg_total} / {this.props.concentrations.avg_total_math}</td>
          </tr> 
          <tr>
            <td>Среднеквадратичное отклонение</td> 
            <td>{this.props.concentrations.standard_deviation_calm}</td>
            <td>{this.props.concentrations.standard_deviation_north}</td>
            <td>{this.props.concentrations.standard_deviation_east}</td>
            <td>{this.props.concentrations.standard_deviation_south}</td>
            <td>{this.props.concentrations.standard_deviation_west}</td>
            <td>{this.props.concentrations.standard_deviation_total} / {this.props.concentrations.standard_deviation_total_math}</td>
          </tr>
          <tr>
            <td>Коэффициент вариации</td> 
            <td>{this.props.concentrations.variance_calm}</td>
            <td>{this.props.concentrations.variance_north}</td>
            <td>{this.props.concentrations.variance_east}</td>
            <td>{this.props.concentrations.variance_south}</td>
            <td>{this.props.concentrations.variance_west}</td>
            <td>{this.props.concentrations.variance_total}</td>
          </tr>
          <tr>
            <td>Функция перехода</td> 
            <td>{this.props.concentrations.transition_function_calm}</td>
            <td>{this.props.concentrations.transition_function_north}</td>
            <td>{this.props.concentrations.transition_function_east}</td>
            <td>{this.props.concentrations.transition_function_south}</td>
            <td>{this.props.concentrations.transition_function_west}</td>
          </tr>
          <tr>
            <td>Концентрация</td> 
            <td>{this.props.concentrations.concentration_calm}</td>
            <td>{this.props.concentrations.concentration_north}</td>
            <td>{this.props.concentrations.concentration_east}</td>
            <td>{this.props.concentrations.concentration_south}</td>
            <td>{this.props.concentrations.concentration_west}</td>
            <td>{this.props.concentrations.conc_bcg_avg5}</td>
          </tr>
          <tr>
            <td>Фоновая концентрация</td> 
            <td>{this.props.concentrations.background_concentration_calm}</td>
            <td>{this.props.concentrations.background_concentration_north}</td>
            <td>{this.props.concentrations.background_concentration_east}</td>
            <td>{this.props.concentrations.background_concentration_south}</td>
            <td>{this.props.concentrations.background_concentration_west}</td>
          </tr>
        </tbody>
      </table>
    );
  }
}    
