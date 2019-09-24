import React, { useEffect, useRef } from 'react'
import { renderToString } from 'react-dom/server'
import Leaflet from 'leaflet'

import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'
import 'leaflet-defaulticon-compatibility'
import './mapstyles.scss'

import constants from './../../../constants'

const MapContainer = props => {
  const {
    center,
    markerPosition,
    zoom,
    markerIcon,
    panToCenter,
    follow,
    accuracy,
    selectedMapLayerState,
    trail,
    trailIcon
  } = props

  //will refactor this and move it elsewhere
  const clientWidth = window.innerWidth
  const minZoom = clientWidth > 500 ? 3 : 1

  // This effect initilizes map
  const mapRef = useRef(null)
  useEffect(() => {
    mapRef.current = Leaflet.map('map', {
      center,
      easeLinearity: 0.2,
      zoomSnap: 0.2,
      zoom,
      zoomControl: false,
      trackResize: true,
      boxZoom: true,
      minZoom: minZoom,
      maxZoom: 19,
      animate: true,
      attributionControl: false,
      layers: [
        Leaflet.tileLayer(selectedMapLayerState.selectedLayer, {
          attribution:
            '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
          key: constants.MAPTILER_KEY,
          tileSize: 1024,
          zoomOffset: -2,
          detectRetina: true,
          minZoom: minZoom,
          minNativeZoom: minZoom + 1,
          maxNativeZoom: 20,
          maxZoom: 20
        })
      ]
    })

    return () => {
      if (mapRef && mapRef.current) mapRef.current.remove()
    }
  }, []) // eslint-disable-line

  // This effect initilizes/updates/manages marker
  const variant = markerIcon && markerIcon.props ? markerIcon.props.variant : ''
  const markerRef = useRef(null)
  useEffect(
    () => {
      let icon = null
      if (markerIcon) {
        const html = renderToString(markerIcon)
        icon = Leaflet.divIcon({
          className: 'live-location-icon-root',
          html
        })
      }
      if (markerPosition) {
        if (markerRef.current) {
          markerRef.current.setIcon(icon)
          markerRef.current.setLatLng(markerPosition)

          if (follow) {
            // This animation allows move screen with Marker's speed
            // TODO: create global animation object and use it
            mapRef.current.panTo(markerPosition, {
              animate: true,
              easeLinearity: 1,
              duration: 1
            })
          }
        } else {
          markerRef.current = Leaflet.marker(
            markerPosition,
            icon ? { icon } : {}
          ).addTo(mapRef.current)
          mapRef.current.panTo(markerPosition)
        }
      }
    },
    [markerPosition, variant] // eslint-disable-line
  )

  // This effect initilizes/updates/manages accuracy halo
  const haloRef = useRef(null)
  React.useEffect(() => {
    if (mapRef && mapRef.current && accuracy) {
      if (haloRef && haloRef.current) haloRef.current.remove()
      haloRef.current = Leaflet.circle(markerPosition, {
        radius: accuracy,
        fillColor: constants.map.colors.activeColor,
        stroke: false
      }).addTo(mapRef.current)
    } else {
      if (haloRef.current) haloRef.current.remove()
    }
  }, [accuracy, markerPosition])

  // This effect initilizes/updates/manages trail
  const trailRef = useRef(null)
  React.useEffect(
    () => {
      if (mapRef && mapRef.current && trail && trail.length > 1) {
        const html = renderToString(trailIcon)
        const icon = Leaflet.divIcon({
          className: 'live-location-icon-root small',
          html
        })
        if (trailRef && trailRef.current) trailRef.current.clearLayers()
        const trailPoints = trail.map(trailElement => {
          return Leaflet.marker(trailElement.geometry.coordinates, { icon })
        })
        const trailLinePoints = [
          markerPosition || center,
          ...trail.map(trailElement => trailElement.geometry.coordinates)
        ]
        const trailLine = Leaflet.polyline(trailLinePoints, {
          color: constants.map.colors.activeColor,
          opacity: 0.5,
          dashArray: constants.map.trailDashPattern
        })
        trailRef.current = Leaflet.layerGroup(trailPoints)
          .addLayer(trailLine)
          .addTo(mapRef.current)
      } else {
        if (trailRef && trailRef.current) trailRef.current.clearLayers()
      }
    },
    [trail.length, markerPosition] // eslint-disable-line
  )

  //This effect resets the center & zoom of the map when panToCenter is a new random value
  React.useEffect(
    () => {
      const newPos = markerPosition || center
      if (panToCenter && mapRef.current && newPos) {
        mapRef.current.setView(newPos, 16, {
          animate: true,
          duration: 0.4
        })
      }
    },
    [panToCenter] // eslint-disable-line
  )

  return <div id="map" className="map-container" />
}

MapContainer.defaultProps = {
  center: constants.HT_SF,
  markerPosition: null,
  zoom: 16,
  panToCenter: false,
  follow: true
}

export default MapContainer
