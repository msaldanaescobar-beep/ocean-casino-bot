import { Telegraf, Markup } from "telegraf";

// ============================
// CONFIGURACIÓN
// ============================
const BOT_TOKEN = "8415598577:AAFgea3lcNN-OrQ1Ro7Jgv6Z4Ihs5IMJKdA"; // <-- pega aquí el token del bot
const ADMIN_CHAT_ID = "8360011868"; // <-- tu chat ID personal
const AFFILIATE_LINK = "https://t.me/OceancasinoVip"; // placeholder
const SUPPORT_USERNAME = "@OceanCasinoVip";

const bot = new Telegraf(8415598577:AAFgea3lcNN-OrQ1Ro7Jgv6Z4Ihs5IMJKdA);

// ============================
// MENSAJES BASE
// ============================
const START_MESSAGE = `
🔥 *ACCESO VIP CASINOS 2026* 🔥

⚠️ *Cupos limitados – Chile prioritario*

Aquí NO damos información pública.
Solo *bonos reales* y *casinos que pagan*.

👇 Elige una opción para continuar:
`;

const BLOCKED_MESSAGE = "⚠️ Usa los botones.\nEl acceso es limitado.";

const URGENCY_MESSAGE = `
⏰ *ATENCIÓN*
Los bonos se cierran cuando se completa el cupo diario.
Si sales, *puedes perder el acceso*.
`;

const REGISTER_MESSAGE = `
💰 *BONO ACTIVO PARA TI*

🎰 Casino verificado
🎁 Bono de bienvenida exclusivo
⚡ Retiros rápidos

👇 Accede ahora:
`;

const HUMAN_MESSAGE = `
👤 *ATENCIÓN HUMANA*

Un operador revisará tu caso.
⏳ Tiempo estimado: 5–15 minutos

⚠️ No cierres el chat.
`;

// ============================
// BOTONES
// ============================
const mainMenu = Markup.inlineKeyboard([
  [Markup.button.callback("🎰 QUIERO EL BONO", "GET_BONUS")],
  [Markup.button.callback("💬 HABLAR CON SOPORTE", "HUMAN")],
]);

const bonusMenu = Markup.inlineKeyboard([
  [Markup.button.url("🚀 ACCEDER AL CASINO", AFFILIATE_LINK)],
  [Markup.button.callback("❓ NO PUDE REGISTRARME", "HUMAN")],
]);

// ============================
// START
// ============================
bot.start(async (ctx) => {
  const user = ctx.from;

  // Aviso al admin (lead nuevo)
  await bot.telegram.sendMessage(
    ADMIN_CHAT_ID,
    `🆕 *Nuevo lead*\n👤 ${user.first_name}\n🆔 ${user.id}`,
    { parse_mode: "Markdown" }
  );

  await ctx.replyWithMarkdown(START_MESSAGE, mainMenu);
});

// ============================
// BLOQUEAR TEXTO LIBRE
// ============================
bot.on("text", async (ctx) => {
  await ctx.reply(BLOCKED_MESSAGE);
});

// ============================
// ACCIONES
// ============================
bot.action("GET_BONUS", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.replyWithMarkdown(URGENCY_MESSAGE);
  await ctx.replyWithMarkdown(REGISTER_MESSAGE, bonusMenu);
});

bot.action("HUMAN", async (ctx) => {
  await ctx.answerCbQuery();

  // Aviso al admin
  await bot.telegram.sendMessage(
    ADMIN_CHAT_ID,
    `🧑‍💬 *Solicitud de atención humana*\n🆔 ${ctx.from.id}`,
    { parse_mode: "Markdown" }
  );

  await ctx.replyWithMarkdown(HUMAN_MESSAGE);
});

// ============================
// START BOT
// ============================
bot.launch();
console.log("🤖 OceanCasinoVIP Bot activo");
