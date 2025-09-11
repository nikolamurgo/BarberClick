import '../styles/HomepageStyles.css'

function Header() {
    return (
        <nav className="navbar navbar-dark navtitle">
            <div className="container">
                {/* Logo + Title on the left */}
                <a className="navbar-brand">
                    <span className="me-2">💈</span>
                    <span className="fs-4"><b>BarberClick</b></span>
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