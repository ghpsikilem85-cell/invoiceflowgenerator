import InvoicePreview from "@/components/InvoicePreview";
import { sampleInvoice } from "@/lib/defaults";

const SHEET_WIDTH = 794;
const SHEET_HEIGHT = 1123;

/**
 * A static, non-interactive preview of a template. Rendered from the same
 * component as the live editor, so a template change cannot leave the
 * marketing pages showing something the product no longer produces.
 */
export default function TemplateThumb({
  templateId,
  width = 260,
}: {
  templateId: string;
  width?: number;
}) {
  const scale = width / SHEET_WIDTH;

  return (
    <div
      className="overflow-hidden rounded-lg ring-1 ring-slate-200"
      style={{ width, height: SHEET_HEIGHT * scale }}
      aria-hidden
    >
      <div
        style={{
          width: SHEET_WIDTH,
          height: SHEET_HEIGHT,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <InvoicePreview invoice={sampleInvoice(templateId)} />
      </div>
    </div>
  );
}
