import React from 'react';

export default class Applicant extends React.Component{
  constructor(props){
    super(props);
    this.handleDeleteClick = this.handleDeleteClick.bind(this);
    this.toClipboard = this.toClipboard.bind(this);
  }
  toClipboard(e){
    let copyText = document.getElementById("tlgText"+this.props.applicant.id);
    copyText.focus();
    copyText.select();
    document.execCommand("copy");
    alert("Скопировано");
  }
  handleDeleteClick(e){
    this.props.onClickDelete(this.props.applicant.id);
  }
  
  render(){
    let date = this.props.applicant.created_at.replace(/T/,' ').substr(0, 19)+' UTC';
    return(
      <tr key={this.props.applicant.id}>
        <td width="110px">{date}</td>
        <td>{this.props.applicant.telegram_type}</td>
        <td width="400px"><textarea id={'tlgText'+this.props.applicant.id} defaultValue={this.props.applicant.telegram}/></td>
        <td>{this.props.applicant.message}</td>
        <td><button onClick={event => this.toClipboard(event)}>Скопировать</button></td>
        <td><input id={this.props.applicant.id} type="submit" value="Удалить" onClick={(event) => this.handleDeleteClick(event)}/></td>
      </tr> //onClick={this.handleDeleteClick}/></td></tr>
    );
  }
}