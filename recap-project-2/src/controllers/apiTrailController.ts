import type { Request, Response } from "express";
import { getAllTrails, getTrailBySlug } from "../models/trailModel";


export async function showApiTrail(req: Request<{ slug: string }>, res: Response): Promise<void> {
    const trail = await getTrailBySlug(req.params.slug)
    if (!trail) {
        res.status(404).json({ error: 'Trail not found' })
        return
    }
    res.json(trail)
}
export async function listApiTrails(req: Request, res: Response): Promise<void> {
    const trails = await getAllTrails();
    res.json(trails);
}