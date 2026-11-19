import { getAllTrails, getTrailBySlug } from "../models/trailModel";
import type { Request, Response } from "express";
import { formatDate } from "../utils/common";
import type { TrailFilters } from "../models/types";

export async function listTrails(req: Request<{}, {}, {}, TrailFilters>, res: Response): Promise<void> {
    const q = req.query.q
    const trails = await getAllTrails({ q })
    res.render('index', { trails, q })
}

export async function showTrail(req: Request<{ slug: string }>, res: Response): Promise<void> {
    const trail = await getTrailBySlug(req.params.slug)

    if (!trail) {
        res.status(404).render("404", { message: "This trail does not exist." });
        return
    }
    res.render("trail", { trail, created_at_formatted: formatDate(trail.created_at) })
}