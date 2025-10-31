const jwt = require('jsonwebtoken');
const redis = require('redis');

const getRedisConfig = () => {
  if (process.env.NODE_ENV === 'production') {
    return {
      url: process.env.REDIS_URL,
      socket: {
        tls: true,
        rejectUnauthorized: false
      }
    };
  } else {
    return {
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    };
  }
};

const redisClient = redis.createClient(getRedisConfig());

redisClient.on('connect', () => {
  console.log('✅ Connected to Redis -', process.env.NODE_ENV);
});

redisClient.on('error', (err) => {
  console.log('❌ Redis error:', err.code);
});

redisClient.connect().catch(console.error);

const signToken = (email) => {
  const jwtPayload = { email };
  return jwt.sign(jwtPayload, process.env.JWT_SECRET_KEY || 'JWT_SECRET_KEY', { expiresIn: '2 days'});
};

const setToken = (token, userId) => {
  return redisClient.set(token, userId.toString(), {
    EX: 60 * 60 * 24 * 2, // 2 days in seconds
    NX: true // Set if Not eXists
  });
};

const createSession = async (user) => {
  try {
    const { email, id } = user;
    const token = signToken(email);
    
    if (redisClient.isOpen) {
      await setToken(token, id);
      console.log('✅ Token stored in Redis for user:', email);
    } else {
      console.log('⚠️ Redis not available - session will not persist');
    }

    return { success: true, userId: id, token };
  } catch (err) {
    console.error('Session creation error:', err);
    return { success: false, error: err.message };
  }
};

const test_RedisDb = async (req, res) => {
  try {
    await redisClient.set('health-check', 'ok');
    const value = await redisClient.get('health-check');
    res.json({ redis: value === 'ok' ? 'working' : 'broken' });
  } catch (err) {
    res.json({ redis: 'error', error: err.message });
  }
}

module.exports = {
	createSession: createSession,
	redisClient: redisClient,
  test_RedisDb: test_RedisDb
}