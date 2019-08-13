import APP_CONSTANTS from './app_constants.json'
import CONSTANTS from './constants.production.json'

const { NODE_ENV, REACT_APP_ENV } = process.env
const env = REACT_APP_ENV || NODE_ENV || 'development'

// function noop() {}

if (APP_CONSTANTS.liveEnvs.includes(env)) {
  // console.log = noop
  // console.warn = noop
  // console.table = noop
} else {
  console.log('Loading environment variables for:', env)
}

const outageIconMap = {
  [APP_CONSTANTS.htEvent.location.permission_not_requested]: 'paused',
  [APP_CONSTANTS.htEvent.location.permission_denied]: 'paused',
  [APP_CONSTANTS.htEvent.location.disabled]: 'paused',
  [APP_CONSTANTS.htEvent.activity.permission_not_requested]: 'paused',
  [APP_CONSTANTS.htEvent.activity.permission_denied]: 'paused',
  [APP_CONSTANTS.htEvent.activity.not_supported]: 'paused',
  [APP_CONSTANTS.htEvent.activity.disabled]: 'paused',
  [APP_CONSTANTS.htEvent.network.disconnect]: 'device-disconnected',
  [APP_CONSTANTS.htEvent.outage.paused]: 'paused',
  [APP_CONSTANTS.htEvent.outage.denied]: 'paused',
  [APP_CONSTANTS.htEvent.outage.disabled]: 'paused',
  [APP_CONSTANTS.htEvent.outage.general]: 'paused',
  [APP_CONSTANTS.htEvent.outage.hardware]: 'paused',
  [APP_CONSTANTS.htEvent.outage.software]: 'paused'
}

const outageMessageMap = {
  [APP_CONSTANTS.htEvent.location.permission_not_requested]:
    'Location permission not requested',
  [APP_CONSTANTS.htEvent.location.permission_denied]:
    'Location permission denied',
  [APP_CONSTANTS.htEvent.location.disabled]: 'Location disabled',
  [APP_CONSTANTS.htEvent.activity.permission_not_requested]:
    'Activity permission not requested',
  [APP_CONSTANTS.htEvent.activity.permission_denied]:
    'Activity permission denied',
  [APP_CONSTANTS.htEvent.activity.not_supported]: 'Activity not supported',
  [APP_CONSTANTS.htEvent.activity.disabled]: 'Activity disabled',
  [APP_CONSTANTS.htEvent.network.disconnected]: 'Device disconnected',
  [APP_CONSTANTS.htEvent.outage.paused]: 'Tracking paused',
  [APP_CONSTANTS.htEvent.outage.stopped]: 'Tracking stopped',
  [APP_CONSTANTS.htEvent.outage.denied]: 'Permissions denied',
  [APP_CONSTANTS.htEvent.outage.disabled]: 'Tracking disabled',
  [APP_CONSTANTS.htEvent.outage.general]: 'Outage',
  [APP_CONSTANTS.htEvent.outage.hardware]:
    'Tracking outage due to hardware failure',
  [APP_CONSTANTS.htEvent.outage.software]:
    'Tracking outage due to software failure',
  [APP_CONSTANTS.htEvent.resumption.software]:
    'Tracking resumed after software failure',
  [APP_CONSTANTS.htEvent.resumption.hardware]:
    'Tracking resumed after hardware failure',
  [APP_CONSTANTS.htEvent.resumption.started]: 'Tracking started by app'
}

const statusMessageMap = {
  [APP_CONSTANTS.htEvent.battery.back_to_normal]: 'Battery back to normal',
  [APP_CONSTANTS.htEvent.battery.charging]: 'Battery charging',
  [APP_CONSTANTS.htEvent.battery.discharging]: 'Battery discharging',
  [APP_CONSTANTS.htEvent.battery.low]: 'Battery low',
  [APP_CONSTANTS.htEvent.battery.low_power_mode_off]: 'Low power mode off',
  [APP_CONSTANTS.htEvent.battery.low_power_mode_on]: 'Low power mode on',
  [APP_CONSTANTS.htEvent.network.disconnected]: 'Network disconnected',
  [APP_CONSTANTS.htEvent.network.reconnected]: 'Network reconnected'
}

const usTimeZones = {
  'America/Anchorage': true,
  'America/Boise': true,
  'America/Chicago': true,
  'America/Denver': true,
  'America/Detroit': true,
  'America/Indiana/Indianapolis': true,
  'America/Indiana/Knox': true,
  'America/Indiana/Marengo': true,
  'America/Indiana/Petersburg': true,
  'America/Indiana/Tell_City': true,
  'America/Indiana/Vevay': true,
  'America/Indiana/Vincennes': true,
  'America/Indiana/Winamac': true,
  'America/Juneau': true,
  'America/Kentucky/Louisville': true,
  'America/Kentucky/Monticello': true,
  'America/Los_Angeles': true,
  'America/Menominee': true,
  'America/Metlakatla': true,
  'America/New_York': true,
  'America/Nome': true,
  'America/North_Dakota/Beulah': true,
  'America/North_Dakota/Center': true,
  'America/North_Dakota/New_Salem': true,
  'America/Phoenix': true,
  'America/Sitka': true,
  'America/Yakutat': true,
  'Pacific/Honolulu': true
}

export default {
  outageIconMap,
  outageMessageMap,
  statusMessageMap,
  usTimeZones,
  ...APP_CONSTANTS,
  ...CONSTANTS
}
