import React from 'react'
import classNames from 'classnames'
import Icon from './../Icon'

import styles from './mapCenterIcon.module.scss'

const MapCenterIcon = ({ assetsUrl, isCentered, isWidget, onClick }) => {
  return (
    <div
      className={classNames(styles.mapCenterIcon, {
        [styles.isWidget]: isWidget
      })}
      onClick={onClick}
    >
      <div className={styles.iconContainer}>
        <Icon
          assetsurl={assetsUrl}
          height={24}
          variant={isCentered ? 'crosshair-green' : 'crosshair'}
          className={styles.crossHairIcon}
        />
      </div>
    </div>
  )
}

export default MapCenterIcon
