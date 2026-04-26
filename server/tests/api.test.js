const test = require('node:test')
const assert = require('node:assert/strict')

process.env.SUPABASE_URL = process.env.SUPABASE_URL || 'http://localhost:54321'
process.env.SUPABASE_KEY = process.env.SUPABASE_KEY || 'test-key'

const users = [
    {
        user_id: 1,
        email: 'barber@example.com',
        password_hash: 'secret',
        first_name: 'Test',
        last_name: 'Barber',
        role: 'barber',
        is_available: true
    },
    {
        user_id: 2,
        email: 'customer@example.com',
        password_hash: 'secret',
        first_name: 'Test',
        last_name: 'Customer',
        role: 'customer',
        is_available: false
    }
]

let timeSlots = [
    {
        slot_id: 1,
        barber_id: 1,
        date: '2026-05-01',
        time: '09:00:00',
        is_available: true
    },
    {
        slot_id: 2,
        barber_id: 1,
        date: '2026-05-01',
        time: '10:00:00',
        is_available: false
    }
]

const createQuery = (table) => {
    const state = {
        table,
        operation: 'select',
        filters: [],
        payload: null
    }

    const getRows = () => {
        if (state.table === 'User') {
            return users
        }

        if (state.table === 'TimeSlots') {
            return timeSlots
        }

        return []
    }

    const applyFilters = (rows) => {
        return rows.filter((row) => {
            return state.filters.every(({ column, value }) => String(row[column]) === String(value))
        })
    }

    const execute = async () => {
        if (state.operation === 'insert') {
            const insertedRows = state.payload.map((row) => ({
                slot_id: timeSlots.length + 1,
                ...row
            }))
            timeSlots = timeSlots.concat(insertedRows)
            return { data: insertedRows, error: null }
        }

        if (state.operation === 'delete') {
            const rows = getRows()
            const deletedRows = applyFilters(rows)
            timeSlots = timeSlots.filter((row) => !deletedRows.includes(row))
            return { data: deletedRows, error: null }
        }

        if (state.operation === 'update') {
            const updatedRows = applyFilters(getRows()).map((row) => Object.assign(row, state.payload))
            return { data: updatedRows, error: null }
        }

        return { data: applyFilters(getRows()), error: null }
    }

    return {
        select() {
            return this
        },
        eq(column, value) {
            state.filters.push({ column, value })
            return this
        },
        order() {
            return this
        },
        insert(payload) {
            state.operation = 'insert'
            state.payload = payload
            return this
        },
        delete() {
            state.operation = 'delete'
            return this
        },
        update(payload) {
            state.operation = 'update'
            state.payload = payload
            return this
        },
        async maybeSingle() {
            const result = await execute()
            return {
                data: result.data[0] || null,
                error: result.error
            }
        },
        then(resolve, reject) {
            return execute().then(resolve, reject)
        }
    }
}

const databasePath = require.resolve('../config/database')
require.cache[databasePath] = {
    id: databasePath,
    filename: databasePath,
    loaded: true,
    exports: {
        from: createQuery,
        admin: {
            from: createQuery
        },
        hasAdminClient: true
    }
}

const app = require('../app')

const request = async (server, path, options = {}) => {
    const response = await fetch(`http://127.0.0.1:${server.address().port}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        }
    })

    const text = await response.text()
    const body = text ? JSON.parse(text) : null

    return {
        status: response.status,
        body
    }
}

test('auth and timeslot APIs', async (t) => {
    const server = await new Promise((resolve, reject) => {
        const testServer = app.listen(0, '127.0.0.1', () => resolve(testServer))
        testServer.on('error', reject)
    })
    t.after(() => server.close())

    const deniedAdd = await request(server, '/api/timeslots/add', {
        method: 'POST',
        body: JSON.stringify({
            barber_id: 1,
            date: '2026-05-02',
            time: '09:15'
        })
    })
    assert.equal(deniedAdd.status, 401)

    const badLogin = await request(server, '/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email: 'customer@example.com',
            password: 'secret'
        })
    })
    assert.equal(badLogin.status, 401)

    const login = await request(server, '/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({
            email: 'barber@example.com',
            password: 'secret'
        })
    })
    assert.equal(login.status, 200)
    assert.equal(login.body.user.role, 'barber')
    assert.ok(login.body.token)
    assert.equal(login.body.user.password_hash, undefined)

    const addSlot = await request(server, '/api/timeslots/add', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${login.body.token}`
        },
        body: JSON.stringify({
            barber_id: 999,
            date: '2026-05-02',
            time: '09:15'
        })
    })
    assert.equal(addSlot.status, 201)
    assert.equal(addSlot.body.data.barber_id, 1)
    assert.equal(addSlot.body.data.time, '09:15:00')

    const availableSlots = await request(server, '/api/timeslots/barber/1?available=true')
    assert.equal(availableSlots.status, 200)
    assert.ok(availableSlots.body.every((slot) => slot.is_available === true))

    const deleteSlot = await request(server, `/api/timeslots/${addSlot.body.data.slot_id}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${login.body.token}`
        }
    })
    assert.equal(deleteSlot.status, 200)
    assert.equal(deleteSlot.body.success, true)

    const deleteMissingSlot = await request(server, '/api/timeslots/9999', {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${login.body.token}`
        }
    })
    assert.equal(deleteMissingSlot.status, 400)
})
