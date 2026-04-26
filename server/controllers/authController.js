const crypto = require('crypto')
const supabase = require('../config/database')

const sessions = new Map()

const hashPassword = (password) => {
    return crypto.createHash('sha256').update(password).digest('hex')
}

const sanitizeUser = (user) => {
    if (!user) {
        return null
    }

    const { password_hash, ...safeUser } = user
    return safeUser
}

const passwordsMatch = (password, storedHash) => {
    if (!password || !storedHash) {
        return false
    }

    return storedHash === password || storedHash === hashPassword(password)
}

const authController = {
    login: async ({ email, password }) => {
        try {
            if (!email || !password) {
                return {
                    success: false,
                    message: 'Email and password are required'
                }
            }

            const { data, error } = await supabase
                .from('User')
                .select('*')
                .eq('email', email)
                .maybeSingle()

            if (error) throw error

            if (!data || !passwordsMatch(password, data.password_hash)) {
                return {
                    success: false,
                    message: 'Invalid email or password'
                }
            }

            if (data.role !== 'barber' && data.role !== 'admin') {
                return {
                    success: false,
                    message: 'Only barbers can access the admin panel'
                }
            }

            const token = crypto.randomBytes(32).toString('hex')
            const user = sanitizeUser(data)
            sessions.set(token, user)

            return {
                success: true,
                message: 'Login successful',
                token,
                user
            }
        } catch (err) {
            return {
                success: false,
                message: 'Error logging in',
                error: err.message
            }
        }
    },

    getSessionUser: (token) => {
        return sessions.get(token)
    },

    logout: (token) => {
        if (token) {
            sessions.delete(token)
        }

        return {
            success: true,
            message: 'Logout successful'
        }
    },

    hashPassword
}

module.exports = authController
