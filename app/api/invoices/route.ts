import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { calculateTotals, lineTotal } from "@/lib/totals";
import { ValidationError, parseInvoice } from "@/lib/validate";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Accounts are not configured." }, { status: 501 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Not signed in." }, { status: 401 });

  const { data, error } = await supabase
    .from("invoices")
    .select("id, invoice_number, kind, status, customer_name, currency, total, invoice_date, due_date")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    console.error("Invoice list failed", error);
    return NextResponse.json({ error: "Could not load invoices." }, { status: 500 });
  }

  return NextResponse.json({ invoices: data });
}

export async function POST(request: Request) {
  const limit = rateLimit(clientKey(request, "invoices"), 60, 60_000);
  if (!limit.ok) {
    return NextResponse.json(
      { error: "Too many requests. Try again in a moment." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } }
    );
  }

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ error: "Accounts are not configured." }, { status: 501 });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Sign in to save invoices." }, { status: 401 });

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  try {
    const invoice = parseInvoice(payload);
    const totals = calculateTotals(invoice);

    // Upsert on (user_id, invoice_number) so re-saving the same draft updates
    // the existing row instead of tripping the unique index.
    const { data: saved, error: saveError } = await supabase
      .from("invoices")
      .upsert(
        {
          user_id: user.id,
          kind: invoice.kind,
          invoice_number: invoice.invoice_number,
          status: invoice.status,
          business_name: invoice.business_name,
          business_email: invoice.business_email,
          business_address: invoice.business_address,
          business_phone: invoice.business_phone,
          business_tax_id: invoice.business_tax_id,
          business_logo: invoice.business_logo,
          customer_name: invoice.customer_name,
          customer_email: invoice.customer_email,
          customer_address: invoice.customer_address,
          currency: invoice.currency,
          subtotal: totals.subtotal,
          discount: totals.discount,
          discount_type: invoice.discount_type,
          discount_value: invoice.discount_value,
          tax: totals.tax,
          total: totals.total,
          invoice_date: invoice.invoice_date || null,
          due_date: invoice.due_date || null,
          notes: invoice.notes,
          payment_terms: invoice.payment_terms,
          template_id: invoice.template_id,
        },
        { onConflict: "user_id,invoice_number" }
      )
      .select("id")
      .single();

    if (saveError || !saved) {
      console.error("Invoice save failed", saveError);
      return NextResponse.json({ error: "Could not save the invoice." }, { status: 500 });
    }

    // Replace the item rows wholesale — simpler and safer than diffing.
    const { error: deleteError } = await supabase
      .from("invoice_items")
      .delete()
      .eq("invoice_id", saved.id);
    if (deleteError) {
      console.error("Invoice item cleanup failed", deleteError);
      return NextResponse.json({ error: "Could not save the invoice." }, { status: 500 });
    }

    const { error: itemsError } = await supabase.from("invoice_items").insert(
      invoice.items.map((item, index) => ({
        invoice_id: saved.id,
        position: index,
        description: item.description,
        quantity: item.quantity,
        unit_price: item.unit_price,
        tax_rate: item.tax_rate,
        total: lineTotal(item),
      }))
    );

    if (itemsError) {
      console.error("Invoice item save failed", itemsError);
      return NextResponse.json({ error: "Could not save the line items." }, { status: 500 });
    }

    return NextResponse.json({ id: saved.id }, { status: 201 });
  } catch (error) {
    if (error instanceof ValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Invoice save failed", error);
    return NextResponse.json({ error: "Could not save the invoice." }, { status: 500 });
  }
}
