import React from 'react'
import { Icon } from './../../Generic'
import styles from './live-device.module.scss'
import CONSTANTS from './../../../constants'

const EmptyState = () => {
  return (
    <div className={styles.emptyListCardContainer}>
      <span className={styles.mainMessage}>Let's get you started</span>
      <span className={styles.supportMessage}>
        Movement data is generated through the HyperTrack SDK integrated in your
        app.
      </span>
      <span className={styles.ctaLabel}>What platform is your app in ?</span>
      <div className={styles.ctaGroup}>
        <div
          className={styles.ctaItem}
          onClick={() =>
            window.open('https://github.com/hypertrack/quickstart-android')
          }
        >
          <Icon variant="android" height={22} />
          Android
        </div>
        <div
          className={styles.ctaItem}
          onClick={() =>
            window.open('https://github.com/hypertrack/quickstart-ios')
          }
        >
          <Icon variant="apple" height={22} />
          iOS
        </div>
        <div
          className={styles.ctaItem}
          onClick={() =>
            window.open('https://github.com/hypertrack/quickstart-react-native')
          }
        >
          <Icon variant="react" height={22} />
          React Native
        </div>
      </div>
      <img
        className={styles.emptyVector}
        src={CONSTANTS.assetsUrl + 'no-devices.png'}
        alt="no-devices"
      />
    </div>
  )
}

const ErrorState = () => {
  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContainerTitle}>
        Something went wrong on our end
      </div>
      <div className={styles.errorContainerSubtitle}>
        We are unable to get your list of devices as of now . In case you are
        seeing this issue multiple times, please reach out to our team on{' '}
        <a href="https://join.slack.com/t/hypertracksupport/shared_invite/enQtNDA0MDYxMzY1MDMxLWFlMmNkYmYxOTA4OTZiNTkxOTBiY2FmYjdiMWY1NWUwYWFlYjNhNmFiNTYxYWZhNDg3Mzg2NWJiYjc4NzEzNDE">
          {' '}
          Slack Support
        </a>
        .
      </div>
      <button
        className={styles.errorContainerButton}
        onClick={() => window.location.reload()}
      >
        <Icon variant="retry" className={styles.icon} />
        Retry
      </button>
      <div className={styles.errorContainerGraphic}>
        <img
          className={styles.errorVector}
          src={CONSTANTS.public_assets_url + 'graphic/error-uncle.svg'}
          alt="no-devices"
        />
      </div>
    </div>
  )
}

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
          src={CONSTANTS.assetsUrl + 'empty.svg'}
          alt="no-devices"
        />
      </div>
    </div>
  )
}

export { EmptyState, ErrorState, WrongKey }
