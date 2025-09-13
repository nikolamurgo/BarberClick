import Header from '../components/Header'
import BarberCard from '../components/BarberCard'

function HomePage(){
    return(
        <div className='d-flex flex-column min-vh-100'>
            <Header/>
            <main className='flex-grow-1'>
                <BarberCard />
            </main>
            <footer className="text-light text-center py-2 mt-auto">
                <small>Developed by <strong>@nikolamurgo</strong></small>
            </footer>
        </div>
    )
}

export default HomePage