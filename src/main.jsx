import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { OrderProvider } from './context/OrderContext.jsx'
import { ChatProvider } from './context/ChatContext.jsx'
import { CommunityProvider } from './context/CommunityContext.jsx'
import { StatusProvider } from './context/StatusContext.jsx'
import './styles/tokens.css'
import './styles/global.css'
import './styles/shell.css'
import './styles/pages.css'

// Hide raw icon ligature names until the Material Symbols font is ready
if (typeof document !== 'undefined') {
  const markReady = () => document.documentElement.classList.add('icons-ready')
  if (document.fonts?.ready) {
    document.fonts.ready.then(markReady).catch(markReady)
  } else {
    markReady()
  }
  setTimeout(markReady, 1500)
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <OrderProvider>
          <ChatProvider>
            <CommunityProvider>
              <StatusProvider>
                <App />
              </StatusProvider>
            </CommunityProvider>
          </ChatProvider>
        </OrderProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
