import type { MetadataRoute } from "next";
import { BLOG_POSTS } from "@/lib/content/blog";
import { COUNTRY_PAGES } from "@/lib/content/countries";
import { PROFESSION_PAGES } from "@/lib/content/professions";
import { TOOL_PAGES } from "@/lib/content/tools";
import { TEMPLATES } from "@/lib/templates";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const entry = (
    path: string,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] = "monthly"
  ) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency,
    priority,
  });

  return [
    entry("/", 1, "weekly"),
    ...TOOL_PAGES.map((page) => entry(page.path, 0.9, "weekly")),
    entry("/templates", 0.8, "weekly"),
    ...TEMPLATES.map((template) => entry(`/templates/${template.slug}`, 0.7)),
    ...PROFESSION_PAGES.map((page) => entry(`/invoice-generator/${page.slug}`, 0.7)),
    ...COUNTRY_PAGES.map((page) => entry(page.path, 0.7)),
    entry("/blog", 0.6, "weekly"),
    ...BLOG_POSTS.map((post) => entry(`/blog/${post.slug}`, 0.6)),
    entry("/pricing", 0.5),
    entry("/privacy", 0.2, "yearly"),
    entry("/terms", 0.2, "yearly"),
  ];
}
