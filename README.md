## Installation

In the project directory, you can run:

```
$ npm install --save hypertrack-views-react
$ yarn add hypertrack-views-react
```

## Usage

```javascript
import React from 'react';
import { LiveView } from 'hypertrack-views-react';

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
