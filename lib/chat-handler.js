const { PORTFOLIO_KNOWLEDGE } = require("./portfolio-knowledge");

const MAX_MESSAGE_LENGTH = 500;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 10;
const requestLog = new Map();

function getApiKey() {
  return process.env.GEMINI_API_KEY || "";
}

function getModel() {
  return process.env.GEMINI_MODEL || "gemini-2.5-flash";
}

function clientId(req) {
  return (
    (req.headers &&
      (req.headers["x-forwarded-for"] || req.headers["x-real-ip"])) ||
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
    sendJson(res, 405, {
      error: "Use POST /api/chat with a JSON body."
    });
    return;
  }

  const body = req.body || {};
  const message =
    typeof body.message === "string" ? body.message.trim() : "";

  if (!message) {
    sendJson(res, 400, {
      error: "Please type a question before sending."
    });
    return;
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    sendJson(res, 400, {
      error: "Please keep questions under 500 characters."
    });
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
        "Gemini API key is not configured. Add GEMINI_API_KEY in Vercel Environment Variables and redeploy."
    });
    return;
  }

  const contents = [];
  const history = Array.isArray(body.history) ? body.history.slice(-8) : [];

  history.forEach(function (item) {
    if (
      item &&
      (item.role === "user" || item.role === "assistant") &&
      typeof item.content === "string" &&
      item.content.trim()
    ) {
      contents.push({
        role: item.role === "assistant" ? "model" : "user",
        parts: [
          {
            text: item.content.slice(0, MAX_MESSAGE_LENGTH)
          }
        ]
      });
    }
  });

  contents.push({
    role: "user",
    parts: [{ text: message }]
  });

  const systemInstruction =
    "You are a helpful portfolio assistant for Sneha Gadia. " +
    "Answer only from the portfolio facts provided below. " +
    "If a fact is missing, say you do not have that information. " +
    "Do not invent jobs, phone numbers, GitHub or LinkedIn URLs, " +
    "grades, wins, or deployment links. Keep answers short and accurate.\n\n" +
    PORTFOLIO_KNOWLEDGE;

  try {
    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/" +
        encodeURIComponent(getModel()) +
        ":generateContent",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": apiKey
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: systemInstruction }]
          },
          contents: contents,
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 400
          }
        })
      }
    );

    const data = await response.json().catch(function () {
      return {};
    });

    if (response.status === 401 || response.status === 403) {
      sendJson(res, 502, {
        error: "Gemini rejected the API key. Check GEMINI_API_KEY in Vercel."
      });
      return;
    }

    if (response.status === 429) {
      sendJson(res, 429, {
        error:
          "Gemini's usage limit was reached. Wait and try again, or check your model's quota in Google AI Studio."
      });
      return;
    }

    if (!response.ok) {
      console.error("Gemini API error:", response.status, data.error || data);
      sendJson(res, 502, {
        error:
          "Gemini returned an error. Check the Vercel function logs and your AI Studio model access."
      });
      return;
    }

    const reply =
      data &&
      data.candidates &&
      data.candidates[0] &&
      data.candidates[0].content &&
      data.candidates[0].content.parts
        ? data.candidates[0].content.parts
            .map(function (part) {
              return typeof part.text === "string" ? part.text : "";
            })
            .join("")
            .trim()
        : "";

    if (!reply) {
      sendJson(res, 502, {
        error:
          "Gemini returned no text. Please try asking your question again."
      });
      return;
    }

    sendJson(res, 200, { reply: reply });
  } catch (error) {
    console.error("Gemini connection error:", error.message);
    sendJson(res, 502, {
      error: "The chatbot could not reach Gemini. Please try again later."
    });
  }
}

module.exports = { handleChat };