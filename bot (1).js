const TelegramBot = require("node-telegram-bot-api");

const TOKEN = process.env.BOT_TOKEN;
if (!TOKEN) {
  console.error("❌ BOT_TOKEN environment variable is missing!");
  process.exit(1);
}

const bot = new TelegramBot(TOKEN, { polling: true });

console.log("🚀 Sports Insights Hub Bot is running...");

// ─── KEYBOARDS ────────────────────────────────────────────────────────────────

const mainMenuKeyboard = {
  reply_markup: {
    keyboard: [
      ["1️⃣ Today's Match Insights", "2️⃣ Premium Analysis"],
      ["3️⃣ Join Community", "4️⃣ Live Updates"],
    ],
    resize_keyboard: true,
    one_time_keyboard: false,
  },
};

const startKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "👉 Start Now", callback_data: "start_now" }],
    ],
  },
};

const backKeyboard = {
  reply_markup: {
    inline_keyboard: [
      [{ text: "🔙 Back to Main Menu", callback_data: "main_menu" }],
    ],
  },
};

// ─── MESSAGES ─────────────────────────────────────────────────────────────────

const MESSAGES = {
  welcome: `Hello 👋\n\nWelcome to the *Sports Insights Hub!*\n\nGet ready to access:\n📊 Match Analysis\n🔥 Trending Insights\n📈 Data-Based Predictions\n\nClick below to continue 👇`,

  mainMenu: `Choose an option:\n\n1️⃣ *Today's Match Insights*\n2️⃣ *Premium Analysis*\n3️⃣ *Join Community*\n4️⃣ *Live Updates*`,

  matchInsight: `📊 *Match: Team A vs Team B*\n\n✔️ Recent Form Analysis\n✔️ Head-to-Head Stats\n✔️ Key Player Performance\n✔️ Winning Probability\n\n👉 *Get Full Analysis Here:*\n[Your Landing Link]`,

  premium: `🔥 *Unlock Advanced Insights*\n\nGet deeper analysis, accuracy-based picks & real-time updates.\n\n👉 *Access Now:*\n[Your Website / Landing Page Link]`,

  community: `💬 *Join Our Discussion Community*\n\nStay updated with latest match trends & insights.\n\n👉 *Join Here:*\nhttps://t.me/rockybook2121rockybookeducation`,

  liveUpdates: `📡 *Live Updates*\n\nGet real-time score updates, breaking news & instant match insights.\n\n🔔 Stay tuned — live coverage is active!\n\n👉 *Follow Live:*\n[Your Live Updates Link]`,
};

// ─── HANDLERS ─────────────────────────────────────────────────────────────────

// /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, MESSAGES.welcome, {
    parse_mode: "Markdown",
    ...startKeyboard,
  });
});

// /menu command
bot.onText(/\/menu/, (msg) => {
  sendMainMenu(msg.chat.id);
});

// Inline button callbacks
bot.on("callback_query", (query) => {
  const chatId = query.message.chat.id;
  const data = query.data;

  bot.answerCallbackQuery(query.id);

  switch (data) {
    case "start_now":
      sendMainMenu(chatId);
      break;

    case "main_menu":
      sendMainMenu(chatId);
      break;

    default:
      break;
  }
});

// Reply keyboard handlers
bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (!text) return;

  if (text.includes("Today's Match Insights") || text === "1") {
    bot.sendMessage(chatId, MESSAGES.matchInsight, {
      parse_mode: "Markdown",
      ...backKeyboard,
    });
  } else if (text.includes("Premium Analysis") || text === "2") {
    bot.sendMessage(chatId, MESSAGES.premium, {
      parse_mode: "Markdown",
      ...backKeyboard,
    });
  } else if (text.includes("Join Community") || text === "3") {
    bot.sendMessage(chatId, MESSAGES.community, {
      parse_mode: "Markdown",
      ...backKeyboard,
    });
  } else if (text.includes("Live Updates") || text === "4") {
    bot.sendMessage(chatId, MESSAGES.liveUpdates, {
      parse_mode: "Markdown",
      ...backKeyboard,
    });
  }
});

// ─── HELPERS ──────────────────────────────────────────────────────────────────

function sendMainMenu(chatId) {
  bot.sendMessage(chatId, MESSAGES.mainMenu, {
    parse_mode: "Markdown",
    ...mainMenuKeyboard,
  });
}

// ─── ERROR HANDLING ───────────────────────────────────────────────────────────

bot.on("polling_error", (error) => {
  console.error("Polling error:", error.message);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});
