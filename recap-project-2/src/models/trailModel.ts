import { getDB } from "./db";
import type { Trail, TrailInput, TrailWithRegion } from "./types";
import { slugify } from "../utils/common";

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

export async function getTrailsByRegionId(regionId: number): Promise<TrailWithRegion[]> {
  const db = getDB()
  return db.all<TrailWithRegion[]>(`
        SELECT trails.*,
        regions.name AS region_name,
        regions.country AS region_country
          FROM trails
          INNER JOIN regions ON trails.region_id = regions.id
            where trails.region_id=?
            ORDER BY trails.created_at DESC
          `, regionId)
}

export async function deleteTrail(id: number): Promise<void> {
  const db = getDB()
  await db.run(`DELETE FROM trails WHERE id=?`, id)
}

export async function getTrailById(id: number): Promise<Trail | undefined> {
  const db = getDB()
  return db.get<Trail>(`SELECT * FROM trails WHERE trails.id = ?`, id)
}

export async function addTrail(data: TrailInput): Promise<void> {
  const db = getDB();
  await db.run(
    `INSERT INTO trails (region_id, title, slug, difficulty, distance_km, description, image_url, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    data.region_id,
    data.title,
    slugify(data.title),
    data.difficulty,
    data.distance_km,
    data.description,
    data.image_url,
    Math.floor(Date.now() / 1000)
  );
}

export async function updateTrail(id: number, data: TrailInput): Promise<void> {
  const db = getDB();
  await db.run(
    `UPDATE trails
         SET region_id = ?, title = ?, slug = ?, difficulty = ?, distance_km = ?, description = ?, image_url = ?
         WHERE id = ?`,
    data.region_id,
    data.title,
    slugify(data.title),
    data.difficulty,
    data.distance_km,
    data.description,
    data.image_url,
    id
  );
}