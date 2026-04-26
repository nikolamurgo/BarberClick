import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import { useState } from 'react'
import AdminPage from './pages/AdminPage'
import HomePage from './pages/HomePage'

function App(){
  const [currentView, setCurrentView] = useState('booking')

  return(
    <div data-bs-theme='dark' className='bg-custom-dark min-vh-100'>
      {currentView === 'admin' ? (
        <AdminPage currentView={currentView} onViewChange={setCurrentView} />
      ) : (
        <HomePage currentView={currentView} onViewChange={setCurrentView} />
      )}
    </div>
  )
}

export default App
