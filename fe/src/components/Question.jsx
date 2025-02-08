import React, { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import ReactMarkdown from "react-markdown";

const QuestionComponent = ({ question, onAnswerSubmit, submitted, setSubmitted }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  if (!question || !question.options) {
    return <p>Loading question...</p>;
  }

  const handleOptionSelect = (optionId) => {
    if (!submitted) { // ✅ Prevent selection after submission
      setSelectedOption(optionId);
    }
  };

  useEffect(() => {
    setSelectedOption(null); // ✅ Reset selected option when a new question loads
    setSubmitted(false); // ✅ Reset submitted state for the new question
  }, [question, setSubmitted]);

  const handleSubmit = () => {
    if (selectedOption !== null && !submitted) {
      setSubmitted(true); // ✅ Use the state from App.jsx
      const selectedAnswer = question.options.find((opt) => opt.id === selectedOption);
      
      if (selectedAnswer) { 
        onAnswerSubmit(selectedAnswer.is_correct);

        if (selectedAnswer.is_correct) {
          // 🎉 Fire confetti if the answer is correct
          confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
          });
        }
      } else {
        console.error("Selected option not found! Check question data.");
      }
    }
  };

  return (
    <div className="question-container">
      <h2>{question.description}</h2>
      <ul>
        {question.options.map((option) => (
          <li key={option.id}>
            <label>
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option.id}
                checked={selectedOption === option.id}
                onChange={() => handleOptionSelect(option.id)}
                disabled={submitted} 
              />
              {option.description}
            </label>
          </li>
        ))}
      </ul>

      <button 
        onClick={handleSubmit} 
        disabled={selectedOption === null || submitted} //  Controlled by App.jsx
        className={`bg-blue-400 shadow-md shadow-gray-400 text-white px-4 py-2 rounded mt-2 ${selectedOption === null || submitted ? 'bg-gray-400' : 'cursor-pointer'}`}>
        Submit
      </button>

      {submitted && selectedOption && (
        <div>
        <p>
          {question.options.find((opt) => opt.id === selectedOption)?.is_correct
            ? "✅ Correct Answer!"
            : "❌ Incorrect Answer!"}
            
        </p>
        <div className="mt-4 p-3 border border-gray-300 rounded bg-gray-50">
          <h3 className="font-bold">Detailed Solution:</h3>
          <ReactMarkdown>{question.detailed_solution}</ReactMarkdown> {/* ✅ Proper Markdown rendering */}
        </div>
        </div>
        
      )}
    </div>
  );
};

export default QuestionComponent;
