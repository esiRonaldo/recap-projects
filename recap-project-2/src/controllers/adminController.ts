import type { Request, Response } from "express";
import { addTrail, deleteTrail, getAllTrails, getTrailById, updateTrail } from "../models/trailModel";
import { getAllRegions } from "../models/regionModel";
import type { Trail, TrailInput } from "../models/types";
import sanitizeHtml from "sanitize-html";

export async function listAdminTrails(req: Request, res: Response): Promise<void> {
    const trails = await getAllTrails()
    res.render('admin/index', { trails })
}

export async function removeTrail(req: Request<{ id: string }>, res: Response): Promise<void> {
    await deleteTrail(Number(req.params.id))
    res.redirect('/admin')
}

const descriptionOptions: sanitizeHtml.IOptions = {
    allowedTags: ["p", "strong", "em", "ul", "ol", "li", "a"],
    allowedAttributes: { a: ["href"] },
};

function readTrailForm(body: Record<string, string>): TrailInput {
    return {
        region_id: Number(body.region_id),
        title: body.title ?? "",
        difficulty: body.difficulty as Trail["difficulty"],
        distance_km: Number(body.distance_km),
        description: sanitizeHtml(body.description ?? "", descriptionOptions) || null,
        image_url: body.image_url || null,
    };
}

function validateTrailForm(body: Record<string, string>): string | null {
    if (!body.title?.trim()) return "Title is required.";
    if (!body.distance_km?.trim()) return "Distance is required.";
    return null;
}

export async function newTrailForm(req: Request, res: Response): Promise<void> {
    const regions = await getAllRegions();
    res.render("admin/form", { regions });
}


export async function createTrail(req: Request, res: Response): Promise<void> {
    const error = validateTrailForm(req.body);

    if (error) {
        const regions = await getAllRegions();
        res.status(400).render("admin/form", { trail: req.body, regions, error });
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
    const error = validateTrailForm(req.body);

    if (error) {
        const regions = await getAllRegions();
        res.status(400).render("admin/form", { trail: { ...req.body, id }, regions, error });
        return;
    }

    await updateTrail(id, readTrailForm(req.body));
    res.redirect("/admin");
}