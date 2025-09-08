const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// supabase config
const supabaseUrl = 'https://mnwyaktmvhfkrqgrtaeo.supabase.co'
const supabaseKey = process.env.SUPABASE_KEY

// create supabase client
const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase