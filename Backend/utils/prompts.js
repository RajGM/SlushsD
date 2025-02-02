const reportCardPrompt = ({ gradeLevel, studentPronouns, strengths, growths }) => {
  return `
      Generate a detailed evaluation for a student with the following details, include Student Pronouns in all cases:
      
      Grade Level: ${gradeLevel}
      Student Pronouns: ${studentPronouns}
      Strengths: ${strengths}
      Areas for Growth: ${growths}
      
      Format: json
      {
        "Title": "Title for storage",
        "Strength": {
          "subTitle": "Areas of Strength",
          "array": [
            "${studentPronouns} is strong in StrengthContent1",
            "${studentPronouns} excels at StrengthContent2",
            ...
          ]
        },
        "Weakness": {
          "subTitle": "Areas for Growth",
          "array": [
            "${studentPronouns} needs to improve in WeaknessContent1",
            "${studentPronouns} could work on WeaknessContent2",
            ...
          ]
        }
      }
    `;
};

const LessonPlanPrompt = ({ gradeLevel, content, additionalContext, alignedStandard }) => {
  return `
      Generate a lesson plan for the following details:
  
      Grade Level: ${gradeLevel}
      Topic/Standard: ${content}
      ${additionalContext ? `Additional Context: ${additionalContext}` : ""}
      ${alignedStandard ? `Standards Set to Align to: ${alignedStandard}` : ""}
  
      Format: json
      {
        "Title": "TitleContent",
        "Objective": "ObjectiveContent",
        "Assessment": ["AssessmentContent1", "AssessmentContent2", ...],
        "Key Points": ["Keypoint1", "Keypoint2", "Keypoint3", ...],
        "Opening": ["OpeningContent1", "OpeningContent2", "OpeningContent3", ...],
        "Introduction to New Material": ["IntroductionToNewMaterialContent1", "IntroductionToNewMaterialContent2", ...],
        "Guided Practice": ["GuidedPracticeContent1", "GuidedPracticeContent2", ...],
        "Independent Practice": ["IndependentPracticeContent1", "IndependentPracticeContent2", ...],
        "Closing": ["ClosingContent1", "ClosingContent2", ...],
        "Extension Activity": ["ExtensionActivityContent1", "ExtensionActivityContent2", ...],
        "Homework": ["HomeworkContent1", "HomeworkContent2", ...],
        "Standards Addressed": ["StandardsAddressedContent1", "StandardsAddressedContent2", ...]
      }
    `;
};

const pptGeneratorPrompt = (topic) => {
  return `
      Generate a detailed presentation outline on the following topic: ${topic}
      
      Format: json
      {
        "Title": "Presentation Title",
        "Slides1": {
          "subTitle": "Slide 1 Title",
          "array": ["Slide 1 Content", "Slide 1 Content", "Slide 1 Content", "..."]
        },
        "Slides2": {
          "subTitle": "Slide 2 Title",
          "array": ["Slide 2 Content", "Slide 2 Content", "Slide 2 Content", "..."]
        },
        "Slides3": {
          "subTitle": "Slide 3 Title",
          "array": ["Slide 3 Content", "Slide 3 Content", "Slide 3 Content", "..."]
        },
        ...
      }
    `;
};

function proofReaderPrompt(text) {
  const prompt = `Please proofread the following text for grammar, spelling, and punctuation errors. Make any necessary corrections. Also, list the changes made along with explanations for each change:

Text: ${text}

Format: JSON
{
  "Title": "Title for the input text context",
  "OriginalText": {
    "subTitle": "Original Text",
    "array": ["Original text line 1", "Original text line 2", ...]
  },
  "Correct": {
    "subTitle": "Proofread Text",
    "array": ["Proofread text line 1", "Proofread text line 2", ...]
  },
  "Changes": {
    "subTitle": "Changes Made",
    "array": ["Change 1 explanation", "Change 2 explanation", ...]
  }
}`;

  return prompt;
}

function rewritePrompt(originalText, rewriteText, pdfText) {
  let prompt = `Rewrite the following texts in the requested way:
Original Text: ${originalText}`;

  if (pdfText) {
    prompt += `\nPDF Text: ${pdfText}`;
  }

  prompt += `\nRewrite Text in the manner described adher to it strictly: ${rewriteText}\n :
    Format: json
    {
  "Title": "Title Based on Context of the originalText",
  "OriginalText": { "subTitle": "Original Text", "array": ["Sentence 1", "Sentence 2", ...] },
  "ReWrite": { "subTitle": "Rewritten Text", "array": ["Rewritten Sentence 1", "Rewritten Sentence 2", ...] }
}`;
  return prompt;
}

