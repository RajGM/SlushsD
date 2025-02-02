const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { reportCardPrompt } = require('../utils/prompts');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const getEvaluationFromOpenAI = async (prompt) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            response_format: {"type": "json_object"},
            messages: [{ role: 'user', content: prompt }],
        });

        let summary = response.choices[0].message.content.trim();

        if (summary.startsWith('```') && summary.endsWith('```')) {
            summary = summary.slice(3, -3).trim();
        }

        if (summary.startsWith('json')) {
            summary = summary.slice(4).trim();
        }

        const jsonStartIndex = summary.indexOf('{');
        const jsonEndIndex = summary.lastIndexOf('}');
        if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
            summary = summary.slice(jsonStartIndex, jsonEndIndex + 1).trim();
        }

        console.log(JSON.parse(summary))
        return JSON.parse(summary);
    } catch (error) {
        console.error('Error generating evaluation:', error);
        throw error;
    }
};

router.post('/', async (req, res) => {
    console.log("REQUEST TO THIS /api/report-card")

    const { gradeLevel, studentPronouns, strengths, growths } = req.body;

    if (!gradeLevel || !studentPronouns || !strengths || !growths) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const prompt = reportCardPrompt({ gradeLevel, studentPronouns, strengths, growths });
        const evaluation = await getEvaluationFromOpenAI(prompt);

        res.status(200).json(evaluation);
    } catch (error) {
        console.error("Error generating evaluation:", error);
        res.status(500).json({ error: 'Failed to generate evaluation' });
    }
});

module.exports = router;
