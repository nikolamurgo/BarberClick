import axios from 'axios'
import '../styles/HomepageStyles.css'
import { useEffect, useState } from 'react'
import API_URL from '../config/api'

function BarberCard({selectedBarber, onBarberSelect, onNext, canGoNext}) {

    const [barbers, setBarbers] = useState([])
    const profileImage = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png'

    // update on every change
    useEffect(() => {
        fetchBarbers() // fetch all barbers on every change.
    }, [])

    const fetchBarbers = async () => {
        try {
            const result = await axios.get(`${API_URL}/users/barbers`)
            setBarbers(result.data)
        } catch (error) {
            console.log('erorr fetching')
        }
    }

    const handleBarberSelect = (barber) =>{
        onBarberSelect(barber)
    }

    return (
        <section id="booking" className='booking-section'>
            <div className="container">
                <div className="booking-shell">
                    <div className="section-heading">
                        <div>
                            <div className="section-kicker">Step 1</div>
                            <h1 className="booking-title">Select your barber</h1>
                            <p className="booking-subtitle">Choose the professional you want for your appointment.</p>
                        </div>
                        {selectedBarber && (
                            <div className="selected-pill">
                                <i className="bi bi-check2-circle"></i>
                                {selectedBarber.first_name} {selectedBarber.last_name}
                            </div>
                        )}
                    </div>

                    <div className="row justify-content-center g-3 g-lg-4">
                        {barbers.length > 0 ? 
                        (
                            barbers.map((barber) => {
                                const isSelected = selectedBarber?.user_id === barber.user_id

                                return (
                                    <div key={barber.user_id} className="col-12 col-sm-6 col-lg-4 col-xl-3">
                                        <button
                                            type="button"
                                            className={`selection-card barber-card ${isSelected ? 'selected' : ''}`}
                                            onClick={() => handleBarberSelect(barber)}
                                            aria-pressed={isSelected}
                                        >
                                            <span className="selection-check"><i className="bi bi-check-lg"></i></span>
                                            <img className="barber-avatar" src={profileImage} alt={`${barber.first_name} ${barber.last_name}`} />
                                            <span className="barber-name">{barber.first_name} {barber.last_name}</span>
                                            <span className="barber-meta">
                                                <i className="bi bi-lightning-charge"></i>
                                                Available for booking
                                            </span>
                                        </button>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="col-12">
                                <div className="empty-state">
                                    <i className="bi bi-calendar-x"></i>
                                    <p>No barbers available right now.</p>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className='d-flex justify-content-center mt-5'>
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

export default BarberCard
