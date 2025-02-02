const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { LessonPlanPrompt } = require('../utils/prompts');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const getLessonPlanFromOpenAI = async (prompt) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: "json_object" },
        });

        let summary = response.choices[0].message.content.trim();
        console.log("Generated Plan BEFORE TRIMMED:", summary);

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

        console.log("Generated Plan:", summary);

        return JSON.parse(summary);
    } catch (error) {
        console.error('Error generating lesson plan:', error);
        return null;
    }
};

router.post('/', async (req, res) => {
    const { gradeLevel, content, additionalContext, alignedStandard } = req.body;
    console.log(gradeLevel, content, additionalContext, alignedStandard);
    
    if (!gradeLevel || !content) {
        return res.status(400).json({ error: 'Grade level and content are required' });
    }

    try {
        const prompt = LessonPlanPrompt({ gradeLevel, content, additionalContext, alignedStandard });
        console.log("PROMPT:", prompt);
        const lessonPlan = await getLessonPlanFromOpenAI(prompt);
        if (lessonPlan) {
            return res.status(200).json(lessonPlan);
        } else {
            return res.status(500).json({ error: 'Failed to generate lesson plan' });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Failed to generate lesson plan' });
    }
});

module.exports = router;
