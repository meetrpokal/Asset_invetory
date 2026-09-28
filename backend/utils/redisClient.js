import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const client = createClient({
    socket: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    },
    password: process.env.REDIS_PASSWORD || '',
});

client.on("error", (err) => console.error("Redis error:", err.message));

// Don't halt the app on top-level await if Redis is down
client.connect().catch(err => console.error("Initial Redis connection failed:", err.message));

export default client;