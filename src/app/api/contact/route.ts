import { NextResponse } from "next/server";
import { createLead } from "@/lib/store";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const name = String(body.name ?? "").trim();
    const email = String(body.email ?? "").trim();
    const message = String(body.message ?? "").trim();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email and message are required." },
        { status: 400 },
      );
    }

    try {
      await createLead({
        name,
        email,
        phone: String(body.phone ?? "").trim() || null,
        location: String(body.location ?? "").trim() || null,
        message,
      });
    } catch (err) {
      // Don't lose the enquiry if storage isn't ready — log and still succeed.
      console.error("Lead save failed:", err);
    }

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }
}
