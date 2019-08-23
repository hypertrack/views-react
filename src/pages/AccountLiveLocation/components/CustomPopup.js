import React from 'react'
import { dateUtils, utils } from './../../../common'
import CONSTANTS from '../../../constants'

const getOutageMessage = (device_status, inactiveReason) =>
  CONSTANTS.newMovementStatusMessage[device_status] ||
  CONSTANTS.newMovementStatusMessage[
    inactiveReason.reason ? inactiveReason.reason : 'unknown'
  ]

const fixCoordinates = val => (val ? val.toFixed(3) : 'Unknown')

export const customPopup = (
  id,
  device_status,
  location,
  name,
  timezone,
  reversedCoordinates,
  notActivePayload
) => {
  return (
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
          {device_status !== CONSTANTS.movementStatus.active ? (
            <tr className="popupTableRow">
              <td className="popupTableRowHeader">Outage</td>
              <td className="emptyCell" />
              <td className="popupTableRowContent error">
                {getOutageMessage(device_status, notActivePayload)}
              </td>
            </tr>
          ) : null}
          <tr className="popupTableRow">
            <td className="popupTableRowHeader">Activity</td>
            <td className="emptyCell" />
            <td className="popupTableRowContent">
              {device_status.active ? device_status.active.activity : 'unknown'}
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
              {location.altitude
                ? Math.round(location.altitude) + 'm'
                : 'unknown'}
            </td>
          </tr>
          <tr className="popupTableRow">
            <td className="popupTableRowHeader">Bearing</td>
            <td className="emptyCell" />
            <td className="popupTableRowContent">
              {location.bearing ? Math.round(location.bearing) + 'deg' : '-'}
            </td>
          </tr>
          <tr className="popupTableRow">
            <td className="popupTableRowHeader">Speed</td>
            <td className="emptyCell" />
            <td className="popupTableRowContent">
              {utils.convertSpeed(location.speed, timezone)}
            </td>
          </tr>
          <tr className="popupTableRow">
            <td className="popupTableRowHeader">Location</td>
            <td className="emptyCell" />
            <td className="popupTableRowContent">
              {fixCoordinates(reversedCoordinates[0])},{' '}
              {fixCoordinates(reversedCoordinates[1])}
            </td>
          </tr>
          <tr className="popupTableRow">
            <td className="popupTableRowHeader">Accuracy</td>
            <td className="emptyCell" />
            <td className="popupTableRowContent">
              upto {Math.round(location.accuracy || location.location_accuracy)}
              m
            </td>
          </tr>
        </tbody>
      </table>
      <div className="copyContainer" />
    </div>
  )
}
