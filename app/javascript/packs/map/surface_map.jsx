import React from 'react';

const StationInfoTable = ({telegram}) => {
  return (
    <table>
      <tbody>
        <tr>
          <td>&#9675;</td>
          <td>&#9021;</td>
          <td>&#9684;</td>
          <td>&#9899;</td>
          <td>&#9898;</td>
        </tr>
        <tr>
          <td><img height="10px" src="/assets/weather/total_cloud_cover/N 5.svg"/></td>
          <td>{telegram.substr(26,3)}</td>
        </tr>
      </tbody>
    </table>
  );
};
export default class SurfaceMap extends React.Component{
  constructor(props){
    super(props);
    this.stationInfo = this.stationInfo.bind(this);
  }
  arrowNumber(val){
    if(val<2) return val;
    // if(val==1) return '01';
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
    // return ret < 10 ? '0'+ret : ret;
    return ret+1;
  }
  stationInfo(t){
    const sign = ['','-'];
    let airTemperature =+(sign[+t[25]]+t.substr(26,3));
    let airPressure = '';
    let meteoRange = +t.substr(15,2);
    let presentWeather = '';
    // let windSpeed = '<img height="15px" src="/assets/weather/wind_arrows/NH '+this.arrowNumber(+t.substr(21,2))+'.svg">'; 
    
    let hightCloud = t[14] == '/' ? '':t[14];
    let cloudHigh = '';
    let cloudMedium = '';
    let cloudLow = '';
    let cloudsNumber = '';
    if(/8[0-9/]{4}/.test(t.substr(30))){
      let index = t.substr(30).match(/8[0-9/]{4}/).index;
      cloudsNumber = t.substr(30)[index+1];
      let val = t.substr(30)[index+4];
      if(val == '0' || val == '/')
        cloudHigh = '';
      else
        cloudHigh = '<img height="15px" src="/assets/weather/cloud_high/CH '+val+'.svg">';
      val = t.substr(30)[index+3];
      if(val == '0' || val == '/')
        cloudMedium = '';
      else
        cloudMedium = '<img height="15px" src="/assets/weather/cloud_medium/CM '+val+'.svg">';
      val = t.substr(30)[index+2];
      if(val == '0' || val == '/')
        cloudLow = '';
      else
        cloudLow = '<img height="15px" src="/assets/weather/cloud_low/CL '+val+'.svg">';
    }
    if(/4[0-9/]{4}/.test(t.substr(30))){
      let index = t.substr(30).match(/4[0-9/]{4}/).index;
      airPressure = +t.substr(30).substr(index+1,4);
    }
    let pastWeather1 = '';
    let pastWeather2 = '';
    if(/7\d{4}/.test(t.substr(30))){
      let index = t.substr(30).match(/7\d{4}/).index;
      let val = t.substr(30).substr(index+1,2);
      presentWeather = '<img height="15px" src="/assets/weather/present_weather/ww '+val+'.svg">';
      val = t.substr(30)[index+3];
      if(+val < 3 || val == '/')
        pastWeather1 = '';
      else
        pastWeather1 = '<img height="15px" src="/assets/weather/past_weather/w1w2 '+val+'.svg">';
      val = t.substr(30)[index+4];
      if(+val < 3 || val == '/')
        pastWeather2 = '';
      else
        pastWeather2 = '<img height="15px" src="/assets/weather/past_weather/w1w2 '+val+'.svg">';
    }
    let totalCloudCover = '<img height="15px" src="/assets/weather/total_cloud_cover/N '+t[18]+'.svg">';
    let pressureTendency = '';
    let pressureDelta = '';
    if(/5[0-8]\d{3}/.test(t.substr(30))){
      let index = t.substr(30).match(/5[0-8]\d{3}/).index;
      let a = t.substr(30)[index+1];
      pressureTendency = '<img height="15px" src="/assets/weather/pressure_tendency/a '+a+'.svg">';
      if(+a > 4)
        pressureDelta = '-'+t.substr(30).substr(index+3,2);
      else
        pressureDelta = t.substr(30).substr(index+3,2);
    }
    let dewPoint = +(sign[+t[31]]+t.substr(32,3));
    
    return '<table><tbody><tr><td height="15px"></td><td width="20px"></td><td>'+cloudHigh+'</td><td></td><td></td></tr><tr><td height="15px"></td><td>'+airTemperature+'</td><td>'+cloudMedium+'</td><td>'+airPressure+'</td><td></td></tr><tr><td>'+meteoRange+'</td><td>'+presentWeather+'</td><td>'+totalCloudCover+'</td><td>'+pressureDelta+'</td><td>'+pressureTendency+'</td></tr><tr><td></td><td>'+dewPoint+'</td><td>'+cloudLow+'</td><td>'+cloudsNumber+' '+pastWeather1+'</td><td>'+pastWeather2+'</td></tr><tr><td></td><td></td><td></td><td>'+hightCloud+'</td></tr></tbody></table>';
  }
  render(){
    // const totalCloudCover = [9675,9021,9684,,9681,,9685,,9679,2297];
    let firstCoords = new google.maps.LatLng(48.0161457, 37.8057165); // Donetsk
    let mapOptions = {
      center: firstCoords, 
      // mapTypeId: google.maps.MapTypeId.TERRAIN,
      zoom: 7,
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
              stylers: [{color: '#263c3f'}]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{color: '#6b9a76'}]
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
    let info = {};
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
      
      ];
    this.props.telegrams.map((t) => {
      let codeStation = t.telegram.substr(6,5);
      info[codeStation] = this.stationInfo(t.telegram);
      // info[codeStation] = <StationInfoTable telegram={t.telegram} />;
      let location = this.props.markerCoords[codeStation];
      // if(t.telegram.substr(19,4)=='0000'){
      //   icon['scaledSize'] = new google.maps.Size(10, 10);
      //   icon['url'] = '/assets/weather/wind_arrows/Calm 00.svg';
      // }else{
      //   icon['scaledSize'] = new google.maps.Size(30, 10);
      //   icon['url'] = '/assets/weather/wind_arrows/NH '+this.arrowNumber(+t.telegram.substr(21,2))+'.svg';
      //   icon['path'] = "m 0,0 h -40 l -5,-17";
      //   icon['rotation'] = 30;
      // }
      // let marker = new google.maps.Marker({position: location, map: map, title: t.telegram, 
      //   icon: {
      //             // path: "M0,0l-40,0 l0,-1l5,-17.25l5,17.25l0,1",
      //             path: windArrows[this.arrowNumber(+t.telegram.substr(21,2))],
      //             scale: 0.8,
      //             rotation: +t.telegram.substr(19,2)*10+90,
      //             strokeWeight:1,
      //             // fillOpacity: 1,
      //             // fillColor:  "#B40404",
      //             strokeColor:"#B40404"
      //         },
      //   id: codeStation});
      let marker = new MarkerWithLabel({
        position: location, 
        map: map, 
        labelContent: this.stationInfo(t.telegram),
        labelAnchor: new google.maps.Point(41, 37),
        labelStyle: {
          // opacity: 0.8,
          color: "black"
        },
        title: t.telegram,
        icon: {
                path: windArrows[this.arrowNumber(+t.telegram.substr(21,2))],
                scale: 0.8,
                rotation: +t.telegram.substr(19,2)*10+90,
                strokeWeight:1,
                // fillOpacity: 1,
                // fillColor:  "#B40404",
                strokeColor:"#B40404"
             },
        id: codeStation});
      markers.push(marker);
    });
    // let marker = new MarkerWithLabel({
    //   position: map.getCenter(),
    //   map: map,
    //   icon: {
    //     url: "http://www.geocodezip.com/mapIcons/SO_20170123_svgMarker.svg",
    //     anchor: new google.maps.Point(62.5, 37),
    //   },
    //   // labelContent: '<b>27</b><img height="15px" src="/assets/weather/cloud_low/CL 1.svg">',
    //   labelContent: <StationInfoTable telegram={this.props.telegrams[0].telegram} />,
    //   labelAnchor: new google.maps.Point(10, 8),
    //   labelClass: "mapLabels", // the CSS class for the label
    //   labelStyle: {
    //     opacity: 0.8,
    //     color: "white"
    //   },
    //   title: "svg url"
    // });
    // markers.push(marker);
    markers.map( m => {
      var infowindow = new google.maps.InfoWindow({content: info[m.id],maxWidth: '500px'});
      m.addListener('click', () => infowindow.open(map, m));
    });
    return(
      <div> 
      </div>
    );
  }
}