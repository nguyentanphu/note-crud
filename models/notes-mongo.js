const util = require('util')
const MongoClient = require('mongodb').MongoClient

const Note = require('./note')


let connectedClient
async function connectDb() {
  if (!connectedClient) {
    const mongoClient = new MongoClient(process.env.MONGO_URL || 'mongodb://localhost:27017', { useNewUrlParser: true })
    connectedClient = await mongoClient.connect()
  }

  return {
    db: connectedClient.db(process.env.MONGO_DBNAME || 'notes-mongo'),
    client: connectedClient
  }
}

exports.create = async (key, title, body) => {
  const { db, client } = await connectDb()
  const note = new Note(key, title, body)

  const collection = db.collection('notes')
  await collection.insertOne({
    noteKey: key,
    title,
    body
  })
  return note
}

exports.update = async (key, title, body) => {
  const { db, client } = await connectDb()

  const note = new Note(key, title, body)
  const collection = db.collection('notes')
  await collection.updateOne({ noteKey: key }, { $set: { title, body } })
  return note
}

exports.read = async (key) => {
  const { db, client } = await connectDb()
  const collection = db.collection('notes')

  const { noteKey, title, body } = await collection.findOne({ noteKey: key })
  return new Note(noteKey, title, body)
}

exports.destroy = async (key) => {
  const { db, client } = await connectDb()
  const collection = db.collection('notes')

  await collection.findOneAndDelete({ noteKey: key })
}

exports.keyList = async () => {
  const { db, client } = await connectDb()
  const collection = db.collection('notes')

  const keys = await new Promise((resolve, reject) => {
    const keyList = []
    collection.find({}).forEach(note => {
      keyList.push(note.noteKey)
    }, err => {
      if (err) reject(err)
      else resolve(keyList)
    })
  })

  return keys
}

exports.count = async () => {
  const { db, client } = await connectDb()
  const collection = db.collection('notes')

  const count = await collection.count({})
  return count
}

exports.close = async () => {
  if (connectedClient) connectedClient.close()

  connectedClient = undefined
}