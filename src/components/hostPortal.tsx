import React, { useState } from "react";
import axios from "axios";
import "../styles/HostPortal.css";
import { Question } from "../interfaces/Question";

const HostPortal: React.FC = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<Question[]>([{ type: "text", prompt: "" }]);
  const [link, setLink] = useState("");

  const addQuestion = () => {
    setQuestions([...questions, { type: "text", prompt: "" }]);
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].prompt = value;
    setQuestions(updatedQuestions);
  };

  const handleQuestionTypeChange = (index: number, type: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index] = { ...updatedQuestions[index], type, options: type === "multiple-choice" ? [""] : undefined };
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options) {
      updatedQuestions[questionIndex].options![optionIndex] = value;
    }
    setQuestions(updatedQuestions);
  };

  const addOption = (index: number) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[index].options) {
      updatedQuestions[index].options!.push("");
    }
    setQuestions(updatedQuestions);
  };

  const createForm = async () => {
    const res = await axios.post("http://localhost:8000/api/forms", { title, questions });
    setLink(`http://localhost:3000/form/${res.data.formId}`);
  };

  return (
    <div className="host-portal">
      <h1 className="host-portal-title">Host Portal</h1>
      <input
        className="host-portal-input title-input"
        type="text"
        placeholder="Form Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="questions-container">
        {questions.map((q, i) => (
          <div key={i} className="question-item">
            <select
              className="question-type-select"
              value={q.type}
              onChange={(e) => handleQuestionTypeChange(i, e.target.value)}
            >
              <option value="text">Text</option>
              <option value="multiple-choice">Multiple Choice</option>
            </select>
            <input
              className="question-prompt-input"
              type="text"
              placeholder={`Question ${i + 1}`}
              value={q.prompt}
              onChange={(e) => handleQuestionChange(i, e.target.value)}
            />
            {q.type === "multiple-choice" && (
              <div className="options-container">
                {q.options?.map((option, optionIndex) => (
                  <div key={optionIndex} className="option-item">
                    <input
                      className="option-input"
                      type="text"
                      placeholder={`Option ${optionIndex + 1}`}
                      value={option}
                      onChange={(e) => handleOptionChange(i, optionIndex, e.target.value)}
                    />
                  </div>
                ))}
                <button className="add-option-btn" onClick={() => addOption(i)}>
                  Add Option
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="buttons-container">
        <button className="add-question-btn" onClick={addQuestion}>
          Add Question
        </button>
        <button className="create-form-btn" onClick={createForm}>
          Create Form
        </button>
      </div>
      {link && <p className="form-link">Form Link: <a href={link}>{link}</a></p>}
    </div>
  );
};

export default HostPortal;
