import { Queue, Worker } from "bullmq"
import { defaultQueueConfig, redisConnection } from "../config/queue";
import logger from "../config/logger";

export const emailQueueName = 'email-queue';

export const emailQueue = new Queue(emailQueueName, {
    connection: redisConnection,
    defaultJobOptions: defaultQueueConfig})


export const handler = new Worker(emailQueueName,
     async(job)=>{
    console.log("the email worker data is:: ", job.data)
}, {
    connection: redisConnection
})



handler.on("completed", (job) => {
    logger.info({ job:job , message: "Job completed"   })
    console.log(`job is ${job.id} is completed`)
})

handler.on("failed", (job) => {
    console.log(`job ${job?.id} is failed`)
})
