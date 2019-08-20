import React from 'react'
import classNames from 'classnames'
import { Icon } from './../../../Generic'
import styles from './LayerSelector.module.scss'

import AnimateHeight from 'react-animate-height'

const LayerSelector = ({
  assetsUrl,
  selectedMapLayerState,
  setSelectedMapLayer,
  customLayerUrl
}) => {
  const [showMenu, setShowMenu] = React.useState(false)
  const [height, setHeight] = React.useState(0)

  const handleClick = e => {
    if (e.target.parentElement.value) {
      setShowMenu(false)
      setHeight(0)
      setSelectedMapLayer({
        type: e.target.parentElement.value,
        data: e.target.parentElement.getAttribute('data-layer')
      })
    }
  }

  return (
    <div
      className={classNames(styles.LayerSelectorContainer, {
        [styles.active]: showMenu
      })}
    >
      <button
        className={classNames(styles.layersMenuButton, {
          [styles.active]: showMenu
        })}
        onClick={() => {
          if (!showMenu) {
            setHeight('auto')
          } else {
            setHeight(0)
          }
          setShowMenu(!showMenu)
        }}
      >
        <Icon assetsurl={assetsUrl} variant={'layers'} height={24} />
      </button>
      {
        <AnimateHeight
          duration={300}
          height={height} // see props documentation below
        >
          <div
            className={classNames(styles.menu)}
            onClick={e => handleClick(e)}
          >
            <button
              className={classNames(styles.layerButton, {
                [styles.active]:
                  selectedMapLayerState && selectedMapLayerState.name === 'base'
              })}
              value="base"
            >
              <Icon
                assetsurl={assetsUrl}
                height={24}
                variant={'default-layer'}
              />
            </button>
            <button
              className={classNames(styles.layerButton, {
                [styles.active]:
                  selectedMapLayerState &&
                  selectedMapLayerState.name === 'street'
              })}
              value="street"
            >
              <Icon assetsurl={assetsUrl} height={24} variant={'street'} />
            </button>
            <button
              className={classNames(styles.layerButton, {
                [styles.active]:
                  selectedMapLayerState &&
                  selectedMapLayerState.name === 'satellite'
              })}
              value="satellite"
            >
              <Icon assetsurl={assetsUrl} height={24} variant={'satellite'} />
            </button>
            {customLayerUrl ? (
              <button
                className={classNames(styles.layerButton, {
                  [styles.active]:
                    selectedMapLayerState &&
                    selectedMapLayerState.name === 'custom'
                })}
                value="custom"
                data-layer={customLayerUrl}
              >
                <Icon assetsurl={assetsUrl} height={24} variant={'custom'} />
              </button>
            ) : null}
          </div>
        </AnimateHeight>
      }
    </div>
  )
}

export default LayerSelector
