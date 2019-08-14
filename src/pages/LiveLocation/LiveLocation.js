import React from 'react'
import gql from 'graphql-tag'
import { Subscription } from 'react-apollo'

import { parseDeviceStatusResponse } from './source'
import { deviceSubscription } from './../../graphql/subscriptions'
import { LocationViewer } from './Components'

const deviceLocationSubscription = gql`
  ${deviceSubscription}
`

const LiveLocationLoader = props => {
  const {
    assetsUrl,
    deviceId,
    getDeviceStatus,
    isWidget,
    routerLocation,
    isTrackingLink,
    publishableKey,
    trackingId,
    setSelectedDeviceForSingleDeviceView,
    selectedMapLayerState,
    showDeviceCard
  } = props
  const firstDeviceStatus = parseDeviceStatusResponse(getDeviceStatus || {})
  return (
    <Subscription
      subscription={deviceLocationSubscription}
      variables={{ deviceId, isWidget }}
      fetchPolicy="no-cache"
      shouldResubscribe={true}
    >
      {({ data, error, loading }) => {
        const latestDeviceStatus = parseDeviceStatusResponse(
          (error || loading) && !data ? {} : data.subscribeToDeviceStatus
        )
        if (error) console.error(error)
        return (
          <LocationViewer
            assetsUrl={assetsUrl}
            firstDeviceStatus={firstDeviceStatus}
            latestDeviceStatus={latestDeviceStatus}
            deviceId={deviceId}
            isWidget={isWidget}
            routerLocation={routerLocation}
            trackingId={trackingId}
            isTrackingLink={isTrackingLink}
            publishableKey={publishableKey}
            setSelectedDeviceForSingleDeviceView={
              setSelectedDeviceForSingleDeviceView
            }
            selectedMapLayerState={selectedMapLayerState}
            showDeviceCard={showDeviceCard}
          />
        )
      }}
    </Subscription>
  )
}

export default LiveLocationLoader
