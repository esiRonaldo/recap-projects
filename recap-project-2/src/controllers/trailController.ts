import { getAllTrails, getTrailBySlug } from "../models/trailModel";
import type { Request, Response } from "express";
import { formatDate } from "../utils/common";

export async function listTrails(req: Request, res: Response) {
    const trails = await getAllTrails()
    res.render('index', { trails })
}
//why slug Object?
export async function showTrail(req: Request<{ slug: string }>, res: Response): Promise<void> {
    const trail = await getTrailBySlug(req.params.slug)

    if (!trail) {
        res.status(404).render("404", { message: "This trail does not exist." });
        return
    }
    res.render("trail", { trail, created_at_formatted: formatDate(trail.created_at) })
}