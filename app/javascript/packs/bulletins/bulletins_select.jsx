import React from 'react';
import ReactDOM from 'react-dom';
import Tabs from '../tabs/components/Tabs';
import Tab from '../tabs/components/Tab';
import TabList from '../tabs/components/TabList';
import FillTabPanel from './fill_tab_panel';
import TabPanel from '../tabs/components/TabPanel';

export default class BulletinsSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      tabIndex: 0,
      tabContent: this.props.tabContent
    };
  }
  handleSelect(tabIndex){
    const bulletinTypes = ['daily', 'sea', 'holiday', 'storm', 'sea_storm', 'radiation', 'tv'];
    let url = "list?bulletin_type="+bulletinTypes[tabIndex];
    $.ajax({
      type: 'GET',
      dataType: 'json',
      url: url
      }).done(function(data) {
        this.setState({tabContent: data.bulletins, tabIndex: tabIndex});
      }.bind(this))
      .fail(function(res) {
      }.bind(this)); 
  }
  render() {
    let tabTitles = [];
    this.props.tabTitles.forEach( (t, i) => {
      tabTitles.push(<Tab key={i}>{t}</Tab>);
    });
    // let panels = new Array(this.props.tabTitles.length).fill(<TabPanel></TabPanel>);
    let panels = [];
    for(var i=0; i<this.props.tabTitles.length; ++i) 
      panels.push(<TabPanel key={i}></TabPanel>);
    panels[this.state.tabIndex] = <TabPanel key={this.state.tabIndex}><FillTabPanel tabContent={this.state.tabContent}/></TabPanel>;
    return (
      <Tabs selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.handleSelect(tabIndex)}>
        <TabList>
          {tabTitles}
        </TabList>
        {panels}
      </Tabs>
    );
  }
}

$(function(){
  const node = document.getElementById('input_params');
  if(node){
    const tabTitles = JSON.parse(node.getAttribute('tabTitles'));
    const tabContent = JSON.parse(node.getAttribute('tabContent'));
    ReactDOM.render(
      <BulletinsSelect tabTitles={tabTitles} tabContent={tabContent} />,
      document.getElementById('tabs_and_result')
    );
  }
})