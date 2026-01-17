import { Telegraf, Markup } from "telegraf";

/* ================= CONFIG ================= */
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = Number(process.env.ADMIN_ID);

// 🔥 PLACEHOLDER LINK AFILIADO
const CASINO_LINK = "https://CASINO-AFILIADO.com/?ref=oceanvip";
/* ========================================= */

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN no definido");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

/* ============ START ============ */
bot.start(async (ctx) => {
  const user = ctx.from;

  // Notificar admin (solo humano)
  if (ADMIN_ID && user.id !== ADMIN_ID) {
    bot.telegram.sendMessage(
      ADMIN_ID,
      `🔥 NUEVO LEAD\n👤 @${user.username || user.first_name}\n🆔 ${user.id}`
    ).catch(() => {});
  }

  await ctx.reply(
    `⚠️ <b>JACKPOT ACTIVO – CUPOS LIMITADOS</b>\n
Hoy se están pagando premios reales.
Si entras tarde, <b>PIERDES EL BONO</b>.\n
🇨🇱 Prioridad Chile · LATAM habilitado\n
⏳ Elige AHORA:`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [Markup.button.url("🎰 ENTRAR AL CASINO VIP", CASINO_LINK)],
        [Markup.button.callback("🎁 QUIERO MI BONO", "bonus")],
        [Markup.button.callback("💬 HABLAR CON SOPORTE", "support")]
      ])
    }
  );
});

/* ============ BONO ============ */
bot.action("bonus", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.reply(
    `🔥 <b>BONO VIP DISPONIBLE</b>\n
✔ Activación inmediata
✔ Sin límite de retiro
✔ Pagos rápidos\n
💰 ¿Cuánto planeas depositar?`,
    {
      parse_mode: "HTML",
      ...Markup.inlineKeyboard([
        [Markup.button.url("💸 $10 – $20", CASINO_LINK)],
        [Markup.button.url("💸 $20 – $50", CASINO_LINK)],
        [Markup.button.url("💸 $50 – $100", CASINO_LINK)],
        [Markup.button.url("💎 $100+", CASINO_LINK)]
      ])
    }
  );
});

/* ============ SOPORTE HUMANO ============ */
bot.action("support", async (ctx) => {
  await ctx.answerCbQuery();

  await ctx.reply("⏳ Un asesor VIP te escribirá en breve. Mantente atento.");

  const u = ctx.from;
  if (ADMIN_ID) {
    bot.telegram.sendMessage(
      ADMIN_ID,
      `👤 SOPORTE HUMANO\n@${u.username || u.first_name}\nID: ${u.id}`
    ).catch(() => {});
  }
});

/* ============ FALLBACK ============ */
bot.on("text", async (ctx) => {
  await ctx.reply(
    "⚠️ El bono puede expirar.\n\n👉 Entra ahora:",
    Markup.inlineKeyboard([
      [Markup.button.url("🎰 ACCEDER AL CASINO VIP", CASINO_LINK)]
    ])
  );
});

/* ============ LAUNCH ============ */
bot.launch().then(() => {
  console.log("✅ Ocean Casino Bot ACTIVO");
});

/* ============ GRACEFUL STOP ============ */
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
