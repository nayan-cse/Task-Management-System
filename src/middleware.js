import rateLimit from './app/lib/rateLimit';

export async function middleware(req) {
    return await rateLimit(req);
}

export const config = {
    matcher: '/api/v1/:path*',
};
