const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { pptGeneratorPrompt } = require('../utils/prompts');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const getPPTContentFromOpenAI = async (prompt) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: "json_object" },
        });

        const content = response.choices[0].message.content.trim();
        console.log("Generated PPT Content:", content);

        return JSON.parse(content);
    } catch (error) {
        console.error('Error generating PPT content:', error);
        throw error;
    }
};

router.post('/', async (req, res) => {
    const { topic } = req.body;

    if (!topic) {
        return res.status(400).json({ error: 'Topic is required' });
    }

    const prompt = pptGeneratorPrompt(topic);

    try {
        const content = await getPPTContentFromOpenAI(prompt);
        console.log("PPT GENERATOR:", content);
        return res.status(200).json(content);
    } catch (error) {
        console.error("Error generating PPT content:", error);
        return res.status(500).json({ error: 'Failed to generate PPT content' });
    }
});

module.exports = router;
