import { getAllTrails, getTrailBySlug } from "../models/trailModel";
import type { Request, Response } from "express";

export async function listTrails(req: Request, res: Response) {
    const trails = await getAllTrails()
    console.log('trails')
    console.log(trails)
    res.render('index', { trails })
}

export async function showTrail(req: Request<{ slug: string }>, res: Response): Promise<void> {
    const trail = await getTrailBySlug(req.params.slug)

    if (!trail) {
        res.status(404).send("Trail not found")
        return
    }
console.log('trail')
console.log(trail)
    res.render("trail", { trail })
}