import type { Request, Response } from "express";
import { addTrail, deleteTrail, getAllTrails, getTrailById, getTrailBySlug, updateTrail } from "../models/trailModel";
import { getAllRegions, getRegionById } from "../models/regionModel";
import { DIFFICULTIES, type Difficulty, type TrailInput } from "../models/types";
import { sanitizeDescription, slugify } from "../utils/common";

export async function listAdminTrails(req: Request, res: Response): Promise<void> {
    const trails = await getAllTrails()
    res.render('admin/index', { trails })
}

export async function removeTrail(req: Request<{ id: string }>, res: Response): Promise<void> {
    await deleteTrail(Number(req.params.id))
    res.redirect('/admin')
}

function readTrailForm(body: Record<string, string>): TrailInput {
    return {
        region_id: Number(body.region_id),
        title: body.title ?? "",
        difficulty: body.difficulty as Difficulty,
        distance_km: Number(body.distance_km),
        description: sanitizeDescription(body.description),
        image_url: body.image_url || null,
    };
}

async function validateTrailForm(body: Record<string, string>, id?: number): Promise<string | null> {
    if (!body.title?.trim()) return "Title is required.";
    if (!body.distance_km?.trim()) return "Distance is required.";
    if (!(Number(body.distance_km) > 0)) return "Distance must be a number greater than 0.";
    if (!DIFFICULTIES.includes(body.difficulty as Difficulty)) return `Difficulty must be one of: ${DIFFICULTIES.join(", ")}.`;

    if (!(await getRegionById(Number(body.region_id)))) return "Please choose a valid region.";

    const sameSlugTrail = await getTrailBySlug(slugify(body.title));
    if (sameSlugTrail && sameSlugTrail.id !== id) return "A trail with this title already exists.";

    return null;
}

export async function newTrailForm(req: Request, res: Response): Promise<void> {
    const regions = await getAllRegions();
    res.render("admin/form", { regions });
}


export async function createTrail(req: Request, res: Response): Promise<void> {
    const errorMessage = await validateTrailForm(req.body);

    if (errorMessage) {
        const regions = await getAllRegions();
        res.status(400).render("admin/form", { trail: req.body, regions, error: errorMessage });
        return;
    }

    await addTrail(readTrailForm(req.body));
    res.redirect("/admin");
}

export async function editTrailForm(req: Request<{ id: string }>, res: Response): Promise<void> {
    const trail = await getTrailById(Number(req.params.id));

    if (!trail) {
        res.status(404).render("404", { message: "This trail does not exist." });
        return;
    }

    const regions = await getAllRegions();
    res.render("admin/form", { trail, regions });
}

export async function saveTrail(req: Request<{ id: string }>, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const errorMessage = await validateTrailForm(req.body, id);

    if (errorMessage) {
        const regions = await getAllRegions();
        res.status(400).render("admin/form", { trail: { ...req.body, id }, regions, error: errorMessage });
        return;
    }

    await updateTrail(id, readTrailForm(req.body));
    res.redirect("/admin");
}