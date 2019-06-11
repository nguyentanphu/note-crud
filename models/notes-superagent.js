const request = require('superagent')
const url = require('url')
const URL = url.URL

function reqURL(path) {
	const requrl = new URL(process.env.USER_SERVICE_URL);
	requrl.pathname = path;
	return requrl.toString();
}
export async function create(username, password,
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

export async function update(username, password,
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