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
  Checkbox,
  Result
} from "antd";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

import "./App.css";

const PUBLISHABLE_KEY = "";

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      tooltip: true,
      deviceList: true,
      deviceCard: true,
      publishableKey: process.env.REACT_APP_PUBLISHABLE_KEY || PUBLISHABLE_KEY,
      defaultLayer: "base",
      deviceId: "",
      customLayerUrl: "",
      assetsUrl: "",
      code: `import { LiveView } from "hypertrack-views-react";\n\n<LiveView\n\tpublishableKey="${process
        .env.REACT_APP_PUBLISHABLE_KEY ||
        PUBLISHABLE_KEY ||
        ""}"\n/>`
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

  setDeviceCard() {
    this.setState(
      {
        deviceCard: !this.state.deviceCard
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
        customLayerUrl: e.target.value
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
    let code = `import { LiveView } from "hypertrack-views-react";\n\n<LiveView \n\tpublishableKey="${
      this.state.publishableKey
    }"\n`;

    if (!this.state.tooltip) {
      code += `\tshowTooltips={${this.state.tooltip}}\n`;
    }

    if (!this.state.deviceList) {
      code += `\tshowDeviceList={${this.state.deviceList}}\n`;
    }

    if (!this.state.deviceCard) {
      code += `\tshowDeviceCard={${this.state.deviceCard}}\n`;
    }

    if (this.state.deviceId !== "") {
      code += `\tselectedDeviceId="${this.state.deviceId}"\n`;
    }

    if (this.state.defaultLayer !== "base") {
      code += `\tdefaultLayer="${this.state.defaultLayer}"\n`;
    }

    if (this.state.customLayerUrl !== "") {
      code += `\tcustomLayerUrl="${this.state.customLayerUrl}"\n`;
    }

    if (this.state.assetsUrl !== "") {
      code += `\tassetsUrl="${this.state.assetsUrl}"\n`;
    }

    code += `/>`;

    this.setState({
      code
    });
  }

  render() {
    const { Content } = Layout;
    const { Option } = Select;
    const { Title } = Typography;

    const layerOptions = ["base", "street", "satellite", "custom"];

    return (
      <div className="App">
        <Layout>
          <Content>
            <Row style={{ padding: "25px" }}>
              <Col span={16} offset={8}>
                <Title>HyperTrack Views ReactJS</Title>
              </Col>
            </Row>
            <Row style={{ padding: "25px" }}>
              <Col span={20} offset={2}>
                {this.state.publishableKey === "" && (
                  <Result
                    style={{ height: "300px" }}
                    title="Please set your publishable key"
                    subTitle={
                      <a
                        href="https://dashboard.hypertrack.com/setup"
                        target="_blank"
                      >
                        Get it from the HyperTrack Dashboard
                      </a>
                    }
                  />
                )}
                {this.state.publishableKey !== "" && (
                  <LiveView
                    publishableKey={this.state.publishableKey}
                    showTooltips={this.state.tooltip}
                    showDeviceList={this.state.deviceList}
                    selectedDeviceId={this.state.deviceId}
                    defaultLayer={this.state.defaultLayer}
                    customLayerUrl={this.state.customLayerUrl}
                    className="liveView"
                    assetsUrl={this.state.assetsUrl}
                  />
                )}
              </Col>
            </Row>
            <Row style={{ padding: "25px" }}>
              <Col span={9} offset={2}>
                <Form layout="vertical">
                  <Form.Item label="View Options">
                    <Checkbox
                      checked={this.state.tooltip}
                      onChange={() => this.setTooltip()}
                    >
                      Show tooltips
                    </Checkbox>
                    <Checkbox
                      checked={this.state.deviceList}
                      onChange={() => this.setDeviceList()}
                    >
                      Show device list
                    </Checkbox>
                    <Checkbox
                      checked={this.state.deviceCard}
                      onChange={() => this.setDeviceCard()}
                    >
                      Show device card
                    </Checkbox>
                  </Form.Item>
                  <Form.Item label="Publishable Key">
                    <Input
                      id="publishableKeyInput"
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
                      value={this.state.customLayerUrl}
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
