import type { Request, Response } from "express";
import { getAllRegions, getRegionBySlug } from "../models/regionModel";
import { getTrailsByRegionId } from "../models/trailModel";


export async function listApiRegions(req: Request, res: Response): Promise<void> {
    const regions = await getAllRegions();
    res.json(regions);
}

export async function listApiRegionTrails(req: Request<{ slug: string }>, res: Response): Promise<void> {
    const region = await getRegionBySlug(req.params.slug);

    if (!region) {
        res.status(404).json({ error: "Region not found" });
        return;
    }

    const trails = await getTrailsByRegionId(region.id);
    res.json(trails);
}