import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-icons/font/bootstrap-icons.css'
import HomePage from './pages/HomePage'

function App(){
  return(
    <div data-bs-theme='dark' className='bg-custom-dark min-vh-100'>
      <HomePage />
    </div>
  )
}

export default App