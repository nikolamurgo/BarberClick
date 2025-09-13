import '../styles/HomepageStyles.css'
const logo = require('../assets/logo-bc.png')

function Header() {
    return (
        <nav className="navbar navbar-dark navtitle border-bottom border-secondary">
            <div className="container">
                {/* Logo + Title on the left */}
                <a className="navbar-brand d-flex align-items-center">
                    <img height='70' width='auto' src={logo}></img>
                    <span className="fs-3"><b>BarberClick</b></span>
                </a>

                {/* Links on the right */}
                <ul className="navbar-nav ms-auto flex-row">
                    <li className="nav-item">
                        <a className="nav-link me-3">About</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link">Contact</a>
                    </li>
                </ul>
            </div>
        </nav>
    )
}

export default Header