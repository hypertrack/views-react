import styles from './accordion.module.scss'
import Icon from '../Icon'
import React, { useEffect } from 'react'
import classNames from 'classnames'

const Accordion = props => {
  const [activeItems, setActiveItem] = React.useState({})
  const [firstRender, setFirstRender] = React.useState(true)

  useEffect(
    () => {
      if (props.children.length && firstRender) {
        let items = {}
        props.children.forEach(child => {
          items[child.props.listName] = child.props.active
        })
        setActiveItem(items)
        setFirstRender(false)
      }
    },
    [firstRender, props.children]
  )

  const onClick = (event, listName) => {
    setActiveItem({ ...activeItems, [listName]: !activeItems[listName] })
    event.preventDefault()
  }

  return (
    <div className={classNames('accordion', styles.accordion)}>
      {props.children.map((child, index) => (
        <AccordionItem
          title={child.props.title}
          onClick={onClick}
          key={index}
          active={activeItems[child.props.listName]}
          listName={child.props.listName}
        >
          {child.props.children}
        </AccordionItem>
      ))}
    </div>
  )
}

const AccordionItem = props => {
  const { title, active, onClick, listName } = props

  let classes = classNames(
    styles.accordion_item,
    'accordion_item',
    active ? 'active' : ''
  )

  const arrowIcon = active ? 'caret-down' : 'back-left'
  return (
    <div className={classes}>
      <div
        onClick={event => {
          onClick(event, listName)
        }}
        className={classNames(
          'accordion_item_header',
          styles.accordion_item_header
        )}
      >
        <span className="accordion_item_title">{title}</span>
        <Icon variant={arrowIcon} className="accordion_item_status" />
      </div>
      <div
        className={classNames(
          'accordion_item_body',
          styles.accordion_item_body
        )}
      >
        {props.children}
      </div>
    </div>
  )
}

AccordionItem.defaultProps = {
  active: false
}

Accordion.AccordionItem = AccordionItem

export default Accordion
