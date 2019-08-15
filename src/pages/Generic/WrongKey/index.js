import React from 'react'
import CONSTANTS from './../../../constants'
import styles from './WrongKey.module.scss'

const WrongKey = ({ assetsUrl }) => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContainerTitle}>
        Invalid Publishable Key or Device ID provided
      </div>
      <div className={styles.errorContainerSubtitle}>
        Please verify your input.
        <br />
        You can use{' '}
        <a
          href={'https://dashboard.hypertrack.com/setup'}
          target="_blank"
          rel="noopener noreferrer"
        >
          HyperTrack Dashboard
        </a>{' '}
        for Publishable Key.
      </div>
      <div className={styles.errorContainerGraphic}>
        <img
          className={styles.errorVector}
          src={CONSTANTS.assetsUrl + 'empty.svg'}
          alt="no-devices"
        />
      </div>
    </div>
  )
}
export default WrongKey
