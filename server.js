const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { handleChat } = require("./lib/chat-handler");

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json({ limit: "8kb" }));
app.use(express.static(path.join(__dirname)));

app.post("/api/chat", function (req, res) {
  handleChat(req, res).catch(function () {
    res.status(502).json({
      error: "The chatbot backend failed unexpectedly."
    });
  });
});

app.use("/api", function (req, res) {
  res.status(404).json({ error: "Unknown API route." });
});

app.listen(port, function () {
  console.log("Portfolio server running at http://localhost:" + port);
  console.log(
    "The AI chatbot needs OPENAI_API_KEY or AI_API_KEY in a local .env file."
  );
});
