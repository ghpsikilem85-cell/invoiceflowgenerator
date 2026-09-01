import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { InvoiceDocument } from "@/lib/pdf/InvoiceDocument";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { ValidationError, parseInvoice, pdfFileName } from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BODY_BYTES = 6 * 1024 * 1024;

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "pdf"), 30, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many PDF requests. Try again in a moment." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const contentLength = Number(request.headers.get("content-length") ?? 0);
  if (contentLength > MAX_BODY_BYTES) {
    return NextResponse.json({ error: "Payload too large." }, { status: 413 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const invoice = parseInvoice(payload);
    const buffer = await renderToBuffer(<InvoiceDocument invoice={invoice} />);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${pdfFileName(invoice)}"`,
        "Content-Length": String(buffer.byteLength),
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("PDF render failed", error);
    return NextResponse.json({ error: "Could not generate the PDF." }, { status: 500 });
  }
}
