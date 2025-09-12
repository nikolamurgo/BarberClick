import axios from 'axios'
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
        <div>
            <h1 className="selectbarbertitle text-center mb-4">Select your Barber</h1>

            <div className="d-flex justify-content-center flex-wrap gap-3 mt-3">
                {barbers.length > 0 ? 
                (
                    barbers.map((barber) => (
                        <div key={barber.user_id}>
                            <div className={`card ${selectedBarber?.user_id === barber.user_id ? 'border-success' : ''}`}
                                style={{ 
                                    width: '18rem', 
                                    cursor: 'pointer',
                                    transform: selectedBarber?.user_id === barber.user_id ? 'scale(1.05)' : 'scale(1)',
                                    transition: 'all 0.3s ease'
                                }}
                                onClick={() => handleBarberSelect(barber)}>
                                <img className="card-img-top" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" alt="Barber"/>
                                <div className="card-body">
                                    <h5 className="card-title text-center">{barber.first_name} {barber.last_name}</h5>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>No barbers available</p>
                )}
            </div>
        </div>
    )
}

export default BarberCard