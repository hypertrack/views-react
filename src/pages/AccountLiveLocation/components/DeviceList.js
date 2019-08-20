import React, { useState, useEffect, useCallback } from 'react'
import classNames from 'classnames'
import { Accordion } from './../../Generic'
import CONSTANTS from './../../../constants'
import Search from './Search'
import Filter from './Filter'
import Sort from './Sort'
import DeviceCard from './DeviceCard'

import styles from './DeviceList.module.scss'

var deviceCardTimeout
//TODO clean up card coded values
const getDeviceStatusIconName = device => {
  const activity = device.activity.data ? device.activity : null
  const health = device.health.data ? device.health : null

  if (!activity && !health) return 'unknown'
  else if (!activity)
    return CONSTANTS.outageIconMap[health.data.value] || 'unknown'
  else if (!health) return activity.data.value

  if (new Date(activity.recorded_at) > new Date(health.recorded_at))
    return activity.data.value
  else return CONSTANTS.outageIconMap[health.data.value] || 'unknown'
}

const EndOfTheList = ({ name }) => {
  return (
    <div className={styles.endOfTheList}>--End of {name} devices list--</div>
  )
}

const EmptyList = ({ name }) => {
  return <div className={styles.emptyList}>--No {name} device found--</div>
}

const getStatusName = device =>
  device.device_status
    ? device.device_status
    : CONSTANTS.movementStatus.disconnected

const getDevicesByStatusAndFilters = (devices, selectedActivity) => {
  const list = devices.reduce(
    (devicesByStatus, device) => ({
      ...devicesByStatus,
      [getStatusName(device)]: [
        ...devicesByStatus[getStatusName(device)],
        device
      ]
    }),
    {
      active: [],
      inactive: [],
      disconnected: []
    }
  )
  if (!selectedActivity) {
    return list
  }
  list.active = list.active.filter(
    e =>
      e.activity &&
      e.activity.data &&
      e.activity.data.value === selectedActivity
  )
  return list
}

// <div
//   className={styles.actionFlight}
//   onTouchStart={e =>
//     setDeviceCardTimeout(device.device_id, setSelectedDeviceId, e)
//   }
//   onTouchEnd={e => clearDeviceCardTimeout(e)}
//   onClick={e =>
//     setDeviceCardTimeout(device.device_id, setSelectedDeviceId, e)
//   }
//   onMouseEnter={e =>
//     setDeviceCardTimeout(device.device_id, setSelectedDeviceId, e)
//   }
//   onMouseLeave={() => clearDeviceCardTimeout()}
// >
//   <Icon variant="flight" className={styles.actionCta} />
// </div>
// <Icon variant="forward-right" className={styles.actionCta} />

