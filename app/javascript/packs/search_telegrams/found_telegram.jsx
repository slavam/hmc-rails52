import React from 'react';
export default class FoundTelegram extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      color: 'red'
    };
  }
  inControl(event){
    this.setState({color: 'blue'});
  }
  outControl(event){
    this.setState({color: 'red'});
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
    // let rightButton = document.querySelector('.button-right');
    // let leftClickStream = Rx.Observable.fromEvent(leftButton, 'click')
    // 	.subscribe(() => {page = page > 0 ? (--page) : (page); renderPhotos()}) ;

    const desiredLink = "/"+this.props.tlgType+"_observations/"+this.props.telegram.id+'?telegram_type='+this.props.tlgType+'&date_from='+this.props.dateFrom+'&date_to='+this.props.dateTo+stationId+add_param+text;
    return (
      <tr>
        <td>{this.props.telegram.date.substr(0, 19)+' UTC'}</td>
        {add_td}
        <td>{this.props.telegram.station_name}</td>
        {/*<td><a href={desiredLink} style={{color: this.state.color}} onMouseOut={event => this.inControl(event)} onMouseOver={(event) => this.outControl(event)}>{this.props.telegram.telegram}</a></td>*/}
        <td><a href={desiredLink} onMouseOut={event => this.inControl(event)} onMouseOver={(event) => this.outControl(event)}>{this.props.telegram.telegram}</a></td>
      </tr>
    );
  }
}