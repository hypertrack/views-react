import copy from 'copy-text-to-clipboard'
import CONSTANTS from './../constants'

const getAnimationDuration = (
  age,
  inputFrameSet = CONSTANTS.animation.inputFrameSet,
  animationFrameSet = CONSTANTS.animation.animationFrameSet
) => {
  /**
   * Current Animation Chart
   * Event Age      0s     1m
   * Event Age(s)   0      50
   * aniDuration        1       null
   */
  let animationDuration = animationFrameSet[animationFrameSet.length]
  //intentionally initialized to null
  for (let i = 1; i < inputFrameSet.length; i++) {
    const base = inputFrameSet[i - 1]
    const ceil = inputFrameSet[i]
    if (base <= age && age < ceil) {
      animationDuration = animationFrameSet[i - 1]
      break
    }
  }
  return animationDuration
}

const copyToClipBoard = (str, showToastCallback) => {
  if (showToastCallback) showToastCallback('Copied to clipboard!')
  copy(str)
}

const validateUrl = url =>
  /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
    url
  )

// const validateEmail = email =>
//   /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
//     email
//   )

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
  CONSTANTS.sentryDSN && !window.location.hostname.includes('localhost')

const radians = degrees => (degrees * Math.PI) / 180

const degrees = radians => (radians * 180) / Math.PI

const bearingCalculate = ([lat1, long1], [lat2, long2]) => {
  const lat_1 = radians(lat1)
  const lat_2 = radians(lat2)
  const diffLong = radians(long2 - long1)
  const x = Math.sin(diffLong) * Math.cos(lat_2)
  const y =
    Math.cos(lat_1) * Math.sin(lat_2) -
    Math.sin(lat_1) * Math.cos(lat_2) * Math.cos(diffLong)
  let initial_bearing = Math.atan2(x, y)
  initial_bearing = degrees(initial_bearing)
  const compass_bearing = (initial_bearing + 360) % 360
  return Math.round(parseFloat(compass_bearing), 2)
}

const googlePolylineDecode = encoded => {
  let points = []
  let index = 0,
    len = encoded.length
  let lat = 0,
    lng = 0
  while (index < len) {
    let b,
      shift = 0,
      result = 0
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)

    let dlat = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lat += dlat
    shift = 0
    result = 0
    do {
      b = encoded.charAt(index++).charCodeAt(0) - 63
      result |= (b & 0x1f) << shift
      shift += 5
    } while (b >= 0x20)
    let dlng = (result & 1) !== 0 ? ~(result >> 1) : result >> 1
    lng += dlng
    points.push([lat / 1e5, lng / 1e5])
  }
  return points
}

export default {
  copyToClipBoard,
  getAnimationDuration,
  formatTimezone,
  validateUrl,
  bearingCalculate,
  checkIfSentry,
  rectifyCase,
  googlePolylineDecode
}
