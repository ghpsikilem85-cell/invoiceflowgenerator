import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BLOG_POSTS, getBlogPost } from "@/lib/content/blog";
import { JsonLd, breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { SITE, absoluteUrl } from "@/lib/site";

export function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return {};

  return pageMetadata({
    title: post.metaTitle,
    description: post.description,
    path: `/blog/${post.slug}`,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const others = BLOG_POSTS.filter((entry) => entry.slug !== post.slug).slice(0, 4);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Article",
          headline: post.title,
          description: post.description,
          datePublished: post.published,
          dateModified: post.published,
          mainEntityOfPage: absoluteUrl(`/blog/${post.slug}`),
          publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      <article className="mx-auto max-w-3xl px-4 py-12">
        <p className="text-sm text-slate-400">
          <Link href="/blog" className="hover:text-slate-600">
            Blog
          </Link>
          {" · "}
          <time dateTime={post.published}>
            {new Date(post.published).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          {" · "}
          {post.readingMinutes} min read
        </p>

        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          {post.title}
        </h1>
        <p className="mt-4 text-lg text-slate-600">{post.intro}</p>

        <div className="prose-seo mt-8">
          {post.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.list ? (
                <ul>
                  {section.list.map((entry) => (
                    <li key={entry}>{entry}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>

        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-6 text-center">
          <p className="font-semibold text-slate-900">Ready to bill for it?</p>
          <Link
            href={post.cta.href}
            className="mt-3 inline-block rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            {post.cta.label} →
          </Link>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6">
          <h2 className="text-lg font-bold text-slate-900">Keep reading</h2>
          <ul className="mt-3 space-y-2">
            {others.map((entry) => (
              <li key={entry.slug}>
                <Link href={`/blog/${entry.slug}`} className="text-blue-600 hover:text-blue-700">
                  {entry.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </article>
    </>
  );
}
