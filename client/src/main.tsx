import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Providers from './components/Providers.tsx'
import Header from './components/Header.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Header />
    <Providers />
  </React.StrictMode>,
)
