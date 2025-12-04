const { redisClient } = require('./sessionManager');

const deleteRedisEntry = async (req, res) => {
	const { authorization } = req.headers;

	if (!authorization) {
		return res.status(400).json({ error: 'No Token sent from browser' });
	}

	try {
		const tokenExists = await redisClient.exists(authorization);
		if (!tokenExists) {
			return res.status(200).json({ message: 'No token to be deleted'});
		} else {
			const delReplay = await redisClient.del([authorization]);
			if (delReplay) {
				console.log('✅ Token successfully deleted in Redis DB');
				return res.status(200).json({ message: 'Token successfully deleted'});
			}
		}
		return res.status(500).json({ error: 'Failed to delete token' });
	} catch (err) {
		console.error('Redis error during signout:', err);
		return res.status(500).json({ error: 'Redis error during signout'});
	}
}

module.exports = {
  deleteRedisEntry
}