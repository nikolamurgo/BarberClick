const express = require('express')
const router = express.Router()
const serviceController = require('../controllers/serviceController')

router.get('/all', async (req,res) => {
    try {
        const result = await serviceController.getAllServices()

        if(result.success){
            res.json(result.data)
        }else{
            res.status(500).json(result)
        }
    } catch (err) {
        res.status(500).json({ // 500: internal server error
            success: false,
            message: "server error",
            error: err.message
        })
    }
})

module.exports = router