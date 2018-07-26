import React from 'react';
import ReactDOM from 'react-dom';
import Forma1Params from './forma1_params';

const OneMeasurement = ({pollution, date}) => {
  let nDigits = [];
  nDigits[1] = 2;
  nDigits[2] = 3;
  nDigits[4] = 0;
  nDigits[5] = 2;
  nDigits[6] = 2;
  nDigits[8] = 3;
  nDigits[10] = 3;
  nDigits[19] = 2;
  nDigits[22] = 3;
  var row = [];
  var td1 =  date.substr(8,2);
  var td2 = date.substr(11,2);
  pollution.forEach( p => {
    row.push(<td key={p[0]}>{p[1] > '' ? Number(p[1]).toFixed(nDigits[p[0]] !== 'undefined'? nDigits[p[0]] : 2) : p[1]}</td>);
  });
  return (
    <tr>
      <td key={998}>{td1}</td>
      <td key={999}>{td2}</td>
      {row}
    </tr>
  );
};

const Forma1Table = ({titles, pollutions, measureNum, maxValues, avgValues}) => {
    var rows = [];
    var ths = [];
    var measure = [];
    var max_values = [];
    var avg_values = [];
    Object.keys(pollutions).forEach( p => rows.push(<OneMeasurement key={p} pollution={pollutions[p]} date={p} />));
    Object.keys(titles).forEach( k => {ths.push(<th key={k}>{titles[k]}</th>);
      if(k < 100){
        measure.push(<td key={k}>{measureNum[k]}</td>);
        max_values.push(<td key={k}>{maxValues[k]}</td>);
        avg_values.push(<td key={k}>{avgValues[k]}</td>);
      }
    });
    return (
      <table className="table table-hover" width="100%">
        <thead>
          <tr>
            <th>Число</th>
            <th>Срок</th>
            {ths}
          </tr>
        </thead>
        <tbody>
          {rows}
          <tr>
            <td>Число измерений</td>
            <td></td>
            {measure}
          </tr>
          <tr>
            <td>Среднее</td>
            <td></td>
            {avg_values}
          </tr>
          <tr>
            <td>Максимум</td>
            <td></td>
            {max_values}
          </tr>
        </tbody>
      </table>
    );
};

export default class Forma1Tza extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      year: this.props.year,
      month: this.props.month,
      siteDescription: this.props.siteDescription,
      substanceNum: this.props.substanceNum,
      pollutions: this.props.pollutions,
      titles: this.props.titles,
      measureNum: this.props.measureNum,
      maxValues: this.props.maxValues,
      avgValues: this.props.avgValues
    };
    this.desiredLink = "/measurements/print_forma1_tza.pdf?year="+this.props.year+"&month="+this.props.month+"&post_id="+this.props.postId;
    this.desiredLink2 = "/measurements/chem_forma1_as_protocol.pdf?year="+this.props.year+"&month="+this.props.month+"&post_id="+this.props.postId;
    this.handleParamsSubmit = this.handleParamsSubmit.bind(this);
  }
  
  handleParamsSubmit(params) {
    this.desiredLink = "/measurements/print_forma1_tza.pdf?year="+params.year+"&month="+params.month+"&post_id="+params.site;
    this.desiredLink2 = "/measurements/chem_forma1_as_protocol.pdf?year="+params.year+"&month="+params.month+"&post_id="+params.site;
    $.ajax({
      type: 'GET',
      url: "get_chem_forma1_tza_data?month="+params.month+"&year="+params.year+"&post_id="+params.site
      }).done(function(data) {
        this.setState({
          pollutions: data.matrix.pollutions,
          postId: data.postId,
          month: data.month,
          year: data.year,
          titles: data.matrix.substance_names,
          measureNum: data.matrix.measure_num,
          maxValues: data.matrix.max_values,
          avgValues: data.matrix.avg_values,
          siteDescription: data.matrix.site_description,
          substanceNum: data.matrix.substance_num
        });
      }.bind(this))
      .fail(function(jqXhr) {
        console.log('failed to register');
      });
  }
  
  render(){
    return(
      <div>
        <h3>Форма 1</h3>
        <h1>Таблица наблюдений за загрязнением атмосферы</h1>
        <h4>Год {this.state.year} Месяц {this.state.month} Количество примесей {this.state.substanceNum} {this.state.siteDescription} </h4>
        <h3>Задайте параметры расчета</h3>
        <Forma1Params posts={this.props.posts} onParamsSubmit={this.handleParamsSubmit} year={this.state.year} month={this.state.month} postId={this.props.postId}/>
        <Forma1Table pollutions={this.state.pollutions} titles={this.state.titles} measureNum={this.state.measureNum} maxValues={this.state.maxValues} avgValues={this.state.avgValues}/>
        <br />
        <a href={this.desiredLink}>Распечатать Форму 1 ТЗА</a>
        <br />
        <a href={this.desiredLink2}>Распечатать Протокол измерений</a>
      </div>
    );
  }
}

$(function () {
  const node = document.getElementById('input_params');
  if(node){
    const year = JSON.parse(node.getAttribute('year'));
    const month = JSON.parse(node.getAttribute('month'));
    const posts = JSON.parse(node.getAttribute('posts')); 
    const substanceNum = JSON.parse(node.getAttribute('substanceNum')); 
    const siteDescription = JSON.parse(node.getAttribute('siteDescription'));
    const pollutions = JSON.parse(node.getAttribute('pollutions'));
    const titles = JSON.parse(node.getAttribute('titles'));
    const measureNum = JSON.parse(node.getAttribute('measureNum'));
    const maxValues = JSON.parse(node.getAttribute('maxValues'));
    const avgValues = JSON.parse(node.getAttribute('avgValues'));
    const postId = JSON.parse(node.getAttribute('postId'));
    ReactDOM.render(
      <Forma1Tza year={year} month={month} posts={posts} substanceNum={substanceNum} siteDescription={siteDescription} pollutions={pollutions} titles={titles} measureNum={measureNum} maxValues={maxValues} avgValues={avgValues} postId={postId}/>,
      document.getElementById('form_and_report')
    );
  }
});