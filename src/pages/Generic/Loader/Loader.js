import React from 'react'

import Icon from './../Icon'
import { hooks } from './../../../common'

import './Loader.scss'
import constants from './../../../constants'

const PageLoader = props => {
  hooks.UseLottie({ variant: constants.svgAnimations.loading })
  return (
    <div className="page-loader-container">
      <div
        id={constants.svgAnimations.loading}
        className="page-loader-wrapper"
      />
    </div>
  )
}

const InPlaceLoader = props => (
  <Icon
    variant="loading"
    className={'ht-loader ' + props.className || ''}
    hidden={props.hidden}
  />
)

const InlineLoader = props => (
  <div className="inlineLoader">
    <div className="inlineLoaderBounce1" />
    <div className="inlineLoaderBounce2" />
    <div className="inlineLoaderBounce3" />
  </div>
)
export { InPlaceLoader, PageLoader, InlineLoader }
