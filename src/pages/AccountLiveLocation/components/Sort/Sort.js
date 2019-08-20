import React from 'react'
import classNames from 'classnames'
import { Icon } from './../../../Generic'
import styles from './Sort.module.scss'

const Sort = ({ assetsUrl, isSorted, setIsSorted }) => {
  const onClickHandler = e => {
    e.stopPropagation()
    setIsSorted(!isSorted)
  }
  return (
    <div className={styles.sortIconContainer}>
      <Icon
        assetsurl={assetsUrl}
        className={classNames(styles.sortIcon, {
          [styles.inactive]: !isSorted
        })}
        variant={isSorted ? 'sort-active' : 'sort'}
        height={20}
        onClick={onClickHandler}
      />
    </div>
  )
}

export default Sort
