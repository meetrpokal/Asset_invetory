import { Queue } from "bullmq";
import dotenv from "dotenv";
dotenv.config();

export const complaintQueue = new Queue("complaint-queue", {
    connection: {
        host: process.env.REDIS_HOST || '127.0.0.1',
        port: parseInt(process.env.REDIS_PORT, 10) || 6379,
        password: process.env.REDIS_PASSWORD || '',
    }
})