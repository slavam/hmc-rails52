import React from 'react';
export default class FoundTelegram extends React.Component{
  constructor(props) {
    super(props);
  }
  render() {
    var desiredLink = "/synoptic_observations/"+this.props.telegram.id;
    return (
      <tr>
        <td>{this.props.telegram.date.substr(0, 19)+' UTC'}</td>
        <td>{this.props.telegram.term < 10 ? '0'+this.props.telegram.term : this.props.telegram.term}</td>
        <td>{this.props.telegram.station_name}</td>
        <td><a href={desiredLink}>{this.props.telegram.telegram}</a></td>
      </tr>
    );
  }
}