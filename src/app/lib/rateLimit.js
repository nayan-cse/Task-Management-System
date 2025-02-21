import { RateLimiterMemory } from 'rate-limiter-flexible';
import { NextResponse } from 'next/server';

const rateLimiter = new RateLimiterMemory({
    points: 10,
    duration: 60,
    blockDuration: 60,
    keyPrefix: 'rate-limit',
});

export default async function rateLimit(req) {
    try {

        const ip = req.headers['x-forwarded-for'] ?
            req.headers['x-forwarded-for'].split(',')[0] :
            req.socket ? .remoteAddress || '127.0.0.1';

        console.log("Checking rate limit for IP:", ip);

        await rateLimiter.consume(ip);

        return NextResponse.next();
    } catch (err) {
        console.log("Rate limit exceeded for IP:", req.headers['x-forwarded-for'] || req.socket ? .remoteAddress || '127.0.0.1');
        return new NextResponse(
            JSON.stringify({ error: 'Too many requests, please slow down!' }), { status: 429, headers: { 'Content-Type': 'application/json' } }
        );
    }
}
