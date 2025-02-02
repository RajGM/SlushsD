const express = require('express');
const router = express.Router();
const OpenAI = require('openai');
const { textDependentQuestionPrompt } = require('../utils/prompts');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const generateQuestions = async (prompt) => {
    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: "json_object" },
        });

        let summary = response.choices[0].message.content.trim();
        console.log(summary);

        if (summary.startsWith('```') && summary.endsWith('```')) {
            console.log("CONTAINS BACK TICKS");
            summary = summary.slice(3, -3).trim();
        }

        if (summary.startsWith('json')) {
            console.log("CONTAINS JSON PREFIX");
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
    try {
        const { gradeLevel, numberOfQuestions, questionTypes, hardQuestions, mediumQuestions, easyQuestions, questionText } = req.body;

        console.log(gradeLevel, numberOfQuestions, hardQuestions, mediumQuestions, easyQuestions, questionTypes, questionText);

        const prompt = TestPrompt(gradeLevel, numberOfQuestions, hardQuestions, mediumQuestions, easyQuestions, questionTypes, questionText);
        console.log("PROMPT:", prompt)

        const result = await generateQuestions(prompt);
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

function TestPrompt(gradeLevel, numberOfQuestions, hardQuestions, mediumQuestions, easyQuestions, questionTypes, questionText) {
    let prompt = `
  Generate ${numberOfQuestions} text-dependent questions with correct answers for a ${gradeLevel} grade student based on the provided text. The questions should be divided into three categories: ${hardQuestions} hard questions, ${mediumQuestions} medium questions, and ${easyQuestions} easy questions. All of question should be the following types: ${questionTypes}. Ensure that all questions require close reading of the text to answer. Provide an explanation for each question and answer. Provide the output in the following JSON format:
  
  {
    "Title": "Context about the questionText in 5 or fewer words",
    "Original Text": "Original questionText here",
    "text-question": [
      {
        "difficulty": "easy",
        "question": "Text-dependent question",
        "answer": "Answer",
        "explanation": "Explanation of the correct answer, referencing specific parts of the text"
      },
      {
        "difficulty": "medium",
        "question": "Text-dependent question",
        "answer": "Answer",
        "explanation": "Explanation of the correct answer, referencing specific parts of the text"
      },
      {
        "difficulty": "hard",
        "question": "Text-dependent question",
        "answer": "Answer",
        "explanation": "Explanation of the correct answer, referencing specific parts of the text"
      }
    ]
  }
  
  Ensure that:
  1. All questions are directly based on the provided text.
  2. Questions require students to cite evidence from the text in their answers.
  3. Literary Device questions focus on identifying and analyzing specific devices used in the text.
  4. Comprehension questions test understanding of explicit and implicit information in the text.
  5. Theme questions require analysis of the text's overall message or underlying ideas.
  6. Mix questions combine analysis of literary devices with comprehension of the text.
  7. Explanations reference specific parts of the text to justify the correct answer.
  
  Text:
  ${questionText}`;
  
    return prompt;
  }