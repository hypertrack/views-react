import React from 'react'
import classNames from 'classnames'

import { Icon, Battery, DeviceInfoIcon } from './../../Generic'
import { batteryStates } from './../../Generic/Battery/Battery'
import { dateUtils, hooks } from './../../../common'
import CONSTANTS from './../../../constants'

import styles from './CardHeader.module.scss'
import { When, If } from 'react-if'

const activityIcon = (connectionStatus, locationProps, loading, assetsUrl) => {
  var variant
  if (locationProps && locationProps.device_status) {
    const activityData = locationProps.activity
    if (locationProps.device_status === CONSTANTS.movementStatus.active) {
      variant =
        activityData && activityData.value && activityData.value
          ? activityData.value
          : 'unknown'
    } else if (
      locationProps.device_status === CONSTANTS.movementStatus.inactive
    ) {
      variant = 'paused'
    } else {
      variant = 'device-disconnected'
    }
  } else {
    variant = 'device-disconnected'
  }
  return (
    <div
      className={classNames(styles.verticalMiddle, {
        [styles.loadingContent]: loading && !connectionStatus
      })}
    >
      <Icon assetsurl={assetsUrl} variant={variant} height={24} />
    </div>
  )
}

const getDeviceConnectionStatus = ({ health }) => {
  if (health && (health.value || health.hint)) {
    return (
      CONSTANTS.outageMessageMap[health.hint] ||
      CONSTANTS.outageMessageMap[health.value] ||
      ''
    )
  }
}

const getBatteryStatus = ({ health }) => {
  if (health && health.hint && batteryStates.includes(health.hint)) {
    return health.hint
  }
  return null
}

const CardHeader = props => {
  const {
    assetsUrl,
    isTrackingLink,
    setSelectedDeviceForSingleDeviceView
  } = props
  const {
    deviceInfoData,
    deviceInfoLoading,
    deviceInfoError,
    recorded_at,
    handleDeviceInfoChange,
    deviceId,
    locationProps,
    showDeviceInfo,
    speed
  } = props.deviceInfo
  const { name } =
    deviceInfoError || deviceInfoLoading || !deviceInfoData
      ? {}
      : deviceInfoData
  const [updatedAt, updateUpdatedAt] = React.useState(
    deviceInfoLoading
      ? ''
      : recorded_at
      ? 'Updated ' + dateUtils.relativeDistance(new Date(), recorded_at)
      : 'Unknown last location'
  )
  const handleUpdateChange = () =>
    updateUpdatedAt(
      recorded_at
        ? 'Updated ' + dateUtils.relativeDistance(new Date(), recorded_at)
        : 'Unknown last location'
    )
  const headerText =
    !deviceInfoError && !deviceInfoLoading
      ? name || deviceId
      : deviceInfoError
      ? deviceId
      : ''

  const timeZone =
    deviceInfoData && deviceInfoData.timezone ? deviceInfoData.timezone : ''
  const parsedSpeed =
    speed && speed > 0
      ? CONSTANTS.usTimeZones[timeZone]
        ? Math.round(speed * 2.23694) + ' mph'
        : Math.round(speed * 3.6) + ' kph'
      : null

  const loadingContent = {
    [styles.loadingContent]: deviceInfoLoading
  }

  hooks.UseTimer(handleUpdateChange)

  const connectionStatus = getDeviceConnectionStatus(locationProps)
  const batteryStatus = getBatteryStatus(locationProps)
  // const outageMessage = outageMessageMap[connectionStatus]
  return (
    <div className={styles.deviceCardContainer}>
      <div className={styles.deviceCardContent}>
        <If condition={!isTrackingLink}>
          <Icon
            assetsurl={assetsUrl}
            variant="back-left"
            onClick={
              () => setSelectedDeviceForSingleDeviceView(null)
              // isWidget && routerLocation && routerLocation.search
              // ? navigate(`/devices${routerLocation.search}`)
              // : navigate('/devices')
              // window.history.length > 2
              //   ? window.history.back(-1)
              //   : navigate(
              //       `/devices${
              //         routerLocation && routerLocation.search
              //           ? routerLocation.search
              //           : ''
              //       }`
              //     )
            }
          />
        </If>
        {activityIcon(
          connectionStatus,
          locationProps,
          deviceInfoLoading,
          assetsUrl
        )}
        <div className={styles.deviceCardInfo}>
          <div
            className={classNames(styles.deviceCardTimeStamp, loadingContent)}
          >
            {updatedAt}
          </div>
          <div className={styles.deviceIdInfoContainer}>
            <div className={classNames(styles.headerText, loadingContent)}>
              {headerText}
            </div>
            <div
              className={styles.deviceInfoIcon}
              onClick={() => handleDeviceInfoChange(!showDeviceInfo)}
            >
              <DeviceInfoIcon showCloseIcon={showDeviceInfo} />
            </div>
          </div>
          <div className={classNames(loadingContent)}>
            <When condition={Boolean(connectionStatus)}>
              <div className={styles.outageMessage}>{connectionStatus}</div>
            </When>
          </div>
        </div>
        <div className={styles.deviceMeta}>
          <div
            className={classNames(styles.metaItemBattery, {
              [styles.dontShow]: !batteryStatus
            })}
          >
            <Battery state={batteryStatus} />
          </div>
          <div
            className={classNames(styles.metaItemSpeed, {
              [styles.dontShow]: !parsedSpeed
            })}
          >
            <Icon assetsurl={assetsUrl} variant="speed" />
            <div className={styles.speedValue}>{parsedSpeed}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CardHeader
