import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import ca3Data from './datastore/ca3.json';
import citData from './datastore/cit.json';
import eu1Data from './datastore/eu1.json';
import us1Data from './datastore/us1.json';
import us2Data from './datastore/us2.json';
import us3Data from './datastore/us3.json';

const DATA = [
  { "dataCenter": "ca3",
    "tenantData": ca3Data},
  { "dataCenter": "cit",
    "tenantData": citData},
  { "dataCenter": "eu1",
    "tenantData": eu1Data},
  { "dataCenter": "us1",
    "tenantData": us1Data},
  { "dataCenter": "us2",
    "tenantData": us2Data},
  { "dataCenter": "us3",
    "tenantData": us3Data}
]


class TenantRow extends React.Component {
  render() {
    let enabled;
    if(this.props.tenant.enabled){
        enabled = "Yes";
    }
    else {
        enabled = "No";
    }

    return (
      <tr>
        <td>{this.props.tenant.name}</td>
        <td>{enabled}</td>
        <td>{this.props.tenant.dataCenter}</td>
      </tr>
    );
  }
}

class TenantTable extends React.Component {
  render() {
    let rows = [];
    this.props.tenantData.forEach(function(tenant, i) {
      rows.push(<TenantRow tenant={tenant} key={i}/>);
    });
    return (
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Enabled</th>
            <th>DataCenter</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
    );
  }
}

class SearchBar extends React.Component {
    render() {
      return (
        <form>
          <input
            type="text"
            placeholder="Search..."
            ref="tenantSearch"
            onChange={this.props.handleSearch}
          />
          <p>
          <input
            type="checkbox"
            checked={this.props.enabledCustomersOnly}
            ref="enabledCustomersOnlyCheckbox"
            onChange={this.props.handleEnableCheckbox}
          />
          {' '}
          Only Show Enabled Customers
        </p>
        </form>
      );
    }
}

class FilterableTenantTable extends React.Component {
  constructor(props) {
    super(props);
    let tenantData = this.filterTenantData(false, "");
    this.state = {
      filterSearch: "",
      enabledCustomersOnly: false,
      tenantData: tenantData
    }

    this.handleSearch = this.handleSearch.bind(this);
    this.handleEnableCheckbox = this.handleEnableCheckbox.bind(this);
  }

  filterTenantData(enabledFilter, filterSearch) {
    var tenantData = [];
    DATA.forEach(function(dataMap){
      dataMap['tenantData'].forEach(function(tenant){
        if ((enabledFilter) && (tenant.enabled === false)){
          return;
        }
        if((filterSearch !== "") && (tenant.name.toLowerCase().search(filterSearch.toLowerCase()) === -1)){
          return;
        }
        tenant.dataCenter = dataMap['dataCenter'];
        tenantData.push(tenant);
      });
    });
    console.log(tenantData);
    return tenantData;
  }

  handleSearch(event) {
    let filterSearch = event.target.value;
    let tenantData = this.filterTenantData(this.state.enabledCustomersOnly, filterSearch);
    this.setState({
      filterSearch: filterSearch,
      tenantData: tenantData
    });
  }

  handleEnableCheckbox(event) {
    let enabled = !this.state.enabledCustomersOnly;
    let tenantData = this.filterTenantData(enabled, this.state.filterSearch);
    this.setState({
      enabledCustomersOnly: enabled,
      tenantData: tenantData
    });
  }

  render() {
    return (
      <div>
        <SearchBar
          enabledCustomersOnly={this.state.enabledCustomersOnly}
          handleSearch={this.handleSearch}
          handleEnableCheckbox={this.handleEnableCheckbox}
        />
        <TenantTable
          tenantData={this.state.tenantData}
        />
      </div>
    );
 }
}

class Header extends React.Component {
  render() {
    return(
      <header>
          <h1>{this.props.title}</h1>
      </header>
    );
  }
}

class App extends React.Component {
  render() {
    return(
      <div>
         <Header title="Vena Tenant Management"/>
         <FilterableTenantTable/>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
