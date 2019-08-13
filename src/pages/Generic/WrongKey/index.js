import React from 'react'

import styles from './WrongKey.module.scss'

const WrongKey = () => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContainerTitle}>Invalid Publishable Key</div>
      <div className={styles.errorContainerSubtitle}>
        Invalid Publishable Key provided. Please ensure you used the key shown
        on your{' '}
        <a
          href={'https://dashboard.hypertrack.com/setup'}
          target="_blank"
          rel="noopener noreferrer"
        >
          {' '}
          HyperTrack Dashboard
        </a>
        .
      </div>
      <div className={styles.errorContainerGraphic}>
        <img
          className={styles.errorVector}
          src={process.env.PUBLIC_URL + '/assets/empty.svg'}
          alt="no-devices"
        />
      </div>
    </div>
  )
}
export default WrongKey
