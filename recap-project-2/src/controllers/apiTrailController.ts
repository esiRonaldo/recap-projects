import type { Request, Response } from "express";
import { addTrail, deleteTrail, getAllTrails, getTrailById, getTrailBySlug, updateTrail } from "../models/trailModel";
import { DIFFICULTIES, type TrailInput } from "../models/types";
import { sanitizeDescription, slugify } from "../utils/common";
import { getAllRegions } from "../models/regionModel";

async function validateApiTrail(body: Record<string, any>, id?: number): Promise<string[]> {
    if (!body) return ["Body is required."];

    const errorMessages: string[] = [];
    if (!body.title) {
        errorMessages.push("title is required.");
    } else {
        const sameSlugTrail = await getTrailBySlug(slugify(body.title));
        if (sameSlugTrail && sameSlugTrail.id !== id) errorMessages.push("title is already used by another trail.");
    }
    if (typeof body.distance_km !== "number") errorMessages.push("distance_km is required and must be a number.");
    if (!DIFFICULTIES.includes(body.difficulty)) errorMessages.push(`difficulty must be one of: ${DIFFICULTIES.join(", ")}.`);

    const regions = await getAllRegions();
    if (body.region_id === undefined) {
        errorMessages.push("region_id is required.");
    } else if (!regions.some((region) => region.id === body.region_id)) {
        errorMessages.push("region_id does not match any region.");
    }

    return errorMessages;
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
        const errorMessages = await validateApiTrail(req.body)
        if (errorMessages.length > 0) {
            res.status(400).json({ errors: errorMessages })
            return
        }

        const data: TrailInput = {
            region_id: req.body.region_id,
            title: req.body.title,
            difficulty: req.body.difficulty,
            distance_km: req.body.distance_km,
            description: sanitizeDescription(req.body.description),
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

        const errorMessages = await validateApiTrail(req.body, id)
        if (errorMessages.length > 0) {
            res.status(400).json({ errors: errorMessages })
            return
        }

        const data: TrailInput = {
            region_id: req.body.region_id,
            title: req.body.title,
            difficulty: req.body.difficulty,
            distance_km: req.body.distance_km,
            description: sanitizeDescription(req.body.description),
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

export async function patchApiTrail(req: Request<{ id: string }>, res: Response): Promise<void> {
    try {
        const id = Number(req.params.id)
        const oldTrail = await getTrailById(id);
        if (!oldTrail) {
            res.status(404).json({ error: 'Trail not found' })
            return
        }

        const body = req.body ?? {}
        const data: TrailInput = {
            region_id: body.region_id ?? oldTrail.region_id,
            title: body.title ?? oldTrail.title,
            difficulty: body.difficulty ?? oldTrail.difficulty,
            distance_km: body.distance_km ?? oldTrail.distance_km,
            description: sanitizeDescription(body.description ?? oldTrail.description),
            image_url: body.image_url ?? oldTrail.image_url,
        }

        const errorMessages = await validateApiTrail(data, id)
        if (errorMessages.length > 0) {
            res.status(400).json({ errors: errorMessages })
            return
        }

        await updateTrail(id, data)
        const updatedTrail = await getTrailBySlug(slugify(data.title))
        res.json(updatedTrail);
    } catch (err) {
        res.status(500).json({ error: "Failed to update trail" })
    }
}

