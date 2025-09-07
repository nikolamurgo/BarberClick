const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// supabase config
const supabaseUrl = 'https://mnwyaktmvhfkrqgrtaeo.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

// create supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

const testConnection = async () =>{
    try{
        await supabase.from('test').select('*')
        console.log("Connected to db successfully")
    }catch(err){
        console.error("dbcon failed", err.message)
    }
}

testConnection()

module.exports = supabase