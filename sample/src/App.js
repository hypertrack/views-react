import React from "react";
import { LiveView } from "hypertrack-views-react";
import { Layout, Input, Row, Col, Button, Select } from "antd";

import "./App.css";

const PUBLISHABLE_KEY = "<your_key_here>";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltip: false,
      deviceList: false,
      publishableKey:
        process.env.REACT_APP_PUBLISHABLE_KEY || PUBLISHABLE_KEY || "",
      defaultLayer: "base",
      deviceId: "",
      customLayer: "",
      assetsUrl: ""
    };
  }

  setTooltip() {
    this.setState({
      tooltip: !this.state.tooltip
    });
  }

  setDeviceList() {
    this.setState({
      deviceList: !this.state.deviceList
    });
  }

  setPusblishableKey(e) {
    this.setState({
      publishableKey: e.target.value
    });
  }

  setDefaultLayer(defaultLayer) {
    this.setState({
      defaultLayer
    });
  }

  setDeviceId(deviceId) {
    this.setState({
      deviceId
    });
  }

  setCustomLayer(e) {
    this.setState({
      customLayer: e.target.value
    });
  }

  setAssetsUrl(e) {
    this.setState({
      assetsUrl: e.target.value
    });
  }

  render() {
    const { Header, Footer, Content } = Layout;

    const { Option } = Select;
    const layerOptions = ["base", "street", "satellite", "custom"];

    return (
      <div className="App">
        <Layout>
          <Header>Header</Header>
          <Content>
            <Col>
              <Row>
                <Button type="primary" onClick={() => this.setTooltip()}>
                  {`${this.state.tooltip ? "Hide tooltips" : "Show tooltips"}`}
                </Button>
                <Button type="primary" onClick={() => this.setDeviceList()}>
                  {`${
                    this.state.tooltip ? "Hide device list" : "Show device list"
                  }`}
                </Button>
                <Input
                  placeholder="Your Publishable Key"
                  value={this.state.publishableKey}
                  onChange={e => this.setPusblishableKey(e)}
                />
                <Input
                  placeholder="Your Device ID"
                  value={this.state.deviceId}
                  onChange={e => this.setDeviceId(e)}
                />
                <Input
                  placeholder="Your Custom Layer URL"
                  value={this.state.customLayer}
                  onChange={e => this.setCustomLayer(e)}
                />
                <Input
                  placeholder="Your Assets URL"
                  value={this.state.assetsUrl}
                  onChange={e => this.setAssetsUrl(e)}
                />
                <Select
                  defaultValue={this.state.defaultLayer}
                  onChange={e => this.setDefaultLayer(e)}
                >
                  {layerOptions.map(layer => (
                    <Option key={layer}>{layer}</Option>
                  ))}
                </Select>
              </Row>
            </Col>
            <LiveView
              publishableKey={this.state.publishableKey}
              isTooltipsShown={this.state.tooltip}
              isDeviceListShown={this.state.deviceList}
              selectedDeviceId={this.state.deviceId}
              defaultLayer={this.state.defaultLayer}
              customLayer={this.state.customLayer}
              className="liveView"
              assetsUrl={this.state.assetsUrl}
            />
          </Content>
          <Footer>Footer</Footer>
        </Layout>
      </div>
    );
  }
}

export default App;
