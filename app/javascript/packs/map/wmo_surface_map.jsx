import React from 'react';
import { MarkerClusterer } from "@googlemaps/markerclusterer";

export default class WmoSurfaceMap extends React.Component{
  constructor(props){
    super(props);
    this.stationInfo = this.stationInfo.bind(this);
  }
  arrowNumber(val){
    if(val<2) return val;
    let ret = 0;
    switch(val % 5){
      case 0:
        ret = (val / 5)*2;
        break;
      case 1:
        ret = ((val-1) / 5)*2;
        break;
      case 2:
        ret = ((val-2) / 5)*2+1;
        break;
      case 3:
        ret = ((val-3) / 5)*2+1;
        break;
      case 4:
        ret = ((val+1) / 5)*2;
    }
    return ret+1;
  }
  stationInfo(t){
    // 33088 32997 80000 11014 21017 30085 40284 52001 8805/ 555 1/001=
    const sign = ['','-'];
    let airTemperature =+(sign[+t[19]]+t.substr(20,3));
    let airPressure = '';
    let meteoRange = t.substr(9,2) == '//' ? '___': (t.substr(9,2));
    let presentWeather = '';
    
    let hightCloud = t[8] == '/' ? '':t[8];
    let cloudHigh = '';
    let cloudMedium = '';
    let cloudLow = '';
    let cloudsNumber = '';
    let other = t.substr(24);
    if(/8[0-9/]{4}/.test(other)){
      let index = other.match(/8[0-9/]{4}/).index;
      cloudsNumber = other[index+1];
      let val = other[index+4];
      if(val == '0' || val == '/')
        cloudHigh = '';
      else
        cloudHigh = '<img height="15px" src="/assets/weather/cloud_high/CH '+val+'.svg">';
      val = other[index+3];
      if(val == '0' || val == '/')
        cloudMedium = '';
      else
        cloudMedium = '<img height="15px" src="/assets/weather/cloud_medium/CM '+val+'.svg">';
      val = other[index+2];
      if(val == '0' || val == '/')
        cloudLow = '';
      else
        cloudLow = '<img height="15px" src="/assets/weather/cloud_low/CL '+val+'.svg">';
    }
    if(/4[0-9/]{4}/.test(other)){
      let index = other.match(/4[0-9/]{4}/).index;
      airPressure = +other.substr(index+1,4);
    }
    let pastWeather1 = '';
    let pastWeather2 = '';
    if(/7\d{4}/.test(other)){
      let index = other.match(/7\d{4}/).index;
      let val = other.substr(index+1,2);
      presentWeather = '<img height="15px" src="/assets/weather/present_weather/ww '+val+'.svg">';
      val = other[index+3];
      if(+val < 3 || val == '/')
        pastWeather1 = '';
      else
        pastWeather1 = '<img height="15px" src="/assets/weather/past_weather/w1w2 '+val+'.svg">';
      val = other[index+4];
      if(+val < 3 || val == '/')
        pastWeather2 = '';
      else
        pastWeather2 = '<img height="15px" src="/assets/weather/past_weather/w1w2 '+val+'.svg">';
    }
    let totalCloudCover = t[12] == '/'? '___':'<img height="15px" src="/assets/weather/total_cloud_cover/N '+t[12]+'.svg">';
    let pressureTendency = '';
    let pressureDelta = '';
    if(/5[0-8]\d{3}/.test(other)){
      let index = other.match(/5[0-8]\d{3}/).index;
      let a = other[index+1];
      pressureTendency = '<img height="15px" src="/assets/weather/pressure_tendency/a '+a+'.svg">';
      if(+a > 4)
        pressureDelta = '-'+other.substr(index+3,2);
      else
        pressureDelta = other.substr(index+3,2);
    }
    let dewPoint = t.length>24? +(sign[+t[25]]+t.substr(26,3)):'';
    
    return '<table><tbody><tr><td height="15px"></td><td width="20px"></td><td>'+cloudHigh+'</td><td></td><td></td></tr><tr><td height="15px"></td><td>'+airTemperature+'</td><td>'+cloudMedium+'</td><td>'+airPressure+'</td><td></td></tr><tr><td>'+meteoRange+'</td><td>'+presentWeather+'</td><td>'+totalCloudCover+'</td><td>'+pressureDelta+'</td><td>'+pressureTendency+'</td></tr><tr><td></td><td>'+dewPoint+'</td><td>'+cloudLow+'</td><td>'+cloudsNumber+' '+pastWeather1+'</td><td>'+pastWeather2+'</td></tr><tr><td></td><td></td><td></td><td>'+hightCloud+'</td></tr></tbody></table>';
  }
  render(){
    const opts = {set2500: [6.85, 48.5, 31.0],set5000: [6.1, 47.0, 27.0],set10000: [6.87, 48.3667, 25.9]};
    let firstCoords = new google.maps.LatLng(opts[this.props.setStations][1],opts[this.props.setStations][2]); //48.3667, 25.9); //Cernovcy    48.0161457, 37.8057165); // Donetsk
    let mapOptions = {
      center: firstCoords, 
      // mapTypeId: google.maps.MapTypeId.TERRAIN,
      zoom: opts[this.props.setStations][0], //6.1,
      styles: [
            // {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
            {elementType: 'geometry', stylers: [{color: '#eeeeee'}]},
            // {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
            // {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
            {elementType: 'labels.text.fill', stylers: [{color: '#999999'}]},
            // {
            //   featureType: 'administrative.locality',
            //   elementType: 'labels.text.fill',
            //   stylers: [{color: '#d59563'}]
            // },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [
                { visibility: "off" }
              ]
              // stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              // stylers: [{color: '#6b9a76'}]
              stylers: [
                { visibility: "off" }
              ]
            },
            {
              featureType: 'road',
              // elementType: 'geometry',
              // stylers: [{color: '#38414e'}]
              stylers: [
                { visibility: "off" }
              ]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{color: '#212a37'}]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{color: '#9ca5b3'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{color: '#746855'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{color: '#1f2835'}]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{color: '#f3d19c'}]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{color: '#2f3948'}]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{color: '#d59563'}]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{color: '#8888ff'}]
              // stylers: [{color: '#17263c'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{color: '#0000ff'}]
              // stylers: [{color: '#515c6d'}]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{color: '#17263c'}]
            }
          ]
    };
    let map = new google.maps.Map(document.getElementById('map'), mapOptions);
    let markers = [];
    const windArrows = [
      "M 18,0 C 18,9.9411255 9.9411255,18 0,18 -9.9411255,18 -18,9.9411255 -18,0 c 0,-9.9411255 8.0588745,-18 18,-18 9.9411255,0 18,8.0588745 18,18 z", // calm 0 scale = 0.4
      "M0,0l-40,0", // 00 1
      "M0,0l-40,0 M-35,0l-2.5,-8.5", // 01 2-3
      "M0,0l-40,0l-5,-17", // 02 4-6
      "M0,0l-40,0l-5,-17 M-35,0l-2.5,-8.5", // 03 7-8
      "M0,0l-40,0l-5,-17 M-35,0l-5,-17", // 04 9-11
      "M0,0l-40,0l-5,-17 M-35,0l-5,-17 M-30,0l-2.5,-8.5", //05 12-13
      "M0,0l-40,0l-5,-17 M-35,0l-5,-17 M-30,0l-5,-17", // 06 14-16
      "M0,0l-40,0l-5,-17 M-35,0l-5,-17 M-30,0l-5,-17 M-25,0l-2.5,-8.5", // 07 17-18
      "M0,0l-40,0l-5,-17 M-35,0l-5,-17 M-30,0l-5,-17 M-25,0l-5,-17", //08 19-21
      "M0,0l-40,0l-5,-17 M-35,0l-5,-17 M-30,0l-5,-17 M-25,0l-5,-17 M-20,0l-2.5,-8.5", // 09 22-23
      "M0,0l-40,0 l0,-1l5,-17.25l5,17.25l0,1", // 10 24-26
      "M0,0l-40,0 l0,-1l5,-17.25l5,17.25l0,1 M-25,0l-2.5,-8.5", // 11 27-28
      "M0,0l-40,0 l0,-1l5,-17.25l5,17.25l0,1 M-25,0l-5,-17", // 12 29-31
      ];
    this.props.telegrams.map((telegram) => {
      let text = telegram[3];
      let codeStation = text.substr(0,5);
      let location = {lat: +telegram[0], lng: +telegram[1]};
      let marker = new MarkerWithLabel({
        position: location, 
        map: map, 
        labelContent: this.stationInfo(text),
        labelAnchor: new google.maps.Point(41, 37),
        labelStyle: {
          // opacity: 0.8,
          color: "black"
        },
        title: telegram[2]+' '+text,
        icon: {
                path: windArrows[this.arrowNumber(+text.substr(15,2))],
                scale: 0.8,
                rotation: +text.substr(13,2)*10+90,
                strokeWeight:1,
                // fillOpacity: 1,
                // fillColor:  "#B40404",
                strokeColor:"#B40404"
             },
        id: codeStation});
      markers.push(marker);
    });
    const markerCluster = new MarkerClusterer({ map, markers });
//    var markerCluster = new MarkerClusterer(map, markers,
//            {imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m'});
    // markers.map( m => {
    //   var infowindow = new google.maps.InfoWindow({content: info[m.id],maxWidth: '500px'});
    //   m.addListener('click', () => infowindow.open(map, m));
    // });
    return(
      <div> 
      </div>
    );
  }
}
