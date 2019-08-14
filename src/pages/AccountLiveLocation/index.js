import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import AccountLiveLocation from './AccountLiveLocation'
import { PageLoader } from './../Generic'
import { listPublicDevicesStatusQuery } from './../../graphql/queries'
import { getDeviceListMap, getDeviceListOrder } from './source'
import { EmptyState, ErrorState, WrongKey } from './components'

const getPublicListDevicesStatus = gql`
  ${listPublicDevicesStatusQuery}
`

const AccountLiveLocationContainer = ({
  assetsUrl,
  className,
  customLayerUrl,
  isWidget,
  layerType,
  layerTypes,
  publishableKey,
  selectedDeviceForSingleDeviceView,
  setSelectedDeviceForSingleDeviceView,
  selectedMapLayerState,
  setSelectedMapLayer,
  isDeviceListShown,
  isTooltipsShown
}) => {
  return (
    <Query
      query={getPublicListDevicesStatus}
      variables={{ publishableKey, isWidget }}
      fetchPolicy="no-cache"
      notifyOnNetworkStatusChange={true} //will test this as Socket closing issue remedy
    >
      {({ loading, error, data }) => {
        if (loading) return <PageLoader />
        if (
          (data && data.listPublicDevicesStatus === null) ||
          !publishableKey ||
          publishableKey === ''
        )
          return <WrongKey />
        if (error) {
          console.error(error)
          return <ErrorState />
        }
        if (
          !(
            data &&
            data.listPublicDevicesStatus &&
            data.listPublicDevicesStatus.length
          )
        )
          return <EmptyState />
        return (
          <AccountLiveLocation
            assetsUrl={assetsUrl}
            initialDeviceListOrder={getDeviceListOrder(
              data.listPublicDevicesStatus
            )}
            initialDeviceListMap={getDeviceListMap(
              data.listPublicDevicesStatus
            )}
            accountId={data.listPublicDevicesStatus[0].account_id} // TODO we need to rethink this
            isWidget={isWidget}
            customLayerUrl={customLayerUrl}
            isDeviceListShown={isDeviceListShown}
            isTooltipsShown={isTooltipsShown}
            layerType={layerType}
            layerTypes={layerTypes}
            selectedDeviceForSingleDeviceView={
              selectedDeviceForSingleDeviceView
            }
            setSelectedDeviceForSingleDeviceView={
              setSelectedDeviceForSingleDeviceView
            }
            selectedMapLayerState={selectedMapLayerState}
            setSelectedMapLayer={setSelectedMapLayer}
          />
        )
      }}
    </Query>
  )
}
export default AccountLiveLocationContainer
