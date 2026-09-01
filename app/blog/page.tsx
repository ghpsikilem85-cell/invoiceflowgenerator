import type { Metadata } from "next";
import Link from "next/link";
import { BLOG_POSTS } from "@/lib/content/blog";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Invoicing Guides and Advice",
  description:
    "Practical guides to invoicing: what an invoice must include, how to number invoices, invoice vs receipt, retention periods and getting paid on time.",
  path: "/blog",
});

export default function Page() {
  const posts = [...BLOG_POSTS].sort((a, b) => b.published.localeCompare(a.published));

  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-4xl px-4 py-12 text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Invoicing guides
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            Short, practical answers to the questions that come up when you start billing your own
            clients.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12">
        <ul className="divide-y divide-slate-200">
          {posts.map((post) => (
            <li key={post.slug} className="py-6">
              <Link href={`/blog/${post.slug}`} className="group">
                <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-700">
                  {post.title}
                </h2>
              </Link>
              <p className="mt-1 text-slate-600">{post.description}</p>
              <p className="mt-2 text-sm text-slate-400">
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
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
