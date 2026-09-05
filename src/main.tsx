import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import { App } from './App'

// Auth0 ACUL injects window.universal_login_context before this bundle executes.
// We overlay a fixed div so Auth0's hidden form elements remain in the DOM
// (the SDK reads from them when submitting login actions).
document.documentElement.style.height = '100%'
document.body.style.margin = '0'
document.body.style.height = '100%'

const root = document.createElement('div')
root.style.cssText = 'position:fixed;inset:0;z-index:2147483647'
document.body.appendChild(root)

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>
)
