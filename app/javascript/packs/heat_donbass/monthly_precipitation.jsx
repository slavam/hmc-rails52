import React from 'react';
import ReactDOM from 'react-dom';
import MonthYearForm from './month_year_form';

const MonthlyPrecipitationTable = ({precipitation, maxDay}) => {
  let rows = [<tr key="0"><td align="center"><b>Число</b></td><td align="center"><b>Авдотьино</b></td><td align="center"><b>Кировский</b></td><td align="center"><b>Макеевка</b></td><td align="center"><b>Старобешево</b></td><td align="center"><b>Тельманово</b></td></tr>];
  if (precipitation){
    for(var i=1; i<=maxDay; ++i){
      let values = [];
      let tr0;
      for(var j=0; j<5; ++j){
        let val = ((precipitation[i] == null) || (precipitation[i][j] == null)) ? '':
          ((precipitation[i][j][0] && precipitation[i][j][1])? precipitation[i][j][0]+'/'+precipitation[i][j][1] :
          (precipitation[i][j][0]? 'Ночь: '+precipitation[i][j][0] : 'День: '+precipitation[i][j][1]));
        values.push(<td key={j} align="center" style={{backgroundColor: (j % 2 == 0)? '#ccc':'#fff'}}>{val}</td>);
      };
      rows.push(<tr key={i}><td key={i}>{i}</td>{values}</tr>);
    }
    return <table className="table table-hover"><tbody>{rows}</tbody></table>;
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
    var locale = "ru",
        month = objDate.toLocaleString(locale, { month: "long" });
    return month;
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
