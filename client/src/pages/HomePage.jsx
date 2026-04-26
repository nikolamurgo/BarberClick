import Header from '../components/Header'
import BarberCard from '../components/BarberCard'
import ServiceSelection from '../components/serviceSelection'
import TimeSelection from '../components/TimeSelection'
import { useState } from 'react'

function HomePage({currentView, onViewChange}){

    const [currentStep, setCurrentStep] = useState(1)
    const totalSteps = 4 // barber, service, time, customerinfo
    const steps = [
        { number: 1, title: 'Barber', icon: 'bi-scissors' },
        { number: 2, title: 'Service', icon: 'bi-stars' },
        { number: 3, title: 'Time', icon: 'bi-calendar2-week' },
        { number: 4, title: 'Details', icon: 'bi-person-check' }
    ]

    // booking data state
    const [selectedBarber, setSelectedBarber] = useState(null)
    const [selectedService, setSelectedService] = useState(null)
    const [selectedTime, setSelectedTime] = useState(null)

    // function to increase the step, on NEXT
    const handleNext = () => {
        if(currentStep < totalSteps){
            setCurrentStep(currentStep + 1)
        }
    }

    // on Previous Button go to prev step in selection process
    const handlePrevious = () => {
        if(currentStep > 1){
            setCurrentStep(currentStep - 1)
        }
    }

    // selection handler tbi
    const handleBarberSelect = (barber) => {
        setSelectedBarber(barber)
        setSelectedService(null)
        setSelectedTime(null)
    }
    const handleServiceSelect = (service) => {
        setSelectedService(service)
        setSelectedTime(null)
    }
    const handleTimeSelect = (timeSlot) => {
        setSelectedTime(timeSlot)
    }

    // function to handle previous step and reset selectedService
    const handleServicePrevious = () => {
        setSelectedService(null);
        setSelectedTime(null);
        handlePrevious();
    }

    const renderCustomerDetailsStep = () => {
        return (
            <section className="booking-section">
                <div className="booking-shell narrow-shell">
                    <div className="section-kicker">Confirm your details</div>
                    <h1 className="booking-title">Customer details are next</h1>
                    <p className="booking-subtitle">
                        Guests will enter first name, last name, phone number, and email before the appointment is confirmed.
                    </p>

                    <div className="summary-panel mt-4">
                        <div className="summary-row">
                            <span>Barber</span>
                            <strong>{selectedBarber ? `${selectedBarber.first_name} ${selectedBarber.last_name}` : 'Not selected'}</strong>
                        </div>
                        <div className="summary-row">
                            <span>Service</span>
                            <strong>{selectedService ? selectedService.title : 'Not selected'}</strong>
                        </div>
                        {selectedService && (
                            <div className="summary-row">
                                <span>Estimate</span>
                                <strong>{selectedService.duration} min · {selectedService.price}€</strong>
                            </div>
                        )}
                        <div className="summary-row">
                            <span>Time</span>
                            <strong>{selectedTime ? `${selectedTime.date} at ${String(selectedTime.time).slice(0, 5)}` : 'Not selected'}</strong>
                        </div>
                    </div>

                    <div className="d-flex justify-content-center gap-3 mt-4">
                        <button type="button" className="btn btn-outline-light btn-lg action-btn" onClick={handlePrevious}>
                            <i className="bi bi-arrow-left"></i>
                            Previous
                        </button>
                        <button type="button" className="btn btn-primary btn-lg action-btn" disabled>
                            Continue
                            <i className="bi bi-arrow-right"></i>
                        </button>
                    </div>
                </div>
            </section>
        )
    }

    // fuction to render the components based on the step
    const renderCurrentStep = () => {
        switch(currentStep) {
            case 1:
                return(
                    // return the BarberCard Component when Step 1
                    <BarberCard 
                        selectedBarber={selectedBarber}
                        onBarberSelect={handleBarberSelect}
                        onNext={handleNext}
                        canGoNext={selectedBarber !== null}
                    />
                )
            case 2:
                return(
                   <ServiceSelection
                        selectedService = {selectedService}
                        onServiceSelect = {handleServiceSelect}
                        onNext = {handleNext}
                        onPrevious = {handleServicePrevious}
                        canGoNext = {selectedService !== null}
                    />
                )
            case 3:
                return(
                    <TimeSelection
                        selectedBarber={selectedBarber}
                        selectedService={selectedService}
                        selectedTime={selectedTime}
                        onTimeSelect={handleTimeSelect}
                        onNext={handleNext}
                        onPrevious={handlePrevious}
                        canGoNext={selectedTime !== null}
                    />
                )
            case 4:
                return(
                    renderCustomerDetailsStep()
                )
            default:
                return null
        }
    }

    return(
        <div className='app-frame d-flex flex-column min-vh-100'>
            <Header currentView={currentView} onViewChange={onViewChange} />
            <section className="hero-band">
                <div className="container">
                    <div className="hero-grid">
                        <div>
                            <div className="section-kicker">Online barber booking</div>
                            <h1 className="hero-title">Book a clean cut in a few clicks.</h1>
                            <p className="hero-copy">
                                Pick your barber, choose a service, reserve a time, and get email reminders before your appointment.
                            </p>
                        </div>

                        <div className="step-panel" aria-label={`Step ${currentStep} of ${totalSteps}`}>
                            <div className="step-panel-top">
                                <span>Step {currentStep} of {totalSteps}</span>
                                <strong>{Math.round((currentStep / totalSteps) * 100)}%</strong>
                            </div>
                            <div className="progress booking-progress" role="progressbar" aria-valuenow={currentStep} aria-valuemin="1" aria-valuemax={totalSteps}>
                                <div className="progress-bar" style={{width: `${(currentStep / totalSteps) * 100}%`}}></div>
                            </div>
                            <div className="step-list">
                                {steps.map((step) => (
                                    <div key={step.number} className={`step-item ${currentStep === step.number ? 'active' : ''} ${currentStep > step.number ? 'complete' : ''}`}>
                                        <span className="step-icon"><i className={`bi ${step.icon}`}></i></span>
                                        <span>{step.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <main className='flex-grow-1'>
                {renderCurrentStep()}
            </main>
            <footer className="site-footer text-center py-3 mt-auto">
                <small>Developed by <strong>@nikolamurgo</strong></small>
            </footer>
        </div>
    )
}

export default HomePage
