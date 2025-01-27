const express = require('express')
const router = express.Router()
const Project = require('../models/Project')
const jwt = require('jsonwebtoken')
const authenticateToken = require('../middlewares/authenticateToken').authenticateToken
const checkRole = require('../middlewares/checkRole').checkRole
const validateProject = require('../middlewares/validateProject').validateProject

router.get('/all', authenticateToken ,async (req, res) => {
    try{
        const projects = await Project.find()
        res.json(projects)
    }catch(error){
        res.json({message: error})
    }
})

router.post('/create', authenticateToken , checkRole(['admin']) , validateProject ,async (req, res) => {
    const project = new Project({
        name: req.body.name,
        description: req.body.description
    })
    try{
            const savedProject = await project.save()
            res.json({message: 'Project created', project: savedProject})
    }catch(error){
        res.json({message: error.message})
    }
})

router.get('/byId/:id', authenticateToken ,async (req, res) => {
    try{
        const project = await Project.findById(req.params.id)
        if(project){
            res.json(project)
        }else{
            res.json({message: 'Project not found'})
        }
    }catch(error){
        res.json({message: error})
    }
})

router.delete('/delete/:id', authenticateToken , checkRole(['admin']) , validateProject ,async (req, res) => {
    try{
            const removedProject = await Project.deleteOne({_id: req.params.id})
            if(removedProject.deletedCount > 0){
                res.json({message: 'Project deleted'})
            }else{
                res.json({message: 'Project not found'})
            }
    }catch(error){
        res.json({message: error})
    }
})

router.patch('/update/:id', authenticateToken , checkRole(['admin']) ,async (req, res) => {
    try{
            const updatedProject = await Project.updateOne(
                {_id: req.params.id},
                {$set: {name: req.body.name, description: req.body.description}}
            )
            if(updatedProject){
                res.json({message: 'Project updated'})
            }else{
                res.json({message: 'Project not found'})
            }
    }catch(error){
        res.json({message: error})
    }
})

module.exports = router