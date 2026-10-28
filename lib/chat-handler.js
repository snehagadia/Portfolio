const { PORTFOLIO_KNOWLEDGE } = require("./portfolio-knowledge");

const MAX_MESSAGE_LENGTH = 500;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 10;
const requestLog = new Map();

function getApiKey() {
  return process.env.OPENAI_API_KEY || process.env.AI_API_KEY || "";
}

function getModel() {
  return process.env.OPENAI_MODEL || process.env.AI_MODEL || "gpt-4o-mini";
}

function clientId(req) {
  return (
    (req.headers && (req.headers["x-forwarded-for"] || req.headers["x-real-ip"])) ||
    req.ip ||
    "unknown"
  );
}

function isRateLimited(id) {
  const now = Date.now();
  const recent = (requestLog.get(id) || []).filter(function (stamp) {
    return now - stamp < RATE_LIMIT_WINDOW_MS;
  });
  if (recent.length >= RATE_LIMIT_MAX) {
    requestLog.set(id, recent);
    return true;
  }
  recent.push(now);
  requestLog.set(id, recent);
  return false;
}

function sendJson(res, status, payload) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}

async function handleChat(req, res) {
  if (req.method !== "POST") {
    sendJson(res, 405, { error: "Use POST /api/chat with a JSON body." });
    return;
  }

  if (isRateLimited(String(clientId(req)))) {
    sendJson(res, 429, {
      error: "Too many chatbot requests. Please wait a minute and try again."
    });
    return;
  }

  const apiKey = getApiKey();
  if (!apiKey || apiKey === "your_api_key_here") {
    sendJson(res, 503, {
      error:
        "The chatbot API key is not configured. Add OPENAI_API_KEY to a local .env file or to Vercel environment variables, then restart the server. The website cannot hide a secret key in frontend files."
    });
    return;
  }

  const body = req.body || {};
  const message = typeof body.message === "string" ? body.message.trim() : "";
  if (!message) {
    sendJson(res, 400, { error: "Please type a question before sending." });
    return;
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    sendJson(res, 400, { error: "Please keep questions under 500 characters." });
    return;
  }

  const history = Array.isArray(body.history) ? body.history.slice(-8) : [];
  const messages = [
    {
      role: "system",
      content:
        "You are a helpful portfolio assistant for Sneha Gadia. Answer only from the portfolio facts below. If a fact is missing, say you do not have that information. Do not invent jobs, phone numbers, GitHub or LinkedIn URLs, grades, wins, or deployment links. Keep answers short and accurate.\n\n" +
        PORTFOLIO_KNOWLEDGE
    }
  ];

  history.forEach(function (item) {
    if (
      item &&
      (item.role === "user" || item.role === "assistant") &&
      typeof item.content === "string"
    ) {
      messages.push({
        role: item.role,
        content: item.content.slice(0, MAX_MESSAGE_LENGTH)
      });
    }
  });
  messages.push({ role: "user", content: message });

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + apiKey
      },
      body: JSON.stringify({
        model: getModel(),
        temperature: 0.2,
        max_tokens: 400,
        messages: messages
      })
    });

    const data = await response.json().catch(function () {
      return {};
    });

    if (response.status === 401 || response.status === 403) {
      sendJson(res, 502, {
        error: "The AI provider rejected the API key. Check OPENAI_API_KEY."
      });
      return;
    }
    if (response.status === 429) {
      sendJson(res, 429, {
        error: "The AI provider rate-limited this project. Try again later."
      });
      return;
    }
    if (!response.ok) {
      sendJson(res, 502, {
        error: "The AI service returned an error. Try again later."
      });
      return;
    }

    const reply =
      data &&
      data.choices &&
      data.choices[0] &&
      data.choices[0].message &&
      data.choices[0].message.content;

    if (!reply) {
      sendJson(res, 502, {
        error: "The AI service returned an empty reply."
      });
      return;
    }

    sendJson(res, 200, { reply: String(reply).trim() });
  } catch (error) {
    sendJson(res, 502, {
      error: "The chatbot could not reach the AI service. Check the network and try again."
    });
  }
}

module.exports = { handleChat };
