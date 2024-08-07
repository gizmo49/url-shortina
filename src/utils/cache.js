const NodeCache = require('node-cache');
const dotenv = require('dotenv');
dotenv.config();

// Initialize NodeCache instance
const cacheService = new NodeCache({
    stdTTL: parseInt(process.env.CACHE_TTL || '3600'), // Cache TTL in seconds (default: 1 hour)
    checkperiod: 120, // How often to check and delete expired keys (default: 120 seconds)
    useClones: false, // Disable cloning of cached values (if necessary)
});

module.exports.cache = {
    get: async (key) => {
        return cacheService.get(key);
    },

    set: async (key, value, ttl) => {
        if (ttl) {
            cacheService.set(key, value, ttl);
        } else {
            cacheService.set(key, value);
        }
    },

    del: async (key) => {
        cacheService.del(key);
    },
};
