const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

// supabase config
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing SUPABASE_URL or SUPABASE_KEY in server environment')
}

// create supabase client
const supabase = createClient(supabaseUrl, supabaseKey)
const supabaseAdmin = supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    })
    : null

supabase.admin = supabaseAdmin
supabase.hasAdminClient = Boolean(supabaseAdmin)

module.exports = supabase
