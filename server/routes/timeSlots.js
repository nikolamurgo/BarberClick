const express = require('express')
const router = express.Router()
const timeSlotController = require('../controllers/timeSlotController')
const { requireBarberAuth } = require('../middleware/authMiddleware')

router.get('/barber/:barberId', async (req, res) => {
    try {
        const onlyAvailable = req.query.available === 'true'
        const result = await timeSlotController.getSlotsByBarber(req.params.barberId, onlyAvailable)

        if (result.success) {
            res.json(result.data)
        } else {
            res.status(400).json(result)
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'server error',
            error: err.message
        })
    }
})

router.post('/add', requireBarberAuth, async (req, res) => {
    try {
        const slotData = {
            ...req.body,
            barber_id: req.user.role === 'admin' ? req.body.barber_id : req.user.user_id
        }
        const result = await timeSlotController.addSlot(slotData)

        if (result.success) {
            res.status(201).json(result)
        } else {
            res.status(400).json(result)
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'server error',
            error: err.message
        })
    }
})

router.patch('/:slotId/availability', requireBarberAuth, async (req, res) => {
    try {
        const barberId = req.user.role === 'admin' ? null : req.user.user_id
        const result = await timeSlotController.updateSlotAvailability(req.params.slotId, req.body.is_available, barberId)

        if (result.success) {
            res.json(result)
        } else {
            res.status(400).json(result)
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'server error',
            error: err.message
        })
    }
})

router.delete('/:slotId', requireBarberAuth, async (req, res) => {
    try {
        const barberId = req.user.role === 'admin' ? null : req.user.user_id
        const result = await timeSlotController.deleteSlot(req.params.slotId, barberId)

        if (result.success) {
            res.json(result)
        } else {
            res.status(400).json(result)
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'server error',
            error: err.message
        })
    }
})

module.exports = router
