export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    const data = await request.json();

    const name = (data.name || "").trim();
    const email = (data.email || "").trim();
    const message = (data.message || "").trim();

    if (!name || !email || !message) {
      return new Response(JSON.stringify({ ok: false, error: "Missing fields" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    await env.DB.prepare(
      "INSERT INTO contacts (name, email, message) VALUES (?, ?, ?)"
    ).bind(name, email, message).run();

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json" }
    });

  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: "Server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
