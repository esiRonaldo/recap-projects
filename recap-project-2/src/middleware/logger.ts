import type { Request, Response, NextFunction } from "express";
import { appendFile, mkdirSync } from "node:fs";

mkdirSync("logs", { recursive: true });

export function logger(req: Request, res: Response, next: NextFunction): void {
    res.on("finish", () => {
        const line = `${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode}\n`;

        appendFile("logs/access.log", line, (err) => {
            if (err) console.error("Could not write access log:", err);
        });
    });

    next();
}