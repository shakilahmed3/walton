import { createClient } from 'redis';

const redisOptions = {
    url: process.env.REDIS_URL,
};

const redisClient = createClient(redisOptions);

redisClient.on('error', (err) => console.log('Redis Client Error', err));

async function initializeRedis() {
    await new Promise<void>((resolve, reject) => {
        redisClient.once('ready', () => {
            console.log('Connected to Redis');
            resolve();
        });

        redisClient.once('error', (err) => {
            console.error('Error connecting to Redis:', err);
            reject(err);
        });
    });
}

initializeRedis();

redisClient.connect()

export default redisClient;