function essayGraderPrompt(gradeLevel, essay) {
  return `
        Please grade the following essay written by a ${gradeLevel} student based on grammar and sentence coherence. The total marks are 10.
        **Essay:**
        ${essay}

        Format:json
        {   
            "Title": "Title based on the Essay Context",
            "totalMarks": {subTitle:"Total Marks", array["10"]} // this is fixed 
             "marks": {
                "subTitle": "Obtained Marks",
                 array[] // "marks": 5 // Example mark, should be dynamically calculated based on the essay, should only contain single element
                },
            "mistakes": {
                "subTitle": "Mistakes",
                "array": [
                    "Incorrect verb tense usage (e.g., goes instead of went, bring instead of brought).",
                    "Lack of proper punctuation and capitalization.",
                    "Subject-verb agreement errors (e.g., 'My sister bring' instead of 'My sister brought').",
                    "Unclear sentence structures affecting readability."
                ]
            },
            "strengths": {
                "subTitle": "Strengths",
                "array": [
                    "The student has good ideas and a clear topic.",
                    "They show enthusiasm for their vacation, which makes the essay engaging."
                ]
            },
            "weaknesses": {
                "subTitle": "Weaknesses",
                "array": [
                    "Frequent grammar errors and a lack of sentence variety.",
                    "The essay also lacks proper punctuation and capitalization in several places."
                ]
            },
            "improvements": {
                "subTitle": "Improvements",
                "array": [
                    "Proper verb tense usage.",
                    "Correct sentence structures to enhance clarity.",
                    "Using a variety of sentences to make the essay more engaging.",
                    "Proper punctuation and capitalization."
                ]
            }
        }
        Use specific examples from the essay to illustrate each point.
    `;
}

function textSummaryPrompt(lengthSummary, inputText) {
  return `Summarize the following inputText after instructions into ${lengthSummary} and make sure to stick to defined lengthSummary. Ensure the summary is clear and concise, and each point is in a separate sentence: ${inputText}

Format: json
{
  "Title": "Generated Summary Title",
  "OriginalText": {
    "subTitle": "Original Text",
    "array": [${JSON.stringify(inputText)}]
  },
  "Summary": {
    "subTitle": "Summary Text",
    "array": []
  }
}`;
}

function textDependentQuestionPrompt(gradeLevel, numberOfQuestions, hardQuestions, mediumQuestions, easyQuestions, questionTypes, questionText) {
  let prompt = `
Generate ${numberOfQuestions} questions with correct answers for a ${gradeLevel} grade student. The questions should be divided into three categories: ${hardQuestions} hard questions, ${mediumQuestions} medium questions, and ${easyQuestions} easy questions. Each question should match one of the following types: ${questionTypes}. Provide an explanation for each question and answer. Provide the output in the following JSON format:

{
  "Title": "Context about the questionText in 5 or fewer words",
  "questions": [
    {
      "type": "Question type (e.g., Comprehension, Literary Devices, Theme, etc.)",
      "difficulty": "easy",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct Option",
      "explanation": "Explanation of the correct answer"
    },
    {
      "type": "Question type (e.g., Comprehension, Literary Devices, Theme, etc.)",
      "difficulty": "medium",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct Option",
      "explanation": "Explanation of the correct answer"
    },
    {
      "type": "Question type (e.g., Comprehension, Literary Devices, Theme, etc.)",
      "difficulty": "hard",
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": "Correct Option",
      "explanation": "Explanation of the correct answer"
    }
  ]
}
Text:
${questionText}`;

  return prompt;
}

function worksheetGeneratorPrompt(gradeLevel, numQuestions, hardQuestions, mediumQuestions, easyQuestions, transcript) {
  return `
You are an experienced educational content creator. Generate a worksheet for ${gradeLevel} grade students based on the following topic or text:

${transcript}

Please follow these instructions exactly:

1. Generate a title that summarizes the topic in 5 words or less.
2. Provide a brief "About" section giving context about the specific topic.
3. Create a worksheet with exactly ${numQuestions} questions for EACH of the three types: fill-up (fill in the blanks), mcq (multiple-choice), and open_ended. This means you should create a total of ${numQuestions * 3} questions.
4. Distribute a total of ${hardQuestions} hard questions, ${mediumQuestions} medium questions, and ${easyQuestions} easy questions across all types combined.

Output the worksheet in the following JSON format:

{
  "Title": "5-word summary of the topic",
  "About": [
    "First concise paragraph or point about the topic.",
    "Second concise paragraph or point about the topic.",
    "Additional paragraphs or points as needed."
  ],
  "worksheet": {
    "fill_up": {
      "subTitle": "Fill in the Blanks",
      "questions": [
        {
          "difficulty": "easy or medium or hard",
          "question": "Fill in the blank question with _____ for blanks",
          "answer": "Correct answer",
          "options": ["A) Option A", "B) Option B", "C) Option C", "D) Option D"],
        }
        // Repeat for exactly ${numQuestions} fill-up questions
      ]
    },
    "mcq": {
      "subTitle": "Multiple Choice Questions",
      "questions": [
        {
          "difficulty": "easy or medium or hard",
          "question": "Multiple choice question text",
          "options": ["A) Option A", "B) Option B", "C) Option C", "D) Option D"],
          "answer": "Correct option letter (e.g., 'B')"
        }
        // Repeat for exactly ${numQuestions} mcq questions
      ]
    },
    "open_ended": {
      "subTitle": "Open Ended",
      "questions": [
        {
          "difficulty": "easy or medium or hard",
          "question": "Open-ended question text",
          "answer": "Detailed answer or key points to cover"
        }
        // Repeat for exactly ${numQuestions} open-ended questions
      ]
    }
  }
}

Ensure that:
1. Each question type (fill_up, mcq, and open_ended) has EXACTLY ${numQuestions} questions. No more, no less.
2. The total number of questions across all types is ${numQuestions * 3}.
3. The questions cover the main points of the given topic or text and are appropriate for ${gradeLevel} grade students.
4. The difficulty levels are distributed appropriately across all question types, totaling ${hardQuestions} hard, ${mediumQuestions} medium, and ${easyQuestions} easy questions.
5. For open-ended questions, provide a comprehensive answer that covers the key points expected in a student's response.

Double-check that you have created the correct number of questions for each type before finalizing your response.
`;
}

