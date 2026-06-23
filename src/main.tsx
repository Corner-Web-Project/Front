import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Nav from './components/Nav.tsx'
import Join from './page/join.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Nav/>
    <App />
    <Join />

  </StrictMode>,
)