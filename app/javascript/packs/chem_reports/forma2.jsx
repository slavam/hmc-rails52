import React from 'react';
import ReactDOM from 'react-dom';
import Forma2Params from './forma2_params';

const Forma2OneRow = ({data, materialId}) => {
    var p = data;
    var k = materialId;
    return (
      <tr key={k}><td>{k}</td><td>{p.material_name}</td><td>{p.size}</td><td>{p.mean}</td>
         <td>{p.max_concentration.value}</td><td>{p.max_concentration.post_id}</td><td>{p.max_concentration.date}</td><td>{p.max_concentration.term}</td>
         <td>{p.standard_deviation}</td><td>{p.variance}</td><td>{p.percent1}</td><td>{p.percent5}</td><td>{p.percent10}</td>
         <td>{p.lt_1pdk}</td><td>{p.lt_5pdk}</td><td>{p.lt_10pdk}</td><td>{p.pollution_index}</td>
         <td>{p.avg_conc}</td><td>{p.max_conc}</td>
      </tr>
    );
};

const Forma2Table = ({pollutions}) => {
    var rows = [];
    Object.keys(pollutions).forEach( k => rows.push(<Forma2OneRow data={pollutions[k]} materialId={k} key={k}/>));
    return (
      <table className="table table-hover">
        <thead>
          <tr>
            <th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th><th></th>
            <th colSpan={3}>Процент повторяемости</th><th colSpan={3}>Количество превышений</th>
          </tr>
          <tr>
            <th>Код</th>
            <th>Название</th>
            <th>Число измер.</th>
            <th>Средняя конц.</th>
            <th>Макс. конц.</th>
            <th>Пост</th>
            <th>Дата</th>
            <th>Срок</th>
            <th>Среднекв. отклонение</th>
            <th>Коэфф. вариации</th>
            <th>1ПДК</th>
            <th>5ПДК</th>
            <th>10ПДК</th>
            <th>1ПДК</th>
            <th>5ПДК</th>
            <th>10ПДК</th>
            <th>ИЗА</th>
            <th>Средняя конц. в ПДКср</th>
            <th>Макс. конц. в ПДКмакс</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
};

export default class Forma2 extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dateFrom: this.props.dateFrom,
      dateTo: this.props.dateTo,
      regionType: this.props.regionType,
      scopeName: this.props.scopeName,
      pollutions: this.props.pollutions
    };
    this.desiredLink = "/measurements/print_forma2.pdf?date_from="+this.props.dateFrom+"&date_to="+this.props.dateTo+"&place_id="+this.props.placeId+"&region_type="+this.props.regionType;
    this.handleParamsSubmit = this.handleParamsSubmit.bind(this);
  }
  
  handleParamsSubmit(params) {
    this.desiredLink = "/measurements/print_forma2.pdf?date_from="+params.dateFrom+"&date_to="+params.dateTo+"&place_id="+params.placeId+"&region_type="+this.props.regionType;
    $.ajax({
      type: 'GET',
      url: "get_chem_forma2_data?date_from="+params.dateFrom+"&date_to="+params.dateTo+"&place_id="+params.placeId+"&region_type="+this.props.regionType
      }).done(function(data) {
        this.setState({
          pollutions: data.pollutions,
          scopeName: data.scopeName,
          dateFrom: data.dateFrom,
          dateTo: data.dateTo
        });
      }.bind(this))
      .fail(function(jqXhr) {
        console.log('failed to register');
      });
  }
  render(){
    return(
      <div>
        <h3>Задайте параметры расчета</h3>
        <Forma2Params onParamsSubmit={this.handleParamsSubmit} dateFrom={this.state.dateFrom} dateTo={this.state.dateTo} posts={this.props.posts} regionType={this.props.regionType} placeId={this.props.placeId}/>
        <h4>Форма 2</h4>
        <h3>Характеристика загрязнения атмосферного воздуха</h3>
        <h4>Период с {this.state.dateFrom} по {this.state.dateTo} {this.state.scopeName}</h4>
        <Forma2Table pollutions={this.state.pollutions} />
        <br />
        <a href={this.desiredLink}>Распечатать</a>
      </div>
    );
  }
}

$(function(){
  const node = document.getElementById('input_params');
  if(node){
    const dateFrom = JSON.parse(node.getAttribute('dateFrom'));
    const dateTo = JSON.parse(node.getAttribute('dateTo'));
    const regionType = JSON.parse(node.getAttribute('regionType'));
    const scopeName = JSON.parse(node.getAttribute('scopeName'));
    const placeId = JSON.parse(node.getAttribute('placeId'));
    const pollutions = JSON.parse(node.getAttribute('pollutions'));
    const posts = JSON.parse(node.getAttribute('posts'));
    
    ReactDOM.render(
      <Forma2 dateFrom={dateFrom} dateTo={dateTo} regionType={regionType} scopeName={scopeName} placeId={placeId} pollutions={pollutions} posts={posts}/>,
      document.getElementById('form_and_report')
      );
  }
});