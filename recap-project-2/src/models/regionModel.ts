import { getDB } from "./db"
import type { Region } from "./types"

export async function getAllRegions(): Promise<Region[]> {
    const db = getDB();
    return db.all<Region[]>(`
    SELECT * FROM regions
    ORDER BY name ASC`
    )
}

export async function getRegionBySlug(slug: string): Promise<Region | undefined> {
    const db = getDB()
    return db.get<Region>(`
        SELECT * FROM regions
        WHERE slug=?`
        , slug
    )
}