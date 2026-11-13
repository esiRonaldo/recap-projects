import type { Request, Response, NextFunction } from "express";

const LIMIT = 5;
const WINDOW_MS = 60 * 1000;

const requests = new Map<string, { count: number; start: number }>();

export function rateLimit(req: Request, res: Response, next: NextFunction): void {
    const key = req.header("x-api-key") ?? "";
    const now = Date.now();
    const entry = requests.get(key);

    if (!entry || now - entry.start >= WINDOW_MS) {
        requests.set(key, { count: 1, start: now });
        next();
        return;
    }

    if (entry.count >= LIMIT) {
        res.status(429).json({ error: "Too many requests, try again in a minute" });
        return;
    }

    entry.count++;
    next();
}
