import type { Request, Response } from "express";
import { addTrail, getAllTrails, getTrailBySlug } from "../models/trailModel";
import type { TrailInput } from "../models/types";
import { slugify } from "../utils/common";
import sanitizeHtml from "sanitize-html";

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

export async function createApiTrail(req: Request, res: Response): Promise<void> {
    const data: TrailInput = {
        region_id: req.body.region_id,
        title: req.body.title,
        difficulty: req.body.difficulty,
        distance_km: req.body.distance_km,
        description: sanitizeHtml(req.body.description ?? "", {
            allowedTags: ["p", "strong", "em", "ul", "ol", "li", "a"],
            allowedAttributes: { a: ["href"] },
        }) || null,
        image_url: req.body.image_url ?? null,
    }

    await addTrail(data)
    const trail = await getTrailBySlug(slugify(data.title))
    res.status(201).json(trail)
}