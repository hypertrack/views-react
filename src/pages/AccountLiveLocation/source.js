export const parseSingleDeviceFromList = (device, oldDevice = {}) => {
  const device_id = device.device_id
  const location =
    device.location && device.location.data
      ? {
          data:
            typeof JSON.parse(device.location.data) === 'object'
              ? JSON.parse(device.location.data)
              : JSON.parse(JSON.parse(device.location.data)),
          recorded_at: device.location.recorded_at
        }
      : {}
  const activity =
    device.activity && device.activity.data
      ? {
          data:
            typeof JSON.parse(device.activity.data) === 'object'
              ? JSON.parse(device.activity.data)
              : JSON.parse(JSON.parse(device.activity.data)),
          recorded_at: device.activity.recorded_at
        }
      : {}
  const health =
    device.health && device.health.data
      ? {
          data:
            typeof JSON.parse(device.health.data) === 'object'
              ? JSON.parse(device.health.data)
              : JSON.parse(JSON.parse(device.health.data)),
          recorded_at: device.health.recorded_at
        }
      : {}
  return {
    device_id,
    location,
    activity,
    health,
    name:
      device && device.device_info && device.device_info.name
        ? device.device_info.name
        : oldDevice.name,
    device_status: device.device_status
  }
}

export const getDeviceListMap = deviceList =>
  deviceList.reduce((deviceListMap, currentDevice) => {
    return {
      ...deviceListMap,
      [currentDevice.device_id]: parseSingleDeviceFromList(currentDevice)
    }
  }, {})

export const getDeviceListOrder = deviceList => deviceList.map(d => d.device_id)

export const mergeSubDataIntoInitialData = (
  devicesMap,
  subscribeToDeviceStatus
) => {
  if (subscribeToDeviceStatus && subscribeToDeviceStatus.device_id) {
    // console.log(`Data recieved for ${subscribeToDeviceStatus.device_id}`)
    // console.table(subscribeToDeviceStatus)
    return {
      ...devicesMap,
      [subscribeToDeviceStatus.device_id]: parseSingleDeviceFromList(
        subscribeToDeviceStatus,
        devicesMap[subscribeToDeviceStatus.device_id]
      )
    }
  }
  return devicesMap
}
