import React from 'react';
import ReactDOM from 'react-dom';
import DateForm from './date_form';

const WindsTable = ({winds}) => {
  var rows = [];
  var stations = ["", "Донецк", "Амвросиевка", "Дебальцево", "", "", '', "", "", '', "Седово"];
  let n = 0;
  [1, 3, 2, 10].forEach( s => {
    let tdsl = [];
    let val;
    [0, 3, 6, 9, 12, 15, 18, 21].forEach( t =>{
      if(winds[s] != null && winds[s][t] != null){
        val = winds[s][t];
        tdsl.push(<td style={{borderLeft: 'solid 1px #ddd'}} key={t}>{val}</td>);
      }else
        tdsl.push(<td style={{borderLeft: 'solid 1px #ddd'}} key={t}></td>);
    });
    rows.push(<tr style={{background: n % 2 == 0? '#fff' : '#eee'}} key={s}><td>{stations[s]}</td>{tdsl}</tr>);
    n++;
  });
  return (
    <table className = "table table-hover">
      <thead>
        <tr>
          <th>Метеостанция</th>
          <th>00</th>
          <th>03</th>
          <th>06</th>
          <th>09</th>
          <th>12</th>
          <th>15</th>
          <th>18</th>
          <th>21</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};
const TemperaturesTable = ({temperaturesLocal, temperaturesUtc}) => {
  var rows = [];
  // var temps;
  var stations = ["", "Донецк", "Амвросиевка", "Дебальцево", "Волноваха", "Мариуполь", '', "Артемовск", "Красноармейск", '', "Седово"];
  
  // temps = temperatures;
  
  ['1', '3', '2', '10', '8', '4', '7', '5'].forEach( s => {
    let tdsl = [];
    let tdsu = [];
    let n = 0;
    let m = 0;
    let i;
    let j;
    let avgl = 0.0;
    let avgu = 0.0;
    ['21', '0', '3', '6','9', '12', '15', '18'].forEach( t =>{
      i = "["+s+", "+t+"]";
      if(temperaturesLocal[i] != null){
        n++;
        avgl += +(temperaturesLocal[i]);
      }
      tdsl.push(<td key={t+'l'}>{temperaturesLocal[i]}</td>);
    });
    tdsl.push(<td key={s+'al'}><b style={{color: "red"}}>{n>0 ? (avgl.toFixed(1)/n).toFixed(1) : ''}</b></td>);
    ['0', '3', '6','9', '12', '15', '18', '21'].forEach( t =>{
      j = "["+s+", "+t+"]";
      if(temperaturesUtc[j] != null){
        m++;
        avgu += +(temperaturesUtc[j]);
      }
      tdsl.push(<td key={t+'u'}>{temperaturesUtc[j]}</td>);
    });
    tdsl.push(<td key={s+'au'}><b style={{color: "blue"}}>{m > 0 ? (avgu.toFixed(1)/m).toFixed(1) : ''}</b></td>);
    rows.push(<tr key={s}><td>{stations[+s]}</td>{tdsl}{tdsu}</tr>);
  });

  return (
    <table className = "table table-hover">
      <thead>
        <tr>
          <th>Местное время</th>
          <th>00:00</th>
          <th>03:00</th>
          <th>06:00</th>
          <th>09:00</th>
          <th>12:00</th>
          <th>15:00</th>
          <th>18:00</th>
          <th>21:00</th>
          <th></th>
          <th>03:00</th>
          <th>06:00</th>
          <th>09:00</th>
          <th>12:00</th>
          <th>15:00</th>
          <th>18:00</th>
          <th>21:00</th>
          <th>00:00</th>
        </tr>
        <tr>
          <th>Метеостанция</th>
          <th>21</th>
          <th>00</th>
          <th>03</th>
          <th>06</th>
          <th>09</th>
          <th>12</th>
          <th>15</th>
          <th>18</th>
          <th>Средняя</th>
          <th>00</th>
          <th>03</th>
          <th>06</th>
          <th>09</th>
          <th>12</th>
          <th>15</th>
          <th>18</th>
          <th>21</th>
          <th>Средняя</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default class Winds extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      calcDate: this.props.calcDate,
      winds: this.props.winds
    };
    this.handleDateSubmit = this.handleDateSubmit.bind(this);
  }

  handleDateSubmit(calcDate) {
    $.ajax({
      type: 'GET',
      dataType: 'json', // important!
      url: "winds?calc_date="+calcDate
      }).done(function(data) {
        this.setState({
          calcDate: calcDate,
          winds: data.winds
        });
      }.bind(this))
      .fail(function(jqXhr) {
        console.log('failed to register');
      });
  }

  render(){
    return(
      <div>
        <h4>Порывы ветра</h4>
        <p>Задайте дату</p>
        <DateForm calcDate={this.state.calcDate} onDateSubmit={this.handleDateSubmit} />
        <h4>Порывы ветра (м/сек) между сроками наблюдений по данным метеорологических станций {this.state.calcDate}</h4>
        {/*<TemperaturesTable temperaturesLocal={this.state.temperaturesLocal} temperaturesUtc={this.state.temperaturesUtc}/>*/}
        <WindsTable winds={this.state.winds}/>
      </div>
    );
  }
}

$(function () {
  const node = document.getElementById('init-params');
  if(node) {
    const winds = JSON.parse(node.getAttribute('winds'));
    const calcDate = JSON.parse(node.getAttribute('calcDate'));
    
    ReactDOM.render(
      <Winds winds={winds} calcDate={calcDate} />,
      document.getElementById('root')
    );
  }
});