import type { AppProps } from 'next/app'
import { ClerkProvider } from '@clerk/nextjs'
import { ToastProvider } from '../providers/toast-provider'
import { ModalProvider } from '../providers/modal-provider'

import '../styles/globals.css'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider>
      <ToastProvider/>
      <ModalProvider />
      <Component {...pageProps} />
    </ClerkProvider>
  )
}

export default MyApp
