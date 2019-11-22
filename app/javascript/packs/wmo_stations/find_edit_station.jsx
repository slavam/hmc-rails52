import React from 'react';
import ReactDOM from 'react-dom';
import FindStation from './find_station';

export default class FindEditStation extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      name: '',
      country: '',
      latitude: null,
      longitude: null,
      altitude: null,
      isActive: null,
      station: null,
      message: ''
    };
    this.handleCodeSubmit = this.handleCodeSubmit.bind(this);
    this.handleStationSubmit = this.handleStationSubmit.bind(this);
  }
  isActiveChange(e){
    this.setState({isActive: e.target.checked});
  }
  altitudeChange(e){
    this.setState({altitude: e.target.value});
  }
  latitudeChange(e){
    this.setState({latitude: e.target.value});
  }
  longitudeChange(e){
    this.setState({longitude: e.target.value});
  }
  nameChange(e){
    this.setState({name: e.target.value}); 
  }
  countryChange(e){
    this.setState({country: e.target.value}); 
  }
  handleStationSubmit(e){
    e.preventDefault();
    let id = this.state.station.id;
    this.state.station.name = this.state.name;
    this.state.station.country = this.state.country;
    this.state.station.latitude = this.state.latitude;
    this.state.station.longitude = this.state.longitude;
    this.state.station.altitude = this.state.altitude;
    this.state.station.is_active = this.state.isActive;
    delete this.state.station.id;
    $.ajax({
      type: 'PUT',
      dataType: 'json',
      data: {wmo_station: this.state.station},
      url: "/wmo_stations/edit_station?id="+id
    }).done((data) => {
      this.setState({station: null, message: "Изменения внесены в справочник"});
    }).fail((res) => {
      this.setState({message: "Проблемы с чтением данных из БД"});
    }); 
  }
  handleCodeSubmit(code){
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "/wmo_stations/find_by_code?code="+code
    }).done((data) => {
      if(data.station == null)
        this.setState({station: null, message: "В справочнике нет станции с кодом "+code});
      else
        this.setState({
          station: data.station, 
          name: data.station.name, 
          country: data.station.country,
          latitude: data.station.latitude,
          longitude: data.station.longitude,
          altitude: data.station.altitude,
          isActive: data.station.is_active,
          message: 'Параметры станции с кодом '+code
        });
    }).fail((res) => {
      this.setState({errors: ["Проблемы с чтением данных из БД"]});
    }); 
  }
  render(){
    let editForm = this.state.station ? <form className="stationForm" onSubmit={(event) => this.handleStationSubmit(event)}>
          <table className= "table table-hover">
            <thead>
              <tr>
                <th>Название</th><th>Страна</th><th>Широта</th><th>Долгота</th><th>Высота</th><th>Активна?</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input type="text" value={this.state.name} onChange={(event) => this.nameChange(event)}/>
                </td>
                <td>
                  <input type="text" value={this.state.country} onChange={(event) => this.countryChange(event)}/>
                </td>
                <td>
                  <input type="number" min="-90" max="90" step="0.0001" value={this.state.latitude} onChange={(event) => this.latitudeChange(event)}/>
                </td>
                <td>
                  <input type="number" min="-180" max="180" step="0.0001" value={this.state.longitude} onChange={(event) => this.longitudeChange(event)}/>
                </td>
                <td>
                  <input type="number" min="0" max="5000" step="1" value={this.state.altitude} onChange={(event) => this.altitudeChange(event)}/>
                </td>
                <td>
                  <input type="checkbox" checked={this.state.isActive} onChange={(event) => this.isActiveChange(event)}/>
                </td>
              </tr>
            </tbody>
          </table>
          <input type="submit" value="Изменить" />
        </form> : null;
    
    return(
      <div>
        <FindStation onCodeSubmit={this.handleCodeSubmit}/>
        <h3>{this.state.message}</h3>
        {editForm}
      </div>
    );
  }
}

$(() => {
  ReactDOM.render(
    <FindEditStation station={null} />,
    document.getElementById('find_and_edit')
  );
});