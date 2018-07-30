import React from 'react';
import ReactDOM from 'react-dom';
import NormalVolumeParams from './normal_volume_params';

export default class VolumeNormal extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      dateFrom: this.props.dateFrom,
      dateTo: this.props.dateTo,
      post: this.props.post,
      numberMeasurements: this.props.numberMeasurements,
      volumeTotal: this.props.volumeTotal,
      volumeSampleDust: this.props.volumeSampleDust
    };
    this.volumeParamsSubmit = this.volumeParamsSubmit.bind(this);
  }
  
  volumeParamsSubmit(params) {
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: "calc_normal_volume?date_from="+params.dateFrom+"&date_to="+params.dateTo+"&post_id="+params.postId
      }).done(function(data) {
        this.setState({
          post: data.post,
          volumeTotal: data.volumeTotal,
          volumeSampleDust: data.volumeSampleDust,
          numberMeasurements: data.numberMeasurements,
          dateFrom: data.dateFrom,
          dateTo: data.dateTo
        });
      }.bind(this))
      .fail(function(jqXhr) {
        console.log('failed to register');
      });
  }
  render(){
    return(
      <div>
        <h3>Задайте параметры расчета</h3>
        <NormalVolumeParams onParamsSubmit={this.volumeParamsSubmit} dateFrom={this.state.dateFrom} dateTo={this.state.dateTo} postId={this.state.post.id} posts={this.props.posts}/>
        <br />
        <h4>{this.state.post.name}</h4>
        <h4>Период с {this.state.dateFrom} по {this.state.dateTo}</h4>
        <h4>Объем отобраной пробы пыли {this.state.volumeSampleDust} дм.<sup>3</sup> </h4>
        <h4>Количество измерений {this.state.numberMeasurements}</h4>
        <h4>Объем пробы, приведенный к нормальным условиям за период {this.state.volumeTotal} дм.<sup>3</sup></h4>
      </div>
    );
  }
}

$(function(){
  const node = document.getElementById('input_params');
  if(node){
    const dateFrom = JSON.parse(node.getAttribute('dateFrom'));
    const dateTo = JSON.parse(node.getAttribute('dateTo'));
    const post = JSON.parse(node.getAttribute('post'));
    const posts = JSON.parse(node.getAttribute('posts'));
    const volumeTotal = JSON.parse(node.getAttribute('volumeTotal'));
    const volumeSampleDust = JSON.parse(node.getAttribute('volumeSampleDust'));
    const numberMeasurements = JSON.parse(node.getAttribute('numberMeasurements'));
    
    ReactDOM.render(
      <VolumeNormal dateFrom={dateFrom} dateTo={dateTo} post={post} posts={posts} volumeTotal={volumeTotal} volumeSampleDust={volumeSampleDust} numberMeasurements={numberMeasurements} />,
      document.getElementById('form_and_report')
    );
  }
})