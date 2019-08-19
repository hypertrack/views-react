import constants from './../constants'

const validateUrl = url =>
  /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    url
  )

const formatKeyName = key =>
  key.replace(/_/g, '-').replace(/-([a-z])/g, (m, w) => w.toUpperCase())

const rectifyCase = obj =>
  Object.keys(obj).reduce((acc, key) => {
    return {
      ...acc,
      [formatKeyName(key)]: obj[key]
    }
  }, {})

const formatTimezone = (timezone = '') => timezone.replace(/_/g, ' ')

const checkIfSentry = () =>
  constants.sentryDSN && !window.location.hostname.includes('localhost')

const formatAddress = address => {
  let originalAddress = address.split(',')
  originalAddress.length = originalAddress.length - 3
  const remainingParts = originalAddress.filter(Boolean)
  const parsedAddress = remainingParts.reduce(
    (parsedAddress, currentPart, index) => {
      return index < 2
        ? `${parsedAddress} ${currentPart}`
        : `${parsedAddress}, ${currentPart}`
    },
    ''
  )
  return parsedAddress || 'Unknown'
}

const getMinZoomLevel = elementId => {
  try {
    const clientWidth = document.getElementsByClassName(elementId)[0]
      .clientWidth
    const minZoom = clientWidth > 500 ? 3 : 1
    return minZoom
  } catch {
    return 3
  }
}

const convertSpeed = (speed, timezone) => {
  const { imperial, metric } = constants.distanceNotations.speed
  const isImperial = Boolean(constants.usTimeZones[timezone])
  return `${
    isImperial ? Math.round(speed * 2.23694) : Math.round(speed * 3.6)
  } ${isImperial ? imperial : metric}`
}

const convertDistance = (distance, timezone) => {
  const { imperial, metric } = constants.distanceNotations.distance
  const isImperial = Boolean(constants.usTimeZones[timezone])
  return `${
    isImperial
      ? (distance * 0.000621371).toFixed(1)
      : (distance * 0.001).toFixed(1)
  } ${isImperial ? imperial : metric}`
}

const encode_utf8 = s => unescape(encodeURIComponent(s))

const decode_utf8 = s => decodeURIComponent(escape(s))

const fixGeometry = geoWithAlt => {
  const [lat, lng] = geoWithAlt.coordinates
  const geometry = { ...geoWithAlt, coordinates: [lng, lat] }
  return { geometry }
}

const parseRoute = (route, status) => {
  if (!route && status === constants.tripStatus.active)
    console.error('Active trip with no route')
  if (!route) return null
  const { distance, remaining_duration, duration } = route
  const start_address = formatAddress(route.start_address)
  const end_address = formatAddress(route.end_address)
  const polyline = route.polyline.coordinates.map(([lat, lng]) => [lng, lat])
  return {
    distance,
    remaining_duration,
    duration,
    start_address,
    end_address,
    polyline
  }
}

const parseEstimate = (estimate, status) => {
  if (!estimate && status === constants.tripStatus.active)
    console.error('Active trip with no estimate')
  if (!estimate) return null
  const { arrive_at, reroutes_exceeded } = estimate
  const route = parseRoute(estimate.route, status)
  return {
    arrive_at,
    reroutes_exceeded,
    route
  }
}

const parseDestination = destination => {
  if (!destination) return null
  const { radius } = destination
  const geometry = fixGeometry(destination.geometry)
  return { radius, ...geometry }
}

//TODO: complete summary parser
const parseSummary = summary => summary

const parseTrip = trip => {
  if (!trip) return null
  const { trip_id, device_id, started_at, completed_at, status, views } = trip
  const summary = parseSummary(trip.summary)
  const estimate = parseEstimate(trip.estimate, status)
  const destination = parseDestination(trip.destination)
  return {
    trip_id,
    device_id,
    started_at,
    completed_at,
    status,
    estimate,
    destination,
    views,
    summary
  }
}

const parseMovementStatus = (device, oldDevice = {}) => {
  const { device_id, battery } = device
  const location = {
    ...device.location,
    ...fixGeometry(device.location.geometry)
  }
  const device_status = device.device_status.value
  const device_state = {
    [constants.movementStatus.active]: null,
    [constants.movementStatus.inactive]: null,
    [constants.movementStatus.disconnected]: null,
    [device_status]: device.device_status[device_status]
  }
  const trip = parseTrip(device.trip)
  return {
    ...device_state,
    device_id,
    location,
    device_status,
    battery,
    trip,
    name:
      device && device.device_info && device.device_info.name
        ? device.device_info.name
        : oldDevice.name,
    timezone:
      device && device.device_info && device.device_info.timezone
        ? device.device_info.timezone
        : oldDevice.timezone
  }
}

const iconVariantMap = {
  [constants.movementStatus.inactive]: 'inactive',
  [constants.movementStatus.disconnected]: 'disconnected'
}

const getIconVariant = ({ device_status, active }) =>
  iconVariantMap[device_status] || (active && active.activity) || 'unknown'

export default {
  formatTimezone,
  validateUrl,
  checkIfSentry,
  rectifyCase,
  formatAddress,
  getMinZoomLevel,
  convertSpeed,
  convertDistance,
  encode_utf8,
  decode_utf8,
  parseMovementStatus,
  getIconVariant
}
