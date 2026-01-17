// bot.js (Telegraf v4)
import { Telegraf, Markup } from "telegraf";

/* ============ CONFIG ============ */
const BOT_TOKEN = process.env.OceanCasinoVipBot;          // define en Railway / env
const ADMIN_ID = process.env.8415598577;           // tu Telegram ID (number as string ok)
const SHEET_WEBHOOK = process.env.SHEET_WEBHOOK; // opcional: URL para enviar leads (Google Apps Script / Zapier)
/* ================================= */

if (!BOT_TOKEN) {
  console.error("ERROR: BOT_TOKEN no definido en env vars");
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

/* ---------------- helper: enviar lead a CRM (opcional) ---------------- */
async function pushLeadToSheet(payload) {
  if (!SHEET_WEBHOOK) return;
  try {
    await fetch(SHEET_WEBHOOK, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
  } catch (e) {
    console.warn("No se pudo enviar lead al webhook:", e.message || e);
  }
}

/* ---------------- notify admin ---------------- */
function notifyAdmin(text) {
  if (!ADMIN_ID) return;
  try {
    bot.telegram.sendMessage(ADMIN_ID, text, { parse_mode: "HTML" });
  } catch (e) {
    console.error("notifyAdmin error:", e);
  }
}

/* ---------------- start (incluye payload) ---------------- */
bot.start(async ctx => {
  const payload = ctx.startPayload || null; // Si viene vía ?start=payload
  const user = ctx.from || {};
  const payloadText = payload ? `\n📎 Payload: ${payload}` : "";

  // Store/notify lead arrival
  const lead = {
    username: user.username || `${user.first_name || ""} ${user.last_name || ""}`.trim(),
    id: user.id,
    lang: user.language_code || "",
    payload: payload || "",
    time: new Date().toISOString()
  };

  // Push to CRM (optional)
  pushLeadToSheet(lead);

  // Notify admin instantly with payload + quick link to chat
  notifyAdmin(
    `🆕 Nuevo visitante Telegram\n` +
    `👤 <b>${lead.username}</b> (id: ${lead.id})\n` +
    `🌐 lang: ${lead.lang}${payloadText}\n` +
    `🔗 https://t.me/${(await bot.telegram.getMe()).username}?start=${payload || ""}`
  );

  // Initial welcome + ask country
  return ctx.reply(
    `🎰 Bienvenido a OCEAN CASINO VIP\n\n🔥 Bono activo para nuevos jugadores\n💰 Pagos rápidos\n🇨🇱 Atención prioritaria Chile\n\nAntes de continuar dime: ¿Desde qué país nos escribes?`,
    Markup.inlineKeyboard([
      [Markup.button.callback("🇨🇱 Chile", "country_chile")],
      [Markup.button.callback("🇲🇽 México", "country_mexico")],
      [
        Markup.button.callback("🇵🇪 Perú", "country_peru"),
        Markup.button.callback("🇨🇴 Colombia", "country_colombia")
      ],
      [Markup.button.callback("🇦🇷 Argentina", "country_argentina")],
      [Markup.button.callback("🌎 Otro", "country_other")]
    ])
  );
});

/* ---------------- country handler ---------------- */
bot.action(/country_(.+)/, async ctx => {
  const countryKey = ctx.match[1]; // "chile", "mexico", etc.
  await ctx.answerCbQuery();

  const countryPretty = {
    chile: "Chile",
    mexico: "México",
    peru: "Perú",
    colombia: "Colombia",
    argentina: "Argentina",
    other: "otro país"
  }[countryKey] || countryKey;

  // Save partial lead
  const user = ctx.from || {};
  const leadPartial = {
    username: user.username || user.first_name || "",
    id: user.id,
    country: countryPretty,
    time: new Date().toISOString()
  };
  pushLeadToSheet(leadPartial);

  // Send tailored reply
  await ctx.reply(
    `${countryKey === "chile" ? "🇨🇱 Perfecto — prioridad para Chile!" : "✅ OK!"}\n\n` +
    `Para jugadores de ${countryPretty} tenemos:\n` +
    `✔ Bono VIP personalizado\n✔ Retiros rápidos\n✔ Atención directa\n\nElige una opción:`,
    Markup.inlineKeyboard([
      [Markup.button.callback("🎁 Quiero el bono", "bonus")],
      [Markup.button.callback("💰 ¿Cómo retiro?", "withdraw")],
      [Markup.button.callback("🎮 ¿Qué juegos hay?", "games")],
      [Markup.button.callback("❓ Hablar con soporte", "support")]
    ])
  );
});

/* ---------------- main actions ---------------- */
bot.action("bonus", async ctx => {
  await ctx.answerCbQuery();
  await ctx.reply(
    `🎁 BONO VIP OCEAN CASINO\n\n✔ Se activa con tu primer depósito\n✔ Sin límite de ganancias\n\n¿Cuánto planeas depositar?`,
    Markup.inlineKeyboard([
      [Markup.button.callback("$10 – $20", "deposit_10_20")],
      [Markup.button.callback("$20 – $50", "deposit_20_50")],
      [Markup.button.callback("$50 – $100", "deposit_50_100")],
      [Markup.button.callback("Más de $100", "deposit_100_plus")]
    ])
  );
});

bot.action("withdraw", async ctx => {
  await ctx.answerCbQuery();
  await ctx.reply("💸 RETIROS: Procesamos en minutos mediante transferencia o crypto. ¿Quieres ver opciones?");
});

bot.action("games", async ctx => {
  await ctx.answerCbQuery();
  await ctx.reply("🎮 Slots populares, juegos en vivo y jackpot progresivo. ¿Te interesa slots o juegos en vivo?");
});

bot.action("support", async ctx => {
  await ctx.answerCbQuery();
  await ctx.reply("👤 Te voy a derivar con un asesor VIP. Por favor espera un momento…");
  // Notify admin to take over (with context)
  const u = ctx.from;
  notifyAdmin(`🔔 Derivir lead a humano\n👤 @${u.username || u.first_name}\nID: ${u.id}`);
});

/* ---------------- deposit actions (lead qualification) ---------------- */
bot.action(/deposit_.+/, async ctx => {
  await ctx.answerCbQuery();

  const amountLabel = ctx.update.callback_query.data.replace("deposit_", "").replace(/_/g, " ");
  const user = ctx.from || {};

  // send confirmation to user
  await ctx.reply(`✅ Perfecto. Un asesor VIP te escribirá en breve para los pasos de depósito (${amountLabel}).`);

  // notify admin with lead details
  const msg = `🔥 LEAD CALIFICADO\n👤 @${user.username || user.first_name}\nID: ${user.id}\nInterés: ${amountLabel}\nHora: ${new Date().toLocaleString()}`;
  notifyAdmin(msg);

  // push to CRM if available
  pushLeadToSheet({
    username: user.username || user.first_name,
    id: user.id,
    interest: amountLabel,
    time: new Date().toISOString()
  });
});

/* ---------------- fallback text handler ---------------- */
bot.on("text", async ctx => {
  // small autoresponder to keep them engaged
  await ctx.reply("Gracias, un asesor VIP revisará tu mensaje. Mientras tanto, ¿quieres activar el bono VIP? (escribe 'bono' o usa los botones)");
});

/* ---------------- launch (polling by default). If Railway provides URL, you can enable webhook instead ---------------- */
(async () => {
  try {
    await bot.launch();
    console.log("✅ Bot activo (long polling).");
  } catch (e) {
    console.error("No se pudo lanzar el bot:", e);
  }
})();

/* ---------------- graceful stop ---------------- */
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
