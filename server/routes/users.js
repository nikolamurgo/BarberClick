const express = require('express')
const router = express.Router()
const supabase = require('../config/database')

//get all users
router.get('/all', async (req,res) =>{
    try{
        const { data, error } = await supabase
        .from('User')
        .select('*')

        //check if supabase returns an error
        if(error) throw error

        res.json({
            success:true,
            data: data
        })
    }catch(err){
        res.status(500).json({ // 500: internal server error
            success: false,
            message: "error fetching all users",
            error: err.message
        })
    }
})

module.exports = router