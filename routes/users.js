const path = require('path')
const util = require('util')
const express = require('express')
const passport = require('passport')
const passportLocal = require('passport-local')
const usersModel = require('../models/notes-superagent')

const LocalStrategy = passportLocal.Strategy
const router = express.Router()

exports.initPassport = function initPassport(app) {
	app.use(passport.initialize())
	app.use(passport.session())
}

exports.ensureAuthenticated = function ensureAuthenticated(req, res, next) {
	try {
		// req.user is set by Passport in the deserialize function 
		if (req.user) next()
		else res.redirect('/users/login')
	} catch (e) { next(e) }
}

router.get('/login', function (req, res, next) {
	try {
		res.render('login', { title: "Login to Notes", user: req.user, })
	} catch (e) { next(e) }
})

router.post('/login',
	passport.authenticate('local', {
		successRedirect: '/', // SUCCESS: Go to home page 
		failureRedirect: 'login', // FAIL: Go to /user/login 
	})
)

router.get('/logout', function (req, res, next) {
	try {
		req.session.destroy()
		req.logout()
		res.clearCookie(sessionCookieName)
		res.redirect('/')
	} catch (e) { next(e) }
})

passport.use(new LocalStrategy(
	async (username, password, done) => {
		try {
			var check = await usersModel.userPasswordCheck(username,
				password)
			if (check.check) {
				done(null, { id: check.username, username: check.username })
			} else {
				done(null, false, check.message)
			}
		} catch (e) { done(e) }
	}
))

passport.serializeUser(function (user, done) {
	try {
		done(null, user.username);
	} catch (e) { done(e); }
});

passport.deserializeUser(async (username, done) => {
	try {
		var user = await usersModel.find(username);
		done(null, user);
	} catch (e) { done(e); }
});

exports.router = router