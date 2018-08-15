import React from 'react';
export default class FoundTelegram extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    let add_td = <td></td>;
    let add_param = '';
    let text = this.props.tlgText.length > 1 ? "&text="+this.props.tlgText : '';
    let stationId = this.props.stationId == '0' ? '' : "&station_id="+this.props.stationId;
    if (this.props.telegram && (this.props.tlgType == 'synoptic' || this.props.tlgType == 'storm')){
      add_td = this.props.tlgType == 'synoptic' ? <td>{('0'+this.props.telegram.term).slice(-2)}</td> : <td>{this.props.telegram.telegram.substr(0,5)}</td>;
      if (this.props.tlgType == 'synoptic' && this.props.tlgTerm != '99')
        add_param =  '&term='+this.props.tlgTerm;
      else if (this.props.tlgType == 'storm' && this.props.stormType != '99') 
        add_param = '&storm_type='+this.props.stormType;
    }
    const desiredLink = "/"+this.props.tlgType+"_observations/"+this.props.telegram.id+'?telegram_type='+this.props.tlgType+'&date_from='+this.props.dateFrom+'&date_to='+this.props.dateTo+stationId+add_param+text;
    return (
      <tr>
        <td>{this.props.telegram.date.substr(0, 19)+' UTC'}</td>
        {add_td}
        <td>{this.props.telegram.station_name}</td>
        <td><a href={desiredLink}>{this.props.telegram.telegram}</a></td>
      </tr>
    );
  }
}