import React from 'react';
export default class FoundTelegram extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    const desiredLink = "/"+this.props.tlgType+"_observations/"+this.props.telegram.id;
    const term = this.props.tlgType == 'synoptic' ? <td>{this.props.telegram.term < 10 ? '0'+this.props.telegram.term : this.props.telegram.term}</td> : <td></td>;
    return (
      <tr>
        <td>{this.props.telegram.date.substr(0, 19)+' UTC'}</td>
        {term}
        <td>{this.props.telegram.station_name}</td>
        <td><a href={desiredLink}>{this.props.telegram.telegram}</a></td>
      </tr>
    );
  }
}