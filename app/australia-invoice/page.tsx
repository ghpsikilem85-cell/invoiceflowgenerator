import type { Metadata } from "next";
import CountryGenerator from "@/components/CountryGenerator";
import { getCountryPage } from "@/lib/content/countries";
import { pageMetadata } from "@/lib/seo";

const page = getCountryPage("australia-invoice")!;

export const metadata: Metadata = pageMetadata({
  title: page.title,
  description: page.description,
  path: page.path,
});

export default function Page() {
  return <CountryGenerator page={page} />;
}
