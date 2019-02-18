import React from 'react';
export default class DNRMap extends React.Component{
  constructor(props){
    super(props);
    this.state={
      info: {},
      markers: []
    };
    this.stationInfo = this.stationInfo.bind(this);
  }
  stationInfo(date, telegram){
    // let codeStation = telegram.substr(12,5);
    let codeWAREP = telegram.substr(26,2);
    let phase = telegram[3] == 'Я'? 'Старт/Рост' : 'Конец';
    return date.substr(0,16)+' '+codeWAREP+' '+phase;
  }
  render(){
    let firstCoords = new google.maps.LatLng(48.0161457, 37.8057165); // Donetsk
    let mapOptions = {center: firstCoords, zoom: 14};
    let map = null; //new google.maps.Map(document.getElementById('map'), mapOptions);
    
    // let info = {};
    this.props.telegrams.map((t) => {
      let codeStation = t.telegram.substr(12,5);
      if(!this.state.info[codeStation]){
        this.state.info[codeStation] = [];
        let location = this.props.markerCoords[codeStation];
        let marker = new google.maps.Marker({position: location, map: map, label: codeStation});
        // let markerClickStream = Rx.Observable.fromEvent(marker, 'click')
          // .subscribe(() => {alert(marker.label)}) ;
        this.state.markers.push(marker);
      }
      this.state.info[codeStation].push(this.stationInfo(t.date, t.telegram));
    });
      // let location = new google.maps.LatLng(this.props.markerCoords[codeStation][0], this.props.markerCoords[codeStation][1]);
      // let location = this.props.markerCoords[codeStation];
      // let label = t.telegram.substr(26,2); // WAREP code
      // let marker = new google.maps.Marker({position: location, label: label, map: map});
      // let imageMap = document.getElementById('form_and_result');
      // let markerClickStream = Rx.Observable.fromEvent(imageMap, 'click')
        // .subscribe(() => { window.open('qqqqqqqqqqqqq','popUpWindow','height=700,width=700,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
		// 	}) ;
        // .subscribe(() => {alert(marker.label)}) ;
      // this.state.markers.push(marker);
    
    return(
      <div> 
        <h1>Map</h1>
        {/*<iframe width="100%" height="300" frameBorder="0" style={{border:0}} src="https://www.google.com/maps/embed/v1/place?key=&q=Любавина+2,Донецк,Донецкая+область" allowFullScreen></iframe>*/}
      </div>
    );
  }
}