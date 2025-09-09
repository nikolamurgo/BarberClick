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
    },

    getBarbers: async () =>{
        try {
            const { data, error } = await supabase
            .from('User')
            .select('*')
            .eq('role', 'barber')

            if(error) throw error

            return{
                success: true,
                data: data
            }
            
        } catch (err) {
            return{
                success: false,
                message: "Error fetching barbers"
            }
        }
    },

    addUser: async (userData) =>{
        try {
            // validate the required fields
            if(!userData.email){
                return{
                    success:false,
                    message: 'Email is required'
                }
            }else if(!userData.first_name || !userData.last_name){
                return{
                    success:false,
                    message: 'Name is required'
                }
            }else if(!userData.phone_number){
                return{
                    success:false,
                    message: 'Phone number is required'
                }
            }else if(!userData.role){
                return{
                    success:false,
                    message: 'Role is required'
                }
            }

            const { data, error } = await supabase
            .from('User')
            .insert([{
                email: userData.email,
                password_hash: userData.password_hash,
                first_name: userData.first_name,
                last_name: userData.last_name,
                phone_number: userData.phone_number,
                role: userData.role,
                is_available: userData.is_available
            }])
            .select() // return the inserted data

            if(error) throw error

            return{
                success: true,
                message: 'User created successfully',
                data: data[0]
            }
        } catch (err) {
            return{
                success:false,
                message: 'error creating user',
                error: err.message
            }
        }
    }
}

module.exports = userController