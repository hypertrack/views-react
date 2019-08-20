import React from 'react'
import { Subscription } from 'react-apollo'

import { deviceSubscription } from './../../graphql/subscriptions'
import { LocationViewer } from './Components'
import { utils } from '../../common'

const LiveLocationLoader = props => {
  const {
    assetsUrl,
    deviceId,
    getMovementStatus,
    isWidget,
    routerLocation,
    isTrackingLink,
    publishableKey,
    trackingId,
    setSelectedDeviceForSingleDeviceView,
    selectedMapLayerState,
    showDeviceCard
  } = props
  const firstDeviceStatus = utils.parseMovementStatus(getMovementStatus || {})
  return (
    <Subscription
      subscription={deviceSubscription}
      variables={{ deviceId, isWidget }}
      fetchPolicy="no-cache"
      shouldResubscribe={true}
    >
      {({ data, error, loading }) => {
        console.log('Subscription Response', data)
        const latestDeviceStatus =
          error || loading
            ? {}
            : utils.parseMovementStatus(data.subscribeToMovementStatus)
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
