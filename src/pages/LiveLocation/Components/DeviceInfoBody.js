import React from 'react'
import classNames from 'classnames'

import { InPlaceLoader, CopyIcon } from './../../Generic'
import { utils, dateUtils } from './../../../common'

import styles from './DeviceInfoBody.module.scss'

const DeviceInfoBody = props => {
  const {
    deviceInfoData,
    deviceInfoLoading,
    deviceInfoError,
    // isWidget,
    // isTrackingLink,
    // routerLocation
  } = props

  const {
    appName,
    appPackageName,
    appVersionString,
    appVersionNumber,
    appVersion,
    deviceBrand,
    deviceModel,
    networkOperator,
    osName,
    osVersion,
    playServicesVersion,
    sdkVersion,
    timezone,
    recordedAt,
    hasPlayServices
  } =
    deviceInfoLoading || deviceInfoError || !deviceInfoData
      ? {}
      : deviceInfoData

  console.log('has', hasPlayServices)

  let body = null
  if (deviceInfoLoading) body = <InPlaceLoader />
  if (deviceInfoError)
    body = <div className={styles.error}>Couldn't fetch device details</div>
  if (deviceInfoData)
    body = (
      <>
        <div className={classNames(styles.deviceInfoField, styles.fullwidth)}>
          <div className={classNames(styles.label, styles.accomodateIcon)}>
            Device ID
          </div>
          <div className={classNames(styles.value, styles.accomodateIcon)}>
            {props.deviceId || 'Unknown'}
          </div>
          <CopyIcon dataToCopy={props.deviceId} />
        </div>
        <div className={styles.deviceInfoField}>
          <div className={styles.label}>Brand</div>
          <div className={styles.value}>{deviceBrand || 'Unknown'}</div>
        </div>
        <div className={styles.deviceInfoField}>
          <div className={styles.label}>Model</div>
          <div className={styles.value}>{deviceModel || 'Unknown'}</div>
        </div>
        <div className={styles.deviceInfoField}>
          <div className={styles.label}>Network</div>
          <div className={styles.value}>{networkOperator || 'Unknown'}</div>
        </div>
        <div className={styles.deviceInfoField}>
          <div className={styles.label}>Timezone</div>
          <div className={styles.value}>
            {utils.formatTimezone(timezone) || 'Unknown'}
          </div>
        </div>
        <div className={styles.deviceInfoField}>
          <div className={styles.label}>OS</div>
          <div className={styles.value}>
            {`${osName || ''} ${osVersion || ''}` || 'Unknown'}
          </div>
        </div>
        <div className={styles.deviceInfoField}>
          <div className={styles.label}>App package name</div>
          <div className={styles.value}>
            {appName || appPackageName || 'Unknown'}
          </div>
        </div>
        <div className={styles.deviceInfoField}>
          <div className={styles.label}>App version</div>
          <div className={styles.value}>
            {appVersionString || appVersion || 'Unknown'}{' '}
            {appVersionNumber === undefined || appVersionNumber === null
              ? ''
              : `(${appVersionNumber})`}
          </div>
        </div>
        <div className={styles.deviceInfoField}>
          <div className={styles.label}>SDK version</div>
          <div className={styles.value}>{sdkVersion || 'Unknown'}</div>
        </div>
        <div className={styles.deviceInfoField}>
          <div className={styles.label}>Created at</div>
          <div className={styles.value}>
            {dateUtils.formatDate(
              new Date(recordedAt),
              `Do MMM 'YY, hh:mm A`
            ) || 'Unknown'}
          </div>
        </div>
        {!playServicesVersion ? null : (
          <div className={styles.deviceInfoField}>
            <div className={styles.label}>Play services</div>
            <div className={styles.value}>{playServicesVersion}</div>
          </div>
        )}
      </>
    )

  return (
    <div className={styles.deviceInfoContainer}>
      <div className={styles.headerRow}>
        <div className={styles.miniHeader}>Device Info</div>
      </div>
      {body}
    </div>
  )
}

export default DeviceInfoBody
