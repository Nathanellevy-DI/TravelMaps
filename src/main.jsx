import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { initBadgeTracking } from './utils/badgeNotification.js'

// Initialize badge tracking (clears badge when app opens)
initBadgeTracking();

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
