import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'
import Leaflet from 'leaflet'
import { renderToString } from 'react-dom/server'

import CONSTANTS from './../../../constants'
import { Icon } from './../../Generic'
import { customPopup } from './CustomPopup'
import { parseSingleDeviceFromList } from './../source'

import './accountMapstyles.scss'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'
import 'leaflet-defaulticon-compatibility'
import 'leaflet.markercluster/dist/leaflet.markercluster.js'
import 'leaflet.featuregroup.subgroup/dist/leaflet.featuregroup.subgroup.js'
import 'leaflet.markercluster/dist/MarkerCluster.css'

Leaflet.Marker.include({
  _slideToUntil: undefined,
  _slideToDuration: undefined,
  _slideToLatLng: undefined,
  _slideFromLatLng: undefined,
  _slideKeepAtCenter: undefined,
  _slideDraggingWasAllowed: undefined,

  // 🍂method slideTo(latlng: LatLng, options: Slide Options): this
  // Moves this marker until `latlng`, like `setLatLng()`, but with a smooth
  // sliding animation. Fires `movestart` and `moveend` events.
  slideTo: function slideTo(latlng, options) {
    if (!this._map) return

    this._slideToDuration = options.duration
    this._slideToUntil = performance.now() + options.duration
    this._slideFromLatLng = this.getLatLng()
    this._slideToLatLng = latlng
    this._slideKeepAtCenter = !!options.keepAtCenter
    this._slideDraggingWasAllowed =
      this._slideDraggingWasAllowed !== undefined
        ? this._slideDraggingWasAllowed
        : this._map.dragging.enabled()

    if (this._slideKeepAtCenter) {
      this._map.dragging.disable()
      this._map.doubleClickZoom.disable()
      this._map.options.touchZoom = 'center'
      this._map.options.scrollWheelZoom = 'center'
    }

    this.fire('movestart')
    this._slideTo()

    return this
  },

  // 🍂method slideCancel(): this
  // Cancels the sliding animation from `slideTo`, if applicable.
  slideCancel: function slideCancel() {
    Leaflet.Util.cancelAnimFrame(this._slideFrame)
  },

  _slideTo: function _slideTo() {
    if (!this._map) return

    var remaining = this._slideToUntil - performance.now()

    if (remaining < 0) {
      this.setLatLng(this._slideToLatLng)
      this.fire('moveend')
      if (this._slideDraggingWasAllowed) {
        try {
          this._map.dragging.enable()
          this._map.doubleClickZoom.enable()
          this._map.options.touchZoom = true
          this._map.options.scrollWheelZoom = true
        } catch (err) {
          console.log(err)
        }
      }
      this._slideDraggingWasAllowed = undefined
      return this
    }

    var startPoint = this._map.latLngToContainerPoint(this._slideFromLatLng)
    var endPoint = this._map.latLngToContainerPoint(this._slideToLatLng)
    var percentDone =
      (this._slideToDuration - remaining) / this._slideToDuration

    var currPoint = endPoint
      .multiplyBy(percentDone)
      .add(startPoint.multiplyBy(1 - percentDone))
    var currLatLng = this._map.containerPointToLatLng(currPoint)
    this.setLatLng(currLatLng)

    if (this._slideKeepAtCenter) {
      this._map.panTo(currLatLng, { animate: false })
    }

    this._slideFrame = Leaflet.Util.requestAnimFrame(this._slideTo, this)
  }
})

Leaflet.Marker.addInitHook(function() {
  this.on('move', this.slideCancel, this)
})

let popupTimeouts = []

const clusterGroupOptions = {
  showCoverageOnHover: true,
  singleMarkerMode: false,
  animateAddingMarkers: false,
  maxClusterRadius: 60,
  disableClusteringAtZoom: 11,
  spiderLegPolylineOptions: {
    weight: 1.5,
    color: '#33E96B',
    opacity: 1
  }
}

const devicesObj = {}

//will refactor this and move it elsewhere
const clientWidth = window.innerWidth
const minZoom = clientWidth > 500 ? 3 : 1

