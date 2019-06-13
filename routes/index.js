const express = require('express')
const router = express.Router()
const notes = require('../models/notes-sequelize')

/* GET home page. */
router.get('/', async function (req, res, next) {
	const keyList = await notes.keyList()
	const keyListPromises = keyList.map(k => notes.read(k))

	const noteList = await Promise.all(keyListPromises)
	res.render('index', { 
		title: 'Note', 
		noteList,
		user: req.user ? req.user : undefined
	})
})

module.exports = router
