import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
import classNames from 'classnames'

import { dateUtils } from './../../../../common'
import { getDeviceInfo } from './../../../../graphql/queries'
import { parseDeviceInfo } from './../../../LiveLocation/source'
import CardHeader from './../CardHeader'
import DeviceInfoBody from './../DeviceInfoBody'

import {
  ExtendedMap,
  Card,
  MapCenterIcon,
  PageLoader
} from './../../../Generic'

import styles from './location-viewer.module.scss'
import CONSTANTS from './../../../../constants'

const deviceInfoStyles = {
  containerClassname: styles.deviceInfoCardContainer,
  bodyClassname: styles.deviceInfoCard
}

const checkIfObjectHasValues = obj =>
  Object.values(obj).reduce(
    (hasValue, currentValue) => currentValue || hasValue,
    false
  )

const GET_DEVICE_INFO = gql`
  ${getDeviceInfo}
`

const initialiseLocationEvents = (first, last) => {
  const initArr = []
  if (first && first.location) initArr.push(first.location)
  if (last && last.location) initArr.push(last.location)
  return initArr
}

const initDeviceInfo = (locationProps, data, error, rest) => {
  return {
    ...locationProps.location,
    recorded_at: locationProps.location
      ? locationProps.location.recorded_at
      : '',
    ...rest,
    locationProps,
    deviceInfoError: error,
    deviceInfoData:
      error || !data.getDeviceInfo ? null : parseDeviceInfo(data.getDeviceInfo)
  }
}

const LocationViewer = props => {
  const {
    assetsUrl,
    firstDeviceStatus,
    latestDeviceStatus,
    deviceId,
    routerLocation,
    isWidget,
    isTrackingLink,
    publishableKey,
    setSelectedDeviceForSingleDeviceView,
    selectedMapLayerState,
    trackingId
  } = props
  const lastLocationEvents = React.useRef(
    initialiseLocationEvents(firstDeviceStatus, latestDeviceStatus)
  )
  React.useEffect(
    () => {
      const currentSet = lastLocationEvents.current
      const lastLocationEvent = currentSet[0] || {}
      const latestLocationEvent = latestDeviceStatus.location || {}
      if (
        latestLocationEvent.recorded_at &&
        dateUtils.isDateAfter(
          latestLocationEvent.recorded_at,
          lastLocationEvent.recorded_at
        )
      ) {
        currentSet.unshift(latestLocationEvent)
        lastLocationEvents.current = currentSet
      }
    },
    [latestDeviceStatus]
  )
  const [panToCenter, updatePanToCenter] = React.useState(false)
  const [lastInteractionTime, setLastInteractionTime] = React.useState(null)
  const [follow, setFollowFlag] = React.useState(true)

  const [showDeviceInfo, updateShowDeviceInfo] = React.useState(false)
  const handleDeviceInfoChange = val => updateShowDeviceInfo(val)

  const locationProps = checkIfObjectHasValues(latestDeviceStatus)
    ? latestDeviceStatus
    : firstDeviceStatus
  //------- card info
  const deviceNameCardStyles = {
    headerClassname: styles.deviceLiveCard,
    containerClassname: styles.deviceLiveCardContainer
  }

  //-------
  const recenterButtonClick = event => {
    event.preventDefault()
    event.stopPropagation()

    updatePanToCenter(Math.random())
    setLastInteractionTime(null)
    setFollowFlag(true)
  }

  const handleMapInteraction = e => {
    // TODO: find a better way to reset var after render
    // and not use random here. Maybe useEffect cleanup?
    e.preventDefault()
    e.stopPropagation()
    setLastInteractionTime(Date.now())
    setFollowFlag(false)
  }

  React.useEffect(
    () => {
      // Automatically resume following if some time of inactivity passed
      if (follow === false && lastInteractionTime != null) {
        if (
          Date.now() - lastInteractionTime >
          CONSTANTS.map.inactivityTimer * 1000
        ) {
          setFollowFlag(true)
        }
      }
    },
    [follow, lastInteractionTime, locationProps]
  )

  return (
    <Query
      query={GET_DEVICE_INFO}
      variables={{ deviceId, trackingId, publishableKey, isWidget }}
    >
      {({ loading, error, data }) => {
        if (loading) return <PageLoader />
        const deviceInfo = initDeviceInfo(locationProps, data, error, {
          deviceId,
          showDeviceInfo,
          handleDeviceInfoChange
        })
        return (
          <div
            onClick={handleMapInteraction}
            onTouchMove={handleMapInteraction}
          >
            <div
              className={classNames(styles.cardWrapper, {
                [styles.isWidget]: isWidget
              })}
            >
              <Card
                variant="name"
                header={
                  <CardHeader
                    assetsUrl={assetsUrl}
                    deviceInfo={deviceInfo}
                    routerLocation={routerLocation}
                    isTrackingLink={isTrackingLink}
                    isWidget={isWidget}
                    setSelectedDeviceForSingleDeviceView={
                      setSelectedDeviceForSingleDeviceView
                    }
                  />
                }
                classNames={deviceNameCardStyles}
              />

              <Card
                variant="custom"
                classNames={deviceInfoStyles}
                hidden={!deviceInfo.showDeviceInfo}
              >
                <DeviceInfoBody
                  assetsUrl={assetsUrl}
                  isWidget={isWidget}
                  isTrackingLink={isTrackingLink}
                  routerLocation={routerLocation}
                  {...deviceInfo}
                />
              </Card>
            </div>
            <MapCenterIcon
              assetsUrl={assetsUrl}
              isCentered={follow}
              isWidget={isWidget}
              onClick={recenterButtonClick}
            />
            <ExtendedMap
              assetsUrl={assetsUrl}
              locationProps={locationProps}
              panToCenter={panToCenter}
              follow={follow}
              lastLocationEvents={lastLocationEvents.current}
              selectedMapLayerState={selectedMapLayerState}
            />
          </div>
        )
      }}
    </Query>
  )
}

LocationViewer.defaultProps = {
  isWidget: false,
  isTrackingLink: false
}

export default LocationViewer
