import sqlite3 from "sqlite3";
import { open, type Database } from "sqlite"

let db: Database | undefined

export async function connectDB(): Promise<Database> {
    const filename = process.env.DB_PATH
    if (!filename) {
        throw new Error("DB_PATH is not set in .env")
    }

    db = await open({
        filename,
        driver: sqlite3.Database
    })
    await db.exec("PRAGMA foreign_keys =ON;")
    return db
}

export function getDB(): Database {
    if (!db) {
        throw new Error("Database is not connected. Call connectDB() first")
    }
    return db
}

export async function closeDB(): Promise<void> {
    if (db) {
        await db.close()
        db = undefined
    }
}