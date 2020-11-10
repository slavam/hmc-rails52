import React from 'react';
import ReactDOM from 'react-dom';
import TeploenergoForm from './teploenergo_form';

const TableTemperatures816 = ({temperatures, maxDay}) => {
  function tempToTable(i,j,k) {
    if(temperatures[i] && temperatures[i][j] && temperatures[i][j][k])
      return temperatures[i][j][k];
    else
      return '';
  }
  function fillValues(j,k){
    let values = []
    for(i=1; i<=maxDay; i++){values.push(<td key={i}>{tempToTable(i,j,k)}</td>);}
    return values;
  }
  let rows = [];
  let row = [<td key="0"><b>Город</b></td>,<td key='00'><b>Время</b></td>];
  for(var i=1; i<=maxDay; ++i){
    row.push(<td key={i}><b>{i}</b></td>);
  }
  rows[0] = <tr key="0">{row}</tr>;
  rows.push(<tr key="1"><td rowSpan='2'><b>Донецк</b></td><td>08:00</td>{fillValues(1,0)}</tr>);
  rows.push(<tr key="2"><td>16:00</td>{fillValues(1,1)}</tr>);
  rows.push(<tr key="3"><td rowSpan='2'><b>Макеевка</b></td><td>08:00</td>{fillValues(1,0)}</tr>);
  rows.push(<tr key="4"><td>16:00</td>{fillValues(1,1)}</tr>);
  rows.push(<tr key="5"><td rowSpan='2'><b>Горловка</b></td><td>08:00</td>{fillValues(5,0)}</tr>);
  rows.push(<tr key="6"><td>16:00</td>{fillValues(5,1)}</tr>);
  rows.push(<tr key="7"><td rowSpan='2'><b>Шахтерск</b></td><td>08:00</td>{fillValues(6,0)}</tr>);
  rows.push(<tr key="8"><td>16:00</td>{fillValues(6,1)}</tr>);
  rows.push(<tr key="9"><td rowSpan='2'><b>Старобешево</b></td><td>08:00</td>{fillValues(7,0)}</tr>);
  rows.push(<tr key="10"><td>16:00</td>{fillValues(7,1)}</tr>);
  rows.push(<tr key="11"><td rowSpan='2'><b>Новоазовск</b></td><td>08:00</td>{fillValues(10,0)}</tr>);
  rows.push(<tr key="12"><td>16:00</td>{fillValues(10,1)}</tr>);
  return <table className="table table-hover"><tbody>{rows}</tbody></table>;
};

export default class Temperatures816 extends React.Component{
  constructor(props){
    super(props);
    let n = new Date(+this.props.year, +this.props.month, 0).getDate();
    this.state = {
      year: this.props.year,
      month: this.props.month,
      temperatures: this.props.temperatures,
      daysInMonth: n
    }
  }
  render(){
    let month = new Date(+this.state.year, +this.state.month-1).toLocaleString('ru',{month:'long'});
    return(
      <div>
        <TeploenergoForm year={this.state.year} month={this.state.month} onFormSubmit={this.handleFormSubmit} />
        <h4>Температура воздуха (°С) в 8 часов и 16 часов за {month} месяц {this.state.year} года</h4>
        <TableTemperatures816 temperatures={this.state.temperatures} maxDay={this.state.daysInMonth} />
      </div>
    );
  }
}
$(() => {
  const node = document.getElementById('init-params');
  if(node) {
    const temperatures = JSON.parse(node.getAttribute('temperatures'));
    const year = JSON.parse(node.getAttribute('year'));
    const month = JSON.parse(node.getAttribute('month'));

    ReactDOM.render(
      <Temperatures816 temperatures={temperatures} year={year} month={month} />,
      document.getElementById('root')
    );
  }
});