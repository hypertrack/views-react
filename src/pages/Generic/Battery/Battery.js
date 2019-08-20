import React from 'react'
import PropTypes from 'prop-types'

import Icon from './../Icon'
import CONSTANTS from './../../../constants'

//Filter only for states we want to display. ie, remove discharging state, as it is the default state
export const batteryStates = [
  CONSTANTS.htEvent.battery.low,
  CONSTANTS.htEvent.battery.charging
  // CONSTANTS.htEvent.battery.discharging,
  // CONSTANTS.htEvent.battery.low_power_mode_on
]

const Battery = ({ assetsUrl, state }) => {
  if (batteryStates.includes(state)) {
    state = state.replace('.', '_')
    return <Icon assetsurl={assetsUrl} variant={state} />
  }
  return null
}

Battery.prototypes = {
  assetsUrl: PropTypes.string,
  state: PropTypes.oneOf(batteryStates)
}

export default Battery
