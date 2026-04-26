const supabase = require('../config/database')

const datePattern = /^\d{4}-\d{2}-\d{2}$/
const timePattern = /^\d{2}:\d{2}(:\d{2})?$/

const normalizeTime = (time) => {
    if (!time) {
        return ''
    }

    const cleanTime = String(time).trim()
    return cleanTime.length === 5 ? `${cleanTime}:00` : cleanTime
}

const getWritableSupabase = () => {
    if (!supabase.admin) {
        return {
            client: null,
            error: {
                success: false,
                message: 'Database write access is not configured',
                error: 'Set SUPABASE_SERVICE_ROLE_KEY in server/.env and restart the backend.'
            }
        }
    }

    return {
        client: supabase.admin,
        error: null
    }
}

const timeSlotController = {
    getSlotsByBarber: async (barberId, onlyAvailable = false) => {
        try {
            if (!barberId) {
                return {
                    success: false,
                    message: 'Barber ID is required'
                }
            }

            let query = supabase
                .from('TimeSlots')
                .select('*')
                .eq('barber_id', barberId)
                .order('date', { ascending: true })
                .order('time', { ascending: true })

            if (onlyAvailable) {
                query = query.eq('is_available', true)
            }

            const { data, error } = await query

            if (error) throw error

            return {
                success: true,
                data: data
            }
        } catch (err) {
            return {
                success: false,
                message: 'Error fetching time slots',
                error: err.message
            }
        }
    },

    addSlot: async (slotData) => {
        try {
            const writable = getWritableSupabase()
            if (writable.error) {
                return writable.error
            }

            if (!slotData.barber_id) {
                return {
                    success: false,
                    message: 'Barber ID is required'
                }
            }

            if (!slotData.date || !slotData.time) {
                return {
                    success: false,
                    message: 'Date and time are required'
                }
            }

            if (!datePattern.test(slotData.date)) {
                return {
                    success: false,
                    message: 'Date must use YYYY-MM-DD format'
                }
            }

            const normalizedTime = normalizeTime(slotData.time)
            if (!timePattern.test(normalizedTime)) {
                return {
                    success: false,
                    message: 'Time must use HH:mm format'
                }
            }

            const { data, error } = await writable.client
                .from('TimeSlots')
                .insert([{
                    barber_id: slotData.barber_id,
                    date: slotData.date,
                    time: normalizedTime,
                    is_available: slotData.is_available ?? true
                }])
                .select()

            if (error) throw error

            return {
                success: true,
                message: 'Time slot created successfully',
                data: data[0]
            }
        } catch (err) {
            return {
                success: false,
                message: 'Error creating time slot',
                error: err.message
            }
        }
    },

    deleteSlot: async (slotId, barberId = null) => {
        try {
            const writable = getWritableSupabase()
            if (writable.error) {
                return writable.error
            }

            if (!slotId) {
                return {
                    success: false,
                    message: 'Slot ID is required'
                }
            }

            let query = writable.client
                .from('TimeSlots')
                .delete()
                .eq('slot_id', slotId)

            if (barberId) {
                query = query.eq('barber_id', barberId)
            }

            const { data, error } = await query
                .select()

            if (error) throw error

            if (!data || data.length === 0) {
                return {
                    success: false,
                    message: 'Time slot not found'
                }
            }

            return {
                success: true,
                message: 'Time slot deleted successfully',
                data: data[0]
            }
        } catch (err) {
            return {
                success: false,
                message: 'Error deleting time slot',
                error: err.message
            }
        }
    },

    updateSlotAvailability: async (slotId, isAvailable, barberId = null) => {
        try {
            const writable = getWritableSupabase()
            if (writable.error) {
                return writable.error
            }

            if (!slotId) {
                return {
                    success: false,
                    message: 'Slot ID is required'
                }
            }

            let query = writable.client
                .from('TimeSlots')
                .update({ is_available: isAvailable })
                .eq('slot_id', slotId)

            if (barberId) {
                query = query.eq('barber_id', barberId)
            }

            const { data, error } = await query
                .select()

            if (error) throw error

            return {
                success: true,
                message: 'Time slot updated successfully',
                data: data[0]
            }
        } catch (err) {
            return {
                success: false,
                message: 'Error updating time slot',
                error: err.message
            }
        }
    }
}

module.exports = timeSlotController
