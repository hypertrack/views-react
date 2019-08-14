import React, { useState } from 'react'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import gql from 'graphql-tag'
import { Subscription } from 'react-apollo'
import { Then, If } from 'react-if'

import Map from './components/Map'
import { mergeSubDataIntoInitialData } from './source'
import { DeviceList } from './components/DeviceList'
import LayerSelector from './components/LayerSelector'
import { accountSubscription } from './../../graphql/subscriptions'

import styles from './AccountLiveLocation.module.scss'

const accountSubscriptionQuery = gql`
  ${accountSubscription}
`

const AccountLiveLocation = ({
  accountId,
  assetsUrl,
  className,
  initialDeviceListOrder,
  initialDeviceListMap,
  isWidget,
  setTooltipSwitch,
  layerType,
  layerTypes,
  customLayerUrl,
  selectedDeviceForSingleDeviceView,
  setSelectedDeviceForSingleDeviceView,
  selectedMapLayerState,
  setSelectedMapLayer,
  isDeviceListShown,
  isTooltipsShown
}) => {
  const [selectedDeviceId, setSelectedDeviceId] = useState(null)
  // const [tooltipSwitch, setTooltipSwitch] = React.useState(false)
  // const [selectedMapLayerId, setSelectedMapLayerId] = React.useState(0)

  return (
    <Subscription
      variables={{ accountId, isWidget }}
      subscription={accountSubscriptionQuery}
      shouldResubscribe={true}
      fetchPolicy="no-cache"
    >
      {({ error, data, loading }) => {
        const subscribeToDeviceStatus =
          error || loading ? {} : data.subscribeToDeviceStatus

        const devicesMap = mergeSubDataIntoInitialData(
          initialDeviceListMap,
          subscribeToDeviceStatus
        )

        const devices = initialDeviceListOrder.map(
          deviceId => devicesMap[deviceId]
        )

        return (
          <>
            {/*
          <button
              style={{
                top: 0,
                position: 'fixed',
                height: '10px',
                zIndex: 555555
              }}
              onClick={() => setTooltipSwitch(!tooltipSwitch)}
            >
              Tooltip
            </button> 
              */}
            <LayerSelector
              assetsUrl={assetsUrl}
              selectedMapLayerState={selectedMapLayerState}
              setSelectedMapLayer={setSelectedMapLayer}
              customLayerUrl={customLayerUrl}
            />

            <div
              className={classNames(styles.mapContainer, {
                [styles.isWidget]: isWidget
              })}
            >
              <Map
                assetsUrl={assetsUrl}
                subscriptionData={subscribeToDeviceStatus}
                selectedDeviceId={selectedDeviceId}
                setSelectedDeviceId={setSelectedDeviceId}
                devicesMap={devicesMap}
                devices={devices}
                isWidget={isWidget}
                isTooltipsShown={isTooltipsShown}
                setSelectedDeviceForSingleDeviceView={
                  setSelectedDeviceForSingleDeviceView
                }
                selectedMapLayerState={selectedMapLayerState}
              />
            </div>
          </>
        )
      }}
    </Subscription>
  )
}
AccountLiveLocation.defaultProps = {
  devices: []
}

AccountLiveLocation.propTypes = {
  accountId: PropTypes.string.isRequired
}
export default AccountLiveLocation
