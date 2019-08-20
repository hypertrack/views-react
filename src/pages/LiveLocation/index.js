import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import { getPublicMovementStatus } from './../../graphql/queries'
// import CONSTANTS from './../../constants'
import LiveLocation from './LiveLocation'
import { PageLoader, WrongKey } from './../Generic'
import { ErrorState } from './source'

const LiveLocationContainer = props => {
  const deviceId = props.selectedDeviceForSingleDeviceView
  const isWidget = true
  const {
    assetsUrl,
    publishableKey,
    routerLocation,
    isTrackingLink,
    setSelectedDeviceForSingleDeviceView,
    // setSelectedMapLayer,
    selectedMapLayerState,
    showDeviceCard,
    trackingId
  } = props

  return (
    <Query
      query={getPublicMovementStatus}
      variables={{ deviceId, publishableKey, isWidget, trackingId }}
      fetchPolicy="no-cache"
    >
      {({ data, error, loading }) => {
        if (loading) return <PageLoader />
        if (error) return <ErrorState />
        if (data && !data.getPublicMovementStatus) return <WrongKey />
        const device_id =
          data && data.getPublicMovementStatus
            ? data.getPublicMovementStatus.device_id
            : deviceId
        return (
          <LiveLocation
            assetsUrl={assetsUrl}
            isWidget={isWidget}
            trackingId={trackingId}
            routerLocation={routerLocation}
            isTrackingLink={isTrackingLink}
            publishableKey={publishableKey}
            deviceId={device_id}
            getMovementStatus={data.getPublicMovementStatus}
            setSelectedDeviceForSingleDeviceView={
              setSelectedDeviceForSingleDeviceView
            }
            selectedMapLayerState={selectedMapLayerState}
            showDeviceCard={showDeviceCard}
          />
        )
      }}
    </Query>
  )
}

LiveLocationContainer.defaultProps = {
  isTrackingLink: false
}

export default LiveLocationContainer
