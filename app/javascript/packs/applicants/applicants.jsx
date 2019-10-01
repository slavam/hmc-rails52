import React from 'react';
import ReactDOM from 'react-dom';
import Applicant from './applicant';

export default class ApplicantsList extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      applicants: this.props.applicants
    };
    this.updateApplicantsState = this.updateApplicantsState.bind(this);
    this.deleteApplicant = this.deleteApplicant.bind(this);
    this.showWindow = this.showWindow.bind(this);
    // this.snd = new Audio("/assets/ring1.wav");
  }  
  
  deleteApplicant(applicantId){
    $.ajax({
      type: 'DELETE',
      url: "/applicants/delete_applicant/"+applicantId
    }).done(function(data){
      this.setState({applicants: data.applicants});
      alert(data.errors[0]);
    }.bind(this))
    .fail(function(res){ // RecordNotFound
      let id = this.state.applicants.findIndex((element, index, array) => element.id == applicantId);
      if(id > -1){
        let applicants = [...this.state.applicants];
        applicants.splice(id, 1);
        this.setState( {applicants: applicants} );
      }
    }.bind(this));
  }
  
  showWindow(myWindow){
    myWindow.document.write("<p>Поступила штормовая телеграмма</p>");
  }
  
  updateApplicantsState(applicant, action) {
    let applicants = [...this.state.applicants];
    let applicantsCopy = applicants.slice();
    let applicantId = applicantsCopy.findIndex((element, index, array) => element.id == applicant.id);
    if(action == 'insert')
      if (applicantId == -1) {
        // let myWindow = window.open("", "", "width=300,height=100");
        // this.showWindow(myWindow);
        applicantsCopy = [applicant].concat(applicants); // add
      } else {
        applicantsCopy[applicantId] = applicant; // update
      }
    else
      if(applicantId > -1)
        applicantsCopy.splice(applicantId, 1); // delete
    this.setState( {applicants: applicantsCopy} );
  }
  
  render(){
    App.candidate = App.cable.subscriptions.create("CandidateChannel", {
      connected: function() {
        // Called when the subscription is ready for use on the server
      },
      received: data => {
        // console.log("received");
        // if (data.applicant && data.applicant.id){
          this.updateApplicantsState(data.applicant, data.action);
        // }
      }
    });
    let applicants = [];
    this.state.applicants.forEach(a => {
      applicants.push(<Applicant key={a.id} applicant={a} onClickDelete={this.deleteApplicant}/>);
    });
    return(
      <div>
        <h1>Телеграммы в буфере</h1>
        <table className="table table-hover">
          <thead>
            <tr>
              <th width = "200px">Дата загрузки</th>
              <th>Тип</th>
              <th>Телеграмма</th>
              <th>Сообщение</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {applicants}
          </tbody>
        </table>
      </div>
    );
  }
}

// jQuery.fn.ready = (fn) => {
//   $(this).on('turbolinks:load'), fn
// };
// if (!Turbolinks)
//   $(document).on('page:fetch', nil);
//   // this.reload;
// Turbolinks.dispatch("turbolinks:load");
// document.addEventListener('turbolinks:load', () => {
// $(document).on('page:fetch', function() {
// $(document).ready(function () {
$(function () {
    const node = document.getElementById('applicants');
    if (node) {
      const applicants = JSON.parse(node.getAttribute('applicants'));
      
      ReactDOM.render(
        <ApplicantsList applicants={applicants}/>,
        document.getElementById('applicants_list')
      );
    }
  });