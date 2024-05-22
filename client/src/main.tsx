import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Providers from './components/Providers.tsx'
import Header from './components/Header.tsx'
import { Analytics } from "@vercel/analytics/react"

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Analytics />
    <Header />
    <Providers />
  </React.StrictMode>,
)
