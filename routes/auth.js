const express = require('express')
const router = express.Router()
const User = require('../models/User')
const bcrypt = require('bcrypt')
const emailValidator = require('email-validator')
const jwt = require('jsonwebtoken')

function generateAccessToken(user){
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1800s'})
}

router.post('/login', async (req, res) => {
    try{
        if(!emailValidator.validate(req.body.email)){
            return res.json({message: 'Invalid email'})
        }
        const user = await User.findOne({email: req.body.email})
        if(user){
            if(await bcrypt.compare(req.body.password, user.password)){
                const accessToken = generateAccessToken({email: user.email, role: user.role})
                res.json({message: 'Login successful', token: accessToken})
            }else{
                res.json({message: 'Login failed'})
            }
        }else{
            res.json({message: 'User not found'})
        }
    }catch(error){
        res.json({message: error.message})
        console.log(error.message)
    }
})

router.post('/register', async (req, res) => {
    try{
        if(!emailValidator.validate(req.body.email)){
            return res.json({message: 'Invalid email'})
        }
        const user = new User({
            email: req.body.email,
            password: req.body.password,
            role: req.body.role
        })
        user.password = await bcrypt.hash(user.password, 10)
        const savedUser = await user.save()
        const accessToken = generateAccessToken({email: savedUser.email, role: savedUser.role})
        res.json({message: 'User created', token: accessToken})
    }catch(error){
        res.json({message: error.message})
        console.log(error.message)
    }
})

module.exports = router