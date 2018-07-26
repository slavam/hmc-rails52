import React from 'react';
import ReactDOM from 'react-dom';
import ObservationsForm from './observations_form';

const ObservationsTable = ({observations, materials, posts, cityId}) => {
  var rows = [];
  var header = [<th>Вещества</th>];
  posts.forEach( p => {
    if(p.city_id == cityId)
      header.push(<th>{p.short_name}</th>);
  });
  header.push(<th>Всего</th>);
  materials.forEach( m => {
    let oData = [];
    var s = 0;
    posts.forEach((p) => {
      if(p.city_id == cityId){
        let key = "["+m.id+", "+p.id+"]";      
        s += isNaN(observations[key]) ? 0 : observations[key];
        oData.push(<td>{observations[key]}</td>);
      }
    });
    rows.push(<tr key={m.id}><td>{m.name}</td>{oData}<td>{s}</td></tr>);
  });
  return (
    <table className="table table-hover">
      <thead>
        <tr>
          {header}
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

export default class ObservationsQuantity extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      observations: this.props.observations,
      dateFrom: this.props.dateFrom,
      dateTo: this.props.dateTo,
      cityId: this.props.cityId,
      total: this.props.total
    };
    this.calcObservations = this.calcObservations.bind(this);
  }
  calcObservations(dateFrom, dateTo, cityId){
    this.state.dateFrom = dateFrom;
    this.state.dateTo = dateTo;
    this.state.cityId = cityId;
     $.ajax({
      type: 'GET',
      dataType: 'json',
      data: {date_from: dateFrom, date_to: dateTo, city_id: cityId}, 
      url: 'observations_quantity'
      }).done((data) => {
        this.setState({observations: data.observations, total: data.total});
      }).fail((res) => {
        // that.setState({errors: ["Ошибка записи в базу"]});
      }); 
  }
  render(){
    let desiredLink = "/measurements/observations_quantity.pdf?date_from="+this.state.dateFrom+"&date_to="+this.state.dateTo+"&city_id="+this.state.cityId;
    let city;
    this.props.cities.some((c) => {
      city = c;
      return c.id == +this.state.cityId;
    });
    return(
      <div>
        <h3>Задайте параметры расчета</h3>
        <ObservationsForm dateFrom={this.state.dateFrom} dateTo={this.state.dateTo} cities={this.props.cities} cityId={this.state.cityId} onParamsSubmit={this.calcObservations}/>
        <h3>Отчет о количестве наблюдений, выполненных на постах контроля за загрязнением атмосферного воздуха</h3>
        <p>Период времени с {this.state.dateFrom} по {this.state.dateTo}</p>
        <p>Город: {city.name} ({city.code})</p>
        <ObservationsTable observations={this.state.observations} materials={this.props.materials} posts={this.props.posts} cityId={this.state.cityId} />
        <p>Всего по городу: {this.state.total}</p>
        <a href={desiredLink}>Распечатать</a>
      </div>
    );
  }
}

$(function(){
  const node = document.getElementById('input_params');
  if(node){
    const dateFrom = JSON.parse(node.getAttribute('dateFrom'));
    const dateTo = JSON.parse(node.getAttribute('dateTo'));
    const cityId = JSON.parse(node.getAttribute('cityId'));
    const cities = JSON.parse(node.getAttribute('cities'));
    const materials = JSON.parse(node.getAttribute('materials'));
    const posts = JSON.parse(node.getAttribute('posts'));
    const observations = JSON.parse(node.getAttribute('observations'));
    const total = JSON.parse(node.getAttribute('total'));
  
    ReactDOM.render(
      <ObservationsQuantity dateFrom={dateFrom} dateTo={dateTo} cityId={cityId} cities={cities} materials={materials} posts={posts} observations={observations} total={total} />,
      document.getElementById('form_and_report')
    );
  }
})