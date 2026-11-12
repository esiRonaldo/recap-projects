import type { Request, Response } from "express";
import { addTrail, deleteTrail, getAllTrails, getTrailById, getTrailBySlug, updateTrail } from "../models/trailModel";
import type { TrailInput } from "../models/types";
import { slugify } from "../utils/common";
import sanitizeHtml from "sanitize-html";
import { getAllRegions } from "../models/regionModel";


async function validateApiTrail(body: Record<string, any>): Promise<string | null> {
    if (!body) return "Body is required.";
    if (!body.title) return "title is required.";
    if (typeof body.distance_km !== "number") return "distance_km is required and must be a number.";
    if (!["easy", "moderate", "hard"].includes(body.difficulty)) return "difficulty must be easy, moderate or hard.";
    if (body.region_id === undefined) return "region_id is required.";

    const regions = await getAllRegions();
    if (!regions.some((region) => region.id === body.region_id)) return "region_id does not match any region.";

    return null;
}

export async function showApiTrail(req: Request<{ slug: string }>, res: Response): Promise<void> {
    try {
        const trail = await getTrailBySlug(req.params.slug)
        if (!trail) {
            res.status(404).json({ error: 'Trail not found' })
            return
        }
        res.json(trail)
    } catch (err) {
        res.status(500).json({ error: "Failed to load trail" })
    }
}

export async function listApiTrails(req: Request, res: Response): Promise<void> {
    try {
        const trails = await getAllTrails();
        res.json(trails);
    } catch (err) {
        res.status(500).json({ error: "Failed to load trails" })
    }
}

export async function createApiTrail(req: Request, res: Response): Promise<void> {
    try {
        const error = await validateApiTrail(req.body)
        if (error) {
            res.status(400).json({ error })
            return
        }

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
    } catch (err) {
        res.status(500).json({ error: "Failed to create trail" })
    }
}

export async function replaceApiTrail(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const id = Number(req.params.id)
        const oldTrail = await getTrailById(id);
        if (!oldTrail) {
            res.status(404).json({ error: 'Trail not found' })
            return
        }

        const error = await validateApiTrail(req.body)
        if (error) {
            res.status(400).json({ error })
            return
        }

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
        await updateTrail(id, data)
        const updatedTrail = await getTrailBySlug(slugify(data.title))
        res.json(updatedTrail);
    } catch (err) {
        res.status(500).json({ error: "Failed to update trail" })
    }
}

export async function deleteApiTrail(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const id = Number(req.params.id)
        const trail = await getTrailById(id);
        if (!trail) {
            res.status(404).json({ error: 'Trail not found' })
            return
        }

        await deleteTrail(id)
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: "Failed to delete trail" })
    }
}
