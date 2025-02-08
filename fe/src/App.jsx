import React, { useState, useEffect } from "react";
import axios from "axios";
import QuestionComponent from "./components/Question";

const App = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set());
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
      setSubmitted(true);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  return (
    <div className="">
    <div className="bg-yellow-200 flex items-center justify-center h-screen">
      <div className="shadow-gray-800 bg-yellow-50 p-6 rounded-lg shadow-lg w-96">
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
            <button 
              onClick={handleNextQuestion} 
              className="bg-blue-400 text-white px-4 py-2 rounded mt-2">
              Next
            </button>
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
