import Redis  from "ioredis";


async function connectRedis(): Promise<Redis> {
    const client: Redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
}
)

client.on('connect', () => console.log('✅ Redis Cache connected.'));
client.on('error', (err) => console.error('❌ Redis Cache Error:', err));
return client
}

export const CACHE_EXPIRATION_SECONDS = 3600

export default connectRedis