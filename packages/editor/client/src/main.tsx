import { createRoot } from 'react-dom/client'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <div style={{ height: '100dvh' }}>
    <App />
  </div>
)
