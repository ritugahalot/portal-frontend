import React, { useState } from "react";
import axios from "axios";

interface Question {
  type: string;
  prompt: string;
  options?: string[]; // Add optional property for multiple-choice questions
}

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
    <div>
      <h1>Host Portal</h1>
      <input
        type="text"
        placeholder="Form Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      {questions.map((q, i) => (
        <div key={i} style={{ marginBottom: "1rem" }}>
          <select
            value={q.type}
            onChange={(e) => handleQuestionTypeChange(i, e.target.value)}
          >
            <option value="text">Text</option>
            <option value="multiple-choice">Multiple Choice</option>
          </select>
          <input
            type="text"
            placeholder={`Question ${i + 1}`}
            value={q.prompt}
            onChange={(e) => handleQuestionChange(i, e.target.value)}
          />
          {q.type === "multiple-choice" && (
            <div>
              {q.options?.map((option, optionIndex) => (
                <div key={optionIndex} style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="text"
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) => handleOptionChange(i, optionIndex, e.target.value)}
                  />
                </div>
              ))}
              <button onClick={() => addOption(i)}>Add Option</button>
            </div>
          )}
        </div>
      ))}
      <button onClick={addQuestion}>Add Question</button>
      <button onClick={createForm}>Create Form</button>
      {link && <p>Form Link: {link}</p>}
    </div>
  );
};

export default HostPortal;
