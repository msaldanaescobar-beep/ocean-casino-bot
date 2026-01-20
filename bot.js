// bot.js — Ocean Casino VIP (Producción)
import { Telegraf, Markup } from "telegraf";

/* ================= CONFIG ================= */
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = Number(process.env.ADMIN_ID);
const BOT_USERNAME = process.env.BOT_USERNAME || "Oceancasinoslots";
/* ========================================== */

if (!BOT_TOKEN || !ADMIN_ID) {
  console.error("❌ Faltan variables de entorno");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

/* ================= HELPERS ================= */
const notifyAdmin = async (text) => {
  try {
    await bot.telegram.sendMessage(ADMIN_ID, text, {
      parse_mode: "HTML",
      disable_web_page_preview: true,
    });
  } catch (e) {
    console.log("Admin notify error:", e.message);
  }
};
/* =========================================== */

/* ================= START =================== */
bot.start(async (ctx) => {
  const user = ctx.from;
  const source = ctx.startPayload || "directo";

  await notifyAdmin(
    `🆕 <b>NUEVO LEAD</b>\n` +
    `👤 @${user.username || "sin_username"}\n` +
    `🆔 ${user.id}\n` +
    `📍 Origen: ${source}`
  );

  await ctx.reply(
    `🎰 <b>ACCESO VIP OCEAN CASINO</b>\n\n` +
    `⚠️ No trabajo con curiosos\n` +
    `💰 Solo jugadores reales\n` +
    `🔥 Bonos activos HOY\n\n` +
    `¿Desde qué país nos escribes?`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🇨🇱 Chile (Prioridad)", "country_chile")],
        [Markup.button.callback("🇲🇽 México", "country_mexico")],
        [Markup.button.callback("🇵🇪 Perú", "country_peru")],
        [Markup.button.callback("🇨🇴 Colombia", "country_colombia")],
        [Markup.button.callback("🌎 Otro", "country_other")],
      ]),
    }
  );
});
/* =========================================== */

/* ================= COUNTRY ================= */
bot.action(/country_(.+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const country = ctx.match[1];
  const user = ctx.from;

  await notifyAdmin(
    `📍 <b>PAÍS</b>\n` +
    `👤 @${user.username || "sin_username"}\n` +
    `🌎 ${country.toUpperCase()}`
  );

  await ctx.reply(
    `✅ <b>ACCESO VALIDADO</b>\n\n` +
    `🎁 Bonos reales\n` +
    `⚡ Retiros rápidos\n` +
    `👤 Atención directa\n\n` +
    `Elige una opción:`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🎁 QUIERO EL BONO", "bonus")],
        [Markup.button.callback("💸 ¿CÓMO RETIRO?", "withdraw")],
        [Markup.button.callback("🎮 JUEGOS", "games")],
        [Markup.button.callback("👤 HABLAR CON HUMANO", "support")],
      ]),
    }
  );
});
/* =========================================== */

/* ================= ACTIONS ================= */
bot.action("bonus", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `🔥 <b>BONO VIP DISPONIBLE</b>\n\n` +
    `Solo para jugadores activos.\n\n` +
    `¿Cuánto planeas depositar?`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("$10 – $20", "dep_10_20")],
        [Markup.button.callback("$20 – $50", "dep_20_50")],
        [Markup.button.callback("$50 – $100", "dep_50_100")],
        [Markup.button.callback("+$100", "dep_100_plus")],
      ]),
    }
  );
});

bot.action(/dep_.+/, async (ctx) => {
  await ctx.answerCbQuery();
  const user = ctx.from;
  const amount = ctx.callbackQuery.data.replace("dep_", "").replace(/_/g, " ");

  await notifyAdmin(
    `🔥 <b>LEAD CALIFICADO</b>\n` +
    `👤 @${user.username || "sin_username"}\n` +
    `💰 Depósito: ${amount}`
  );

  await ctx.reply(
    `✅ Perfecto.\n\n` +
    `Un asesor VIP te escribe ahora.\n` +
    `⚠️ Ten listo tu medio de pago.`,
    { parse_mode: "HTML" }
  );
});

bot.action("withdraw", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `💸 <b>RETIROS RÁPIDOS</b>\n\n` +
    `✔ Transferencia\n` +
    `✔ Crypto\n` +
    `✔ Sin vueltas`,
    { parse_mode: "HTML" }
  );
});

bot.action("games", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `🎮 <b>JUEGOS TOP</b>\n\n` +
    `Slots\n` +
    `Live Casino\n` +
    `Jackpots`,
    { parse_mode: "HTML" }
  );
});

bot.action("support", async (ctx) => {
  await ctx.answerCbQuery();
  const user = ctx.from;

  await notifyAdmin(
    `🧑‍💼 <b>ATENCIÓN HUMANA</b>\n` +
    `👤 @${user.username || "sin_username"}`
  );

  await ctx.reply(
    `👤 Un asesor VIP toma tu caso ahora.\n` +
    `⏳ No cierres el chat.`,
    { parse_mode: "HTML" }
  );
});
/* =========================================== */

/* ================= FALLBACK ================= */
bot.on("text", async (ctx) => {
  await ctx.reply(
    `⚠️ Usa los botones.\n` +
    `El acceso es limitado.`,
    { parse_mode: "HTML" }
  );
});
/* =========================================== */

/* ================= LAUNCH =================== */
bot.launch().then(() => {
  console.log("✅ Ocean Casino Bot ACTIVO");
});

process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
/* =========================================== */
