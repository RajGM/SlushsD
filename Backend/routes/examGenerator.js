const express = require('express');
const router = express.Router();
const { ExamGeneratorPrompt } = require('../utils/prompts');

const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function getQuestionsFromOpenAI(prompt) {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: "json_object" },
        });

        const questionsText = response.choices[0].message.content.trim();
        return JSON.parse(questionsText);
    } catch (error) {
        console.error('Error generating questions:', error);
        return null;
    }
}

router.post('/', async (req, res) => {
    try {
        const { gradeLevel, numberOfQuestions, questionTypes, hardQuestions, mediumQuestions, easyQuestions, questionText } = req.body;

        console.log(gradeLevel, numberOfQuestions, questionTypes, hardQuestions, mediumQuestions, easyQuestions, questionText);
       
        const prompt = ExamGeneratorPrompt(gradeLevel, numberOfQuestions, questionTypes, hardQuestions, mediumQuestions, easyQuestions, questionText);

        const result = await getQuestionsFromOpenAI(prompt);
        if (result) {
            console.log("RESULTS:", result);
            return res.status(200).json(result);
        } else {
            return res.status(500).json({ error: 'Failed to generate questions' });
        }
    } catch (error) {
        console.error('Error in POST handler:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
