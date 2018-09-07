import React from 'react';
import ReactDOM from 'react-dom';
import BackgroundConcentrationsForm from './background_concentrations_form';
import BackgroundConcentrationsResult from './background_concentrations_result';

export default class ChemBackgroundConcentrations extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      startDate: this.props.startDate,
      endDate: this.props.endDate,
      siteDescription: this.props.siteDescription,
      substance: this.props.substance,
      concentrations: this.props.concentrations,
      postId: 5,
      materialId: 1,
    };
    this.handleParamsSubmit = this.handleParamsSubmit.bind(this);
  }
  
  handleParamsSubmit(params) {
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "background_concentrations?start_date="+params.startDate+"&end_date="+params.endDate+"&post_id="+params.postId+"&material_id="+params.materialId
      }).done(function(data) {
        this.setState({
          concentrations: data.concentrations,
          startDate: params.startDate,
          endDate: params.endDate,
          substance: data.substance,
          siteDescription: data.siteDescription,
          postId: params.postId,
          materialId: params.materialId
        });
      }.bind(this))
      .fail(function(jqXhr) {
        console.log('failed to register');
      });
  }
  
  render(){
    let desiredLink = "background_concentrations.pdf?start_date="+this.state.startDate+"&end_date="+this.state.endDate+"&post_id="+this.state.postId+"&material_id="+this.state.materialId;
    return(
      <div>
        <BackgroundConcentrationsForm posts={this.props.posts} substances={this.props.substances} onParamsSubmit={this.handleParamsSubmit} startDate={this.state.startDate} endDate={this.state.endDate} />
        За период с {this.state.startDate} по {this.state.endDate}
        <br/>
        {this.state.siteDescription}
        <br/>
        Вещество {this.state.substance}
        <BackgroundConcentrationsResult concentrations={this.state.concentrations} />
        <a href={desiredLink}>Распечатать</a>
      </div>
    );
  }
}

$(function(){
  const node = document.getElementById('input_params');
  if(node){
    const startDate = JSON.parse(node.getAttribute('startDate'));
    const endDate = JSON.parse(node.getAttribute('endDate'));
    const posts = JSON.parse(node.getAttribute('posts'));
    const siteDescription = JSON.parse(node.getAttribute('siteDescription'));
    const substances = JSON.parse(node.getAttribute('substances'));
    const substance = JSON.parse(node.getAttribute('substance'));
    const concentrations = JSON.parse(node.getAttribute('concentrations'));
    
    ReactDOM.render(
      <ChemBackgroundConcentrations startDate={startDate} endDate={endDate} posts={posts} siteDescription={siteDescription} substances={substances} substance={substance} concentrations={concentrations} />,
      document.getElementById('form_and_report')
    );
  }
})