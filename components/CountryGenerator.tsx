import GeneratorPage from "@/components/GeneratorPage";
import { COUNTRY_PAGES, type CountryPage } from "@/lib/content/countries";
import { getUser } from "@/lib/supabase/server";

/**
 * Country pages share a shell but each one carries its own tax rules, currency
 * and required-fields list, so they are genuinely different documents rather
 * than one page with the country name swapped.
 */
export default async function CountryGenerator({ page }: { page: CountryPage }) {
  const user = await getUser();

  const factsSection = {
    heading: `Invoicing in ${page.country} at a glance`,
    paragraphs: [
      `Documents created on this page default to ${page.currency} and are laid out for ${page.country}. Set the tax rate on each line to match the supply.`,
    ],
    list: [
      `Currency: ${page.currency}`,
      `Tax: ${page.taxName}`,
      `Rates: ${page.standardRate}`,
      `Tax identifier on the invoice: ${page.taxIdName}`,
    ],
  };

  const related = COUNTRY_PAGES.filter((entry) => entry.slug !== page.slug).map((entry) => ({
    href: entry.path,
    label: `${entry.country} invoice generator`,
  }));

  return (
    <GeneratorPage
      path={page.path}
      h1={page.h1}
      intro={page.intro}
      kind="invoice"
      templateId={page.templateId}
      currency={page.currency}
      canSave={Boolean(user)}
      bullets={[page.currency, `${page.taxName} per line`, "Free PDF download"]}
      sections={[factsSection, ...page.sections]}
      faq={page.faq}
      related={[{ href: "/invoice-generator", label: "Free invoice generator" }, ...related]}
      breadcrumbs={[
        { name: "Home", path: "/" },
        { name: page.h1, path: page.path },
      ]}
    />
  );
}
