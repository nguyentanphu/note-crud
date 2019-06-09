const express = require('express')
const router = express.Router()
const notes = require('../models/notes-level')

/* GET home page. */
router.get('/', async function (req, res, next) {
	const keyList = await notes.keyList()
	const keyListPromises = keyList.map(k => notes.read(k))

	const noteList = await Promise.all(keyListPromises)
	console.log(noteList)
	res.render('index', { title: 'Note', noteList })
})

module.exports = router
