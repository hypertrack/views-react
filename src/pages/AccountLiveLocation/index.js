import React from 'react'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'

import AccountLiveLocation from './AccountLiveLocation'
import { PageLoader } from './../Generic'
import { listPublicMovementStatusQuery } from './../../graphql/queries'
import { getDeviceListMap, getDeviceListOrder } from './source'
import { EmptyState, ErrorState, WrongKey } from './components'

const listPublicMovementStatus = gql`
  ${listPublicMovementStatusQuery}
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
  showDeviceList,
  showTooltips
}) => {
  return (
    <Query
    query={listPublicMovementStatus}
      variables={{ publishableKey }}
      fetchPolicy="no-cache"
      notifyOnNetworkStatusChange={true} //will test this as Socket closing issue remedy
    >
      {({ loading, error, data }) => {
        if (loading) return <PageLoader />
        if (
          (data && data.listPublicMovementStatus === null) ||
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
            data.listPublicMovementStatus &&
            data.listPublicMovementStatus.length
          )
        )
          return <EmptyState />
        return (
          <AccountLiveLocation
            assetsUrl={assetsUrl}
            initialDeviceListOrder={getDeviceListOrder(
              data.listPublicMovementStatus
            )}
            initialDeviceListMap={getDeviceListMap(
              data.listPublicMovementStatus
            )}
            accountId={data.listPublicMovementStatus[0].account_id} // TODO we need to rethink this
            isWidget={isWidget}
            customLayerUrl={customLayerUrl}
            showDeviceList={showDeviceList}
            showTooltips={showTooltips}
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
