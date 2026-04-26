import '../styles/HomepageStyles.css'
const logo = require('../assets/logo-bc.png')

function Header({currentView = 'booking', onViewChange}) {
    const handleViewClick = (event, view) => {
        if (!onViewChange) {
            return
        }

        event.preventDefault()
        onViewChange(view)
    }

    return (
        <nav className="navbar navbar-dark navtitle">
            <div className="container">
                <a className="navbar-brand brand-lockup d-flex align-items-center" href="/" onClick={(event) => handleViewClick(event, 'booking')}>
                    <img className="brand-logo" src={logo} alt="BarberClick logo" />
                    <span className="brand-name">BarberClick</span>
                </a>

                <ul className="navbar-nav ms-auto flex-row nav-actions">
                    <li className="nav-item">
                        <a className={`nav-link ${currentView === 'booking' ? 'active' : ''}`} href="#booking" onClick={(event) => handleViewClick(event, 'booking')}>Book</a>
                    </li>
                    <li className="nav-item">
                        <a className={`nav-link ${currentView === 'admin' ? 'active' : ''}`} href="#admin" onClick={(event) => handleViewClick(event, 'admin')}>Admin</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#contact">Contact</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Header
