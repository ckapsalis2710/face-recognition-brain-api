const { redisClient } = require('./sessionManager');

const requireAuth = async (req, res, next) => {
	const { authorization } = req.headers;
	
	if (!authorization) {
		return res.status(401).send('Unauthorized');
	}
	
	try {
		const reply = await redisClient.get(authorization);
		if (!reply) {
			return res.status(401).send('Unauthorized');
		}
		return next();
	} catch (err) {
		console.error('Redis error:', err);
		return res.status(500).send('Server error');
	}
}

module.exports = {
  requireAuth
}