import sanitizeHtml from "sanitize-html";

const descriptionOptions: sanitizeHtml.IOptions = {
    allowedTags: ["p", "strong", "em", "ul", "ol", "li", "a"],
    allowedAttributes: { a: ["href"] },
};

export function sanitizeDescription(html: string | undefined): string | null {
    return sanitizeHtml(html ?? "", descriptionOptions) || null;
}

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