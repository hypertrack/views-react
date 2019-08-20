import {
  distanceInWordsStrict,
  distanceInWordsToNow,
  format,
  isAfter,
  isBefore,
  isDate,
  getYear,
  getMonth,
  addMonths,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  differenceInCalendarDays
} from 'date-fns'
// const { formatToTimeZone } = require('date-fns-timezone')

const relativeDistanceOptions = {
  includeSeconds: true,
  addSuffix: true
}

const initDate = dateObj => (isDate(dateObj) ? dateObj : new Date(dateObj))

const relativeDistance = (date1, date2, options = relativeDistanceOptions) => {
  date1 = initDate(date1)
  date2 = initDate(date2)
  return distanceInWordsStrict(date1, date2, options)
}

const formatDate = (date = new Date(), expectedFormat = `MMM D 'YY, HH:mm`) =>
  format(date, expectedFormat)

// const fixTimeZone = timeZone =>
//   timeZone && timeZone.includes(' ') ? timeZone.split(' ').join('_') : timeZone

// const formatDateWithTz = (
//   date = new Date(),
//   expectedFormat = `MMM D 'YY, HH:mm`,
//   timeZone
// ) => {
//   if (timeZone)
//     return formatToTimeZone(date, expectedFormat, {
//       timeZone: fixTimeZone(timeZone)
//     })
//   console.error('Timezone missing')
//   return formatDate(date, expectedFormat)
// }

//Is the first date before the second one ?
const isDateBefore = (beforeDate = new Date(), afterDate = new Date()) => {
  const date1 = initDate(beforeDate)
  const date2 = initDate(afterDate)
  return isBefore(date1, date2)
}

//Is the first date after the second one ?
const isDateAfter = (afterDate = new Date(), beforeDate = new Date()) => {
  const date1 = initDate(afterDate)
  const date2 = initDate(beforeDate)
  return isAfter(date1, date2)
}

const getDistanceToNow = date => distanceInWordsToNow(date)

const getNextMonthFirstDate = () => {
  const year = getYear(new Date())
  const month = getMonth(new Date())
  return addMonths(new Date(year, month, 1), 1)
}

const getMonthExtremeties = (date = new Date()) => {
  const providedDate = initDate(date)
  const startMonth = startOfMonth(providedDate)
  const endMonth = endOfMonth(providedDate)
  return { startMonth, endMonth }
}

const getWeekStartDate = (date = new Date(), weekStartsOn = 0) => {
  const providedDate = initDate(date)
  return startOfWeek(providedDate, { weekStartsOn })
}

const getDurationFromSecondsToHours = seconds => {
  const d = Number(seconds)
  const h = Math.floor(d / 3600)
  const m = Math.floor((d % 3600) / 60)

  const hDisplay = h > 0 ? h + ' hr ' : ''
  const mDisplay = m > 0 ? m + ' min ' : ''
  return (hDisplay + mDisplay).trim()
}

const diffInDays = (recentDate = new Date(), pastDate = new Date()) => {
  const date1 = initDate(recentDate)
  const date2 = initDate(pastDate)
  return differenceInCalendarDays(date1, date2)
}

export default {
  relativeDistance,
  formatDate,
  // formatDateWithTz,
  getDistanceToNow,
  isDateBefore,
  isDateAfter,
  getNextMonthFirstDate,
  getMonthExtremeties,
  getDurationFromSecondsToHours,
  getWeekStartDate,
  diffInDays
}
