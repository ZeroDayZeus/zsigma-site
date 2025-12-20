import { Resend } from "resend";

export async function onRequestPost({ request, env }) {
  try {
    const { name, email, message } = await request.json();

    if (!name || !email || !message) {
      return new Response("Missing fields", { status: 400 });
    }

    // salva nel DB
    await env.DB.prepare(
      "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)"
    ).bind(name, email, message).run();

    // invia email
    const resend = new Resend(env.RESEND_API_KEY);

    await resend.emails.send({
      from: "ZSigma <contact@zsigma.ai>",
      to: ["contact@zsigma.ai"],
      reply_to: email,
      subject: `New contact from ${name}`,
      html: `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `
    });

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response("Server error", { status: 500 });
  }
}
