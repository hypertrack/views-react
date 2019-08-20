import React from 'react'

import lottie from 'lottie-web'

import animationData from '../constants/animations.json'

function UpdateTitle(currentTitle, defaultTitle = `HyperTrack | Dashboard`) {
  React.useEffect(
    () => {
      document.title = currentTitle
      return () => (document.title = defaultTitle)
    },
    [currentTitle, defaultTitle]
  )
}

function UseTimer(callback, interval = 1000) {
  React.useEffect(
    () => {
      const intervalId = setInterval(() => callback(), interval)
      return () => clearInterval(intervalId)
    },
    [callback, interval]
  )
}

function UseMenu() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)
  const menuRef = React.useRef()
  const onMenuClick = e => {
    e.preventDefault()
    setIsMenuOpen(true)
  }
  React.useEffect(
    () => {
      let timeoutId
      const onDocumentClick = e => {
        timeoutId = setTimeout(() => setIsMenuOpen(false), 100)
      }
      if (isMenuOpen) document.addEventListener('click', onDocumentClick)
      return () => {
        clearTimeout(timeoutId)
        document.removeEventListener('click', onDocumentClick)
      }
    },
    [isMenuOpen]
  )
  return [isMenuOpen, onMenuClick, menuRef]
}

function UseFullHeight() {
  React.useEffect(() => {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }, [])
}

function UseLottie(options) {
  const { variant, renderer = 'svg', loop = true, autoplay = true } = options
  React.useEffect(
    () => {
      const container = document.getElementById(variant)
      const animation = lottie.loadAnimation({
        container,
        renderer,
        loop,
        autoplay,
        animationData
      })
      return () => animation && animation.destroy && animation.destroy()
    },
    [variant, renderer, loop, autoplay]
  )
}
function SetSearchParams(key, value) {
  const { location } = window
  const params = new URLSearchParams(location.search)
  params.set(key, value)
  window.history.replaceState({}, '', `${location.pathname}?${params}`)
}

export default {
  UpdateTitle,
  UseTimer,
  UseFullHeight,
  SetSearchParams,
  UseMenu,
  UseLottie
}
