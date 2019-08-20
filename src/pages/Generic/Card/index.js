import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'

import styles from './Card.module.scss'

const renderListItem = (item, itemClassname) => (
  <div className={itemClassname} key={item.id}>
    {item.component || null}
  </div>
)

const cardMap = {
  custom: props => (
    <div>
      <div className={props.classNames.headerClassname}>{props.header}</div>
      <div className={props.classNames.bodyClassname}>{props.children}</div>
    </div>
  ),
  name: props => (
    <div className={props.classNames.headerClassname}>{props.header}</div>
  ),
  list: props => (
    <div>
      <div className={props.classNames.headerClassname}>{props.header}</div>
      <div className={props.classNames.bodyClassname}>
        {props.list.map(item =>
          (props.renderListItem || renderListItem)(
            item,
            props.classNames.itemClassname
          )
        )}
      </div>
    </div>
  )
}

const Card = props => {
  const { hidden, variant } = props
  const derivedClassName = classNames(
    styles['card-default'],
    props.classNames.containerClassname,
    { hidden }
  )

  return hidden ? null : (
    <div className={derivedClassName}>{cardMap[variant](props)}</div>
  )
}

Card.defaultProps = {
  tabIndex: -1,
  hidden: false,
  classNames: {
    containerClassname: '',
    headerClassname: styles['card-header'],
    bodyClassname: styles['card-body'],
    itemClassname: styles['card-item']
  }
}

Card.propTypes = {
  variant: PropTypes.oneOf(['name', 'list', 'custom']).isRequired,
  list: PropTypes.array,
  renderListItem: PropTypes.func,
  children: PropTypes.node,
  header: PropTypes.node,
  classNames: PropTypes.shape({
    containerClassname: PropTypes.string,
    headerClassname: PropTypes.string,
    bodyClassname: PropTypes.string,
    itemClassname: PropTypes.string
  })
}

export default Card
