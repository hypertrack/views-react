import React, { useRef, useEffect } from 'react'
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

  const handleState = () => {
    setShowMenu(false)
    setHeight(0)
  }

  const handleClick = e => {
    if (!layerSelectorEl.current.contains(e.target)) {
      //handleOutsideClick
      handleState()
      return
    } else {
      //handleInsideClick
      handleState()
      setSelectedMapLayer({
        type: e.target.parentElement.value,
        data: e.target.parentElement.getAttribute('data-layer')
      })
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClick, false)
    return () => document.removeEventListener('mousedown', handleClick, false)
  }, [])

  const layerSelectorEl = useRef(null)

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
