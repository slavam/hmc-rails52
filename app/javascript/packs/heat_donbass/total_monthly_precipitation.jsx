import React from 'react';
import ReactDOM from 'react-dom';
import MonthYearForm from './month_year_form';

const TotalMonthlyPrecipitationTable = ({precipitation, maxDay}) => {
  // let names = ['','Донецк','Кировский','Авдотьино','Макеевка','Новоселовка','Дебальцево','Амвросиевка','Благодатное',
  //   'Стрюково','Дмитровка','Алексеево-Орловка','Николаевка','Старобешево','Раздольное','Тельманово','Седово']
  let names = ['','Донецк','Авдотьино','Новоселовка','Дебальцево','Стрюково','Дмитровка','Амвросиевка','Благодатное',
    'Алексеево-Орловка','Волноваха','Николаевка','Раздольное','Тельманово','Мариуполь','Седово']
  let daysNum = [];
  for(var i=1; i<=maxDay; ++i){ 
    daysNum.push(<td style={{borderWidth:"1px", borderColor:"#555555", borderStyle:'solid'}} key={i}><b>{i}</b></td>);
  }
  let row0 = <tr key='0' ><td style={{borderWidth:"1px", borderColor:"#555555", borderStyle:'solid'}} colSpan="2" ></td>{daysNum}</tr>;
  let rows = [];  
  if (precipitation){
    rows.push(row0);
    for(var j=1; j<names.length; ++j){
      let valuesN = [];
      let valuesD = [];
      for(var i=1; i<=maxDay; ++i){
        var vn, vd, tn, td = ''
        if((precipitation[j] != null) && (precipitation[j][i] != null) && precipitation[j][i][0]){
          vn=precipitation[j][i][0];
          tn=precipitation[j][i][2];
        }else{
          vn = '';
          tn = '';
        }
        if((precipitation[j] != null) && (precipitation[j][i] != null) && precipitation[j][i][1]){
          vd=precipitation[j][i][1];
          td=precipitation[j][i][3];
        }else{
          vd = '';
          td = '';
        }
        valuesN.push(<td style={{borderWidth:"1px", backgroundColor: '#dddddd', borderColor:"#555555", borderStyle:'solid'}} key={i*2} align="center" title={tn}>{vn}</td>);
        valuesD.push(<td style={{borderWidth:"1px", borderColor:"#555555", borderStyle:'solid'}} key={i} align="center" title={td}>{vd}</td>);
      }
      rows.push(<tr key={j} ><td style={{borderWidth:"1px", borderColor:"#555555", borderStyle:'solid'}} rowSpan="2"><b>{names[j]}</b></td><td style={{borderWidth:"1px", backgroundColor: '#dddddd', borderColor:"#555555", borderStyle:'solid'}} >Ночь</td>{valuesN}</tr>);
      rows.push(<tr key={j*2+20}><td style={{borderWidth:"1px", borderColor:"#555555", borderStyle:'solid'}} >День</td>{valuesD}</tr>);
    }
    row0 = <tr key='00'><td style={{borderWidth:"1px", borderColor:"#555555", borderStyle:'solid'}} colSpan="2" ></td>{daysNum}</tr>;
    rows.push(row0);
    return <table className="table table-bordered"><tbody>{rows}</tbody></table>;
  }else{
    return <div></div>
  }
}

export default class TotalMonthlyPrecipitation extends React.Component {
  constructor(props) {
    super(props);
    let n = new Date(+this.props.year, +this.props.month, 0).getDate();
    this.state = {
      year: this.props.year,
      month: this.props.month,
      precipitation: this.props.precipitation,
      daysInMonth: n
    };
    this.handleDateSubmit = this.handleDateSubmit.bind(this);
  }
  handleDateSubmit(year, month) {
    this.state.year = year;
    this.state.month = month;
    this.state.daysInMonth = new Date(+year, +month, 0).getDate();
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "total_monthly_precipitation?year="+year+'&month='+month
      }).done(function(data) {
        this.setState({
          precipitation: data.precipitation
        });
      }.bind(this))
      .fail(function(jqXhr) {
        console.log('Проблемы с БД');
      });
  }
  getMonth(idx) {
    var objDate = new Date();
    objDate.setDate(1);
    objDate.setMonth(idx-1);
    return objDate.toLocaleString("ru", {month: "long"});
  }
  render(){
    let desiredLink = "/other_observations/total_monthly_precipitation.pdf?year="+this.state.year+"&month="+this.state.month;
    return(
      <div>
        <MonthYearForm year={this.state.year} month={this.state.month} onFormSubmit={this.handleDateSubmit} />
        <h4>Количество осадков (мм) за {this.getMonth(this.state.month)} {this.state.year}</h4>
        <TotalMonthlyPrecipitationTable precipitation={this.state.precipitation} maxDay={this.state.daysInMonth}/>
        <a href={desiredLink}>Распечатать</a>
        <br/>
      </div>
    );
  }
}

$(() => {
  const node = document.getElementById('init_params');
  if(node) {
    const precipitation = JSON.parse(node.getAttribute('precipitation'));
    const year = JSON.parse(node.getAttribute('year'));
    const month = JSON.parse(node.getAttribute('month'));
    ReactDOM.render(
      <TotalMonthlyPrecipitation precipitation={precipitation} year={year} month={month} />,
      document.getElementById('root')
    );
  }
});
