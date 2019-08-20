import React from 'react'
import copy from 'copy-text-to-clipboard'
// import { showToast } from '../../index'
import Icon from './../Icon'

import styles from './copyIcon.module.scss'

const CopyIcon = ({ dataToCopy, tooltipContent }) => {
  return (
      <div
        className={styles.copyIconContainer}
        onClick={() => {
          // showToast()
          copy(dataToCopy)
        }}
      >
        <Icon className={styles.copyIcon} variant={'copy'} height={32} />
      </div>
  )
}

CopyIcon.defaultProps = {
  tooltipContent: ''
}

export default CopyIcon
