import type { Request, Response, NextFunction } from "express";

export function apiKey(req: Request, res: Response, next: NextFunction): void {
    const key = req.header("x-api-key");

    if (!process.env.API_KEY || key !== process.env.API_KEY) {
        res.status(401).json({ error: "Missing or invalid API key" });
        return;
    }

    next();
}