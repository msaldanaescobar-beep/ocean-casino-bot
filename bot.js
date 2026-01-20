import { Telegraf, Markup } from "telegraf";

const BOT_TOKEN = "8415598577:AAFgea3lcNN-OrQ1Ro7Jgv6Z4Ihs5IMJKdA"; // token del bot
const ADMIN_CHAT_ID = 8360011868
const AFFILIATE_LINK = process.env.AFFILIATE_LINK || "https://example.com";

}

const bot = new Telegraf(BOT_TOKEN);

// ===== MEMORIA SIMPLE (LISTA VIP / LEADS) =====
const users = new Map();

// ===== MENSAJES =====
const MSG = {
  welcome: `🌊 *Ocean Casino VIP*

💰 Bonos privados
🎰 Casinos verificados
🔥 Acceso limitado LATAM

⚠️ Solo usuarios reales
⚠️ Cupos diarios limitados

👇 Comienza ahora`,
  
  chooseCountry: "🌎 *¿Desde qué país juegas?*",
  experience: "🎰 *¿Has jugado antes en casinos online?*",

  waiting: `⏳ *Acceso VIP en activación*

Estamos liberando:
💰 Bonos privados
🔥 Giros exclusivos
🎁 Cashback VIP

Solo la *lista prioritaria* entra primero.`,

  vipAdded: `✅ *Estás en la Lista VIP*

📣 Serás notificado apenas:
• Se activen los bonos
• Se libere el acceso
• Se abran cupos nuevos`,

  menu: `🎰 *Menú Ocean Casino VIP*`,
};

// ===== BOTONES =====
const BTN = {
  start: Markup.inlineKeyboard([
    [Markup.button.callback("🔥 ENTRAR VIP", "START_VIP")],
  ]),

  countries: Markup.inlineKeyboard([
    [Markup.button.callback("🇨🇱 Chile", "C_CL")],
    [Markup.button.callback("🇲🇽 México", "C_MX")],
    [Markup.button.callback("🇦🇷 Argentina", "C_AR")],
    [Markup.button.callback("🌎 Otro país", "C_OTRO")],
  ]),

  experience: Markup.inlineKeyboard([
    [Markup.button.callback("💸 Sí, juego seguido", "EXP_YES")],
    [Markup.button.callback("🎯 He probado", "EXP_MAYBE")],
    [Markup.button.callback("🆕 Soy nuevo", "EXP_NO")],
  ]),

  menu: Markup.inlineKeyboard([
    [Markup.button.callback("💰 Obtener bono", "GET_BONUS")],
    [Markup.button.callback("🔥 Lista VIP", "VIP")],
  ]),
};

// ===== START =====
bot.start(async (ctx) => {
  users.set(ctx.from.id, {});
  await ctx.replyWithMarkdown(MSG.welcome, BTN.start);
});

// ===== FLUJO =====
bot.action("START_VIP", async (ctx) => {
  await ctx.answerCbQuery();
  await ctx.editMessageText(MSG.chooseCountry, {
    parse_mode: "Markdown",
    ...BTN.countries,
  });
});

bot.action(/C_/, async (ctx) => {
  await ctx.answerCbQuery();
  users.get(ctx.from.id).country = ctx.callbackQuery.data;
  await ctx.editMessageText(MSG.experience, {
    parse_mode: "Markdown",
    ...BTN.experience,
  });
});

bot.action(/EXP_/, async (ctx) => {
  await ctx.answerCbQuery();
  users.get(ctx.from.id).experience = ctx.callbackQuery.data;

  // Aviso admin (lead)
  if (ADMIN_CHAT_ID) {
    await ctx.telegram.sendMessage(
      ADMIN_CHAT_ID,
      `🆕 Nuevo lead\n👤 ${ctx.from.username || ctx.from.first_name}\n🌍 ${users.get(ctx.from.id).country}\n🎰 ${users.get(ctx.from.id).experience}`
    );
  }

  await ctx.editMessageText(MSG.menu, {
    parse_mode: "Markdown",
    ...BTN.menu,
  });
});

// ===== MENU =====
bot.action("GET_BONUS", async (ctx) => {
  await ctx.answerCbQuery();

  if (AFFILIATE_LINK.includes("example")) {
    await ctx.replyWithMarkdown(MSG.waiting);
  } else {
    await ctx.reply(
      "🔥 Acceso desbloqueado",
      Markup.inlineKeyboard([
        [Markup.button.url("💰 JUGAR AHORA", AFFILIATE_LINK)],
      ])
    );
  }
});

bot.action("VIP", async (ctx) => {
  await ctx.answerCbQuery();
  users.get(ctx.from.id).vip = true;
  await ctx.replyWithMarkdown(MSG.vipAdded);
});

// ===== BLOQUEAR TEXTO =====
bot.on("text", async (ctx) => {
  await ctx.reply("⚠️ Usa los botones. El acceso es limitado.");
});

// ===== START BOT =====
bot.launch();
console.log("✅ Ocean Casino VIP BOT activo");

// ===== SHUTDOWN =====
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
