import React from 'react';
import ReactDOM from 'react-dom';
import TeploenergoForm from './teploenergo_form';

const AvgTemperaturesCompact = ({temperatures, maxDay}) => {
  let rows = [];
  let row = [<td key="0"><b>Населенные пункты ДНР</b></td>];
  for(var i=1; i<=maxDay; ++i){
    row.push(<td key={i}><b>{i}</b></td>);
  }
  rows[0] = <tr key="0">{row}</tr>;
  let cities = [
    ,
    <td><b>Донецк<br/>Пантелеймоновка<br/>Моспино<br/>Еленовка<br/>Макеевка<br/>Харцызск<br/>Ясиноватая</b></td>,
    <td><b>Амвросиевка<br/>Иловайск<br/>Старобешево<br/>Комсомольское</b></td>,
    <td><b>Дебальцево<br/>Углегорск</b></td>,
    <td><b>Волноваха</b></td>,
    <td><b>Мариуполь</b></td>,
    6,7,8,9,
    <td><b>Новоазовск</b></td>,
    <td><b>Горловка<br/>Енакиево</b></td>,
    <td><b>Снежное<br/>Торез<br/>Шахтерск</b></td>,
    <td><b>Ждановка<br/>Кировское</b></td>,
    <td><b>Зугрэс</b></td>,
    <td><b>Докучаевск<br/>Тельманово</b></td>,
    
  ];
  let values = [];
  [1,3,2,15,10,11,12,13,14,4,5].forEach((j) => { // коды станций 1-4,10
    values = [];
    for(var i=1; i<=maxDay; ++i){
      let key = ('0'+i).slice(-2)+'-'+('0'+j).slice(-2);
      let val = temperatures[key] == null ? '': temperatures[key];
      values.push(<td key={i}>{val}</td>);
    }
    rows.push(<tr key={j}>{cities[j]}{values}</tr>);
  });
  return <table className="table table-hover"><tbody>{rows}</tbody></table>;
};

export default class Teploenergo2 extends React.Component{
  constructor(props){
    super(props);
    let n = new Date(+this.props.year, +this.props.month, 0).getDate();
    this.state = {
      year: this.props.year,
      month: this.props.month,
      temperatures: this.props.temperatures,
      daysInMonth: n
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }  
  handleFormSubmit(year, month){
    this.state.year = year;
    this.state.month = month;
    this.state.daysInMonth = new Date(+year, +month, 0).getDate();
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "/synoptic_observations/teploenergo?year="+year+"&month="+month
      }).done((data) => {
        this.setState({temperatures: data.temperatures});
      }).fail((res) => {
        this.setState({errors: ["Проблемы с чтением данных из БД"]});
      }); 
  }
  render(){
    for(var i=1; i<=this.state.daysInMonth; ++i){
      let d = ('0'+i).slice(-2);
      if(this.state.temperatures[d+'-01'] && this.state.temperatures[d+'-03']){
        let v = (Math.round(((Number(this.state.temperatures[d+'-01'])+Number(this.state.temperatures[d+'-03']))/2)*10)/10).toFixed(1);
        this.state.temperatures[d+'-11'] = v.toString();
      }
      if(this.state.temperatures[d+'-02'] && this.state.temperatures[d+'-03']){
        let db = Number(this.state.temperatures[d+'-03']);
        let a = Number(this.state.temperatures[d+'-02']);
        let v = (Math.round((a+db)/2*10)/10).toFixed(1);
        this.state.temperatures[d+'-12'] = v.toString();
        v = (Math.round((db-(db-a)/3)*10)/10).toFixed(1);
        this.state.temperatures[d+'-13'] = v.toString();
      }
      if(this.state.temperatures[d+'-01'] && this.state.temperatures[d+'-02']){
        let v = (Math.round(((Number(this.state.temperatures[d+'-01'])+Number(this.state.temperatures[d+'-02']))/2)*10)/10).toFixed(1);
        this.state.temperatures[d+'-14'] = v.toString();
      }
      if(this.state.temperatures[d+'-01'] && this.state.temperatures[d+'-04']){
        let v = (Math.round(((Number(this.state.temperatures[d+'-01'])+Number(this.state.temperatures[d+'-04']))/2)*10)/10).toFixed(1);
        this.state.temperatures[d+'-15'] = v.toString();
      }
    }
    const MONTHS = ['', 'января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    let endDate = this.state.daysInMonth+' '+MONTHS[+this.state.month]+' '+this.state.year;
    let desiredLink = "/synoptic_observations/teploenergo2.pdf?year="+this.state.year+"&month="+this.state.month;
    let cData = [];
    [1,3,2,4,10].forEach((j) => {
      cData[j] = [];
      let id = ('0'+j).slice(-2);
      Object.keys(this.state.temperatures).forEach((k) => {if(k.substr(3,2)==id) cData[j][+k.substr(0,2)-1]=this.state.temperatures[k]});
    });
    
    return(
      <div>
        <TeploenergoForm year={this.state.year} month={this.state.month} onFormSubmit={this.handleFormSubmit} />
        <h5>Средняя за сутки (00:01-24:00) температура воздуха (°С) с 01 по {endDate} года для населенных пунктов Донецкой Народной Республики</h5>
        <br/>
        {/*<AvgTemperatures temperatures={this.state.temperatures} maxDay={this.state.daysInMonth}/>*/}
        <AvgTemperaturesCompact temperatures={this.state.temperatures} maxDay={this.state.daysInMonth}/>
        <a href={desiredLink+'&variant=chief'} title='Подписал начальник'>Распечатать вариант 1</a>
        <br/>
        <a href={desiredLink+'&variant=deputy_chief'} title='Подписал заместитель'>Распечатать вариант 2</a>
        {/*<br/>
        <a href={desiredLink+'&variant=one_page'} title='Development'>Распечатать вариант 3</a>
        <br/>
        <a href={desiredLink+'&variant=portrait'} title='Development'>Распечатать вариант 4</a>*/}
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
      <Teploenergo2 temperatures={temperatures} year={year} month={month} />,
      document.getElementById('root')
    );
  }
});