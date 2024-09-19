import { RedisModuleAsyncOptions } from "@nestjs-modules/ioredis";

require('dotenv').config();
// use this file for running migration
export const redisOptions: RedisModuleAsyncOptions = {
    useFactory: () => ({
        type: 'single',
        options:{
            host: process.env.REDIS_HOST,
            // host: 'localhost',
            port: +process.env.REDIS_PORT
    }
})}
export default redisOptions;