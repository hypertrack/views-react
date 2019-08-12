import React from 'react'
import { Icon } from './../../Generic'

import CONSTANTS from './../../../constants'

import styles from './DeviceList.module.scss'

const DeviceCard = ({
  assetsUrl,
  device,
  setSelectedDeviceId,
  setIsTooltipsShown,
  isTooltipsShown,
  isWidget,
  onClickHandler
}) => {
  let variant
  if (device.device_status === CONSTANTS.movementStatus.active) {
    variant =
      device.activity && device.activity.data
        ? device.activity.data.value
        : 'unknown'
  } else if (device.device_status === CONSTANTS.movementStatus.inactive)
    variant = 'paused'
  else variant = 'device-disconnected'
  return (
    <div
      className={styles.deviceItemContainer}
      onClick={e => {
        e.target.parentElement.parentElement.parentElement.parentElement.parentElement.scrollTop = 0
        setSelectedDeviceId(device.device_id)
        if (onClickHandler) {
          onClickHandler(false)
        }
      }}
    >
      <Icon
        assetsurl={assetsUrl}
        variant={variant}
        className={styles.activityItem}
      />
      <div className={styles.deviceDetail}>
        {device.name || device.device_id}
      </div>
    </div>
  )
}
export default DeviceCard
