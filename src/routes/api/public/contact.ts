import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(255),
  subject: z.string().trim().min(1).max(150),
  message: z.string().trim().min(1).max(2000),
});

const RECIPIENT = "kumarrohit60060@gmail.com";

export const Route = createFileRoute("/api/public/contact")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return Response.json({ error: "Invalid JSON" }, { status: 400 });
        }
        const parsed = schema.safeParse(json);
        if (!parsed.success) {
          return Response.json(
            { error: parsed.error.issues[0]?.message ?? "Invalid input" },
            { status: 400 },
          );
        }
        const { name, email, subject, message } = parsed.data;
        const userAgent = request.headers.get("user-agent") ?? null;

        const { supabaseAdmin } = await import(
          "@/integrations/supabase/client.server"
        );

        const { data: row, error: dbErr } = await supabaseAdmin
          .from("contact_messages" as never)
          .insert({
            name,
            email,
            subject,
            message,
            user_agent: userAgent,
          } as never)
          .select("id")
          .single();

        if (dbErr) {
          console.error("[contact] insert failed", dbErr);
          return Response.json(
            { error: "Could not save message" },
            { status: 500 },
          );
        }

        const rowId = (row as { id: string } | null)?.id ?? crypto.randomUUID();

        // Try to send an email via Lovable Emails. Fails gracefully if the
        // email domain / infrastructure isn't configured yet — the message
        // is still stored in the database.
        try {
          const origin = new URL(request.url).origin;
          const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
          if (serviceKey) {
            const emailRes = await fetch(
              `${origin}/lovable/email/transactional/send`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${serviceKey}`,
                },
                body: JSON.stringify({
                  templateName: "contact-message",
                  recipientEmail: RECIPIENT,
                  idempotencyKey: `contact-${rowId}`,
                  replyTo: email,
                  templateData: {
                    name,
                    email,
                    subject,
                    message,
                    submittedAt: new Date().toISOString(),
                  },
                }),
              },
            );
            if (!emailRes.ok) {
              const txt = await emailRes.text().catch(() => "");
              console.warn(
                "[contact] email send failed (message still stored):",
                emailRes.status,
                txt,
              );
            }
          }
        } catch (err) {
          console.warn("[contact] email send threw (message still stored):", err);
        }

        return Response.json({ ok: true, id: rowId });
      },
    },
  },
});
