import { Worker } from "bullmq";
import redis from "../config/redis.js";
import { ingestDocument } from "../services/ingestion.service.js";

const worker = new Worker('ingestion', async (job) => {
    async (job) => {
        const {documentId, filePath} = job.data
        console.log(`Processing job ${job.id} for document ${documentId}`)
        await ingestDocument(documentId, filePath)
    },
    {
        connection: redis,
        concurrency: 2,
    }
})

worker.on('completed', (job) => {
    console.log(`Job ${job.id} completed successfully`)
})

worker.on('failed', (job, err) => {
    console.error(`Job ${job.id} failed:`, err.message)
})  

export default worker;