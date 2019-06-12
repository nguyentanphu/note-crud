const request = require('superagent')
const url = require('url')
const URL = url.URL

function reqURL(path) {
	const requrl = new URL(process.env.USER_SERVICE_URL);
	requrl.pathname = path;
	return requrl.toString();
}
exports.create = async function create(username, password,
	provider, familyName, givenName, middleName,
	emails, photos) {
	var res = await request
		.post(reqURL('/create-user'))
		.send({
			username, password, provider,
			familyName, givenName, middleName, emails, photos
		})
		.set('Content-Type', 'application/json')
		.set('Acccept', 'application/json')
		.auth('them', 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF');
	return res.body;
}

exports.update = async function update(username, password,
	provider, familyName, givenName, middleName,
	emails, photos) {
	var res = await request
		.post(reqURL(`/update-user/${username}`))
		.send({
			username, password, provider,
			familyName, givenName, middleName, emails, photos
		})
		.set('Content-Type', 'application/json')
		.set('Acccept', 'application/json')
		.auth('them', 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF');
	return res.body;
}

exports.find = async function find(username) {
	var res = await request
		.get(reqURL(`/find/${username}`))
		.set('Content-Type', 'application/json')
		.set('Acccept', 'application/json')
		.auth('them', 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF');
	return res.body;
}

exports.userPasswordCheck = async function userPasswordCheck(username, password) {
	var res = await request
		.post(reqURL(`/passwordCheck`))
		.send({ username, password })
		.set('Content-Type', 'application/json')
		.set('Acccept', 'application/json')
		.auth('them', 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF');
	return res.body;
}

exports.findOrCreate = async function findOrCreate(profile) {
	var res = await request
		.post(reqURL('/find-or-create'))
		.send({
			username: profile.id, password: profile.password,
			provider: profile.provider,
			familyName: profile.familyName,
			givenName: profile.givenName,
			middleName: profile.middleName,
			emails: profile.emails, photos: profile.photos
		})
		.set('Content-Type', 'application/json')
		.set('Acccept', 'application/json')
		.auth('them', 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF');
	return res.body;
}

exports.listUsers = async function listUsers() { 
    var res = await request
        .get(reqURL('/list'))
        .set('Content-Type', 'application/json')
        .set('Acccept', 'application/json')
        .auth('them', 'D4ED43C0-8BD6-4FE2-B358-7C0E230D11EF'); 
    return res.body;
}