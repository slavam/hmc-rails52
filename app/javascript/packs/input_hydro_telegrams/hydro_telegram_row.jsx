import React from 'react';
import { checkHydroTelegram } from './check_hydro_telegram';
import TextHydroTelegramEdit from './text_hydro_telegram_edit';

export default class HydroTelegramRow extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      tlgText: this.props.telegram.telegram,
      errors: [],
      source: 'outside',
      mode: 'Изменить'
    };
    this.handleEditTelegramSubmit = this.handleEditTelegramSubmit.bind(this);
  }
  handleEditClick(e){
    if (this.state.mode == 'Изменить') 
      this.setState({mode:'Отменить', errors: []});
    else
      this.setState({mode:'Изменить'});
  }
  handleEditTelegramSubmit(tlgText){
    tlgText = tlgText.replace(/\s+/g, ' ');
    var errors = [];
    var tlgData = {};
    var observation = this.props.telegram;
    var desiredLink = '';
    switch(this.props.tlgType) {
      case 'hydro':
        if(!checkHydroTelegram(tlgText, this.props.hydroPosts, errors, observation, this.props.telegram.date)){
          this.setState({errors: errors});
          return;
        }
        observation.telegram = tlgText;
        tlgData = {hydro_observation: observation};
        desiredLink = "/hydro_observations/update_hydro_telegram?id="+this.props.telegram.id;
        break;
    }
    observation.telegram = tlgText;
    this.setState({mode: "Изменить", tlgText: tlgText, source: 'inside'});
    $.ajax({
      type: 'PUT',
      dataType: 'json',
      data: tlgData,
      url: desiredLink
      }).done((data) => {})
      .fail((jqXhr) => {
        console.log('failed to register');
      });
  }
  render() {
    if(this.state.source == 'outside')
      this.state.tlgText = this.props.telegram.telegram;
    var desiredLink = "/"+this.props.tlgType+"_observations/"+this.props.telegram.id;
    
    return (
      <tr key = {this.props.telegram.id}>
        <td>{this.props.telegram.date}</td>
        <td>{this.props.telegram.station_name}</td>
        {this.state.mode == 'Изменить' ? <td><a href={desiredLink}>{this.state.tlgText}</a></td> : <td><TextHydroTelegramEdit tlgText={this.state.tlgText} onTelegramEditSubmit={this.handleEditTelegramSubmit} errors = {this.state.errors}/></td> }
        <td><input id={this.props.telegram.id} type="submit" value={this.state.mode} onClick={(event) => this.handleEditClick(event)}/></td> 
      </tr>
    );
  }
}