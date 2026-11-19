import type { Request, Response, NextFunction } from "express";

export function apiErrorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
    const status = err.status ?? 500;

    if (status === 500) console.error(err);

    res.status(status).json({ error: status === 500 ? "Something went wrong" : err.message });
}
