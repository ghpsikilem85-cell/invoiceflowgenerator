import type { Metadata } from "next";
import GeneratorPage from "@/components/GeneratorPage";
import { getToolPage } from "@/lib/content/tools";
import { pageMetadata } from "@/lib/seo";
import { getUser } from "@/lib/supabase/server";

const page = getToolPage("estimate-generator")!;

export const metadata: Metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
});

export default async function Page() {
  const user = await getUser();

  return (
    <GeneratorPage
      path={page.path}
      h1={page.h1}
      intro={page.intro}
      kind={page.kind}
      templateId={page.templateId}
      currency={page.currency}
      canSave={Boolean(user)}
      bullets={page.bullets}
      sections={page.sections}
      faq={page.faq}
      related={page.related}
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: page.h1, path: page.path },
      ]}
    />
  );
}
