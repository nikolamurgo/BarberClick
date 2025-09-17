import axios from 'axios'
import { useEffect, useState } from 'react'

function ServiceSelection({selectedService, onServiceSelect, onNext, onPrevious, canGoNext}){

    const [services, setServices] = useState([])

    useEffect(() =>{
        fetchServices()
    }, [])

    const fetchServices = async () =>{
        try {
            const result = await axios.get('http://localhost:5001/api/services/all')
            setServices(result.data)
        } catch (error) {
            console.error('error fetching services', error)
        }
    }

    const handleServiceSelect = (service) => {
        onServiceSelect(service)
    }

    return(
        <div className='container-fluid px-3 py-5'>
            <h1 className="text-center mb-4 text-light">Select a Service</h1>

            <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-6">
                    {services.length > 0 ? 
                    (
                        services.map((service) => {
                            const isSelected = selectedService?.service_id === service.service_id
                            
                            return (
                                <div key={service.service_id} className="mb-3">
                                    <div 
                                        className={`border rounded p-3 bg-dark ${isSelected ? 'border-primary border-1' : 'border-secondary'}`}
                                        style={{ 
                                            cursor: 'pointer',
                                            transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onClick={() => handleServiceSelect(service)}
                                    >
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div className="flex-grow-1">
                                                <div className="d-flex align-items-center mb-1">
                                                    <h5 className="text-light mb-0 me-3">{service.title}</h5>
                                                </div>
                                                <p className="text-muted small mb-1">{service.description}</p>
                                                <div className="d-flex align-items-center text-info small">
                                                    <i className="bi bi-clock me-1"></i>
                                                    {service.duration} minutes
                                                </div>
                                            </div>
                                            
                                            <div className="text-end">
                                                <h4 className="text-light mb-0">{service.price}€</h4>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="text-center">
                            <p className="text-light">No services available</p>
                        </div>
                    )}
                </div>
            </div>
            
            <div className='d-flex justify-content-center gap-3 mt-5'>
                <button 
                    type='button' 
                    className='btn btn-outline-light btn-lg'
                    onClick={onPrevious}
                >Previous</button>
                <button
                    type='button'
                    className={`btn btn-lg ${canGoNext ? 'btn-primary' : 'btn-secondary'}`}
                    disabled={!canGoNext}
                    onClick={onNext}
                >Next</button>
            </div>
        </div>
    )
}

export default ServiceSelection