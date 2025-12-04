const { createSession, redisClient } = require('./sessionManager');

const handleSignin = (db, bcrypt, req, res) => {
	const { email, password } = req.body;
	if (!email || !password) {
		return Promise.reject('incorrect form submission');
	}
	return db.select('email', 'hash').from('login')
	.where('email', '=', email)
	.then(data => {
		const isValid = bcrypt.compareSync(password, data[0].hash);
		if (isValid) {
			return db.select('*').from('users')
			.where('email', '=', email)
			.then(user => user[0])
			.catch(err => Promise.reject('unable to get user'));
		} else {
			return Promise.reject('wrong credentials');
		}
	})
	.catch(err => Promise.reject('Wrong credentials'));
}

// Asynch getAuthTokenId
const getAuthTokenId = async (req, res, authorization) => {
	try {
		const reply = await redisClient.get(authorization);
		if (!reply) {
			return res.status(401).send('Unauthorized');
		}
		return res.json({ id: reply });
	} catch (err) {
		console.error('Redis error:', err);
		return res.status(500).send('Server error');
	}
}

const signinAuthiedication = (db, bcrypt) => async (req, res) => {
	const { authorization } = req.headers;

	if (authorization) { // in case of refresh will pass again from signin page, because is the default page
		return getAuthTokenId(req, res, authorization);
	}

	try {
		const userData = await handleSignin(db, bcrypt, req, res);

		if (userData.id && userData.email) {
			const session = await createSession(userData);
			if (session.success) {
		        return res.json(session);
		      } else {
		        return res.status(500).json(session);
		      }
		} else {
			return res.status(400).json('Invalid credentials');
		}
	} catch (err) {
    	return res.status(400).json(err);
	}
}

module.exports = {
	signinAuthiedication: signinAuthiedication
};
