import React from 'react';
import ReactDOM from 'react-dom';

const TemperaturesTable = ({temperatures}) => {
  var rows = [];
  var temps;
  var stations = ["", "Донецк", "Амвросиевка", "Дебальцево", "Волноваха", "Мариуполь"];
  
  temps = temperatures;
  
  ['3', '1', '2', '4', '5'].forEach( s => {
    let tds = [];
    let n = 0;
    let i;
    let avg = 0.0;
    ['9', '12', '15', '18', '21', '0', '3', '6'].forEach( t =>{
      i = "["+s+", "+t+"]";
      if(temps[i] != null){
        n++;
        avg += +(temps[i]);
      }
      tds.push(<td key={t}>{temps[i]}</td>);
    });
    rows.push(<tr key={s}><td>{stations[+s]}</td>{tds}<td><b>{n > 0 ? (avg/n).toFixed(2) : ''}</b></td></tr>);
  });

  return (
    <table className = "table table-hover">
      <thead>
        <tr>
          <th>Метеостанция</th>
          <th>09</th>
          <th>12</th>
          <th>15</th>
          <th>18</th>
          <th>21</th>
          <th>00</th>
          <th>03</th>
          <th>06</th>
          <th>Средняя</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default class HeatDonbass extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      calcDate: this.props.calcDate,
      temperatures: this.props.temperatures
    };
    this.inputDate = document.querySelector('#input-date');
    this.inputDate.value = this.props.calcDate;
    this.calcDate$ = Rx.Observable.fromEvent(this.inputDate, 'change')
    .subscribe(() => {
      this.handleDateSubmit(this.inputDate.value);
    });
	    
    this.handleDateSubmit = this.handleDateSubmit.bind(this);
  }

  handleDateSubmit(calcDate) {
    $.ajax({
      type: 'GET',
      url: "get_temps?calc_date="+calcDate
      }).done(function(data) {
        this.setState({
          calcDate: data.calcDate,
          temperatures: data.temperatures
        });
      }.bind(this))
      .fail(function(jqXhr) {
        console.log('failed to register');
      });
  }

  render(){
    
    return(
      <div className="col-md-6 col-md-offset-3">
        <h4>Температура воздуха (°С) в сроки наблюдений по данным метеорологических станций {this.state.calcDate}</h4>
        <TemperaturesTable temperatures={this.state.temperatures} />
      </div>
    );
  }
}



$(function () {
  const node = document.getElementById('init_params');
  if(node) {
    const temperatures = JSON.parse(node.getAttribute('temperatures'));
    const calcDate = JSON.parse(node.getAttribute('calcDate'));
    
    
    ReactDOM.render(
      <HeatDonbass temperatures={temperatures} calcDate={calcDate} />,
      document.getElementById('form_and_result')
    );
  }
});