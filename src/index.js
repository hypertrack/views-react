import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloLink } from 'apollo-link'
import { createHttpLink } from 'apollo-link-http'
import AWSAppSyncClient, { createAppSyncLink } from 'aws-appsync'
import LiveViewContainer from './pages'

import CONSTANTS from './constants'

const aws_exports = CONSTANTS.appsync

const appSyncConfig = {
  url: aws_exports.graphqlEndpoint,
  region: aws_exports.region,
  auth: {
    type: 'API_KEY',
    apiKey: aws_exports.apiKey
  },
  disableOffline: true
}

const client = new AWSAppSyncClient(appSyncConfig, {
  link: createAppSyncLink({
    ...appSyncConfig,
    resultsFetcherLink: ApolloLink.from([
      createHttpLink({
        uri: appSyncConfig.url
      })
    ])
  })
})

const LiveView = props => {
  console.log('LiveView rendering')
  return (
    <ApolloProvider client={client}>
      <LiveViewContainer {...props} />
    </ApolloProvider>
  )
}

export { LiveView }

if (process.env.REACT_APP_PUBLISHABLE_KEY) {
  ReactDOM.render(
    <div
      style={{
        position: 'absolute',
        height: '80%',
        width: '80%',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
      }}
    >
      <LiveView
        publishableKey={
          process.env.REACT_APP_PUBLISHABLE_KEY
        }
        showTooltips={false}
        showDeviceList={true}
        showDeviceCard={true}
        className="testClass"
        defaultLayer={'custom'}
        customLayerUrl={'http://a.tile.openstreetmap.org/{z}/{x}/{y}.png'}
      />
    </div>,
    document.getElementById('root')
  )
}
