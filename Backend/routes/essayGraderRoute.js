const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { essayGraderPrompt } = require('../utils/prompts');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const getEvaluationFromOpenAI = async (prompt) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: "json_object" },
        });

        let summary = response.choices[0].message.content.trim();

        console.log("SUMMARY:", summary)
        
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
        console.error('Error generating questions:', error);
        return null;
    }
};

router.post('/', async (req, res) => {
    const { gradeLevel, essay } = req.body;

    const prompt = essayGraderPrompt(gradeLevel, essay);

    try {
        const evaluation = await getEvaluationFromOpenAI(prompt);

        return res.status(200).json(evaluation);
    } catch (error) {
        return res.status(500).json({ error: 'Failed to generate evaluation' });
    }
});

module.exports = router;
