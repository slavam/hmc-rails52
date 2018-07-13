import React from 'react';
import { checkSynopticTelegram } from './check_synoptic_telegram';
import { checkStormTelegram } from './check_storm_telegram';
import { checkAgroTelegram } from './check_agro_telegram';
import TextTelegramEditForm from './text_telegram_edit_form';


export default class TelegramRow extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      tlgText: this.props.telegram.telegram,
      errors: [],
      source: 'outside',
      mode: 'Изменить'
    };
    this.handleEditClick = this.handleEditClick.bind(this);
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
    var observation = {};
    var desiredLink = '';
    switch(this.props.tlgType) {
      case 'synoptic':
        if (!checkSynopticTelegram(this.props.telegram.term, tlgText, errors, this.props.stations, observation)){
          this.setState({errors: errors});
          return;
        }
        desiredLink = "/synoptic_observations/update_synoptic_telegram?id="+this.props.telegram.id; //+"&telegram="+tlgText;
        tlgData = {observation: observation};
        break;
      case 'agro':
        if (!checkAgroTelegram(tlgText, this.props.stations, errors, observation)) {
          this.setState({errors: errors});
          return;
        }
        let c_d = observation.damage_crops;
        let c_c = observation.state_crops;
        tlgData = {agro_observation: observation, crop_conditions: c_c, crop_damages: c_d};
        if (observation.state_crops)
          delete observation.state_crops;
        if (observation.damage_crops)
          delete observation.damage_crops;

        desiredLink = "/agro_observations/update_agro_telegram?id="+this.props.telegram.id; //+"&telegram="+tlgText;
        break;
      case 'agro_dec':
        if (!checkAgroTelegram(tlgText, this.props.stations, errors, observation)) {
          this.setState({errors: errors});
          return;
        }
        c_c = observation.state_crops;
        tlgData = {agro_dec_observation: observation, crop_conditions: c_c};
        if (observation.state_crops)
          delete observation.state_crops;

        desiredLink = "/agro_dec_observations/update_agro_dec_telegram?id="+this.props.telegram.id;
        break;
      case 'storm':
        if (!checkStormTelegram(tlgText, this.props.stations, errors, observation)){
          this.setState({errors: errors});
          return;
        }
        tlgData = {storm_observation: observation};
        desiredLink = "/storm_observations/update_storm_telegram?id="+this.props.telegram.id+"&telegram="+tlgText;
        break;
      case 'sea':
        observation.day_obs = tlgText.substr(5,2);
        observation.term = tlgText.substr(7,2);
        tlgData = {sea_observation: observation};
        desiredLink = "/sea_observations/update_sea_telegram?id="+this.props.telegram.id+"&telegram="+tlgText;
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
    var term = this.props.tlgType == 'synoptic' ? <td>{this.props.telegram.term < 10 ? '0'+this.props.telegram.term : this.props.telegram.term}</td> : '';
    
    return (
      <tr key = {this.props.telegram.id}>
        <td>{this.props.telegram.date.substr(0, 19)+' UTC'}</td>
        {term}
        <td>{this.props.telegram.station_name}</td>
        {this.state.mode == 'Изменить' ? <td><a href={desiredLink}>{this.state.tlgText}</a></td> : <td><TextTelegramEditForm tlgText={this.state.tlgText} onTelegramEditSubmit={this.handleEditTelegramSubmit} errors = {this.state.errors}/></td> }
        <td><input id={this.props.telegram.id} type="submit" value={this.state.mode} onClick={(event) => this.handleEditClick(event)}/></td> 
      </tr>
    );
  }
}