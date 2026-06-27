# Sala de Agentes

Oficina isométrica con 12 agentes IA. Click en un agente para chatear 1 a 1,
o "Reunión grupal" para que 3 agentes (uno por piso) debatan un tema.

Tiene **voz**: podés hablarle al agente (botón de micrófono) y el agente
puede responderte leyendo en voz alta (botón de altavoz arriba del chat).
La voz usa la Web Speech API nativa del navegador — gratis, sin librerías
ni keys extra. Funciona mejor en Chrome/Edge.

Usa **Groq** como backend — 100% gratis, sin tarjeta de crédito, sin
restricciones de región para Argentina (a diferencia de Gemini, que tuvo
problemas de disponibilidad regional).

## Correrlo en tu compu (VS Code)

1. Instalá las dependencias:
   ```
   npm install
   ```

2. Conseguí tu API key gratis en https://console.groq.com/keys
   (te creás cuenta con email o Google, no pide tarjeta)

3. Copiá `.env.example` como `.env.local` y pegá tu key:
   ```
   cp .env.example .env.local
   ```

4. Como el endpoint `/api/agent` es una Vercel Function, para probarlo
   localmente con las funciones funcionando necesitás la CLI de Vercel
   (no `npm run dev` solo, que es únicamente el frontend):
   ```
   npm install -g vercel
   vercel dev
   ```
   En el primer setup te va a preguntar varias cosas — podés aceptar
   todos los valores por defecto apretando Enter sin marcar ninguna opción.
   Te abre el proyecto en `http://localhost:3000` con el frontend Y el
   backend funcionando juntos.

   (Si solo querés ver el diseño sin que respondan los agentes, alcanza
   con `npm run dev`, pero las llamadas a `/api/agent` van a fallar
   porque Vite solo no corre funciones serverless.)

## Deploy a Vercel (gratis)

1. Subí este proyecto a un repo de GitHub.
2. Entrá a vercel.com, importá el repo.
3. En la sección de Environment Variables del proyecto en Vercel,
   agregá `GROQ_API_KEY` con tu key.
4. Deploy. Listo — todo gratis: hosting en Vercel + inferencia en Groq.
5. Si cambiás la env var después de un deploy ya hecho, hacé un
   **Redeploy** manual (Deployments → ⋯ → Redeploy) para que tome efecto.

## Sobre el modelo y los límites gratis de Groq

Este proyecto usa `openai/gpt-oss-120b` (modelo abierto, gratis en Groq).
Si en el futuro ves errores de "modelo no encontrado", chequeá la lista
actualizada en https://console.groq.com/docs/models y cambiá el nombre
del modelo en `api/agent.js`.

El tier gratis de Groq (sin tarjeta) te da, a modo orientativo:
- ~30 peticiones por minuto
- ~1.000 peticiones por día
- ~6.000 tokens por minuto

Para uso personal es más que suficiente.

## Sobre la voz

- El micrófono solo aparece si el navegador soporta `SpeechRecognition`
  (Chrome y Edge sí; Firefox no lo soporta bien todavía).
- Tocás el ícono de altavoz arriba del panel de chat para prender/apagar
  la lectura automática de las respuestas.
- El reconocimiento está en español argentino (`es-AR`).

## Estructura

- `src/SalaAgentes.jsx` — el componente principal (la UI, el chat y la voz)
- `api/agent.js` — la función serverless que llama a la API de Groq
  usando tu key (nunca se expone al navegador)
- `src/main.jsx` — entry point de React
