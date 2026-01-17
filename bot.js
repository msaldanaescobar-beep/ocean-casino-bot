import { Telegraf, Markup } from "telegraf";

const BOT_TOKEN = "PEGA_AQUI_TU_TOKEN";
const ADMIN_ID = 123456789;

const bot = new Telegraf(BOT_TOKEN);

bot.start(ctx => {
  ctx.reply(
    "🎰 Bienvenido a OCEAN CASINO VIP\n\n🔥 Bono exclusivo activo\n💰 Pagos rápidos\n🇨🇱 Prioridad Chile\n\n¿Desde qué país nos escribes?",
    Markup.inlineKeyboard([
      [Markup.button.callback("🇨🇱 Chile", "country_chile")],
      [Markup.button.callback("🇲🇽 México", "country_mexico")],
      [Markup.button.callback("🇵🇪 Perú", "country_peru")],
      [Markup.button.callback("🇨🇴 Colombia", "country_colombia")],
      [Markup.button.callback("🌎 Otro", "country_other")]
    ])
  );
});

bot.action(/country_(.+)/, ctx => {
  ctx.answerCbQuery();
  ctx.reply(
    "🎁 Tenemos un bono VIP disponible\n\n¿Qué deseas hacer?",
    Markup.inlineKeyboard([
      [Markup.button.callback("🎰 Activar bono", "bonus")],
      [Markup.button.callback("💰 Retiros", "withdraw")],
      [Markup.button.callback("🎮 Juegos", "games")],
      [Markup.button.callback("👤 Hablar con humano", "support")]
    ])
  );
});

bot.action("bonus", ctx => {
  ctx.answerCbQuery();
  ctx.reply(
    "💰 ¿Cuánto planeas depositar?",
    Markup.inlineKeyboard([
      [Markup.button.callback("$10 – $20", "lead")],
      [Markup.button.callback("$20 – $50", "lead")],
      [Markup.button.callback("$50 – $100", "lead")],
      [Markup.button.callback("Más de $100", "lead")]
    ])
  );
});

bot.action("withdraw", ctx => {
  ctx.answerCbQuery();
  ctx.reply("💸 Retiros rápidos por transferencia o crypto.");
});

bot.action("games", ctx => {
  ctx.answerCbQuery();
  ctx.reply("🎮 Slots, casino en vivo y jackpots.");
});

bot.action(["lead", "support"], ctx => {
  ctx.answerCbQuery();
  ctx.reply("✅ Un asesor VIP te escribirá en breve.");

  bot.telegram.sendMessage(
    ADMIN_ID,
    `🔥 LEAD VIP\n👤 @${ctx.from.username || ctx.from.first_name}\n⏰ ${new Date().toLocaleString()}`
  );
});

bot.launch();
