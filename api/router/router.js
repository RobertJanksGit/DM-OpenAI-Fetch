const express = require("express");
const multer = require("multer");
const { OpenAI } = require("openai");
const { validateBody } = require("../middleware/middleware");

require("dotenv").config();

const router = express.Router();
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

// Initialize OpenAI client with the API key
const client = new OpenAI({
  apiKey: process.env["OPENAI_API_KEY"],
});

router.post("/", validateBody, async (req, res, next) => {
  try {
    const prompt = req.body;

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: prompt,
    });

    if (response) {
      res.json({
        role: "Assistant",
        content: response.choices[0].message.content,
      });
    } else {
      res.status(500).json({ message: "Analysis failed or data incomplete." });
    }
  } catch (error) {
    next(error);
  }
});

// Error handling middleware
router.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    message: err.message,
  });
});

module.exports = router;
