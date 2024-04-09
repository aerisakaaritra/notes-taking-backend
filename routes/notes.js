const express = require('express')
const fetchUser = require('../middlewares/fetchUser')
const Notes = require('../models/Content')
const { body, validationResult } = require('express-validator')
const router = express.Router()

// Route - 1

router.get('/fetchnotes', fetchUser, async(req, res) => {
    
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Internal Server Error!')
    }
})

// Route - 2

router.post('/addnotes',fetchUser, [
    body('title', 'title must be minimum of 3 characters').isLength({ min: 3 }),
    body('note', 'note must be minimum of 3 characters').isLength({ min: 3 }),
], async(req, res) => {

    // if error exists returning with bad request and the errors
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() })
    }

    try {
        const page = new Notes({
            title, note, tag, user: req.user.id
        })
        const savedpage = await page.save()
        res.json(savedpage)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Internal Server Error!')
    }
})

// Route - 3

router.put('/updatenote/:id', fetchUser, async(req, res) => {
    const {title, note, tag} = req.body

    try {
        const updateNote = {}
        if(title){updateNote.title = title}
        if(note){updateNote.note = note}
        if(tag){updateNote.tag = tag}
    
        // find the note to be updated and update it
        let update = await Notes.findById(req.params.id)
        if(!update){
            return res.status(401).send('Not Found')
        }
        // authenthenticating the note with related user
        if(update.user.toString() !== req.user.id){
            return res.status(401).send('Not Allowed')
        }
        update = await Notes.findByIdAndUpdate(req.params.id, {$set: updateNote}, {new: true})
        res.json(update)
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Internal Server Error!')
    }
})

// Route - 4

router.delete('/deletenote/:id', fetchUser, async(req, res) => {
    const {title, note, tag} = req.body

    try {
        // find the note to be deleted and delete it
        let update = await Notes.findById(req.params.id)
        if(!update){
            return res.status(401).send('Not Found')
        }
        // authenthenticating the note with related user
        if(update.user.toString() !== req.user.id){
            return res.status(401).send('Not Allowed')
        }
        update = await Notes.findByIdAndDelete(req.params.id)
        res.json({"Success": "Note has been deleted", update: update})
    } catch (error) {
        console.error(error.message)
        res.status(500).send('Internal Server Error!')
    }
})

module.exports = router