function mcqGeneratorPrompt(gradeLevel, numQuestions, questionType, hardQuestions, mediumQuestions, easyQuestions, transcript) {

  return `
Generate ${numQuestions} ${questionType} questions with correct answers for a ${gradeLevel} grade student based on the following video transcript. The questions should be divided into three categories: ${hardQuestions} hard questions, ${mediumQuestions} medium questions, and ${easyQuestions} easy questions. Provide an explanation for each question and answer. Provide the output in the following JSON format:

Format: array inside JSON 
{
"Title":"Context about the questionText in 5 under words",
"Questions": [
{
  "difficulty": "easy or medium or hard", //  based on difficulty
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "Correct Option",
  "explanation": "Explanation of the correct answer"
}
]
}

Transcript:
${transcript}
`;
}

function youtubeGeneratorPrompt(gradeLevel, numQuestions, questionType, hardQuestions, mediumQuestions, easyQuestions, transcript) {

  return `
Generate ${numQuestions} ${questionType} questions with correct answers for a ${gradeLevel} grade student based on the following video transcript. The questions should be divided into three categories: ${hardQuestions} hard questions, ${mediumQuestions} medium questions, and ${easyQuestions} easy questions. Provide an explanation for each question and answer. Provide the output in the following JSON format:
Format: array inside JSON 
{
"Title":"Context about the questionText in 5 under words",
"Questions":[
{
  "difficulty": "easy",
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "Correct Option",
  "explanation": "Explanation of the correct answer"
},
{
  "difficulty": "medium",
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "Correct Option",
  "explanation": "Explanation of the correct answer"
},
{
  "difficulty": "hard",
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "answer": "Correct Option",
  "explanation": "Explanation of the correct answer"
}
]
}

Transcript:
${transcript}
`;

}

function ExamGeneratorPrompt(
  gradeLevel,
  numQuestions,
  questionType, // Can be 'MCQ', 'Open-Ended', or 'Mixed'
  hardQuestions,
  mediumQuestions,
  easyQuestions,
  transcript
) {
  return `
Generate ${numQuestions} ${questionType === 'Mixed' ? 'MCQ and Open-Ended' : questionType} questions with correct answers for a ${gradeLevel} grade student based on the following video transcript. The questions should be divided into three categories: ${hardQuestions} hard questions, ${mediumQuestions} medium questions, and ${easyQuestions} easy questions. Provide an explanation for each question and answer. Ensure open-ended questions test understanding and critical thinking, while MCQs provide plausible distractors. Provide the output in the following JSON format:

Format: array inside JSON 
{
  "Title":"Context about the questionText in 5 or fewer words",
  "Questions": [
    {
      "difficulty": "easy or medium or hard", // based on difficulty
      "questionType": "MCQ or Open-Ended or True-False", // question type
      "question": "Question text",
      "options": ["Option A", "Option B", "Option C", "Option D"], // For MCQs and True-False only, omit for open-ended questions
      "answer": "Correct Option or Expected Answer", // Correct answer for MCQs and True-False or ideal answer for open-ended questions
      "explanation": "Explanation of the correct answer or expected answer"
    }
  ]
}

Guidelines for Questions:
- MCQs: Include 4 options (A, B, C, D) where only one is correct. Distractors (incorrect options) should be plausible.
- Open-Ended: Formulate questions that require students to provide explanations, solutions, or critical analysis, without multiple-choice options.
- True-False: Include only two options (True or False).

Transcript:
${transcript}
`;
}

module.exports = { reportCardPrompt, 
  LessonPlanPrompt, 
  pptGeneratorPrompt, 
  proofReaderPrompt, 
  rewritePrompt, 
  essayGraderPrompt, 
  textSummaryPrompt, 
  textDependentQuestionPrompt, 
  worksheetGeneratorPrompt, 
  mcqGeneratorPrompt, 
  youtubeGeneratorPrompt,
  ExamGeneratorPrompt };
