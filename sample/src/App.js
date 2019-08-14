import React from "react";
import { LiveView } from "hypertrack-views-react";
import {
  Layout,
  Input,
  Row,
  Col,
  Select,
  Typography,
  Form,
  Checkbox
} from "antd";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

import "./App.css";

const PUBLISHABLE_KEY = "";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltip: false,
      deviceList: false,
      publishableKey: process.env.REACT_APP_PUBLISHABLE_KEY || PUBLISHABLE_KEY,
      defaultLayer: "base",
      deviceId: "",
      customLayer: "",
      assetsUrl: "",
      code: `import { LiveView } from "hypertrack-views-react";\n\n<LiveView
      publishableKey=${process.env.REACT_APP_PUBLISHABLE_KEY ||
        PUBLISHABLE_KEY ||
        ""}
      isTooltipsShown=false
      isDeviceListShown=false
      selectedDeviceId=""
      defaultLayer="base"
      customLayer=""
      assetsUrl=""
    />`
    };
  }

  setTooltip() {
    this.setState(
      {
        tooltip: !this.state.tooltip
      },
      () => {
        this.updateCode();
      }
    );
  }

  setDeviceList() {
    this.setState(
      {
        deviceList: !this.state.deviceList
      },
      () => {
        this.updateCode();
      }
    );
  }

  setPusblishableKey(e) {
    this.setState(
      {
        publishableKey: e.target.value
      },
      () => {
        this.updateCode();
      }
    );
  }

  setDefaultLayer(defaultLayer) {
    this.setState(
      {
        defaultLayer
      },
      () => {
        this.updateCode();
      }
    );
  }

  setDeviceId(e) {
    this.setState(
      {
        deviceId: e.target.value
      },
      () => {
        this.updateCode();
      }
    );
  }

  setCustomLayer(e) {
    this.setState(
      {
        customLayer: e.target.value
      },
      () => {
        this.updateCode();
      }
    );
  }

  setAssetsUrl(e) {
    this.setState(
      {
        assetsUrl: e.target.value
      },
      () => {
        this.updateCode();
      }
    );
  }

  updateCode() {
    this.setState({
      code: `import { LiveView } from "hypertrack-views-react";\n\n<LiveView
      publishableKey=${process.env.REACT_APP_PUBLISHABLE_KEY ||
        PUBLISHABLE_KEY ||
        ""}
      isTooltipsShown=${this.state.tooltip}
      isDeviceListShown=${this.state.deviceList}
      selectedDeviceId="${this.state.deviceId}"
      defaultLayer="${this.state.defaultLayer}"
      customLayer="${this.state.customLayer}"
      assetsUrl="${this.state.assetsUrl}"
    />`
    });
  }

  render() {
    const { Content } = Layout;
    const { Option } = Select;
    const { Title } = Typography;

    const layerOptions = ["base", "street", "satellite", "custom"];

    console.log(this.state);

    return (
      <div className="App">
        <Layout>
          <Content>
            <Row style={{ padding: "25px" }}>
              <Col span={16} offset={8}>
                <Title>HyperTrack Views ReactJS</Title>
              </Col>
            </Row>
            {this.state.publishableKey !== "" && (
              <Row style={{ padding: "25px" }}>
                <Col span={20} offset={2}>
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
                </Col>
              </Row>
            )}
            <Row style={{ padding: "25px" }}>
              <Col span={9} offset={2}>
                <Form layout="vertical">
                  <Form.Item label="View Options">
                    <Checkbox onChange={() => this.setTooltip()}>
                      Show tooltips
                    </Checkbox>
                    <Checkbox onChange={() => this.setDeviceList()}>
                      Show device list
                    </Checkbox>
                  </Form.Item>
                  <Form.Item label="Publishable Key">
                    <Input
                      placeholder="Your Publishable Key"
                      value={this.state.publishableKey}
                      onChange={e => this.setPusblishableKey(e)}
                    />
                  </Form.Item>
                  <Form.Item label="Device ID">
                    <Input
                      placeholder="Your Device ID"
                      value={this.state.deviceId}
                      onChange={e => this.setDeviceId(e)}
                    />
                  </Form.Item>
                  <Form.Item label="Custom Layer URL">
                    <Input
                      placeholder="Your Custom Layer URL"
                      value={this.state.customLayer}
                      onChange={e => this.setCustomLayer(e)}
                    />
                  </Form.Item>
                  <Form.Item label="Asset URL">
                    <Input
                      placeholder="Your Assets URL"
                      value={this.state.assetsUrl}
                      onChange={e => this.setAssetsUrl(e)}
                    />
                  </Form.Item>
                  <Form.Item label="Default Layer">
                    <Select
                      defaultValue={this.state.defaultLayer}
                      onChange={e => this.setDefaultLayer(e)}
                    >
                      {layerOptions.map(layer => (
                        <Option key={layer}>{layer}</Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Form>
              </Col>
              <Col span={9} offset={2}>
                <SyntaxHighlighter
                  wrapLines={true}
                  language="javascript"
                  style={docco}
                >
                  {this.state.code}
                </SyntaxHighlighter>
              </Col>
            </Row>
          </Content>
        </Layout>
      </div>
    );
  }
}

export default App;
