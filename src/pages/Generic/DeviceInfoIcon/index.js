import React from 'react'
import Icon from './../Icon'
import classNames from 'classnames'

import styles from './deviceInfoIcon.module.scss'

const DeviceInfoIcon = ({ showCloseIcon }) => {
  return (
      <div
        className={classNames(styles.deviceInfoIcon, {
          [styles.openDeviceInfo]: showCloseIcon
        })}
      >
        <Icon variant={showCloseIcon ? 'cross-white' : 'info'} />
      </div>
  )
}

DeviceInfoIcon.defaultProps = {
  showCloseIcon: false
}

export default DeviceInfoIcon
