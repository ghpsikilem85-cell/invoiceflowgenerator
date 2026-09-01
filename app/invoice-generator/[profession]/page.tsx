import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GeneratorPage from "@/components/GeneratorPage";
import { PROFESSION_PAGES, getProfessionPage } from "@/lib/content/professions";
import { pageMetadata } from "@/lib/seo";
import { getUser } from "@/lib/supabase/server";

export function generateStaticParams() {
  return PROFESSION_PAGES.map((page) => ({ profession: page.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ profession: string }>;
}): Promise<Metadata> {
  const { profession } = await params;
  const page = getProfessionPage(profession);
  if (!page) return {};

  return pageMetadata({
    title: page.title,
    description: page.description,
    path: `/invoice-generator/${page.slug}`,
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ profession: string }>;
}) {
  const { profession } = await params;
  const page = getProfessionPage(profession);
  if (!page) notFound();

  const user = await getUser();
  const path = `/invoice-generator/${page.slug}`;

  const related = PROFESSION_PAGES.filter((entry) => entry.slug !== page.slug).map((entry) => ({
    href: `/invoice-generator/${entry.slug}`,
    label: `Invoice generator for ${entry.name.toLowerCase()}`,
  }));

  return (
    <GeneratorPage
      path={path}
      h1={page.h1}
      intro={page.intro}
      kind="invoice"
      templateId={page.templateId}
      canSave={Boolean(user)}
      bullets={["No registration required", "Free PDF download", "Add your logo"]}
      sections={page.sections}
      faq={page.faq}
      related={[{ href: "/invoice-generator", label: "Free invoice generator" }, ...related]}
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Invoice generator", path: "/invoice-generator" },
        { name: page.name, path },
      ]}
    />
  );
}
