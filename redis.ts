// redis.js
const redis = require('redis');
const config = require('config');

const redisClient = redis.createClient({
  url: config.get('REDIS_URL')
});

redisClient.on('error', (err: any) => {
  console.error('Error connecting to Redis:', err);
});

redisClient.on('connect', () => console.log('Connected to Redis!'));

export default redisClient;
