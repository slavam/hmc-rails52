import React from 'react';

export default class TextHydroTelegramEdit extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      tlgText: this.props.tlgText,
    };
  }
  handleTextChange(e) {
    this.setState({tlgText: e.target.value});
  }
  handleEditSubmit(e){
    e.preventDefault();
    this.props.onTelegramEditSubmit(this.state.tlgText);
  }
  render() {
    return (
      <form className="telegramEditForm" onSubmit={(event) => this.handleEditSubmit(event)}>
        <input type="text" value={this.state.tlgText} onChange={(event) => this.handleTextChange(event)}/>
        <span style={{color: 'red'}}>{this.props.errors[0]}</span>
        <input type="submit" value="Сохранить" />
      </form>
    );
  }
}