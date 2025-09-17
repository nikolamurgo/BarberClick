const supabase = require('../config/database')

const serviceController = {
    getAllServices : async () =>{
        try {
            const { data, error } = await supabase
            .from('Service')
            .select('*')

            if (error) throw error

            return{
                success: true,
                data: data
            }
        } catch (err) {
            return {
                success: false,
                message: 'Error fetching all services'
            }
        }
    }
}

module.exports = serviceController