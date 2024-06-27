import Redis from 'ioredis';
const dotenv = require('dotenv');
dotenv.config();  

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD || undefined,
});

redis.on('connect', () => {
    console.log('Connected to Redis');
});

redis.on('error', (err) => {
    console.error('Redis connection error:', err);
});

export const cache = {
    get: async (key: string): Promise<string | null> => {
        const value = await redis.get(key);
        return value;
    },
    set: async (key: string, value: string, ttl?: number): Promise<void> => {
        if (ttl) {
            await redis.set(key, value, 'EX', ttl);
        } else {
            await redis.set(key, value);
        }
    },
    del: async (key: string): Promise<void> => {
        await redis.del(key);
    },
};
