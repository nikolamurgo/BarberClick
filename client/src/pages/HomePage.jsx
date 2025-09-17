import Header from '../components/Header'
import BarberCard from '../components/BarberCard'
import ServiceSelection from '../components/serviceSelection'
import { useState } from 'react'

function HomePage(){

    const [currentStep, setCurrentStep] = useState(1)
    const totalSteps = 4 // barber, service, time, customerinfo

    // booking data state
    const [selectedBarber, setSelectedBarber] = useState(null)
    const [selectedService, setSelectedService] = useState(null)
    const [selectedTime, setSelectedTime] = useState(null)
    const [customerDetails, setCustomerDetails] = useState(null)

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
    }
    const handleServiceSelect = (service) => {
        setSelectedService(service)
    }

    // function to handle previous step and reset selectedService
    const handleServicePrevious = () => {
        setSelectedService(null);
        handlePrevious();
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
                    // TO BE IMPLEMENTED
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
                    // TO BE IMPLEMENTED
                   <h2>Step 3: Select Time</h2> 
                )
            case 4:
                return(
                    // TO BE IMPLEMENTED
                   <h2>Step 4: Customer info</h2> 
                )
            default:
                return null
        }
    }

    return(
        <div className='d-flex flex-column min-vh-100'>
            <Header/>
            <div className="bg-custom-dark py-3">
                <div className="container">
                    <div className="text-center text-light">
                        <small>Step {currentStep} of {totalSteps}</small>
                        <div className="progress mt-2" style={{height: '4px'}}>
                            <div 
                                className="progress-bar bg-primary" 
                                style={{width: `${(currentStep / totalSteps) * 100}%`}}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
            <main className='flex-grow-1 bg-custom-dark'>
                {renderCurrentStep()}
            </main>
            <footer className="text-light text-center py-2 mt-auto">
                <small>Developed by <strong>@nikolamurgo</strong></small>
            </footer>
        </div>
    )
}

export default HomePage