import React from 'react';
import ReactDOM from 'react-dom';
import DateForm from './date_form';

const DailyTemperaturesTable = ({temperaturesLocal, temperaturesUtc}) => {
  var rows = [];
  var stations = ["", "Донецк", "Амвросиевка", "Дебальцево", "Волноваха", "Мариуполь", '', "Артемовск", "Красноармейск", '', "Седово", "По территории", "По ДНР"];
  let n = 0;
  [1, 3, 2, 10, 8, 4, 7, 5, 11,12].forEach( s => {
    let tdsl = [];
    let tdsu = [];
    let val;
    [21, 0, 3, 6,9, 12, 15, 18,22].forEach( t =>{
      if(temperaturesLocal[s] != null && temperaturesLocal[s][t] != null){
        if(((s>10) && (t==22)) || (t==22))
           val = <b style={{color: "red"}}>{temperaturesLocal[s][t]}</b>;
        else
          if(s>10)
            val = <b>{temperaturesLocal[s][t]}</b>;
          else
            val = temperaturesLocal[s][t];
        tdsl.push(<td style={{borderLeft: 'solid 1px #ddd'}} key={t+'l'}>{val}</td>);
      }else
        tdsl.push(<td style={{borderLeft: 'solid 1px #ddd'}} key={t+'l'}></td>);
    });
    [0, 3, 6,9, 12, 15, 18, 21,22].forEach( t =>{
      if(temperaturesUtc[s] != null && temperaturesUtc[s][t] != null){
        if(((s>10) && (t==22)) || (t==22))
           val = <b style={{color: "blue"}}>{temperaturesUtc[s][t]}</b>;
        else
          if(s>10)
            val = <b>{temperaturesUtc[s][t]}</b>;
          else
            val = temperaturesUtc[s][t];
        tdsu.push(<td style={{borderLeft: 'solid 1px #ddd'}} key={t+'l'}>{val}</td>);
      }else
        tdsu.push(<td style={{borderLeft: 'solid 1px #ddd'}} key={t+'l'}></td>);
    });
    rows.push(<tr style={{background: n % 2 == 0? '#fff' : '#eee'}} key={s}><td>{stations[s]}</td>{tdsl}{tdsu}</tr>);
    n++;
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

export default class DailyAvgTemperatures extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      calcDate: this.props.calcDate,
      temperaturesLocal: this.props.temperaturesLocal,
      temperaturesUtc: this.props.temperaturesUtc
    };
    this.handleDateSubmit = this.handleDateSubmit.bind(this);
  }

  handleDateSubmit(calcDate) {
    $.ajax({
      type: 'GET',
      dataType: 'json', // important!
      url: "daily_avg_temp?calc_date="+calcDate
      }).done(function(data) {
        this.setState({
          calcDate: data.calcDate,
          temperaturesLocal: data.temperaturesLocal,
          temperaturesUtc: data.temperaturesUtc
        });
      }.bind(this))
      .fail(function(jqXhr) {
        console.log('failed to register');
      });
  }

  render(){
    return(
      <div>
        <h4>Среднесуточная температура воздуха</h4>
        <p>Задайте дату</p>
        <DateForm calcDate={this.state.calcDate} onDateSubmit={this.handleDateSubmit} />
        <h4>Температура воздуха (°С) в сроки наблюдений по данным метеорологических станций {this.state.calcDate}</h4>
        {/*<TemperaturesTable temperaturesLocal={this.state.temperaturesLocal} temperaturesUtc={this.state.temperaturesUtc}/>*/}
        <DailyTemperaturesTable temperaturesLocal={this.state.temperaturesLocal} temperaturesUtc={this.state.temperaturesUtc}/>
      </div>
    );
  }
}

$(function () {
  const node = document.getElementById('init_params');
  if(node) {
    const temperaturesLocal = JSON.parse(node.getAttribute('temperaturesLocal'));
    const temperaturesUtc = JSON.parse(node.getAttribute('temperaturesUtc'));
    const calcDate = JSON.parse(node.getAttribute('calcDate'));
    
    ReactDOM.render(
      <DailyAvgTemperatures temperaturesLocal={temperaturesLocal} temperaturesUtc={temperaturesUtc} calcDate={calcDate} />,
      document.getElementById('form_and_report')
    );
  }
});