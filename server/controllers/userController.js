const supabase = require('../config/database')

const userController = {
    getAllUsers: async () => {
        try{
            const { data, error } = await supabase
            .from('User')
            .select('*')

            if(error) throw error

            return {
                success: true,
                data: data
            }
        }catch(err){
            return {
                success: false,
                message: 'Error fetching all users'
            }
        }
    }
}

module.exports = userController