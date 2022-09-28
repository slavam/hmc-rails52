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
        val = parseInt(winds[s][t], 10);
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
          <th>00:00</th>
          <th>03:00</th>
          <th>06:00</th>
          <th>09:00</th>
          <th>12:00</th>
          <th>15:00</th>
          <th>18:00</th>
          <th>21:00</th>
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