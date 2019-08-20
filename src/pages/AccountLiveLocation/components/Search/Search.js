import React, { useEffect, useState } from 'react'
import Downshift, { resetIdCounter } from 'downshift'
import classNames from 'classnames'
import { Icon } from '../../../Generic'

import debounce from 'lodash.debounce'
import DeviceCard from '../DeviceCard'

import styles from './Search.module.scss'

const Search = ({
  assetsUrl,
  devices,
  setSelectedDeviceId,
  isWidget,
  onClick
}) => {
  const [searchDevices, setSearchDevices] = useState([])
  // const [loading, setLoading] = useState(false)

  useEffect(
    () => {
      setSearchDevices(devices)
    },
    [devices]
  )

  const onChange = debounce(e => {
    // console.log('searching', e.target.value)
    const value = e.target.value
    //turn loading on
    //manually query the apollo client
    if (e.target.value.length >= 1) {
      // setLoading(true)
      setSearchDevices(() => {
        // debugger
        return devices.filter(device => {
          if (device.name) {
            if (device.name.toLowerCase().includes(value.toLowerCase())) {
              return true
            }
          }
          if (device.device_id) {
            if (device.device_id.toLowerCase().includes(value.toLowerCase())) {
              return true
            }
          }
          return false
        })
      })
    }
  }, 350)

  resetIdCounter() //downshift 'aria-labelledby' error fix to reset ids
  return (
    <Downshift
      itemToString={device => (device === null ? '' : device.name)}
      // onChange={this.props.onSkillAdd}
    >
      {({ getInputProps, getItemProps, isOpen, inputValue }) => (
        <div
          className={classNames(styles.searchContainer, {
            [styles.isOpen]: isOpen
          })}
        >
          <Icon
            assetsurl={assetsUrl}
            variant={'search'}
            className={styles.searchIcon}
            height={18}
          />

          <input
            className={styles.deviceSearchBar}
            {...getInputProps({
              type: 'search',
              placeholder: 'Search by ID / name',
              id: 'search',
              // className: this.state.loading ? 'loading' : '',
              onChange: e => {
                e.persist()
                // console.log(e)
                onChange(e)
              }
            })}
          />
          {isOpen && (
            <div className={styles.searchDropDownContainer}>
              {searchDevices.map((device, index) => {
                return (
                  <DeviceCard
                    assetsUrl={assetsUrl}
                    device={device}
                    setSelectedDeviceId={setSelectedDeviceId}
                    isWidget={isWidget}
                    onClickHandler={onClick}
                    {...getItemProps({ item: device })}
                    key={device.device_id}
                  >
                    <img width="50" src={device.image} alt={device.name} />
                    {device.name}
                  </DeviceCard>
                )
              })}
              {!searchDevices.length && (
                <div className={styles.noResults}>
                  No device found for '{inputValue}'
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </Downshift>
  )
}
export default Search
