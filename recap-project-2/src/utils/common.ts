export function formatDate(timestamp: number): string {
    return new Date(timestamp * 1000).toLocaleDateString(undefined, {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/[\s-]+/g, "-")
        .replace(/^-+|-+$/g, "");
}