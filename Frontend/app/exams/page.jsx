'use client';

import React, { useState, useEffect, useContext } from 'react';
import { firestore, collection, doc, updateDoc, getDocs } from '@lib/firebase';
import { UserContext } from '@lib/context';

export default function Exam() {
  const [examData, setExamData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeExam, setActiveExam] = useState(null); // Tracks the current exam being taken
  const [answers, setAnswers] = useState({}); // Tracks answers for the current exam
  const { user } = useContext(UserContext); // Get the current user

  useEffect(() => {
    if (user?.email) {
      fetchExamData(user.email);
    }
  }, [user]);

  const fetchExamData = async (email) => {
    try {
      const examsCollectionRef = collection(firestore, `exams/${email}/exam`);
      const querySnapshot = await getDocs(examsCollectionRef);

      const exams = [];
      querySnapshot.forEach((doc) => {
        exams.push({ id: doc.id, ...doc.data() });
      });

      setExamData(exams);
    } catch (error) {
      console.error('Error fetching exam data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = (exam) => {
    setActiveExam(exam);
    // Initialize answers state with empty values for each question
    const initialAnswers = {};
    exam.result.Questions.forEach((_, index) => {
      initialAnswers[index] = '';
    });
    setAnswers(initialAnswers);
  };

  const handleOptionChange = (questionIndex, value) => {
    setAnswers((prev) => ({
      ...prev,
      [questionIndex]: value, // Update the answer for the specific question
    }));
  };

  const handleSubmit = async () => {
    try {
        const email = user?.email; // Submitted by
        const { id: docId, result } = activeExam; // Get the current exam's result and docId
        const createdBy = activeExam.createdBy;//result?.createdBy || ''; // Assuming 'createdBy' is part of the exam result
        const examsCollectionRef = doc(firestore, `exams/${email}/exam/${docId}`);

        // Create a new array of questions with the submitted answers added
        const updatedQuestions = result.Questions.map((question, index) => ({
            ...question,
            submitted_answer: answers[index] || '', // Add submitted_answer for each question
        }));

        // Update the Firestore document with the modified questions
        await updateDoc(examsCollectionRef, {
            isOpen:false,
            'result.Questions': updatedQuestions, // Update the Questions array within the result object
        });

        console.log('Answers submitted to Firestore successfully.');  
        console.log(docId, createdBy, email);

        // Make a POST request to the backend
        const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/exam-evaluator`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                examID: docId,
                createdBy,
                submittedBy: email,
            }),
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Backend Response:', responseData);
            console.log('Your answers have been submitted and sent for evaluation!');
        } else {
            console.error('Failed to call the backend route.');
            console.log('Your answers were submitted, but evaluation failed. Please try again later.');
        }

        //setActiveExam(null); // Go back to the list of exams
    } catch (error) {
        console.error('Error submitting answers:', error);
        alert('Failed to submit answers. Please try again.');
    }
};

  const renderQuestions = (questions) => {
    return (
      <div className="space-y-6">
        {questions.map((question, index) => (
          <div key={index} className="border p-4 rounded-lg shadow">
            <p className="font-semibold text-lg">{`${index + 1}. ${question.question}`}</p>
            {question.questionType === 'MCQ' ? (
              <div className="space-y-2">
                {question.options.map((option, i) => (
                  <div key={i} className="flex items-center">
                    <input
                      type="radio"
                      name={`question-${index}`}
                      id={`option-${i}`}
                      value={option}
                      checked={answers[index] === option}
                      onChange={() => handleOptionChange(index, option)}
                      className="mr-2"
                    />
                    <label htmlFor={`option-${i}`}>{option}</label>
                  </div>
                ))}
              </div>
            ) : (
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Write your answer here..."
                value={answers[index]} // Track open-ended answers
                onChange={(e) => handleOptionChange(index, e.target.value)}
              />
            )}
          </div>
        ))}
        <button className="btn btn-primary mt-4" onClick={handleSubmit}>
          Submit
        </button>
      </div>
    );
  };

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white rounded-xl shadow-md space-y-6">
      <h1 className="text-2xl font-bold">Your Exams</h1>
      {loading ? (
        <p>Loading...</p>
      ) : activeExam ? (
        <div>
          <button
            className="btn btn-secondary mb-4"
            onClick={() => setActiveExam(null)}
          >
            Back to Exams
          </button>
          <h2 className="text-xl font-bold">{activeExam.result?.Title}</h2>
          {renderQuestions(activeExam.result?.Questions || [])}
        </div>
      ) : examData.length > 0 ? (
        <div className="space-y-4">
          {examData.map((exam) => (
            <div key={exam.id} className="border p-4 rounded-lg shadow">
              <h2 className="font-semibold text-lg">{exam.result?.Title || 'Untitled Exam'}</h2>
              <p><strong>Number of Questions:</strong> {exam.result?.Questions?.length || 0}</p>
              {exam?.evaluated ? (
                <>
                  <p><strong>Total Marks:</strong> {exam?.total_marks}  <strong>Marks Scored:</strong> {exam?.marks_scored}</p>
                </>
              ) : exam.result?.isOpen ? (
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => handleStartExam(exam)}
                >
                  Start Exam
                </button>
              ) : (
                <p className="text-gray-500">Exam is not open.</p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No exams found for your email.</p>
      )}
    </div>
  );
  
}
