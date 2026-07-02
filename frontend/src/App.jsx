import { BrowserRouter, Routes, Route } from 'react-router-dom'
import LoginPage from './pages/features/auth/login/LoginPage'

function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App