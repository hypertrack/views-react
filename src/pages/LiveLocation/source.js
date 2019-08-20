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

export const ErrorState = ({ error, empty, assetsUrl }) => (
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
      src={`${CONSTANTS.assetsUrl}error.png`}
      alt={'Could not get the latest location'}
    />
  </div>
)
