import gql from 'graphql-tag'

export const getEventQuery = gql`
  query getEvent($device_id: String!) {
    getEvent(device_id: $device_id) {
      device_id
      recorded_at
      type
      data
    }
  }
`

export const getLastL1EventsQuery = gql`
  query getLastEvents($deviceId: String!) {
    getLastEvents(device_id: $deviceId) {
      data
      device_id
      recorded_at
      type
    }
  }
`

export const getPublicLastEventsQuery = gql`
  query getPublicLastEvents($deviceId: String!, $publishableKey: String!) {
    getPublicLastEvents(
      device_id: $deviceId
      publishable_key: $publishableKey
    ) {
      data
      device_id
      recorded_at
      type
    }
  }
`

export const listDevicesStatusQuery = gql`
  query listDevicesStatus($accountId: String!) {
    listDevicesStatus(input: { account_id: $accountId }) {
      account_id
      device_id
      online
      session_started_at
      device_status
      location {
        data
        recorded_at
      }
      activity {
        data
        recorded_at
      }
      health {
        data
        recorded_at
      }
      device_info {
        name
      }
    }
  }
`

export const listPublicDevicesStatusQuery = gql`
  query listPublicDevicesStatus($publishableKey: String!) {
    listPublicDevicesStatus(publishable_key: $publishableKey) {
      account_id
      device_id
      online
      session_started_at
      device_status
      location {
        data
        recorded_at
      }
      activity {
        data
        recorded_at
      }
      health {
        data
        recorded_at
      }
      device_info {
        name
      }
    }
  }
`

export const getPublicApiKeyQuery = gql`
  query getPublicApiQuery {
    getPublicApiKey {
      account_id
      secret_key
    }
  }
`

export const getDeviceStatus = gql`
  query listDevicesStatus($deviceId: String!) {
    getDeviceStatus(input: { device_id: $deviceId }) {
      account_id
      device_id
      location {
        recorded_at
        data
      }
      activity {
        recorded_at
        data
      }
      health {
        recorded_at
        data
      }
      device_status
      device_info {
        name
      }
    }
  }
`

export const listPublicMovementStatusQuery = gql`
  query listPublicMovementStatus($publishableKey: String!) {
    listPublicMovementStatus(publishable_key: $publishableKey) {
      account_id
      device_id
      device_status {
        value
        active {
          activity
          recorded_at
        }
        inactive {
          reason
          recorded_at
        }
        disconnected {
          recorded_at
        }
      }
      device_info {
        name
        timezone
      }
      location {
        accuracy
        geometry {
          coordinates
        }
        bearing
        speed
        recorded_at
      }
    }
  }
`

export const getPublicDeviceStatusWithTrip = gql`
  query getPublicDeviceStatusQuery(
    $publishableKey: String
    $deviceId: String
    $trackingId: String
  ) {
    getPublicDeviceStatus(
      publishable_key: $publishableKey
      device_id: $deviceId
      tracking_id: $trackingId
    ) {
      device_id
      location {
        recorded_at
        data
      }
      activity {
        recorded_at
        data
      }
      health {
        recorded_at
        data
      }
      device_status
      device_info {
        name
      }
      trip {
        trip_id
        device_id
        started_at
        completed_at
        status
        views {
          embed_url
          share_url
        }
        destination {
          radius
          geometry {
            coordinates
          }
        }
        estimate {
          reroutes_exceeded
          route {
            distance
            duration
            start_address
            end_address
            polyline {
              type
              coordinates
            }
          }
        }
      }
      device_id
      device_info {
        name
      }
      location {
        recorded_at
        data
      }
    }
  }
`

export const getPublicMovementStatus = gql`
  query getPublicMovementStatusQuery(
    $publishableKey: String
    $deviceId: String
    $trackingId: String
  ) {
    getPublicMovementStatus(
      publishable_key: $publishableKey
      device_id: $deviceId
      tracking_id: $trackingId
    ) {
      account_id
      device_id
      location {
        accuracy
        geometry {
          coordinates
        }
        bearing
        speed
        recorded_at
      }
      device_status {
        value
        active {
          activity
          recorded_at
        }
        inactive {
          reason
          recorded_at
        }
        disconnected {
          recorded_at
        }
      }
    }
  }
`

export const getDeviceInfo = gql`
  query getDeviceInfo(
    $trackingId: String
    $publishableKey: String
    $deviceId: String
  ) {
    getDeviceInfo(
      tracking_id: $trackingId
      publishable_key: $publishableKey
      device_id: $deviceId
    ) {
      app_name
      app_version_string
      app_version_number
      device_hardware
      device_brand
      device_meta
      device_model
      name
      network_operator
      os_hardware_identifier
      os_name
      os_version
      play_services_version
      recorded_at
      sdk_version
      timezone
      device_id
    }
  }
`

export const getDevicesSummary = gql`
  query devicesSummary(
    $accountId: String
    $forDays: Int
    $from_date: String
    $to_date: String
  ) {
    devicesSummary(
      input: {
        account_id: $accountId
        for_days: $forDays
        from_date: $from_date
        to_date: $to_date
      }
    ) {
      devices_data {
        drive_duration
        active_duration
        total_distance
        count_drives
        date
        device_id
        stop_duration
        total_steps
        count_walks
        miles_driven
        count_stops
        inactive_duration
        walk_duration
        disconnected_duration
        name
      }
      file_link
      data_available_from
    }
  }
`
