import React from "react";
import { LiveView } from "hypertrack-views-react";
import "./App.css";

function App() {
  const [button, setButton] = React.useState(false);
  const PUBLISHABLE_KEY = "<your_key_here>";

  return (
    <div className="App">
      <button onClick={() => setButton(!button)} />
      <div className="hypertrack-container">
        <LiveView
          publishableKey={
            process.env.REACT_APP_PUBLISHABLE_KEY || PUBLISHABLE_KEY
          }
          isTooltipsShown={button}
          isDeviceListShown={button}
          selectedDeviceId={null}
          defaultLayer={"custom"}
          className="testClass"
          assetsUrl={"https://abc-sdk-test-assets.s3-us-west-2.amazonaws.com/"}
        />
      </div>
    </div>
  );
}

export default App;
