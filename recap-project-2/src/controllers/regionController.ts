import { getAllRegions, getRegionBySlug } from "../models/regionModel";
import type { Request, Response } from "express";
import { getTrailsByRegionId } from "../models/trailModel";

export async function listRegions(req: Request, res: Response): Promise<void> {
    const regions = await getAllRegions()
    res.render("regions", { regions });
}

export async function showRegion(req: Request<{ slug: string }>, res: Response): Promise<void> {
    const region = await getRegionBySlug(req.params.slug)
    if (!region) {
        res.status(404).render('404', { message: 'This Region does not exist.' })
        return
    }
    const trails = await getTrailsByRegionId(region.id)
    res.render('region', { region, trails })
}