import axios from 'axios'
import { useEffect, useMemo, useState } from 'react'
import API_URL from '../config/api'

function TimeSelection({selectedBarber, selectedService, selectedTime, onTimeSelect, onNext, onPrevious, canGoNext}) {
    const [slots, setSlots] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!selectedBarber?.user_id) {
            return
        }

        const fetchAvailableSlots = async () => {
            try {
                setLoading(true)
                setError('')
                const result = await axios.get(`${API_URL}/timeslots/barber/${selectedBarber.user_id}?available=true`)
                setSlots(result.data)
            } catch (err) {
                setError('Could not load available times. Please try again later.')
            } finally {
                setLoading(false)
            }
        }

        fetchAvailableSlots()
    }, [selectedBarber])

    const groupedSlots = useMemo(() => {
        return slots.reduce((groups, slot) => {
            const date = slot.date
            if (!groups[date]) {
                groups[date] = []
            }
            groups[date].push(slot)
            return groups
        }, {})
    }, [slots])

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

    return (
        <section className='booking-section'>
            <div className="container">
                <div className="booking-shell narrow-shell">
                    <div className="section-heading">
                        <div>
                            <div className="section-kicker">Step 3</div>
                            <h1 className="booking-title">Select a time</h1>
                            <p className="booking-subtitle">
                                Showing open slots for {selectedBarber?.first_name} {selectedBarber?.last_name}
                                {selectedService ? ` · ${selectedService.duration} min service` : ''}.
                            </p>
                        </div>
                        {selectedTime && (
                            <div className="selected-pill">
                                <i className="bi bi-check2-circle"></i>
                                {formatDate(selectedTime.date)} at {formatTime(selectedTime.time)}
                            </div>
                        )}
                    </div>

                    {loading && (
                        <div className="empty-state">
                            <i className="bi bi-hourglass-split"></i>
                            <p>Loading available times...</p>
                        </div>
                    )}

                    {!loading && error && (
                        <div className="empty-state">
                            <i className="bi bi-exclamation-circle"></i>
                            <p>{error}</p>
                        </div>
                    )}

                    {!loading && !error && slots.length === 0 && (
                        <div className="empty-state">
                            <i className="bi bi-calendar-x"></i>
                            <p>No available times for this barber yet.</p>
                        </div>
                    )}

                    {!loading && !error && slots.length > 0 && (
                        <div className="slot-day-list">
                            {Object.entries(groupedSlots).map(([date, dateSlots]) => (
                                <div className="slot-day" key={date}>
                                    <div className="slot-day-header">
                                        <span>{formatDate(date)}</span>
                                        <small>{dateSlots.length} slots</small>
                                    </div>
                                    <div className="slot-grid">
                                        {dateSlots.map((slot) => {
                                            const isSelected = selectedTime?.slot_id === slot.slot_id

                                            return (
                                                <button
                                                    type="button"
                                                    key={slot.slot_id}
                                                    className={`time-slot-btn ${isSelected ? 'selected' : ''}`}
                                                    onClick={() => onTimeSelect(slot)}
                                                    aria-pressed={isSelected}
                                                >
                                                    <i className="bi bi-clock"></i>
                                                    {formatTime(slot.time)}
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className='d-flex justify-content-center gap-3 mt-5'>
                        <button 
                            type='button' 
                            className='btn btn-outline-light btn-lg action-btn'
                            onClick={onPrevious}
                        >
                            <i className="bi bi-arrow-left"></i>
                            Previous
                        </button>
                        <button
                            type='button'
                            className='btn btn-primary btn-lg action-btn'
                            disabled={!canGoNext}
                            onClick={onNext}
                        >
                            Continue
                            <i className="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TimeSelection
