import React from 'react';

export default class OnePollution extends React.Component {
  constructor(props) {
    super(props);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }
  handleDeleteClick(e){
    this.props.onClickDeletePollution(this.props.pollution.id);
  }
  render() {
    return (
      <tr key={this.props.material_id}><td>{this.props.pollution.material_name}</td><td>{this.props.pollution.value}</td><td>{this.props.pollution.concentration}</td><td>{this.props.size > 1 ? <input id={this.props.material_id} type="submit" value="Удалить" onClick={this.handleDeleteClick}/> : ''}</td></tr>
    );
  }
}