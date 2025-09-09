const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

//get all users
router.get('/all', async (req,res) =>{
    try{
        const result = await userController.getAllUsers()

        if(result.success){
            res.json(result.data)
        }else{
            res.status(500).json(result)
        }
    }catch(err){
        res.status(500).json({ // 500: internal server error
            success: false,
            message: "server error",
            error: err.message
        })
    }
})

router.get('/barbers', async (req,res) =>{
    try {
        const result = await userController.getBarbers()
        if(result){
            res.json(result.data)
        }else{
            res.status(500).json(result)
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'server error',
            error: err.message
        })
    }
})

router.post('/adduser', async (req,res) =>{
    try {
        // call the controller function with the request body data
        const result = await userController.addUser(req.body)
        if(result.success){
            res.status(201).json(result) // created
        }else{
            res.status(400).json(result) // bad request
        }
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'server error',
            error: err.message
        })
    }
})
module.exports = router