import React, { useState, useEffect } from "react";
import axios from "axios";
import QuestionComponent from "./components/Question";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
  const [submittedQuestions, setSubmittedQuestions] = useState(new Set());
  const [submitted, setSubmitted] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false); // State to track if quiz has started

  useEffect(() => {
    (async () => {
      try {
        const response = await axios.get("http://localhost:3000/quiz");
        console.log("Fetched Data:", response.data);
        setQuestions(response.data.questions);
      } catch (error) {
        console.error("Error fetching quiz data:", error);
      }
    })();
  }, []);

  const handleAnswerSubmit = (isCorrect) => {
    if (!answeredQuestions.has(currentQuestion)) {
      if (isCorrect) {
        setScore((prevScore) => prevScore + 1);
      }
      setAnsweredQuestions((prev) => new Set(prev).add(currentQuestion));
      setSubmittedQuestions((prev) => new Set(prev).add(currentQuestion)); // Mark as submitted
      setSubmitted(true);
    }
  };

  const handleNextQuestion = () => {
    if(currentQuestion === questions.length - 1) {
      const confirmSubmit = window.confirm("You have reached the last question. Do you want to submit the quiz?");
      if(confirmSubmit) {
        setQuizCompleted(true);
    }
  }
    else if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSubmitted(false);
    }
     else {
      setQuizCompleted(true);
    }
  };
  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="bg-yellow-200 flex-grow flex items-center justify-center">
        <div className="shadow-gray-800 bg-yellow-50 p-6 rounded-lg shadow-lg w-1/2">
          {!quizStarted ? ( // Show start button before quiz begins
            <div className="text-center">
              <h2 className="text-xl font-bold">Welcome to the Quiz!</h2>
              <button 
                onClick={() => setQuizStarted(true)} 
                className="bg-black text-white px-4 py-2 rounded mt-4">
                Start Quiz
              </button>
            </div>
          ) : quizCompleted ? (
            <div className="text-center">
              <h2 className="text-xl font-bold">Quiz Completed!</h2>
              <p className="text-lg">Your score: {score}/{questions.length}</p>
            </div>
          ) : questions.length > 0 ? (
            <div>
              <p className="text-lg mb-4">Question {currentQuestion + 1}/{questions.length}</p>
              <p className="font-bold">Score: {score}</p>
              <QuestionComponent 
                question={questions[currentQuestion]} 
                onAnswerSubmit={handleAnswerSubmit}
                submitted={submitted}
                setSubmitted={setSubmitted}
              />
              <div className="flex justify-between gap-2 mt-4">
                <button 
                  onClick={handlePreviousQuestion} 
                  disabled={currentQuestion === 0}
                  className={`px-4 py-2 flex-1 shadow-md shadow-gray-400 rounded ${currentQuestion === 0 ? "bg-gray-400" : "bg-blue-400 text-white cursor-pointer"}`}>
                   ← Previous
                </button>
                <button 
                  onClick={handleNextQuestion} 
                  className="px-4 py-2 flex-1 shadow-md shadow-gray-400 bg-blue-400 text-white rounded cursor-pointer">
                  Next →
                </button>
              </div>
            </div>
          ) : (
            <p>Loading questions...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
