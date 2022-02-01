import React from 'react';
import ReactDOM from 'react-dom';
// import Select from 'react-select';
// import TeploenergoForm from

const WindByRhumb = ({wind}) => {
  let rows = [];
  // let row = [<td key="0"><b>Числа месяца</b></td>];
  // for(var i=1; i<=maxDay; ++i){
  //   row.push(<td key={i}><b>{i}</b></td>);
  // }
  // rows[0] = <tr key="0">{row}</tr>;
  const MONTHS = ['', 'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
  for(let m=1; m<=12; m++){
    let values = [];
    for(let i=1; i<12; i++){
      let val = wind[m] ? wind[m][i]+' '+(wind[m][i]>0 && (i<9 || i==10)? '/'+Math.round(wind[m][i]*1000/(i==10? wind[m][11]:wind[m][9]))/10:'') : '';
      values.push(<td key={i}>{val}</td>);
    }
    rows.push(<tr key={m}><td key="0">{MONTHS[m]}</td>{values}</tr>)
  }  
  return <table className="table table-hover">
    <thead>
      <tr>
        <th>Месяц</th>
        <th>С</th>
        <th>СВ</th>
        <th>В</th>
        <th>ЮВ</th>
        <th>Ю</th>
        <th>ЮЗ</th>
        <th>З</th>
        <th>СЗ</th>
        <th>С ветром</th>
        <th>Штиль</th>
        <th>Всего</th>
      </tr>
    </thead>
    <tbody>{rows}</tbody>
  </table>;
};
export default class WindPerYear extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      wind: this.props.wind
    }
  }
  render(){
    return(
      <div className='container'>
        <WindByRhumb wind={this.state.wind} />
      </div>
    );
  }
}

$(() => {
  const node = document.getElementById('init-params');
  if(node) {
    const wind = JSON.parse(node.getAttribute('wind'));
    const year = JSON.parse(node.getAttribute('year'));
    const stationId = JSON.parse(node.getAttribute('stationId'));
    const stations = JSON.parse(node.getAttribute('stations'));
    
    ReactDOM.render(
      <WindPerYear wind={wind} year={year} stationId={stationId} stations={stations} />,
      document.getElementById('root')
    );
  }
});