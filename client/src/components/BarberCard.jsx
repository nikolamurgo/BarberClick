import axios from 'axios'
import '../styles/HomepageStyles.css'
import { useEffect, useState } from 'react'

function BarberCard() {

    const [barbers, setBarbers] = useState([])
    const [selectedBarber, setSelectedBarber] = useState(null)

    // update on every change
    useEffect(() => {
        fetchBarbers() // fetch all barbers on every change.
    }, [])

    const fetchBarbers = async () => {
        try {
            const result = await axios.get('http://localhost:5001/api/users/barbers')
            setBarbers(result.data)
        } catch (error) {
            console.log('erorr fetching')
        }
    }

    const handleBarberSelect = (barber) =>{
        setSelectedBarber(barber)
    }

    return (
        <div className='container-fluid px-3'>
            <h1 className="selectbarbertitle text-center mb-4 text-light">Select your Barber</h1>

            <div className="row justify-content-center g-3">
                {barbers.length > 0 ? 
                (
                    barbers.map((barber) => (
                        <div key={barber.user_id} className="col-6 col-md-4 col-lg-3 col-xl-2 d-flex justify-content-center">
                            <div className={`card h-100 bg-dark ${selectedBarber?.user_id === barber.user_id ? 'border-primary' : ''}`}
                                style={{ 
                                    width: '100%', 
                                    cursor: 'pointer',
                                    transform: selectedBarber?.user_id === barber.user_id ? 'scale(1.05)' : 'scale(1)',
                                    transition: 'all 0.3s ease',
                                    maxWidth: '250px',
                                    margin: '0 auto'
                                }}
                                onClick={() => handleBarberSelect(barber)}>
                                <img className="card-img-top" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" style={{
                                    height: 'auto', objectFit: 'cover'
                                }} alt="Barber"/>
                                <div className="card-body p-2 text-center">
                                    <h5 className="card-title text-center">{barber.first_name} {barber.last_name}</h5>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-12">
                        <p className="text-light text-center">No barbers available</p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default BarberCard