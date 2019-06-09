const util = require('util')
const express = require('express')
const router = express.Router();
const notes = require('../models/notes-level')

router.get('/add', (req, res, next) => {
	res.render('note-edit', {
		title: 'Add a note',
		doCreate: true,
		noteKey: "",
		note: undefined
	})
})

router.post('/save', async (req, res, next) => {
	const { doCreate, noteKey, title, body } = req.body
	let note = null
	if (doCreate === 'create') {
		note = await notes.create(noteKey, title, body)
	} else {
		note = await notes.update(noteKey, title, body)
	}

	res.redirect(`/notes/view/${noteKey}`)
})

router.get('/view/:key', async (req, res, next) => {
	const requestKey = req.params.key;
	if (!requestKey)
		throw new Error('Must have key query')

	const note = await notes.read(requestKey)

	res.render('note-view', {
		title: note.title,
		noteKey: requestKey,
		note
	})
})

router.get('/edit/:key', async (req, res, next) => {
	const noteKey = req.params.key
	if (!noteKey)
		throw new Error('key must be defined')

	const currentNote = await notes.read(noteKey)

	res.render('note-edit', {
		title: `Edit ${currentNote.title}`,
		doCreate: false,
		noteKey,
		note: currentNote
	})
})

router.get('/destroy/:key', async (req, res, next) => {
	const noteKey = req.params.key
	if (!noteKey)
		throw new Error(`Note with key: ${noteKey} does not exist`)

	notes.destroy(noteKey)
	res.redirect('/')
})

module.exports = router