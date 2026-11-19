export type Region = {
    id: number;
    name: string;
    slug: string;
    country: string;
    description: string | null;
};

export const DIFFICULTIES = ["easy", "moderate", "hard"] as const;
export type Difficulty = typeof DIFFICULTIES[number];

export type Trail = {
    id: number;
    region_id: number;
    title: string;
    slug: string;
    difficulty: Difficulty;
    distance_km: number;
    description: string | null;
    image_url: string | null;
    created_at: number;
};
export type TrailWithRegion = Trail & {
    region_name: string
    region_country: string
}

export type TrailInput = Omit<Trail, "id" | "slug" | "created_at">;

export type TrailFilters = {
    region?: string;
    difficulty?: string;
    q?: string;
};
