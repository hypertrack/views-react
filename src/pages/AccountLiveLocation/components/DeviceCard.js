import React from 'react'
import { Icon } from './../../Generic'
import { utils } from './../../../common'

import styles from './DeviceList.module.scss'

const DeviceCard = ({
  assetsUrl,
  device,
  setSelectedDeviceId,
  setIsTooltipsShown,
  isWidget,
  onClickHandler
}) => {
  const variant = utils.getIconVariant(device)
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
