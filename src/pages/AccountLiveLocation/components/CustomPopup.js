import React from 'react'
import { dateUtils } from './../../../common'
import constants from '../../../constants'

const getOutageMessage = (val = '') => constants.outageMessageMap[val]

export const customPopup = (
  id,
  device_status,
  location,
  activity,
  name,
  reversedCoordinates,
  healthData
) => (
  <div className="accountLiveLocationPopupBody">
    <table className="popupTable">
      <thead>
        <th colSpan="3">{name ? name : id.substring(0, 15) + '...'}</th>
      </thead>
      <tbody>
        <tr className="popupTableRow">
          <td className="popupTableRowHeader">Status</td>
          <td className="emptyCell" />
          <td className="popupTableRowContent">{device_status}</td>
        </tr>
        {device_status === constants.movementStatus.inactive ? (
          <tr className="popupTableRow">
            <td className="popupTableRowHeader">Outage</td>
            <td className="emptyCell" />
            <td className="popupTableRowContent error">
              {getOutageMessage(
                healthData ? healthData.value || healthData.hint : ''
              )}
            </td>
          </tr>
        ) : null}
        <tr className="popupTableRow">
          <td className="popupTableRowHeader">Activity</td>
          <td className="emptyCell" />
          <td className="popupTableRowContent">
            {activity && activity.data ? activity.data.value : 'unknown'}
          </td>
        </tr>
        <tr className="popupTableRow">
          <td className="popupTableRowHeader">Recorded</td>
          <td className="emptyCell" />
          <td className="popupTableRowContent">
            {dateUtils.getDistanceToNow(location.recorded_at) + ' ago'}
          </td>
        </tr>
        <tr className="popupTableRow">
          <td className="popupTableRowHeader">Altitude</td>
          <td className="emptyCell" />
          <td className="popupTableRowContent">
            {location.data.altitude
              ? Math.round(location.data.altitude) + 'm'
              : 'unknown'}
          </td>
        </tr>
        <tr className="popupTableRow">
          <td className="popupTableRowHeader">Bearing</td>
          <td className="emptyCell" />
          <td className="popupTableRowContent">
            {location.data.bearing
              ? Math.round(location.data.bearing) + 'deg'
              : '-'}
          </td>
        </tr>
        <tr className="popupTableRow">
          <td className="popupTableRowHeader">Speed</td>
          <td className="emptyCell" />
          <td className="popupTableRowContent">
            {Math.round(location.data.speed)}mph
          </td>
        </tr>
        <tr className="popupTableRow">
          <td className="popupTableRowHeader">Location</td>
          <td className="emptyCell" />
          <td className="popupTableRowContent">
            {reversedCoordinates[0].toFixed(3)},{' '}
            {reversedCoordinates[1].toFixed(3)}
          </td>
        </tr>
        <tr className="popupTableRow">
          <td className="popupTableRowHeader">Accuracy</td>
          <td className="emptyCell" />
          <td className="popupTableRowContent">
            upto{' '}
            {Math.round(
              location.data.accuracy || location.data.location_accuracy
            )}
            m
          </td>
        </tr>
      </tbody>
    </table>
    <div className="copyContainer" />
  </div>
)