const Map = props => {
  const {
    assetsUrl,
    devicesMap,
    subscriptionData,
    selectedDeviceId,
    selectedMapLayerState,
    center,
    devices,
    zoom,
    setSelectedDeviceForSingleDeviceView,
    isTooltipsShown
  } = props
  const [follow, setFollow] = useState({})

  const mapRef = useRef(null)
  const mainClusterLayer = useRef(null) // main cluster layer
  const activeClusterLayer = useRef(null) //sub cluster layer for active devices
  const nonActiveClusterLayer = useRef(null) //sub cluster layer for inactive and disconnect devices

  const addEventListeners = (leafletMarker, device_id) => {
    leafletMarker.on('mouseover', e => {
      popupTimeouts.push(
        setTimeout(function() {
          e.target.openPopup()
        }, 500)
      )
    })
    leafletMarker.on('click', e => {
      e.target.closePopup()
      setSelectedDeviceForSingleDeviceView(device_id)
    })
    leafletMarker.on('mouseout', e => {
      popupTimeouts.forEach(timeout => {
        clearTimeout(timeout)
      })
    })
  }

  const bindPopup = (leafletMarker, deviceData) => {
    let reversedCoordinates = [
      ...deviceData.location.data.location.coordinates
    ].reverse()
    const popup = Leaflet.popup()
    leafletMarker.on('move', function() {
      try {
        popup.setLatLng(this._slideToLatLng) // this is not working WIP TODO
      } catch (err) {
        console.log(err)
      }
    })
    popup.setContent(
      renderToString(
        customPopup(
          deviceData.device_id,
          deviceData.device_status,
          deviceData.location,
          deviceData.activity,
          deviceData.name,
          reversedCoordinates,
          deviceData.health.data
        )
      )
    )
    leafletMarker.bindPopup(popup, {
      offset: new Leaflet.point(5, 5),
      borderRadius: '4px',
      className: 'ht-popup',
      // autoPan: true,
      closeButton: false
    })

    leafletMarker.unbindTooltip()
    leafletMarker.bindTooltip(deviceData.name || deviceData.device_id, {
      offset: new Leaflet.point(5, 15),
      direction: 'bottom',
      className: 'ht-tooltip-enable',
      permanent: isTooltipsShown
    })
  }

  const getVariant = deviceData => {
    return deviceData.device_status === CONSTANTS.movementStatus.active
      ? deviceData.location.data.bearing
        ? 'live-direction'
        : 'live'
      : 'offline'
  }

  const getIcon = deviceData => {
    const bearing = deviceData.location.data.bearing
    const style = {
      transform: `rotate(${bearing || 0}deg)`,
      filter: `drop-shadow(0 0 1px #333)`,
      transition: `1.5s all ease-in-out`
    }
    const variant = getVariant(deviceData)

    const html = renderToString(
      <Icon
        assetsurl={assetsUrl}
        height={variant === 'live-direction' ? 24 : 22}
        style={style}
        variant={variant}
      />
    )

    const icon = Leaflet.divIcon({
      className: 'map-marker-account-livelocation',
      html
    })
    return icon
  }

  //generate marker to be added to relevant sublayer
  const getNewMarker = deviceData => {
    const { device_id, location } = deviceData
    if (
      !(
        location &&
        location.data &&
        location.data.location &&
        location.data.location.coordinates
      )
    )
      return null
    let reversedCoordinates = [...location.data.location.coordinates].reverse()

    const icon = getIcon(deviceData)
    const newMarker = Leaflet.marker(
      new Leaflet.LatLng(reversedCoordinates[0], reversedCoordinates[1]),
      { icon }
    )

    addEventListeners(newMarker, device_id)

    bindPopup(newMarker, deviceData)
    devicesObj[device_id] = newMarker

    return newMarker
  }
  //end of getNewMarker

  useLayoutEffect(
    () => {
      mapRef.current = Leaflet.map('map', {
        center,
        zoom,
        zoomControl: false,
        trackResize: true,
        boxZoom: true,
        minZoom: minZoom,
        maxZoom: 20,
        animate: true,
        attributionControl: false,
        updateWhenZooming: true,
        layers: [
          Leaflet.tileLayer(selectedMapLayerState.selectedLayer, {
            attribution:
              '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
            key: CONSTANTS.MAPTILER_KEY,
            tileSize: selectedMapLayerState.selectedLayer.includes('maptiler')
              ? 1024
              : 512,
            zoomOffset: selectedMapLayerState.selectedLayer.includes('maptiler')
              ? -2
              : -1,
            detectRetina: true,
            minZoom: minZoom,
            minNativeZoom: minZoom + 1,
            maxNativeZoom: 21,
            maxZoom: 21
          })
        ]
      })
      mapRef.current.on('dragend', () => {
        setFollow({})
        popupTimeouts.forEach(timeout => {
          clearTimeout(timeout)
        })
      })
      // mapRef.current.on('zoomend',() => setFollow(false))
      // mapRef.current.on('moveend',() => setFollow(false))
      // mapRef.current.on('click',() => setFollow(false))
      mainClusterLayer.current = Leaflet.markerClusterGroup(
        clusterGroupOptions
      ).addTo(mapRef.current)
      nonActiveClusterLayer.current = Leaflet.featureGroup
        .subGroup(mainClusterLayer.current)
        .addTo(mapRef.current)
      activeClusterLayer.current = Leaflet.featureGroup
        .subGroup(mainClusterLayer.current)
        .addTo(mapRef.current)

      devices.forEach(device => {
        const newMarker = getNewMarker(device)
        devicesObj[device.device_id] = newMarker
        if (
          device.device_status === CONSTANTS.movementStatus.active &&
          newMarker
        ) {
          newMarker.setZIndexOffset(1000)
          activeClusterLayer.current.addLayer(newMarker)
        } else {
          if (newMarker) nonActiveClusterLayer.current.addLayer(newMarker)
        }
      })

      let bounds
      if (
        activeClusterLayer &&
        activeClusterLayer.current &&
        activeClusterLayer.current._layers &&
        Object.keys(activeClusterLayer.current._layers).length
      ) {
        bounds = activeClusterLayer.current.getBounds()
        if (bounds && bounds.isValid()) mapRef.current.fitBounds(bounds)
        if (clientWidth > 500) mapRef.current.zoomOut(0.8)
      } else {
        try {
          bounds = nonActiveClusterLayer.current.getBounds()
          if (bounds && bounds.isValid()) mapRef.current.fitBounds(bounds)
        } catch (err) {
          console.log(err)
        }
      }
      //updates URL search params with current map bounds

      return () => {
        if (activeClusterLayer && activeClusterLayer.current)
          activeClusterLayer.current.remove()
        if (nonActiveClusterLayer && nonActiveClusterLayer.current)
          nonActiveClusterLayer.current.remove()
        if (mainClusterLayer && mainClusterLayer.current)
          mainClusterLayer.current.remove()
        if (mapRef && mapRef.current) mapRef.current.remove()
      }
    },
    [selectedMapLayerState] // eslint-disable-line
  )

  //update browser history with viewport data
  const searchParams = new URLSearchParams(window.location.search)
  const prevView = searchParams.has('b') ? searchParams.get('b') : null
  useEffect(() => {
    if (prevView && mapRef && mapRef.current) {
      const tmp = JSON.parse(prevView)
      const southWest = Leaflet.latLng(tmp._southWest.lat, tmp._southWest.lng),
        northEast = Leaflet.latLng(tmp._northEast.lat, tmp._northEast.lng)
      const bounds = Leaflet.latLngBounds(southWest, northEast)
      if (bounds && bounds.isValid()) mapRef.current.fitBounds(bounds)
    }
  }, []) // eslint-disable-line

  useLayoutEffect(
    () => {
      const device = devicesObj[selectedDeviceId]
      if (device) {
        const distance = mapRef.current.distance(
          mapRef.current.getCenter(),
          device._latlng
        ) // calculate distance to adjust animation time and timeout for popup
        const duration = Math.floor(distance > 10000 ? 4 : 1)
        mapRef.current.flyTo([device._latlng.lat, device._latlng.lng], 18, {
          animate: true,
          duration: duration
        })
        popupTimeouts.push(
          setTimeout(function() {
            setFollow({ device_id: selectedDeviceId })
            device.openPopup()
          }, duration * 1000 + 500)
        )
        popupTimeouts.push()
      }
      return () => {
        popupTimeouts.forEach(timeout => {
          clearTimeout(timeout)
        })
      }
    },
    [selectedDeviceId]
  )

  useLayoutEffect(
    () => {
      const subscriptionDevice = parseSingleDeviceFromList(
        subscriptionData,
        devicesMap[subscriptionData.device_id]
      )

      if (devicesObj[subscriptionDevice.device_id] && mapRef.current) {
        const existingDevice = devicesObj[subscriptionDevice.device_id]
        const location = subscriptionDevice.location
        if (
          location &&
          location.data &&
          location.data.location &&
          location.data.location.coordinates
        ) {
          //bindPopup
          bindPopup(existingDevice, subscriptionDevice)

          //set new icon
          existingDevice.setIcon(getIcon(subscriptionDevice))
          //slide animation to new location
          // activeClusterLayer.current.removeLayer(existingDevice)
          // activeClusterLayer.current.addLayer(existingDevice)
          try {
            existingDevice.slideTo(
              // this errors out when device_name changed through mobile SDK? Why?
              [
                location.data.location.coordinates[1],
                location.data.location.coordinates[0]
              ],
              {
                duration: 2000,
                keepAtCenter:
                  follow.device_id &&
                  follow.device_id === subscriptionDevice.device_id
                    ? true
                    : false
              }
            )
          } catch (err) {
            console.log(err)
          }
        }
      } else if (
        subscriptionDevice &&
        subscriptionDevice.location &&
        subscriptionDevice.location.data
      ) {
        const newMarker = getNewMarker(subscriptionDevice)
        devicesObj[subscriptionDevice.device_id] = newMarker
        if (
          subscriptionDevice.device_status === CONSTANTS.movementStatus.active
        ) {
          try {
            if (
              activeClusterLayer &&
              activeClusterLayer.current &&
              activeClusterLayer.current.refreshClusters &&
              activeClusterLayer.current.addLayer
            ) {
              activeClusterLayer.current.addLayer(newMarker)
              // activeClusterLayer.current.refreshClusters(newMarker)
              activeClusterLayer.current.refreshClusters()
            }
            if (
              mainClusterLayer &&
              mainClusterLayer.current &&
              mainClusterLayer.current.refreshClusters
            )
              mainClusterLayer.current.refreshClusters()
            if (
              nonActiveClusterLayer &&
              nonActiveClusterLayer.current &&
              nonActiveClusterLayer.current.refreshClusters
            )
              nonActiveClusterLayer.current.refreshClusters()
          } catch (err) {
            console.log(err)
          }
        } else {
          if (newMarker) {
            if (nonActiveClusterLayer.current) {
              nonActiveClusterLayer.current.addLayer(newMarker)
              if (nonActiveClusterLayer.current.refreshClusters) {
                // nonActiveClusterLayer.current.refreshClusters(newMarker)
                nonActiveClusterLayer.current.refreshClusters()
              }
            }
            if (mainClusterLayer.current)
              mainClusterLayer.current.refreshClusters()
          }
        }
      }
      return () => {}
    },
    [subscriptionData] // eslint-disable-line
  )

  useEffect(
    () => {
      for (let x in devices) {
        if (isTooltipsShown) {
          // devicesObj[devices[x].device_id].getTooltip().options.className =
          //   'ht-tooltip-enable'
          devicesObj[devices[x].device_id].openTooltip()
          // .bindTooltip(
          // devices[x].name || devices[x].device_id,
          // {
          //   offset: new Leaflet.point(5, 15),
          //   direction: 'bottom',
          //   className: 'ht-tooltip-enable'
          // }
          // )
        } else {
          // devicesObj[devices[x].device_id].getTooltip().options.className =
          //   'ht-tooltip-disable'
          devicesObj[devices[x].device_id].closeTooltip()
        }
        // else if (devices[x].name && !isTooltipsShown) {
        //   devicesObj[devices[x].device_id].unbindTooltip()
        // }
      }
    },
    [isTooltipsShown, devices]
  )

  return <div ref={mapRef} id="map" className="account-map-container" />
}

Map.defaultProps = {
  center: [...CONSTANTS.HT_SF].reverse(),
  zoom: 10,
  devices: []
}

export default Map
