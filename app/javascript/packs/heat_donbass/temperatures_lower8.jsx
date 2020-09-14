import React from 'react';
import ReactDOM from 'react-dom';

export default class TemperaturesLower8 extends React.Component{
  // constructor(props){
    // super(props);
    // let n = new Date(+this.props.year, +this.props.month, 0).getDate();
    // this.state = {
      // city: this.props.city,
      // year: this.props.year,
      // month: this.props.month,
      // temperatures: this.props.temperatures,
      // daysInMonth: n
    // };
    // this.handleFormSubmit = this.handleFormSubmit.bind(this);
  // }  
  // handleFormSubmit(year, month){
  //   this.state.year = year;
  //   this.state.month = month;
  //   this.state.daysInMonth = new Date(+year, +month, 0).getDate();
  //   $.ajax({
  //     type: 'GET',
  //     dataType: 'json',
  //     url: "/synoptic_observations/daily_avg_temp_lower_8?year="+year+"&month="+month
  //     }).done((data) => {
  //       this.setState({temperatures: data.temperatures});
  //     }).fail((res) => {
  //       this.setState({errors: ["Проблемы с чтением данных из БД"]});
  //     }); 
  // }
  render(){
    let i = 0;
    switch (this.props.city) {
      case 'Харцызск':
      case 'Ясиноватая':
        i = 1;
        break;
      case 'Старобешево':
      case 'Амвросиевка':
        i = 2;
        break;
      case 'Дебальцево':
        i = 3;
        break;
      case 'Докучаевск':
      case 'Тельманово':
        i = 4;
        break;
      case 'Новоазовск':
        i = 10;
        break;
      case 'Горловка':
      case 'Енакиево':
        i = 11;
        break;
      case 'Шахтерск':
      case 'Торез':
      case 'Снежное':
        i = 12;
        break;
      case 'Кировское':
        i = 13;
        break;
      case 'Зугрес':
        i = 14;
        break;
      case '':
    }
    const dayOfYear = date => {
      const myDate = new Date(date);
      const year = myDate.getFullYear();
      const firstJan = new Date(year, 0, 1);
      const differenceInMillieSeconds = myDate - firstJan;
      return (differenceInMillieSeconds / (1000 * 60 * 60 * 24) + 1);
  };
  
  // const result = dayOfYear("2019-2-01");
    let rows = [];
    let maxDay = this.props.temperatures[i][0] ? dayOfYear(this.props.temperatures[i][0]) - 273 + 4 : 60;
    let row = [<td key="0"><b>Числа месяца</b></td>];
    for(var j=1; j<=maxDay; ++j){
      row.push(<td key={j}><b>{j}</b></td>);
    }
    rows[0] = <tr key="0">{row}</tr>;
    let values = [];
    for(var k=1; k<=maxDay; k++){
      let val = this.props.temperatures[i][k] <=8 ? this.props.temperatures[i][k] : '-';
      values.push(<td key={k}>{val}</td>);
    }
    rows.push(<tr key="1"><td><b>Температура</b></td>{values}</tr>);
    return <table className="table table-hover"><tbody>{rows}</tbody></table>;

    // return(
    //   <div>
    //     {this.props.city}
    //   </div>
    // );
    // for(var i=1; i<=this.state.daysInMonth; ++i){
    //   let d = ('0'+i).slice(-2);
    //   if(this.state.temperatures[d+'-01'] && this.state.temperatures[d+'-03']){
    //     let v = (Math.round(((Number(this.state.temperatures[d+'-01'])+Number(this.state.temperatures[d+'-03']))/2)*10)/10).toFixed(1);
    //     this.state.temperatures[d+'-11'] = v.toString();
    //   }
    //   if(this.state.temperatures[d+'-02'] && this.state.temperatures[d+'-03']){
    //     let db = Number(this.state.temperatures[d+'-03']);
    //     let a = Number(this.state.temperatures[d+'-02']);
    //     let v = (Math.round((a+db)/2*10)/10).toFixed(1);
    //     this.state.temperatures[d+'-12'] = v.toString();
    //     v = (Math.round((db-(db-a)/3)*10)/10).toFixed(1);
    //     this.state.temperatures[d+'-13'] = v.toString();
    //   }
    //   if(this.state.temperatures[d+'-01'] && this.state.temperatures[d+'-02']){
    //     let v = (Math.round(((Number(this.state.temperatures[d+'-01'])+Number(this.state.temperatures[d+'-02']))/2)*10)/10).toFixed(1);
    //     this.state.temperatures[d+'-14'] = v.toString();
    //   }
    // }
  }
}

// $(() => {
document.addEventListener('turbolinks:load', () => {  
  const node = document.getElementById('init-params');
  if(node) {
    const temperatures = JSON.parse(node.getAttribute('temperatures'));
    const year = JSON.parse(node.getAttribute('year'));
    // const month = JSON.parse(node.getAttribute('month'));
    const city = JSON.parse(node.getAttribute('city'));
    
    ReactDOM.render(
      <TemperaturesLower8 temperatures={temperatures} city={city}/>,
      document.getElementById('root')
    );
  }
});