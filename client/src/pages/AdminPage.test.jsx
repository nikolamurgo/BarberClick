import '@testing-library/jest-dom'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import axios from 'axios'
import AdminPage from './AdminPage'

jest.mock('axios', () => ({
    post: jest.fn(),
    get: jest.fn(),
    delete: jest.fn()
}))

beforeEach(() => {
    localStorage.clear()
    jest.clearAllMocks()
})

test('blocks admin tools until a barber logs in', () => {
    render(<AdminPage currentView="admin" onViewChange={jest.fn()} />)

    expect(screen.getByRole('heading', { name: /barber login/i })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /new available time/i })).not.toBeInTheDocument()
})

test('shows availability tools after successful barber login', async () => {
    axios.post.mockResolvedValueOnce({
        data: {
            token: 'test-token',
            user: {
                user_id: 1,
                email: 'barber@example.com',
                first_name: 'Test',
                last_name: 'Barber',
                role: 'barber'
            }
        }
    })
    axios.get.mockResolvedValueOnce({ data: [] })

    render(<AdminPage currentView="admin" onViewChange={jest.fn()} />)

    fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'barber@example.com' }
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'secret' }
    })
    fireEvent.click(screen.getByRole('button', { name: /log in/i }))

    await waitFor(() => {
        expect(screen.getByRole('heading', { name: /new available time/i })).toBeInTheDocument()
    })
    expect(screen.getByText(/test barber/i)).toBeInTheDocument()
})
