const level = require('level')

const Note = require('./note')

let db
async function connectDb() {
  if (db) return db

  db = await level(
    process.env.LEVELDB_LOCATION || 'notes.level',
    {
      createIfMissing: true,
      valueEncoding: 'json'
    }
  )

  return db
}

async function crupdate(key, title, body) {
  const db = await connectDb()
  var note = new Note(key, title, body)
  await db.put(key, note.JSON)
  return note
}

exports.create = function (key, title, body) {
  return crupdate(key, title, body)
}

exports.update = function (key, title, body) {
  return crupdate(key, title, body)
}

exports.read = async (key) => {
  const db = await connectDb()

  return Note.fromJSON(await db.get(key))
}

exports.destroy = async (key) => {
  const db = await connectDb()
  await db.del(key)
}

exports.keyList = async () => {
  const db = await connectDb()

  const keys = []
  await new Promise((resolve, reject) => {
    // @ts-ignore
    db.createKeyStream()
      .on('data', (data) => {
        keys.push(data)
      })
      .on('error', (err) => {
        reject(err)
      })
      .on('end', () => {
        resolve(keys)
      })
  })

  return keys
}

exports.count = async () => {
  return (await exports.keyList()).length
}

exports.close = async () => {
  const _db = db
  db = undefined

  return _db ? _db.close() : undefined
}