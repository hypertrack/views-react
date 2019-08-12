import gql from 'graphql-tag'

export const subscriptionQuery = gql`
  subscription subscribeToDeviceEvent($device_id: String) {
    subscribeToDeviceEvent(device_id: $device_id) {
      device_id
      recorded_at
      type
      data
    }
  }
`

export const accountSubscription = gql`
  subscription subscribeToDeviceStatus($accountId: String) {
    subscribeToDeviceStatus(account_id: $accountId) {
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
      online
      session_started_at
    }
  }
`

export const deviceSubscription = gql`
  subscription subscribeToDeviceStatus($deviceId: String) {
    subscribeToDeviceStatus(device_id: $deviceId) {
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
      online
      session_started_at
    }
  }
`

export const subscribeToTrip = gql`
  subscription subscribeToTrip($trackingId: String) {
    subscribeToTrip(tracking_id: $trackingId) {
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
  }
`
