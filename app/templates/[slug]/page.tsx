import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GeneratorPage from "@/components/GeneratorPage";
import { TEMPLATES, getTemplate } from "@/lib/templates";
import { pageMetadata } from "@/lib/seo";
import { getUser } from "@/lib/supabase/server";

export function generateStaticParams() {
  return TEMPLATES.map((template) => ({ slug: template.slug }));
}

function find(slug: string) {
  return TEMPLATES.find((template) => template.slug === slug);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const template = find(slug);
  if (!template) return {};

  return pageMetadata({
    title: `${template.name} Invoice Template – Free Editable PDF`,
    description: `${template.description} Fill it in online and download a free PDF invoice.`,
    path: `/templates/${template.slug}`,
  });
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!find(slug)) notFound();

  const template = getTemplate(find(slug)!.id);
  const user = await getUser();
  const path = `/templates/${template.slug}`;

  return (
    <GeneratorPage
      path={path}
      h1={`${template.name} Invoice Template`}
      intro={template.description}
      templateId={template.id}
      canSave={Boolean(user)}
      bullets={["Free PDF download", "Add your logo", "16 currencies"]}
      sections={[
        {
          heading: `Who the ${template.name} template suits`,
          paragraphs: [template.description, template.tagline + "."],
        },
        {
          heading: "Editing this template",
          paragraphs: [
            "Everything on the document is editable in the form above — business details, customer details, line items, tax rates, discount, currency and notes. Your draft is kept in your browser as you type, so closing the tab does not lose it.",
            "You can switch template at any point using the template picker without re-entering anything; the data stays put and only the design changes.",
          ],
        },
        {
          heading: "Other templates",
          paragraphs: [
            "If this one is not right, the other four cover most of the remaining ground: " +
              TEMPLATES.filter((entry) => entry.id !== template.id)
                .map((entry) => `${entry.name} (${entry.tagline.toLowerCase()})`)
                .join(", ") +
              ".",
          ],
        },
      ]}
      faq={[
        {
          question: `Is the ${template.name} invoice template free?`,
          answer:
            "Yes. Fill it in and download the PDF free of charge, with no account and no watermark.",
        },
        {
          question: "Can I add my logo to this template?",
          answer:
            "Yes. Upload a PNG or JPG up to 2 MB and it appears in the header of both the preview and the downloaded PDF.",
        },
        {
          question: "Can I change template after filling in my details?",
          answer:
            "Yes. Switching template keeps all your data and only changes the design, so you can compare them before downloading.",
        },
      ]}
      related={[
        { href: "/templates", label: "All invoice templates" },
        ...TEMPLATES.filter((entry) => entry.id !== template.id).map((entry) => ({
          href: `/templates/${entry.slug}`,
          label: `${entry.name} invoice template`,
        })),
      ]}
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: "Templates", path: "/templates" },
        { name: template.name, path },
      ]}
    />
  );
}
