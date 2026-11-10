import { getDB } from "./db";
import type { Trail, TrailWithRegion } from "./types";

export async function getAllTrails(): Promise<TrailWithRegion[]> {
    const db = getDB();
    return db.all<TrailWithRegion[]>(
        `SELECT trails.*,
            regions.name AS region_name,
            regions.country AS region_country
     FROM trails
     INNER JOIN regions ON trails.region_id = regions.id
     ORDER BY trails.created_at DESC`
    );
}
//TODO: how to debug qeury and model when still no controller or router we have
export async function getTrailBySlug(slug: string): Promise<TrailWithRegion | undefined> {
    const db = getDB();

    return db.get<TrailWithRegion>(`
    SELECT trails.*,
           regions.name AS region_name,
           regions.country AS region_country
    FROM trails
    INNER JOIN regions ON trails.region_id = regions.id
    WHERE trails.slug = ?
  `, slug);
}