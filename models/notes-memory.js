const Note = require('./note')

const notes = []

exports.update = exports.create = async function (key, title, body) {
	notes[key] = new Note(key, title, body)
	return notes[key]
}

exports.read = async function (key) {
	if (notes[key])
		return notes[key]

	throw new Error(`Note with ${key} does not exist`)
}

exports.destroy = async function (key) {
	if (notes[key])
		return delete notes[key]

	throw new Error(`Note with ${key} does not exist`)
}

exports.keyList = async function () {
	return Object.keys(notes)
}

exports.count = async function () {
	return notes.length
}

exports.close = async function () { }