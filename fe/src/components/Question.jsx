import React, { useState, useEffect } from "react";

const QuestionComponent = ({ question, onAnswerSubmit, submitted, setSubmitted }) => {
  const [selectedOption, setSelectedOption] = useState(null);

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
              />
              {option.description}
            </label>
          </li>
        ))}
      </ul>

      <button 
        onClick={handleSubmit} 
        disabled={selectedOption === null || submitted} // ✅ Controlled by App.jsx
        className="bg-blue-400 text-white px-4 py-2 rounded mt-2 disabled:bg-gray-400">
        Submit
      </button>

      {submitted && selectedOption && (
        <p>
          {question.options.find((opt) => opt.id === selectedOption)?.is_correct
            ? "✅ Correct Answer!"
            : "❌ Incorrect Answer!"}
        </p>
      )}
    </div>
  );
};

export default QuestionComponent;
