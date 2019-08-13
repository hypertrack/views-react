import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import { getPublicDeviceStatus } from './../../graphql/queries'
// import CONSTANTS from './../../constants'
import LiveLocation from './LiveLocation'
import { PageLoader, WrongKey } from './../Generic'
import { ErrorState } from './source'

const getPublicDeviceStatusQuery = gql`
  ${getPublicDeviceStatus}
`

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
    trackingId
  } = props

  return (
    <Query
      query={getPublicDeviceStatusQuery}
      variables={{ deviceId, publishableKey, isWidget, trackingId }}
      fetchPolicy="no-cache"
    >
      {({ data, error, loading }) => {
        if (loading) return <PageLoader />
        if (error) return <ErrorState />
        if (data && !data.getPublicDeviceStatus) return <WrongKey />
        const device_id =
          data && data.getPublicDeviceStatus
            ? data.getPublicDeviceStatus.device_id
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
            getDeviceStatus={data.getPublicDeviceStatus}
            setSelectedDeviceForSingleDeviceView={
              setSelectedDeviceForSingleDeviceView
            }
            selectedMapLayerState={selectedMapLayerState}
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
