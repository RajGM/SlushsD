const express = require('express');
const router = express.Router();
const { db } = require('../lib/firebase');
const fetch = require('node-fetch'); // Use `fetch` to call OpenAI API
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
    try {
        console.log("EXAM EVALUATOR");

        const { examID, createdBy, submittedBy } = req.body;
        console.log(examID, createdBy, submittedBy);

        // Firestore references
        const correctAnswersRef = db.collection('history').doc(createdBy).collection('exams').doc(examID);
        const submittedAnswersRef = db.collection('exams').doc(submittedBy).collection('exam').doc(examID);

        // Fetch correct answers
        const correctAnswersSnap = await correctAnswersRef.get();
        if (!correctAnswersSnap.exists) {
            return res.status(404).json({ error: 'Correct answers not found.' });
        }
        const correctData = correctAnswersSnap.data();

        // Fetch submitted answers
        const submittedAnswersSnap = await submittedAnswersRef.get();
        if (!submittedAnswersSnap.exists) {
            return res.status(404).json({ error: 'Submitted answers not found.' });
        }
        const submittedData = submittedAnswersSnap.data();

        // Process questions and answers
        const correctQuestions = correctData.result.Questions;
        const submittedQuestions = submittedData.result.Questions;

        const evaluatedQuestions = [];
        let totalMarks = 0;
        let marksScored = 0;

        for (let i = 0; i < correctQuestions.length; i++) {
            const correctQuestion = correctQuestions[i];
            const submittedQuestion = submittedQuestions[i];
            const { questionType, submitted_answer, question } = submittedQuestion;

            let correctness = 'incorrect';
            let explanation = correctQuestion.explanation || '';
            const mark = 1; // Each question carries 1 mark
            totalMarks += mark;

            console.log(question)
            console.log(submittedQuestion)
            // Handle MCQ
            if (questionType === 'MCQ') {
                if (submitted_answer === correctQuestion.answer) {
                    correctness = 'correct';
                    marksScored += mark;
                }
                evaluatedQuestions.push({
                    ...submittedQuestion,
                    correctness,
                    explanation,
                });
            } else if (questionType === 'Open-Ended') {
                const openAIResponse = await evaluateOpenEnded(
                    correctQuestion.answer,
                    submitted_answer,
                    question
                );
                correctness = openAIResponse.correctness;
                explanation = correctQuestion.explanation || openAIResponse.explanation;
                if (correctness === 'correct') {
                    marksScored += mark; // Add marks if correct
                }

                evaluatedQuestions.push({
                    ...submittedQuestion,
                    correctness,
                    explanation,
                });
            }
        }

        // Save the evaluated answers back to Firestore
        await submittedAnswersRef.update({
            'result.Questions': evaluatedQuestions,
            'total_marks': totalMarks,
            'marks_scored': marksScored,
            evaluated: true,
        });

        console.log("Evaluation completed.");
        return res.status(200).json({ success: true, evaluatedQuestions });

    } catch (error) {
        console.error('Error in /examEvaluator:', error);
        return res.status(500).json({ error: 'Failed to evaluate the exam.' });
    }
});

// Function to evaluate open-ended answers using OpenAI
const evaluateOpenEnded = async (correctAnswer, submittedAnswer, question) => {
    try {
        const prompt = `
            Compare the following two answers for similarity in meaning for the given question:
            Question: ${question}
            Correct Answer: ${correctAnswer}
            Submitted Answer: ${submittedAnswer}
            Based on the similarity, provide one of the following:
            1. "correct" if the answers have similar meaning.
            2. "incorrect" if the answers have different meanings.
            Also provide a short explanation justifying your evaluation.


            Format: JSON 
{
"correctness":"correct or incorrect",
"explanation": "Context about the questionText in 5 or fewer words"
}


        `;

        // Use OpenAI SDK to create a chat completion
        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [{ role: 'user', content: prompt }],
            response_format: { type: "json_object" },
        });

        // Parse the OpenAI response
        const resultText = response.choices[0].message.content.trim();
        console.log(resultText);
        console.log(JSON.parse(resultText));
        return JSON.parse(resultText);

    } catch (error) {
        console.error('Error calling OpenAI API:', error);
        return {
            correctness: 'unknown',
            explanation: 'Could not evaluate due to an error.',
        };
    }
};



module.exports = router;
