import { Queue } from "bullmq";
import redis from "../config/redis.js"


const ingestionQueue = new Queue('ingestion', {
    connection: redis,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: false,
    },
})


export const addIngestionJob = async (documentId, filePath, userId) => {
    await ingestionQueue.add('ingest-document', {
        documentId,
        filePath,
        userId,
    })
}

export default ingestionQueue;