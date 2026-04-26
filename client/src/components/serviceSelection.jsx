import axios from 'axios'
import { useEffect, useState } from 'react'
import API_URL from '../config/api'

function ServiceSelection({selectedService, onServiceSelect, onNext, onPrevious, canGoNext}){

    const [services, setServices] = useState([])

    useEffect(() =>{
        fetchServices()
    }, [])

    const fetchServices = async () =>{
        try {
            const result = await axios.get(`${API_URL}/services/all`)
            setServices(result.data)
        } catch (error) {
            console.error('error fetching services', error)
        }
    }

    const handleServiceSelect = (service) => {
        onServiceSelect(service)
    }

    return(
        <section className='booking-section'>
            <div className="container">
                <div className="booking-shell narrow-shell">
                    <div className="section-heading">
                        <div>
                            <div className="section-kicker">Step 2</div>
                            <h1 className="booking-title">Select a service</h1>
                            <p className="booking-subtitle">Compare duration and price before choosing your haircut.</p>
                        </div>
                        {selectedService && (
                            <div className="selected-pill">
                                <i className="bi bi-check2-circle"></i>
                                {selectedService.title}
                            </div>
                        )}
                    </div>

                    <div className="service-list">
                        {services.length > 0 ? 
                        (
                            services.map((service) => {
                                const isSelected = selectedService?.service_id === service.service_id

                                return (
                                    <button
                                        type="button"
                                        key={service.service_id}
                                        className={`selection-card service-card ${isSelected ? 'selected' : ''}`}
                                        onClick={() => handleServiceSelect(service)}
                                        aria-pressed={isSelected}
                                    >
                                        <span className="service-icon"><i className="bi bi-scissors"></i></span>
                                        <span className="service-copy">
                                            <span className="service-title">{service.title}</span>
                                            <span className="service-description">{service.description}</span>
                                            <span className="service-duration">
                                                <i className="bi bi-clock"></i>
                                                {service.duration} minutes
                                            </span>
                                        </span>
                                        <span className="service-price">{service.price}€</span>
                                        <span className="selection-check"><i className="bi bi-check-lg"></i></span>
                                    </button>
                                )
                            })
                        ) : (
                            <div className="empty-state">
                                <i className="bi bi-tag"></i>
                                <p>No services available right now.</p>
                            </div>
                        )}
                    </div>

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

export default ServiceSelection
