import React from 'react';
import ReactDOM from 'react-dom';
import MonthYearForm from './month_year_form';

const MonthlyPrecipitationTable = ({precipitation, maxDay}) => {
  let nightDay = [];
  for(var k=0; k<5; ++k){
    nightDay.push(<td key={k} style={{borderColor:"black"}} align="center"><b>Ночь</b></td>);
    nightDay.push(<td key={k+10} style={{borderColor:"black"}} align="center"><b>День</b></td>);
  }
  let rows = [<tr key="0"><td style={{borderColor:"black"}}></td><td style={{borderColor:"black"}} colSpan="2" align="center"><b>Авдотьино</b></td><td style={{borderColor:"black"}} colSpan="2" align="center"><b>Кировский</b></td><td style={{borderColor:"black"}} colSpan="2" align="center"><b>Макеевка</b></td><td style={{borderColor:"black"}} colSpan="2" align="center"><b>Старобешево</b></td><td style={{borderColor:"black"}} colSpan="2" align="center"><b>Тельманово</b></td></tr>,
              <tr key="100"><td style={{borderColor:"black"}} align="center"><b>Число</b></td>{nightDay}</tr>];
  if (precipitation){
    for(var i=1; i<=maxDay; ++i){
      let values = [];
      let tr0;
      for(var j=0; j<5; ++j){
        let vn, vd, tn, td = ''
        if((precipitation[i] != null) && (precipitation[i][j] != null)){
          if(precipitation[i][j][0]){
            vn=precipitation[i][j][0];
            tn=precipitation[i][j][2];
          }
          if(precipitation[i][j][1]){
            vd=precipitation[i][j][1];
            td=precipitation[i][j][3];
          }
        }
        values.push(<td style={{borderColor:"black"}} key={j*2} align="center" title={tn}>{vn}</td>);
        values.push(<td style={{borderColor:"black"}} key={j*2+1} align="center" title={td}>{vd}</td>);
      }
      rows.push(<tr key={i}><td style={{borderColor:"black"}} align="center" key={i}>{i}</td>{values}</tr>);
    }
    return <table className="table table-bordered" ><tbody>{rows}</tbody></table>;
  }else{
    return <div></div>
  }
}

export default class MonthlyPrecipitation extends React.Component {
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
      url: "monthly_precipitation?year="+year+'&month='+month
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
    return(
      <div>
        <MonthYearForm year={this.state.year} month={this.state.month} onFormSubmit={this.handleDateSubmit} />
        <h4>Количество осадков (мм) за {this.getMonth(this.state.month)} {this.state.year}</h4>
        <MonthlyPrecipitationTable precipitation={this.state.precipitation} maxDay={this.state.daysInMonth}/>
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
      <MonthlyPrecipitation precipitation={precipitation} year={year} month={month} />,
      document.getElementById('root')
    );
  }
});
