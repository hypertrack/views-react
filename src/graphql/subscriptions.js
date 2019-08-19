import gql from 'graphql-tag'

export const accountSubscription = gql`
  subscription subscribeToMovementStatus($accountId: String) {
    subscribeToMovementStatus(account_id: $accountId) {
      account_id
      device_id
      device_status {
        value
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

export const deviceSubscription = gql`
  subscription subscribeToMovementStatus($deviceId: String) {
    subscribeToMovementStatus(device_id: $deviceId) {
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
      battery
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
        arrive_at
        reroutes_exceeded
        route {
          distance
          duration
          remaining_duration
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
