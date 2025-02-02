const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { proofReaderPrompt } = require('../utils/prompts');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateProofread = async (proofreadPrompt) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: proofreadPrompt }],
            response_format: { type: "json_object" },
        });

        let summary = response.choices[0].message.content.trim();
        
        if (summary.startsWith('```') && summary.endsWith('```')) {
            console.log("CONTAINS BACK TICKS")
            summary = summary.slice(3, -3).trim();
        }

        if (summary.startsWith('json')) {
            console.log("CONTAINS JSON PREFIX")
            summary = summary.slice(4).trim();
        }

        const jsonStartIndex = summary.indexOf('{');
        const jsonEndIndex = summary.lastIndexOf('}');
        if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
            summary = summary.slice(jsonStartIndex, jsonEndIndex + 1).trim();
        }

        return JSON.parse(summary);

    } catch (error) {
        console.error('Error generating proofread text:', error);
        return null;
    }
};

router.post('/', async (req, res) => {
    try {
        const { originalText } = req.body;

        const prompt = proofReaderPrompt(originalText);
        const result = await generateProofread(prompt);

        if (result) {
            console.log("RESULTS:", result);
            return res.status(200).json(result);
        } else {
            return res.status(500).json({ error: 'Failed to proofread text' });
        }
    } catch (error) {
        console.error('Error in POST handler:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;