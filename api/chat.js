const { handleChat } = require("../lib/chat-handler");

module.exports = async function chat(req, res) {
  if (req.method === "OPTIONS") {
    res.statusCode = 204;
    res.end();
    return;
  }
  await handleChat(req, res);
};
