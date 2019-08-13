import React from 'react'
import PropTypes from 'prop-types'

import CONSTANTS from './../../../constants'

const batteryEvents = CONSTANTS.htEvent.battery

const Icon = props => {
  return (
    <img
      onClick={props.onClick}
      height={props.height}
      src={`${props.assetsurl || CONSTANTS.assetsUrl}${props.variant}.svg`}
      onError={e => {
        e.target.onerror = null
        e.target.src = `${CONSTANTS.assetsUrl}${props.variant}.svg`
      }}
      alt={props.variant}
      id={props.id}
      className={props.className || ''}
      hidden={props.hidden}
      style={props.style}
      {...props}
    />
  )
}

Icon.defaultProps = {
  height: 32,
  variant: 'hint'
}

Icon.propTypes = {
  assetsUrl: PropTypes.string,
  variant: PropTypes.oneOf([
    'amex',
    'android',
    'apple',
    'arrow-down',
    'arrow-up',
    'back-left',
    'card',
    'caret-down',
    'chat',
    'checked',
    'code',
    'code-white',
    'combined-shape',
    'copy',
    'copy-white',
    'cross',
    'cross-white',
    'crosshair',
    'crosshair-green',
    'cycle',
    'custom',
    'default-card',
    'default-layer',
    'disconnected',
    'diners-club',
    'discover',
    'docs',
    'dots-menu',
    'download',
    'drive',
    'edit',
    'email',
    'error',
    'filter',
    'filter-green',
    'flight',
    'hint',
    'history',
    'hypertrack-bw',
    'info',
    'key',
    'layers',
    'left',
    'live',
    'live-direction',
    'loading',
    'logout',
    'low_power_mode_on',
    'mastercard',
    'menu',
    'minus',
    'navigate',
    'notification',
    'offline',
    'paused',
    'permission-denied',
    'plus',
    'profile',
    'react',
    'retry',
    'right',
    'run',
    'satellite',
    'settings',
    'search',
    'share',
    'slack',
    'sort',
    'sort-active',
    'speed',
    'stop',
    'street',
    'unknown',
    'visa',
    'walk',
    'warning',
    ...Object.values(batteryEvents).map(b => b.replace('.', '_'))
  ]).isRequired,
  height: PropTypes.number.isRequired
}

export default Icon
