import { Telegraf } from "telegraf";

const BOT_TOKEN = process.env.8415598577:AAFgea3lcNN-OrQ1Ro7Jgv6Z4Ihs5IMJKdA ; // token real en Railway
const ADMIN_ID = process.env.8360011868 ;// tu user_id personal

const bot = new Telegraf(BOT_TOKEN);

// START
bot.start(async (ctx) => {
  const user = ctx.from;

  const leadMsg = `
🆕 NUEVO LEAD
👤 ${user.username || "Sin username"}
🌍 ${user.language_code || "N/A"}
🆔 ${user.id}
`;

  // Aviso al admin (SOLO si ADMIN_ID es humano)
  if (ADMIN_ID) {
    await bot.telegram.sendMessage(ADMIN_ID, leadMsg);
  }

  await ctx.reply(`
⚠️ ACCESO LIMITADO

No trabajo con curiosos.
Solo con jugadores reales.

¿De qué país eres?
`);
});

// RESPUESTAS
bot.on("text", async (ctx) => {
  const text = ctx.message.text.toLowerCase();

  // País detectado
  if (
    text.includes("chile") ||
    text.includes("argentina") ||
    text.includes("peru") ||
    text.includes("mexico") ||
    text.includes("colombia")
  ) {
    return ctx.reply(`
Perfecto.

Tengo cupos activos HOY.
Después cierro accesos.

¿Has depositado antes en casinos online?
Responde: SI / NO
`);
  }

  // Experiencia previa
  if (text === "si" || text === "sí") {
    return ctx.reply(`
Bien.

Empezamos con monto bajo.
Si funciona, escalamos.

¿Qué prefieres?
1️⃣ Slots
2️⃣ Casino en vivo
`);
  }

  if (text === "no") {
    return ctx.reply(`
Entonces empezamos tranquilo.

Monto bajo, sin presión.
Si te gusta, seguimos.

¿Qué prefieres?
1️⃣ Slots
2️⃣ Casino en vivo
`);
  }

  // Elección final
  if (text.includes("1")) {
    return ctx.reply(`
Perfecto.

Te explico rápido y vamos directo.
Escríbeme: LISTO
`);
  }

  if (text.includes("2")) {
    return ctx.reply(`
Bien.

Juego en vivo, retiros rápidos.
Escríbeme: LISTO
`);
  }

  if (text.includes("listo")) {
    return ctx.reply(`
Perfecto.

En breve te paso el acceso.
Mantente atento.
`);
  }
});

bot.launch();
console.log("🤖 BOT ACTIVO");
