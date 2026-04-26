const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const seedBarberEmail = process.env.SEED_BARBER_EMAIL
const seedBarberPassword = process.env.SEED_BARBER_PASSWORD

if (!supabaseUrl || !serviceRoleKey) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in server/.env')
    process.exit(1)
}

if (!seedBarberEmail || !seedBarberPassword) {
    console.error('Missing SEED_BARBER_EMAIL or SEED_BARBER_PASSWORD in server/.env')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
})

const demoEmails = ['barber1@example.com', 'barber2@example.com']
const realBarber = {
    email: seedBarberEmail,
    password_hash: seedBarberPassword,
    first_name: 'Nikola',
    last_name: 'Murgo',
    phone_number: '+386 40 123 456',
    role: 'barber',
    is_available: true
}

const services = [
    {
        title: 'Classic Haircut',
        price: 24,
        description: 'Clean cut, wash, and styling.',
        duration: 45
    },
    {
        title: 'Skin Fade',
        price: 29,
        description: 'Detailed fade with sharp finishing.',
        duration: 60
    },
    {
        title: 'Beard Trim',
        price: 16,
        description: 'Shape, trim, and line-up for the beard.',
        duration: 25
    },
    {
        title: 'Haircut and Beard',
        price: 38,
        description: 'Full haircut with beard trim and styling.',
        duration: 75
    }
]

const addDays = (days) => {
    const date = new Date()
    date.setDate(date.getDate() + days)
    return date.toISOString().slice(0, 10)
}

const failIfError = (label, error) => {
    if (error) {
        console.error(`${label}: ${error.message}`)
        process.exit(1)
    }
}

const seed = async () => {
    const { data: demoUsers, error: demoUsersError } = await supabase
        .from('User')
        .select('user_id,email')
        .in('email', demoEmails)
    failIfError('Could not load demo users', demoUsersError)

    const demoUserIds = demoUsers.map((user) => user.user_id)

    if (demoUserIds.length > 0) {
        const { error: deleteDemoSlotsError } = await supabase
            .from('TimeSlots')
            .delete()
            .in('barber_id', demoUserIds)
        failIfError('Could not delete demo time slots', deleteDemoSlotsError)

        const { error: deleteDemoUsersError } = await supabase
            .from('User')
            .delete()
            .in('user_id', demoUserIds)
        failIfError('Could not delete demo users', deleteDemoUsersError)
    }

    const { data: existingRealBarber, error: existingRealBarberError } = await supabase
        .from('User')
        .select('user_id')
        .eq('email', realBarber.email)
        .maybeSingle()
    failIfError('Could not check real barber', existingRealBarberError)

    let barberId = existingRealBarber?.user_id

    if (barberId) {
        const { error: updateBarberError } = await supabase
            .from('User')
            .update(realBarber)
            .eq('user_id', barberId)
        failIfError('Could not update real barber', updateBarberError)
    } else {
        const { data: insertedBarber, error: insertBarberError } = await supabase
            .from('User')
            .insert([realBarber])
            .select('user_id')
            .single()
        failIfError('Could not insert real barber', insertBarberError)
        barberId = insertedBarber.user_id
    }

    const serviceTitles = services.map((service) => service.title)
    const { error: deleteServicesError } = await supabase
        .from('Service')
        .delete()
        .in('title', serviceTitles)
    failIfError('Could not clear existing services', deleteServicesError)

    const { error: insertServicesError } = await supabase
        .from('Service')
        .insert(services)
    failIfError('Could not insert services', insertServicesError)

    const { error: clearRealSlotsError } = await supabase
        .from('TimeSlots')
        .delete()
        .eq('barber_id', barberId)
    failIfError('Could not clear existing real barber slots', clearRealSlotsError)

    const slots = [
        { date: addDays(1), time: '09:00:00' },
        { date: addDays(1), time: '10:30:00' },
        { date: addDays(1), time: '13:00:00' },
        { date: addDays(2), time: '09:30:00' },
        { date: addDays(2), time: '11:00:00' },
        { date: addDays(2), time: '15:00:00' },
        { date: addDays(3), time: '10:00:00' },
        { date: addDays(3), time: '14:30:00' }
    ].map((slot) => ({
        barber_id: barberId,
        date: slot.date,
        time: slot.time,
        is_available: true
    }))

    const { error: insertSlotsError } = await supabase
        .from('TimeSlots')
        .insert(slots)
    failIfError('Could not insert real time slots', insertSlotsError)

    console.log('Real seed data inserted.')
    console.log(`Admin login email: ${realBarber.email}`)
    console.log(`Barber ID: ${barberId}`)
}

seed()
