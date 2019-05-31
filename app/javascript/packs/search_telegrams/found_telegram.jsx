import React from 'react';

// const Popup = ({text, closePopup}) => {
//   return (
//     <td>
//       <div className='popup-bubble'>
//         <div >
//           <p>{text}</p>
//           <button onClick={closePopup} style={{float: "right"}}>Закрыть</button>
//         </div>
//       </div>
//     </td>
//   );
// };
export default class FoundTelegram extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      info: ''
    };
  }
  inControl(event){
    
    let t = this.props.telegram;
    let info = '';
    switch(this.props.tlgType) {
      case 'storm':
        info = t.date.substr(0,16)+'; '+t.station_name+'; '+(t.telegram[3] == 'Я'? 'Начало/усиление; ':'Завершение; ')+this.props.fact[t.telegram.substr(26,2)];
        break;
      case 'synoptic':
        info = t.date.substr(0,10)+'; '+t.term+'; '+t.station_name+'; ';
        break;
      default:
        info = '';
    }
    
    this.setState({info: info});
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
        {/*<td>{this.props.telegram.date.substr(0, 19)+' UTC'}</td> 20190531*/}
        <td>{this.props.telegram.date.substr(0, 19)}</td>
        {add_td}
        <td>{this.props.telegram.station_name}</td>
        {/*<td><a href={desiredLink} style={{color: this.state.color}} onMouseOver={(event) => this.inControl(event)}>{this.props.telegram.telegram}</a></td>*/}
        <td><a href={desiredLink} title={this.state.info} onMouseOver={(event) => this.inControl(event)}>{this.props.telegram.telegram}</a></td>
      </tr>
    );
  }
}