/*jshint esversion: 6 */
import React from 'react';
import ReactDOM from 'react-dom';
import SearchParams from './search_params';
import FoundMeasurements from './found_measurements';
export default class SearchMeasurements extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      measurements: this.props.measurements,
      dateFrom: this.props.dateFrom,
      dateTo: this.props.dateTo,
      // term: this.props.term,
      // postId: this.props.postId,
      errors: {}
    };
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.deleteMeasurement = this.deleteMeasurement.bind(this);
  }
  handleFormSubmit(params) {
    this.state.dateFrom = params.dateFrom;
    this.state.dateTo = params.dateTo;
    let term = params.term == '99' ? '' : "&term="+params.term;
    let postId = params.postId == '0' ? '' : "&post_id="+params.postId;
    let url = "search_measurements?date_from="+params.dateFrom+"&date_to="+params.dateTo+term+postId;
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: url
      }).done(function(data) {
        this.setState({measurements: data.measurements, errors: {}});
      }.bind(this))
      .fail(function(res) {
        this.setState({errors: ["Ошибка записи в базу"]});
      }.bind(this));
  }
  deleteMeasurement(measurementId){
    let measurements = [];
    $.ajax({
      type: 'DELETE',
      dataType: 'json',
      url: "/measurements/"+measurementId //+'.json'
    }).done(data => {
      measurements = [...this.state.measurements];
      let id = this.state.measurements.findIndex((element, index, array) => element.measurement.id == +measurementId);
      if(id > -1){
        measurements.splice(id, 1);
      }
      this.setState({measurements: measurements});
    }).fail(res => { // RecordNotFound
      alert('Проблема с удалением измерения');
    });
  }
  render(){
    return (
      <div>
        {/*}<SearchParams onParamsSubmit={this.handleFormSubmit} dateFrom={this.props.dateFrom} dateTo={this.props.dateTo} errors={this.state.errors} posts={this.props.posts} term={this.state.term}  postId={this.state.postId} />*/}
        <SearchParams onParamsSubmit={this.handleFormSubmit} dateFrom={this.props.dateFrom} dateTo={this.props.dateTo} posts={this.props.posts} />
        <FoundMeasurements onDeleteMeasurement={this.deleteMeasurement} measurements={this.state.measurements} dateFrom={this.state.dateFrom} dateTo={this.state.dateTo} materials={this.props.materials} posts={this.props.posts}/>
      </div>
    );
  }
}
$(function () {
  const node = document.getElementById('search-params');
  if(node){
    const measurements = JSON.parse(node.getAttribute('measurements'));
    const posts = JSON.parse(node.getAttribute('posts'));
    const dateFrom = JSON.parse(node.getAttribute('dateFrom'));
    const dateTo = JSON.parse(node.getAttribute('dateTo'));
    const materials = JSON.parse(node.getAttribute('materials'));
    // const postId = JSON.parse(node.getAttribute('postId'));

    ReactDOM.render(
      <SearchMeasurements measurements={measurements} materials={materials} posts={posts} dateFrom={dateFrom} dateTo={dateTo} />,
      document.getElementById('root')
    );
  }
});
