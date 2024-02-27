'use client'

import { useState, useEffect } from 'react'
import SettingsModal from '../modals/settings-modal'
import CoverImageModal from '../modals/cover-image-modal'
import AuthModal from '../modals/auth-modal'

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }
  return (
    <>
      <SettingsModal />
      <CoverImageModal />
      <AuthModal />
    </>
  )
}
