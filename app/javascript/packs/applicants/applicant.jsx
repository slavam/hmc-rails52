import React from 'react';

export default class Applicant extends React.Component{
  constructor(props){
    super(props);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
  }

  handleDeleteClick(e){
    this.props.onClickDelete(this.props.applicant.id);
  }
  
  render(){
    let date = this.props.applicant.created_at.replace(/T/,' ').substr(0, 19)+' UTC';
    return(
      <tr key={this.props.applicant.id}><td>{date}</td><td>{this.props.applicant.telegram_type}</td><td>{this.props.applicant.telegram}</td><td>{this.props.applicant.message}</td><td><input id={this.props.applicant.id} type="submit" value="Удалить" onClick={(event) => this.handleDeleteClick(event)}/></td></tr> //onClick={this.handleDeleteClick}/></td></tr>
    );
  }
}