const DeviceList = props => {
  const { assetsUrl, devices, setSelectedDeviceId, isWidget } = props
  const [showDeviceList, updateShowDeviceList] = React.useState(true)
  const [selectedActivity, setSelectedActivity] = React.useState(null)
  const [filterDropDownOpen, setFilterDropDownOpen] = React.useState(false)
  const [isSorted, setIsSorted] = useState(false)

  useEffect(() => () => clearTimeout(deviceCardTimeout), [])

  const devicesByStatus = React.useMemo(
    () => getDevicesByStatusAndFilters(devices, selectedActivity),
    [devices, selectedActivity]
  )

  // const renderDeviceCard = device => (
  //   <DeviceCard
  //     device={device}
  //     onClickHandler={updateShowDeviceList}
  //     key={device.device_id}
  //     setSelectedDeviceId={setSelectedDeviceId}
  //     isWidget={isWidget}
  //   />
  // )
  const renderDeviceCard = useCallback(
    device => (
      <DeviceCard
        assetsUrl={assetsUrl}
        device={device}
        onClickHandler={updateShowDeviceList}
        key={device.device_id}
        setSelectedDeviceId={setSelectedDeviceId}
        isWidget={isWidget}
      />
    ),
    [isWidget, setSelectedDeviceId, assetsUrl]
  )

  const sortDevices = listToSort =>
    isSorted
      ? [...listToSort].sort((a, b) => {
          const deviceIdentifierA = a.props.device.name
            ? a.props.device.name
            : a.props.device.device_id
          const deviceIdentifierB = b.props.device.name
            ? b.props.device.name
            : b.props.device.device_id
          return deviceIdentifierA.localeCompare(deviceIdentifierB)
        })
      : listToSort

  const activeDevices = React.useMemo(
    () => devicesByStatus.active.map(device => renderDeviceCard(device)),
    [devicesByStatus.active, renderDeviceCard]
  )

  const inactiveDevices = React.useMemo(
    () => devicesByStatus.inactive.map(device => renderDeviceCard(device)),
    [devicesByStatus.inactive, renderDeviceCard]
  )

  const disconnectedDevices = React.useMemo(
    () => devicesByStatus.disconnected.map(device => renderDeviceCard(device)),
    [devicesByStatus.disconnected, renderDeviceCard]
  )

  const header = (
    <div className={styles.deviceListHeader}>
      Devices {devices.length ? `(${devices.length})` : ''}
      <span
        onClick={() => updateShowDeviceList(!showDeviceList)}
        className={styles.listVisibilityButton}
      >
        {showDeviceList ? 'See map' : 'See list'}
      </span>
    </div>
  )

  const getTitle = t => t + ' (' + devicesByStatus[t.toLowerCase()].length + ')'

  return (
    <div
      className={classNames(styles.deviceListCardContainer, {
        [styles.activeList]: showDeviceList,
        [styles.isWidget]: isWidget
      })}
    >
      {header}
      <div className={styles.searchAndFilterContainer}>
        <Search
          assetsUrl={assetsUrl}
          devices={devices}
          setSelectedDeviceId={setSelectedDeviceId}
          isWidget={isWidget}
          onClick={() => updateShowDeviceList(!showDeviceList)}
        />
        <Filter
          assetsUrl={assetsUrl}
          onClick={() => setFilterDropDownOpen(!filterDropDownOpen)}
          className={styles.filterButtonContainer}
          setSelectedActivity={setSelectedActivity}
          selectedActivity={selectedActivity}
          filterDropDownOpen={filterDropDownOpen}
          setFilterDropDownOpen={setFilterDropDownOpen}
        />
        <Sort
          assetsUrl={assetsUrl}
          setIsSorted={setIsSorted}
          isSorted={isSorted}
        />
      </div>
      <Accordion>
        <Accordion.AccordionItem
          title={getTitle('Active')}
          listName={'active'}
          active={true}
        >
          {sortDevices(activeDevices)}
          <div
            className={classNames(styles.deviceItemContainer, {
              [styles.message]: true
            })}
          >
            {!activeDevices.length ? (
              <EmptyList name={'active'} />
            ) : (
              <EndOfTheList name={'active'} />
            )}
          </div>
        </Accordion.AccordionItem>
        <Accordion.AccordionItem
          title={getTitle('Inactive')}
          listName={'inactive'}
        >
          {sortDevices(inactiveDevices)}
          <div
            className={classNames(styles.deviceItemContainer, {
              [styles.message]: true
            })}
          >
            {!inactiveDevices.length ? (
              <EmptyList name={'inactive'} />
            ) : (
              <EndOfTheList name={'inactive'} />
            )}
          </div>
        </Accordion.AccordionItem>
        <Accordion.AccordionItem
          title={getTitle('Disconnected')}
          listName={'disconnected'}
        >
          {sortDevices(disconnectedDevices)}
          <div
            className={classNames(styles.deviceItemContainer, {
              [styles.message]: true
            })}
          >
            {!disconnectedDevices.length ? (
              <EmptyList name={'inactive'} />
            ) : (
              <EndOfTheList name={'disconnected'} />
            )}
          </div>
        </Accordion.AccordionItem>
      </Accordion>
    </div>
  )
}

export { DeviceList, getDeviceStatusIconName }
