//ts-check
const fs = require('fs-extra')
const util = require('util')
const path = require('path')
const jsyaml = require('js-yaml')
const Sequelize = require('sequelize')

const Note = require('./note')

let SqlNote;
let sequlz;
async function connectDb() {
	if (!sequlz) {
		// const yamlConfig = await fs.readFile(path.join(__dirname, 'models/se'), 'utf-8')

		// const params = jsyaml.safeLoad(yamlConfig)
		// @ts-ignore
		sequlz = new Sequelize('Notes', 'sa', '123456', {
			dialect: 'mssql',
			host: 'localhost',
			port: 1434
		})
	}

	if (SqlNote) return SqlNote.sync()

	SqlNote = sequlz.define('Note', {
		noteKey: { type: Sequelize.STRING, primary: true, unique: true},
		title: Sequelize.STRING,
		body: Sequelize.TEXT
	})

	return SqlNote.sync()
}

exports.create = async (key, title, body) => {
	const SqlNote = await connectDb()
	const note = new Note(key, title, body)

	await SqlNote.create({noteKey: key, title, body})
	return note
}

exports.update = async (key, title, body) => {
	const SqlNote = await connectDb()
	
	const dbNote = await SqlNote.findOne({
		where: { noteKey: key }
	})

	if (!dbNote) {
		throw new Error(`No note found for ${key}`)
	}
	else {
		await dbNote.update({
			title,
			body
		})
	}

	return new Note(key, title, body)
}

exports.read = async (key) => {
	const SqlNote = await connectDb()
	const dbNote = await SqlNote.findOne({
		where: {
			noteKey: key
		}
	})

	if (!dbNote) {
		throw new Error(`No note found for ${key}`)
	}
	else {
		return new Note(dbNote.noteKey, dbNote.title, dbNote.body)
	}
}

exports.destroy = async (key) => {
	const SqlNote = await connectDb()

	const dbNote = await SqlNote.find({
		where: { noteKey: key }
	})

	await dbNote.destroy()
}

exports.keyList = async () => {
	const SqlNote = await connectDb()

	const notes = await SqlNote.findAll({attributes: ['noteKey']})
	return notes.map(n => n.noteKey)
}

exports.count = async () => {
	const SQNote = await connectDb()
    const count = await SQNote.count()
    return count; 
}

exports.close = () => {
	if (sequlz) sequlz.close()

	sequlz = undefined
	SqlNote = undefined
}