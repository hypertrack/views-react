import React from 'react'
import Downshift, { resetIdCounter } from 'downshift'
import classNames from 'classnames'
import { Icon } from '../../../Generic'

import styles from './Filter.module.scss'

const Filter = ({
  assetsUrl,
  devices,
  filterDropDownOpen,
  setFilterDropDownOpen,
  selectedActivity,
  setSelectedActivity,
  isWidget,
  onClick
}) => {
  const filters = ['walk', 'run', 'cycle', 'drive', 'stop', 'reset']
  // const [loading, setLoading] = useState(false)

  const onChange = e => {
    e === 'reset' ? setSelectedActivity(null) : setSelectedActivity(e)
  }

  resetIdCounter() //downshift 'aria-labelledby' error fix to reset ids
  return (
    <>
      <Downshift
        onChange={onChange}
        selectedItem={onChange}
        itemToString={item => (item ? item : '')}
        isOpen={filterDropDownOpen}
        onOuterClick={() => setFilterDropDownOpen(false)}
      >
        {({
          isOpen,
          getItemProps,
          highlightedIndex,
          selectedItem: dsSelectedItem
        }) => (
          <div
            className={classNames(styles.filterContainer, {
              [styles.isOpen]: isOpen
            })}
            onClick={() => setFilterDropDownOpen(!filterDropDownOpen)}
          >
            <div className={styles.buttonContainer}>
              <Icon
                assetsurl={assetsUrl}
                variant={selectedActivity ? 'filter-green' : 'filter'}
                className={styles.filterIcon}
                height={24}
              />
              <span>Filter</span>
            </div>
            {isOpen ? (
              <div className={styles.filterDropDownContainer}>
                {filters.map((item, index) => (
                  <div
                    className={styles.dropdownItem}
                    {...getItemProps({ key: index, index, item })}
                    style={{
                      backgroundColor:
                        highlightedIndex === index || selectedActivity === item
                          ? '#F7F7F7'
                          : 'white',
                      fontWeight: selectedActivity === item ? 'bold' : 'normal',
                      color: selectedActivity === item ? 'black' : 'normal'
                    }}
                    key={index}
                  >
                    {item !== 'reset' ? (
                      <Icon
                        assetsurl={assetsUrl}
                        variant={item}
                        className={styles.filterIcon}
                        height={20}
                      />
                    ) : null}
                    {item}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </Downshift>
    </>
  )
}
export default Filter
