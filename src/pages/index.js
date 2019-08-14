import React, { Suspense } from 'react'
import PropTypes from 'prop-types'

import { PageLoader } from './Generic'
import AccountLiveLocation from './AccountLiveLocation'
import LiveLocation from './LiveLocation'
import CONSTANTS from '../constants'

import styles from './index.module.scss'

function reducer(state, action) {
  switch (action.type) {
    case 'base':
      return CONSTANTS.tileLayers[action.type]
    case 'street':
      return CONSTANTS.tileLayers[action.type]
    case 'satellite':
      return CONSTANTS.tileLayers[action.type]
    case 'custom':
      return { selectedLayer: action.data, name: 'custom' }
    default:
      console.log('error')
      return CONSTANTS.tileLayers['base']
  }
}

const LiveViewContainer = props => {
  const {
    className,
    defaultLayer,
    publishableKey,
    customLayerUrl,
    showDeviceCard,
    showDeviceList,
    showTooltips,
    selectedDeviceId
  } = props
  const assetsUrl =
    props.assetsUrl.substr(-1) !== '/' ? props.assetsUrl + '/' : props.assetsUrl
  const initialState =
    defaultLayer !== 'custom'
      ? CONSTANTS.tileLayers[defaultLayer]
      : customLayerUrl !== ''
      ? { selectedLayer: customLayerUrl, name: 'custom' }
      : props.initialState
  const [
    selectedDeviceForSingleDeviceView,
    setSelectedDeviceForSingleDeviceView
  ] = React.useState(selectedDeviceId)

  const [selectedAssetsUrl, setSelectedAssetsUrl] = React.useState(assetsUrl)

  const [state, dispatch] = React.useReducer(reducer, initialState)
  const [viewport, setViewport] = React.useState({})
  React.useEffect(
    () => {
      if (defaultLayer !== 'custom') {
        dispatch({
          type: defaultLayer
        })
      } else if (customLayerUrl !== '') {
        dispatch({
          type: 'custom',
          data: customLayerUrl
        })
      }
    },
    [defaultLayer, customLayerUrl]
  )
  React.useEffect(
    () => {
      setSelectedDeviceForSingleDeviceView(selectedDeviceId)
    },
    [selectedDeviceId]
  )
  React.useEffect(
    () => {
      setSelectedAssetsUrl(assetsUrl)
    },
    [assetsUrl]
  )

  return (
    <Suspense fallback={<PageLoader />}>
      <div className={className}>
        <div className={styles.liveLocationContainer}>
          {selectedDeviceForSingleDeviceView ? (
            <LiveLocation
              assetsUrl={selectedAssetsUrl}
              selectedDeviceForSingleDeviceView={
                selectedDeviceForSingleDeviceView
              }
              setSelectedDeviceForSingleDeviceView={
                setSelectedDeviceForSingleDeviceView
              }
              selectedMapLayerState={state}
              setSelectedMapLayer={dispatch}
              showDeviceCard={showDeviceCard}
              publishableKey={publishableKey}
            />
          ) : (
            <AccountLiveLocation
              assetsUrl={selectedAssetsUrl}
              className={className}
              defaultLayer={defaultLayer}
              path="devices"
              publishableKey={publishableKey}
              isWidget={true}
              showDeviceList={showDeviceList}
              showTooltips={showTooltips}
              customLayerUrl={customLayerUrl}
              selectedDeviceForSingleDeviceView={
                selectedDeviceForSingleDeviceView
              }
              setSelectedDeviceForSingleDeviceView={
                setSelectedDeviceForSingleDeviceView
              }
              selectedMapLayerState={state}
              setSelectedMapLayer={dispatch}
              viewport={viewport}
              setViewport={setViewport}
            />
          )}
        </div>
      </div>
    </Suspense>
  )
}

export default LiveViewContainer

LiveViewContainer.propTypes = {
  publishableKey: PropTypes.string.isRequired,
  customLayerUrl: PropTypes.string,

  defaultLayer: PropTypes.oneOf(['base', 'street', 'satellite', 'custom']),
  showDeviceList: PropTypes.bool,
  showDeviceCard: PropTypes.bool,
  showTooltips: PropTypes.bool
}

LiveViewContainer.defaultProps = {
  initialState: {
    selectedLayer:
      'https://api.maptiler.com/maps/voyager/{z}/{x}/{y}@2x.png?key={key}',
    name: 'base'
  },
  showDeviceList: true,
  showDeviceCard: true,
  showTooltips: false
}
