import { Telegraf, Markup } from "telegraf";

// ===============================
// CONFIGURACIÓN
// ===============================
const BOT_TOKEN = 8415598577:AAFgea3lcNN-OrQ1Ro7Jgv6Z4Ihs5IMJKdA; // token del bot
const ADMIN_CHAT_ID = 8360011868; // TU chat id personal (numero)

const bot = new Telegraf(BOT_TOKEN);

// ===============================
// MENÚ PRINCIPAL
// ===============================
const mainMenu = Markup.inlineKeyboard([
  [Markup.button.callback("🎰 Bonos Exclusivos", "bonos")],
  [Markup.button.callback("🔥 Casino Recomendado Hoy", "casino")],
  [Markup.button.callback("💰 Ganadores en Vivo", "wins")],
  [Markup.button.callback("📲 Hablar con Soporte VIP", "soporte")]
]);

// ===============================
// /START
// ===============================
bot.start(async (ctx) => {
  const user = ctx.from;

  // Notificación de lead
  await ctx.telegram.sendMessage(
    ADMIN_CHAT_ID,
    `🆕 NUEVO LEAD\n👤 ${user.username || "sin username"}\n🆔 ${user.id}`
  );

  await ctx.reply(
    `🔥 *ACCESO VIP ACTIVADO*\n\n` +
    `🎯 Bonos ocultos\n🎰 Casinos con mayor RTP\n💸 Pagos rápidos LATAM\n\n` +
    `⚠️ Cupos limitados hoy`,
    {
      parse_mode: "Markdown",
      ...mainMenu
    }
  );
});

// ===============================
// BOTONES
// ===============================
bot.action("bonos", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `🎁 *BONOS ACTIVOS HOY*\n\n` +
    `✅ Hasta 200% en tu primer depósito\n` +
    `✅ Free Spins sin wagering\n\n` +
    `⚠️ Válido solo hoy`,
    {
      parse_mode: "Markdown",
      ...mainMenu
    }
  );
});

bot.action("casino", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `🔥 *CASINO RECOMENDADO*\n\n` +
    `🎰 Slots con alto RTP\n💸 Retiros rápidos\n🔐 Acepta LATAM\n\n` +
    `👉 *Enlace exclusivo:* \n` +
    `https://TU_LINK_AFILIADO_AQUI`,
    {
      parse_mode: "Markdown",
      ...mainMenu
    }
  );
});

bot.action("wins", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `💰 *GANADORES RECIENTES*\n\n` +
    `🇨🇱 Juan – $450.000 CLP\n` +
    `🇵🇪 Carlos – $1.200 PEN\n` +
    `🇦🇷 Sofía – $320.000 ARS\n\n` +
    `🔥 Pagos reales`,
    {
      parse_mode: "Markdown",
      ...mainMenu
    }
  );
});

bot.action("soporte", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `📲 *SOPORTE VIP*\n\n` +
    `Un asesor humano puede ayudarte.\n` +
    `⚠️ Atención limitada\n\n` +
    `👉 Escríbenos aquí:\n` +
    `https://t.me/Oceancasinoslots`,
    {
      parse_mode: "Markdown",
      ...mainMenu
    }
  );
});

// ===============================
// BLOQUEO DE TEXTO (CONTROLADO)
// ===============================
bot.on("text", async (ctx) => {
  await ctx.reply(
    "⚠️ Usa los botones para continuar.\nEl acceso es limitado.",
    mainMenu
  );
});

// ===============================
// INICIO
// ===============================
bot.launch();
console.log("🤖 OceanCasinoVip BOT activo");
