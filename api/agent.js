// api/agent.js
// Vercel Function (serverless). Corre en el servidor, no en el navegador,
// así que la API key nunca queda expuesta al usuario.
//
// Usa Groq (https://console.groq.com) — tier gratis, sin tarjeta,
// sin restricciones de región para Argentina (a diferencia de Gemini).

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const { messages, system } = req.body || {};

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Faltan los mensajes" });
  }


  // Groq usa el formato estilo OpenAI: el "system" va como un mensaje más
  // dentro del array, con role: "system", al principio de todo.
  const groqMessages = [
    ...(system ? [{ role: "system", content: system }] : []),
    ...messages,
  ];

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        max_tokens: 1000,
        messages: groqMessages,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Error de Groq:", errText);
      return res.status(502).json({ error: "Error llamando a la API de Groq" });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "(sin respuesta)";

    return res.status(200).json({ reply });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
