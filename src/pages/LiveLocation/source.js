import React from 'react'

import { utils } from '../../common'
import CONSTANTS from './../../constants'

import styles from './Components/ErrorState.module.scss'

export const parseDeviceInfo = ({ data, ...rest }) => {
  let obj = { ...rest }
  if (data && typeof data == 'string')
    obj = Object.assign(obj, { ...JSON.parse(data) })

  return utils.rectifyCase(obj)
}

const parseRawEvent = rawEvent => {
  if (!rawEvent) return rawEvent
  const { data, recorded_at } = rawEvent
  try {
    let rest = {}
    if (typeof data === 'string') {
      const _1stParsePass = JSON.parse(data)
      if (typeof _1stParsePass === 'string') rest = JSON.parse(_1stParsePass)
      else if (typeof _1stParsePass === 'object') rest = _1stParsePass
    }
    if (rest.location) {
      rest.coordinates = rest.location.coordinates.reverse()
      delete rest.location
    }
    return {
      recorded_at,
      ...rest
    }
  } catch (err) {
    return rawEvent
  }
}

export const parseDeviceStatusResponse = deviceStatus => {
  try {
    return {
      ...deviceStatus,
      [CONSTANTS.htEvent.health.change]: parseRawEvent(
        deviceStatus[CONSTANTS.htEvent.health.change]
      ),
      [CONSTANTS.htEvent.location.change]: parseRawEvent(
        deviceStatus[CONSTANTS.htEvent.location.change]
      ),
      [CONSTANTS.htEvent.activity.change]: parseRawEvent(
        deviceStatus[CONSTANTS.htEvent.activity.change]
      )
    }
  } catch (err) {
    console.log(err)
    return {}
  }
}

export const ErrorState = ({ error, empty }) => (
  <div className={styles.errorMessage}>
    <p>Could not get the latest location</p>
    <p>
      We are facing issues trying to get the latest location for this device. In
      case you are seeing this issue multiple times, please reach out to our
      team on{' '}
      <a href="https://join.slack.com/t/hypertracksupport/shared_invite/enQtNDA0MDYxMzY1MDMxLWFlMmNkYmYxOTA4OTZiNTkxOTBiY2FmYjdiMWY1NWUwYWFlYjNhNmFiNTYxYWZhNDg3Mzg2NWJiYjc4NzEzNDE">
        {' '}
        Slack Support
      </a>
    </p>
    <img
      src={`${process.env.PUBLIC_URL}/assets/error.png`}
      alt={'Could not get the latest location'}
    />
  </div>
)
