import type { Request, Response } from "express";
import { deleteTrail, getAllTrails } from "../models/trailModel";

export async function listAdminTrails(req: Request, res: Response): Promise<void> {
    const trails = await getAllTrails()
    res.render('admin/index', { trails })
}

export async function removeTrail(req: Request<{ id: string }>, res: Response): Promise<void> {
    console.log('req.params.id')
    console.log(req.params.id)
    await deleteTrail(Number(req.params.id))
    res.redirect('/admin')
}