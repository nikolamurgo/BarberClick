const authController = require('../controllers/authController')

const requireBarberAuth = (req, res, next) => {
    const authHeader = req.headers.authorization || ''
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
    const user = authController.getSessionUser(token)

    if (!user) {
        return res.status(401).json({
            success: false,
            message: 'Login required'
        })
    }

    if (user.role !== 'barber' && user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Barber access required'
        })
    }

    req.user = user
    next()
}

module.exports = {
    requireBarberAuth
}
