const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.post('/login', async (req, res) => {
    try {
        const result = await authController.login(req.body)

        if (result.success) {
            res.json(result)
        } else {
            res.status(401).json(result)
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'server error',
            error: err.message
        })
    }
})

router.post('/logout', (req, res) => {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    res.json(authController.logout(token))
})

module.exports = router
