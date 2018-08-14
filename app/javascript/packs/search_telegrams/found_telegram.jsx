import React from 'react';
export default class FoundTelegram extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    let td_term = <td></td>;
    let term = '';
    let param_term = '';
    let text = this.props.tlgText.length > 1 ? "&text="+this.props.tlgText : '';
    let stationId = this.props.stationId == '0' ? '' : "&station_id="+this.props.stationId;
    if (this.props.tlgType == 'synoptic'){
      td_term = <td>{('0'+this.props.telegram.term).slice(-2)}</td>;
      term = this.props.tlgTerm;
      if(term != '99')
        param_term = '&term='+term;
    }
    const desiredLink = "/"+this.props.tlgType+"_observations/"+this.props.telegram.id+'?telegram_type='+this.props.tlgType+'&date_from='+this.props.dateFrom+'&date_to='+this.props.dateTo+stationId+param_term+text;
    return (
      <tr>
        <td>{this.props.telegram.date.substr(0, 19)+' UTC'}</td>
        {td_term}
        <td>{this.props.telegram.station_name}</td>
        <td><a href={desiredLink}>{this.props.telegram.telegram}</a></td>
      </tr>
    );
  }
}