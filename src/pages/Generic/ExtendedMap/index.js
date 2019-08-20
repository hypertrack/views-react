import React from 'react'
import classNames from 'classnames'

import Map from './../Map'
import Icon from './../Icon'
import CONSTANTS from './../../../constants'
import { dateUtils } from '../../../common'

import styles from './extended-map.module.scss'
import constants from './../../../constants'

export const IconFactory = (locationProps, assetsUrl) => {
  const timerId = React.useRef(null)
  if (
    !locationProps ||
    !locationProps.location ||
    !locationProps.location.recorded_at
  )
    return
  const { location } = locationProps
  const age =
    Number(dateUtils.formatDate(undefined, 'X')) -
    Number(dateUtils.formatDate(location.recorded_at, 'X'))

  const bearing = location && location.bearing
  let variant = bearing ? 'live-direction' : 'live'
  const style = {
    transform: `rotate(${bearing || 0}deg)`,
    filter: `drop-shadow(0 0 1px #333)`,
    margin: variant === 'live-direction' ? '-6px 0 0 -6px' : '-5px 0 0 -5px'
  }
  let className = ''
  if (locationProps && locationProps.device_status) {
    if (locationProps.device_status !== CONSTANTS.movementStatus.active) {
      variant = 'offline'
    } else {
      className = classNames(styles.mapMarker, styles[variant], {
        [styles.startAnimation]: age < 60
      })

      //TODO: Don't add animation to outage events
      const marker = document.getElementsByClassName(styles.mapMarker)[0]
      if (age < 60) {
        if (marker)
          marker.className = classNames(
            styles.mapMarker,
            styles[variant],
            styles.startAnimation
          )
      } else {
        if (timerId && timerId.current) clearTimeout(timerId.current)
        if (marker)
          timerId.current = setTimeout(() => {
            marker.className = classNames(styles.mapMarker, styles[variant])
          }, (60 - age) * 1000)
        console.log(`Scheduled kill animation at `, (60 - age) * 1000)
      }
    }
  }
  return (
    <Icon
      assetsurl={assetsUrl}
      style={style}
      className={className}
      variant={variant}
      height={variant === 'live-direction' ? 24 : 22}
    />
  )
}

const trailIcon = assetsUrl => (
  <Icon
    assetsurl={assetsUrl}
    style={{
      filter: `drop-shadow(0 0 1px #333)`,
      marginLeft: '-1px',
      marginTop: '-1px'
    }}
    className={classNames(styles.mapMarker, styles.live)}
    variant="live"
    height={16}
  />
)

const ExtendedMap = ({
  assetsUrl,
  locationProps,
  panToCenter,
  follow,
  lastLocationEvents,
  selectedMapLayerState
}) => {
  const { location, device_status } = locationProps
  // health, lastActivity
  const currentEventLocation =
    location && location.geometry ? location.geometry.coordinates : null
  const icon = IconFactory(locationProps, assetsUrl)
  const accuracy =
    device_status === constants.movementStatus.active && location
      ? location.accuracy || location.location_accuracy
      : null
  const trail = constants.movementStatus.active
    ? lastLocationEvents.slice(0, constants.map.numberOfEventsIntrail)
    : []
  return (
    <div className={classNames(styles.liveLocation, styles.container)}>
      <Map
        center={currentEventLocation || CONSTANTS.HT_SF}
        markerPosition={currentEventLocation}
        markerIcon={icon}
        panToCenter={panToCenter}
        follow={follow}
        accuracy={accuracy}
        selectedMapLayerState={selectedMapLayerState}
        trail={trail}
        trailIcon={trailIcon(assetsUrl)}
      />
    </div>
  )
}

export default ExtendedMap
