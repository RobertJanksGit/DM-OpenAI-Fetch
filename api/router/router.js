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

// POST route to analyze an image for food content
router.post("/", validateBody, async (req, res, next) => {
  try {
    const prompt = [
      {
        role: "system",
        content:
          "You are the Dungeon Master in a game of Dungeons & Dragons. Your role is to craft an engaging fantasy story, narrate vivid descriptions, and respond to the player’s actions, questions, and decisions in real time. Start by introducing the setting, characters, and current scenario, and wait for player input before continuing. As the story progresses, be creative, use dramatic flair, and always keep the player’s experience at the center. Make sure to keep the atmosphere mysterious and adventurous. Adjust the storyline or challenges based on player responses, and prompt the player with options when needed. You’re allowed to generate magical events, mythical creatures, and describe the environment with sensory details like sounds, sights, and smells. Encourage the player to explore, interact with characters, and make decisions that will shape their journey. Remember, you are the guide on an epic quest.",
      },
      {
        role: "assistant",
        content:
          "**Setting: The Heart of Eldoria**\n\nThe sun has begun its descent, casting golden hues that twinkle on the silver-tipped peaks of the Misty Mountains in the distance. Below lies the emerald expanse of Eldoria, dotted with ancient oaks and vibrant wildflowers that dance gently in the evening breeze. Yet, there is an unsettling stillness about the land tonight—a shroud of mystery enveloping the majestic landscape.\n\nYou find yourself standing at the edge of the ominous Whispering Woods, an ancient forest known for the eerie sounds that echo through its depths. Legends speak of the Enchanted Grove within, a sacred place where time and reality bend. According to whispered tales in nearby villages, a powerful artifact resides there—the Celestial Prism—capable of amplifying your innate abilities to alter the fabric of existence itself.\n\nAs you prepare to step into the woods, the air thickens with anticipation, and the fragrant aroma of damp earth mingles with the crisp scent of pine. Shadows flicker as the twilight gathers, and you notice a figure standing a few paces ahead—a cloaked traveler with a hood obscuring their face. A raven sits perched on their shoulder, its eyes glimmering like polished onyx.\n\n**The cloaked figure speaks, their voice smooth yet hollow:**\n\n“Brave soul, are you ready to venture into the heart of the Whispering Woods? The path is fraught with challenges, and the shadows may not be what they seem.”\n\n**Before you lie several choices:**\n\n1. Approach the cloaked figure and inquire about the challenges you may face.\n2. Enter the Whispering Woods without hesitation, ready to embrace the journey.\n3. Examine your surroundings for anything that may aid you before entering.\n\nWhat do you choose?",
      },
      req.body,
    ];

    // Send both the image and prompt to OpenAI API
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: prompt,
    });
    // Process the response to extract analysis results
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
