const createError = require('http-errors')
const express = require('express')
const session = require('express-session')
const sessionFileStore = require('session-file-store')
const hbs = require('hbs')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const fs = require('fs-extra')
const rfs = require('rotating-file-stream')
const debug = require('debug')('notes:error')

const indexRouter = require('./routes/index')
const notesRouter = require('./routes/notes')

const FileStore = sessionFileStore(session)
const { router: users, initPassport } = require('./routes/users')

const sessionCookieName = 'notescookie.sid'

process.on('uncaughtException', (err) => {
  debug("I've crashed!!! - " + (err.stack || err));
})

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'hbs')
hbs.registerPartials(path.join(__dirname, 'views/partials'))


if (process.env.REQUEST_LOG_FILE) {
  (async () => {
    const logDirectory = path.dirname(process.env.REQUEST_LOG_FILE)
    await fs.ensureDir(logDirectory)
    // @ts-ignore
    return rfs(process.env.REQUEST_LOG_FILE, {
      size: '10M',
      interval: '1d',
      compress: 'gzip'
    })
  })().catch(error => { console.error(error) })
}
if (process.env.REQUEST_LOG_FILE) {
  // @ts-ignore
  const logStream = rfs(process.env.REQUEST_LOG_FILE, {
    size: '10M',
    interval: '1d',
    compress: 'gzip'
  })
  app.use(logger('common', {
    stream: logStream
  }));
}

app.use(logger('dev'));

app.use(session({
	store: new FileStore({ path: 'sessions' }),
	secret: 'keyboard mouse',
	resave: true,
	saveUninitialized: true,
	name: this.sessionCookieName
}))

initPassport(app)

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/assets/vendors/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist')))
app.use('/assets/vendors/jquery', express.static(path.join(__dirname, 'node_modules/jquery')))
app.use('/assets/vendors/popper.js', express.static(path.join(__dirname, 'node_modules/popper.js/dist')))

app.use('/', indexRouter)
app.use('/notes', notesRouter)
app.use('/users', users)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.log(err, 'errrrrrrrrrrrrr')
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = {
	app,
	sessionCookieName
}
