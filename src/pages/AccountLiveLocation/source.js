import { utils } from '../../common'

export const getDeviceListMap = deviceList =>
  deviceList.reduce((deviceListMap, currentDevice) => {
    return {
      ...deviceListMap,
      [currentDevice.device_id]: utils.parseMovementStatus(currentDevice)
    }
  }, {})

export const getDeviceListOrder = deviceList => deviceList.map(d => d.device_id)

export const mergeSubDataIntoInitialData = (
  devicesMap,
  subscribeToMovementStatus
) =>
  subscribeToMovementStatus && subscribeToMovementStatus.device_id
    ? {
        ...devicesMap,
        [subscribeToMovementStatus.device_id]: utils.parseMovementStatus(
          subscribeToMovementStatus,
          devicesMap[subscribeToMovementStatus.device_id]
        )
      }
    : devicesMap
