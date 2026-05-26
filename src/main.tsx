import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ProjectPage from './ProjectPage.tsx'
import Nav from './components/Nav.tsx'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Nav/>
    <App />
    <ProjectPage />
  </StrictMode>,
)