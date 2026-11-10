export type Region = {
    id: number;
    name: string;
    slug: string;
    country: string;
    description: string | null;
};

export type Trail = {
    id: number;
    region_id: number;
    title: string;
    slug: string;
    difficulty: "easy" | "moderate" | "hard";
    distance_km: number;
    description: string | null;
    image_url: string | null;
    created_at: number;
};
export type TrailWithRegion = Trail & {
    region_name: string
    region_country: string
}