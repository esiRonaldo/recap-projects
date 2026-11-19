import { getDB } from "./db";
import type { Trail, TrailFilters, TrailInput, TrailWithRegion } from "./types";
import { slugify } from "../utils/common";

export async function getAllTrails(filters: TrailFilters = {}): Promise<TrailWithRegion[]> {
  const db = getDB();
  const conditions: string[] = [];
  const params: string[] = [];

  if (filters.region) {
    conditions.push("regions.slug = ?");
    params.push(filters.region);
  }
  if (filters.difficulty) {
    conditions.push("trails.difficulty = ?");
    params.push(filters.difficulty);
  }
  if (filters.q) {
    conditions.push("trails.title LIKE ?");
    params.push(`%${filters.q}%`);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  return db.all<TrailWithRegion[]>(
    `SELECT trails.*,
            regions.name AS region_name,
            regions.country AS region_country
     FROM trails
     INNER JOIN regions ON trails.region_id = regions.id
     ${where}
     ORDER BY trails.created_at DESC`,
    params
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
         VALUES (@region_id, @title, @slug, @difficulty, @distance_km, @description, @image_url, @created_at)`,
    {
      "@region_id": data.region_id,
      "@title": data.title,
      "@slug": slugify(data.title),
      "@difficulty": data.difficulty,
      "@distance_km": data.distance_km,
      "@description": data.description,
      "@image_url": data.image_url,
      "@created_at": Math.floor(Date.now() / 1000),
    }
  );
}

export async function updateTrail(id: number, data: TrailInput): Promise<void> {
  const db = getDB();
  await db.run(
    `UPDATE trails
         SET region_id = @region_id, title = @title, slug = @slug, difficulty = @difficulty,
             distance_km = @distance_km, description = @description, image_url = @image_url
         WHERE id = @id`,
    {
      "@id": id,
      "@region_id": data.region_id,
      "@title": data.title,
      "@slug": slugify(data.title),
      "@difficulty": data.difficulty,
      "@distance_km": data.distance_km,
      "@description": data.description,
      "@image_url": data.image_url,
    }
  );
}