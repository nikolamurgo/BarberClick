import axios from 'axios'
import Header from '../components/Header'
import { useEffect, useMemo, useState } from 'react'
import API_URL from '../config/api'

const getToday = () => {
    return new Date().toISOString().slice(0, 10)
}

const createDateOptions = () => {
    return Array.from({ length: 14 }, (_, index) => {
        const date = new Date()
        date.setDate(date.getDate() + index)
        return date.toISOString().slice(0, 10)
    })
}

const timeOptions = [
    '08:00',
    '08:30',
    '09:00',
    '09:30',
    '10:00',
    '10:30',
    '11:00',
    '11:30',
    '12:00',
    '13:00',
    '13:30',
    '14:00',
    '14:30',
    '15:00',
    '15:30',
    '16:00',
    '16:30',
    '17:00',
    '17:30',
    '18:00'
]

function AdminPage({currentView, onViewChange}) {
    const [auth, setAuth] = useState(() => {
        const savedAuth = localStorage.getItem('barberclick_admin_auth')
        return savedAuth ? JSON.parse(savedAuth) : null
    })
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [slots, setSlots] = useState([])
    const [date, setDate] = useState(getToday())
    const [selectedTime, setSelectedTime] = useState('09:00')
    const [loading, setLoading] = useState(false)
    const [saving, setSaving] = useState(false)
    const [notification, setNotification] = useState(null)

    const selectedBarberId = auth?.user?.user_id || ''
    const dateOptions = useMemo(() => createDateOptions(), [])

    useEffect(() => {
        if (selectedBarberId) {
            const loadSlots = async () => {
                try {
                    setLoading(true)
                    const result = await axios.get(`${API_URL}/timeslots/barber/${selectedBarberId}`)
                    setSlots(result.data)
                } catch (err) {
                    showNotification('error', 'Could not load availability.')
                } finally {
                    setLoading(false)
                }
            }

            loadSlots()
        } else {
            setSlots([])
        }
    }, [selectedBarberId])

    useEffect(() => {
        if (!notification) {
            return
        }

        const timeout = setTimeout(() => {
            setNotification(null)
        }, 3600)

        return () => clearTimeout(timeout)
    }, [notification])

    const groupedSlots = useMemo(() => {
        return slots.reduce((groups, slot) => {
            const slotDate = slot.date
            if (!groups[slotDate]) {
                groups[slotDate] = []
            }
            groups[slotDate].push(slot)
            return groups
        }, {})
    }, [slots])

    const authHeaders = () => ({
        Authorization: `Bearer ${auth.token}`
    })

    const showNotification = (type, text) => {
        setNotification({ type, text })
    }

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            setSaving(true)
            setNotification(null)
            const result = await axios.post(`${API_URL}/auth/login`, {
                email,
                password
            })
            setAuth(result.data)
            localStorage.setItem('barberclick_admin_auth', JSON.stringify(result.data))
            setPassword('')
            showNotification('success', 'Logged in successfully.')
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Login failed.')
        } finally {
            setSaving(false)
        }
    }

    const handleLogout = async () => {
        try {
            if (auth?.token) {
                await axios.post(`${API_URL}/auth/logout`, {}, { headers: authHeaders() })
            }
        } catch (err) {
            // Local logout still clears the protected UI if the server session already expired.
        } finally {
            localStorage.removeItem('barberclick_admin_auth')
            setAuth(null)
            setSlots([])
            setNotification(null)
        }
    }

    const fetchSlots = async (barberId) => {
        try {
            setLoading(true)
            const result = await axios.get(`${API_URL}/timeslots/barber/${barberId}`)
            setSlots(result.data)
        } catch (err) {
            showNotification('error', 'Could not load availability.')
        } finally {
            setLoading(false)
        }
    }

    const handleAddSlot = async (event) => {
        event.preventDefault()

        if (!selectedBarberId || !date || !selectedTime) {
            showNotification('error', 'Select a date and time.')
            return
        }

        try {
            setSaving(true)
            setNotification(null)
            await axios.post(`${API_URL}/timeslots/add`, {
                barber_id: selectedBarberId,
                date,
                time: selectedTime,
                is_available: true
            }, {
                headers: authHeaders()
            })
            showNotification('success', 'Availability added.')
            fetchSlots(selectedBarberId)
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Could not add availability.')
        } finally {
            setSaving(false)
        }
    }

    const handleDeleteSlot = async (slotId) => {
        try {
            setNotification(null)
            await axios.delete(`${API_URL}/timeslots/${slotId}`, {
                headers: authHeaders()
            })
            showNotification('success', 'Availability removed.')
            fetchSlots(selectedBarberId)
        } catch (err) {
            showNotification('error', err.response?.data?.message || 'Could not remove availability.')
        }
    }

    const formatDate = (dateValue) => {
        return new Intl.DateTimeFormat('en', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        }).format(new Date(`${dateValue}T00:00:00`))
    }

    const formatTime = (timeValue) => {
        return String(timeValue).slice(0, 5)
    }

    const formatCalendarDay = (dateValue) => {
        return new Intl.DateTimeFormat('en', {
            weekday: 'short'
        }).format(new Date(`${dateValue}T00:00:00`))
    }

    const formatCalendarDate = (dateValue) => {
        return new Intl.DateTimeFormat('en', {
            month: 'short',
            day: 'numeric'
        }).format(new Date(`${dateValue}T00:00:00`))
    }

    const renderNotification = () => {
        if (!notification) {
            return null
        }

        return (
            <div className={`admin-notification ${notification.type}`} role="status" aria-live="polite">
                <i className={`bi ${notification.type === 'success' ? 'bi-check2-circle' : 'bi-exclamation-circle'}`}></i>
                <span>{notification.text}</span>
                <button type="button" onClick={() => setNotification(null)} aria-label="Dismiss notification">
                    <i className="bi bi-x-lg"></i>
                </button>
            </div>
        )
    }

    const renderLogin = () => (
        <section className="booking-section">
            <div className="container">
                <form className="booking-shell login-shell" onSubmit={handleLogin}>
                    <div className="section-kicker">Secure access</div>
                    <h1 className="booking-title">Barber login</h1>
                    <p className="booking-subtitle">
                        Log in with your barber account to manage available appointment times.
                    </p>

                    <label className="form-label mt-4" htmlFor="admin-email">Email</label>
                    <input
                        id="admin-email"
                        className="form-control form-control-modern"
                        type="email"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        autoComplete="email"
                    />

                    <label className="form-label mt-3" htmlFor="admin-password">Password</label>
                    <input
                        id="admin-password"
                        className="form-control form-control-modern"
                        type="password"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        autoComplete="current-password"
                    />

                    <button type="submit" className="btn btn-primary btn-lg action-btn mt-4" disabled={saving}>
                        <i className="bi bi-box-arrow-in-right"></i>
                        {saving ? 'Logging in...' : 'Log in'}
                    </button>
                </form>
            </div>
        </section>
    )

    const renderAdmin = () => (
        <>
            <section className="admin-hero">
                <div className="container">
                    <div className="section-kicker">Barber admin</div>
                    <h1 className="hero-title">Manage appointment availability.</h1>
                    <p className="hero-copy">
                        Add open dates and times so customers can reserve real appointment slots during booking.
                    </p>
                </div>
            </section>

            <section className="booking-section">
                <div className="container">
                    <div className="admin-grid">
                        <form className="booking-shell admin-form" onSubmit={handleAddSlot}>
                            <div className="section-heading compact-heading">
                                <div>
                                    <div className="section-kicker">Add slot</div>
                                    <h2 className="admin-title">New available time</h2>
                                </div>
                                <button type="button" className="btn btn-outline-light btn-sm" onClick={handleLogout}>
                                    Log out
                                </button>
                            </div>

                            <div className="admin-account">
                                <i className="bi bi-person-badge"></i>
                                <span>{auth.user.first_name} {auth.user.last_name}</span>
                                <small>{auth.user.email}</small>
                            </div>

                            <div className="availability-picker mt-4">
                                <div className="picker-heading">
                                    <div>
                                        <span className="form-label d-block mb-1">Date</span>
                                        <small>Choose a day from the calendar.</small>
                                    </div>
                                    <strong>{formatDate(date)}</strong>
                                </div>
                                <div className="calendar-grid" role="group" aria-label="Select availability date">
                                    {dateOptions.map((dateOption) => (
                                        <button
                                            type="button"
                                            key={dateOption}
                                            className={`calendar-day ${date === dateOption ? 'selected' : ''}`}
                                            onClick={() => setDate(dateOption)}
                                            aria-pressed={date === dateOption}
                                        >
                                            <span>{formatCalendarDay(dateOption)}</span>
                                            <strong>{formatCalendarDate(dateOption)}</strong>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="availability-picker mt-4">
                                <div className="picker-heading">
                                    <div>
                                        <span className="form-label d-block mb-1">Time</span>
                                        <small>Pick the appointment start time.</small>
                                    </div>
                                    <strong>{selectedTime}</strong>
                                </div>
                                <div className="time-chip-grid" role="group" aria-label="Select availability time">
                                    {timeOptions.map((timeOption) => (
                                        <button
                                            type="button"
                                            key={timeOption}
                                            className={`time-chip ${selectedTime === timeOption ? 'selected' : ''}`}
                                            onClick={() => setSelectedTime(timeOption)}
                                            aria-pressed={selectedTime === timeOption}
                                        >
                                            {timeOption}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="slot-preview mt-4">
                                <span>Preview</span>
                                <strong>{date ? formatDate(date) : 'Select date'} at {selectedTime}</strong>
                            </div>

                            <button type="submit" className="btn btn-primary btn-lg action-btn mt-4" disabled={saving}>
                                <i className="bi bi-plus-lg"></i>
                                {saving ? 'Adding...' : 'Add availability'}
                            </button>
                        </form>

                        <div className="booking-shell">
                            <div className="section-heading">
                                <div>
                                    <div className="section-kicker">Schedule</div>
                                    <h2 className="admin-title">Your open slots</h2>
                                </div>
                                <div className="selected-pill">
                                    <i className="bi bi-calendar2-check"></i>
                                    {slots.filter((slot) => slot.is_available).length} available
                                </div>
                            </div>

                            {loading && (
                                <div className="empty-state">
                                    <i className="bi bi-hourglass-split"></i>
                                    <p>Loading slots...</p>
                                </div>
                            )}

                            {!loading && slots.length === 0 && (
                                <div className="empty-state">
                                    <i className="bi bi-calendar-plus"></i>
                                    <p>No slots added yet.</p>
                                </div>
                            )}

                            {!loading && slots.length > 0 && (
                                <div className="admin-slot-list">
                                    {Object.entries(groupedSlots).map(([slotDate, dateSlots]) => (
                                        <div className="slot-day" key={slotDate}>
                                            <div className="slot-day-header">
                                                <span>{formatDate(slotDate)}</span>
                                                <small>{dateSlots.length} slots</small>
                                            </div>
                                            <div className="admin-slot-grid">
                                                {dateSlots.map((slot) => (
                                                    <div className={`admin-slot ${slot.is_available ? '' : 'unavailable'}`} key={slot.slot_id}>
                                                        <span>
                                                            <i className="bi bi-clock"></i>
                                                            {formatTime(slot.time)}
                                                        </span>
                                                        <button
                                                            type="button"
                                                            className="icon-btn"
                                                            onClick={() => handleDeleteSlot(slot.slot_id)}
                                                            aria-label={`Delete ${formatTime(slot.time)} slot`}
                                                        >
                                                            <i className="bi bi-trash"></i>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </>
    )

    return (
        <div className='app-frame d-flex flex-column min-vh-100'>
            <Header currentView={currentView} onViewChange={onViewChange} />
            {renderNotification()}
            <main className="admin-page flex-grow-1">
                {auth ? renderAdmin() : renderLogin()}
            </main>
            <footer className="site-footer text-center py-3 mt-auto">
                <small>Developed by <strong>@nikolamurgo</strong></small>
            </footer>
        </div>
    )
}

export default AdminPage
