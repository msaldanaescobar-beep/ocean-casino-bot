import { Telegraf, Markup } from "telegraf";

/* ================= CONFIG ================= */
const BOT_TOKEN = process.env.BOT_TOKEN;
const ADMIN_ID = process.env.ADMIN_ID;
/* ========================================= */

if (!BOT_TOKEN) {
  console.error("❌ BOT_TOKEN no definido");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

/* ============ START ============ */
bot.start(async (ctx) => {
  const user = ctx.from;

  // Notificar admin
  if (ADMIN_ID) {
    bot.telegram.sendMessage(
      ADMIN_ID,
      `🆕 Nuevo lead\n👤 ${user.first_name}\n🆔 ${user.id}`
    );
  }

  return ctx.reply(
    `🎰 *OCEAN CASINO VIP*\n\n` +
    `💰 Bono exclusivo\n` +
    `⚡ Retiros rápidos\n` +
    `🇨🇱 Prioridad Chile\n\n` +
    `¿Desde qué país nos escribes?`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("🇨🇱 Chile", "country_chile")],
        [Markup.button.callback("🇲🇽 México", "country_mexico")],
        [Markup.button.callback("🇵🇪 Perú", "country_peru")],
        [Markup.button.callback("🇨🇴 Colombia", "country_colombia")],
        [Markup.button.callback("🌎 Otro", "country_other")]
      ])
    }
  );
});

/* ============ COUNTRY ============ */
bot.action(/country_(.+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const country = ctx.match[1];

  return ctx.reply(
    `✅ Perfecto.\n\n¿Qué deseas hacer ahora?`,
    Markup.inlineKeyboard([
      [Markup.button.callback("🎁 Quiero el bono", "bonus")],
      [Markup.button.callback("💸 ¿Cómo retiro?", "withdraw")],
      [Markup.button.callback("👤 Hablar con soporte", "support")]
    ])
  );
});

/* ============ BONUS ============ */
bot.action("bonus", async (ctx) => {
  await ctx.answerCbQuery();

  return ctx.reply(
    `🎁 *BONO VIP*\n\n¿Con cuánto deseas comenzar?`,
    {
      parse_mode: "Markdown",
      ...Markup.inlineKeyboard([
        [Markup.button.callback("$10 – $20", "deposit_10_20")],
        [Markup.button.callback("$20 – $50", "deposit_20_50")],
        [Markup.button.callback("$50 – $100", "deposit_50_100")],
        [Markup.button.callback("Más de $100", "deposit_100")]
      ])
    }
  );
});

/* ============ DEPOSITS ============ */
bot.action(/deposit_(.+)/, async (ctx) => {
  await ctx.answerCbQuery();
  const user = ctx.from;
  const amount = ctx.match[1];

  ctx.reply(
    `🔥 Excelente decisión.\n\nUn asesor VIP te contactará ahora.`
  );

  if (ADMIN_ID) {
    bot.telegram.sendMessage(
      ADMIN_ID,
      `🔥 LEAD CALIFICADO\n👤 ${user.first_name}\n🆔 ${user.id}\n💰 Depósito: ${amount}`
    );
  }
});

/* ============ SUPPORT ============ */
bot.action("support", async (ctx) => {
  await ctx.answerCbQuery();
  ctx.reply("👤 Te derivamos con un asesor VIP. Espera un momento…");

  if (ADMIN_ID) {
    bot.telegram.sendMessage(
      ADMIN_ID,
      `📞 Soporte solicitado\n👤 ${ctx.from.first_name}\n🆔 ${ctx.from.id}`
    );
  }
});

/* ============ FALLBACK ============ */
bot.on("text", (ctx) => {
  ctx.reply("Usa los botones para continuar 🎰");
});

/* ============ LAUNCH ============ */
bot.launch().then(() => {
  console.log("✅ Ocean Casino Bot activo");
});

/* ============ STOP ============ */
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
