## Installation

In the project directory, you can run:

```
$ npm install --save hypertrack-sdk-react
$ yarn add hypertrack-sdk-react
```

## Usage

```javascript
import React from 'react';
import { LiveView } from 'hypertrack-sdk-react';

const App = () => {
  const [tooltip, setTooltip] = React.useState(false);
  const [list, setList] = React.useState(false);

  return (
    <div className="App">
      <LiveView
        publishableKey={"Your publishableKey here"}
        isTooltipsShown={false}
        isDeviceListShown={false}
        selectedDeviceId={null}
        defaultLayer={"street"}
        customLayer={"Optional prop for changing map tiles here"}
        className="testClass"
      />
    </div>
  );
}

export default App;
```
