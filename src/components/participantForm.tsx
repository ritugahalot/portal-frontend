import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/ParticipantForm.css"; // Import the CSS file for styling
import { Form } from "../interfaces/Form";
import { Answer } from "../interfaces/Answer";


const ParticipantForm: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<(string | string[])[]>([]);

  useEffect(() => {
    const fetchForm = async () => {
      const res = await axios.get(`http://localhost:8000/api/forms/${formId}`);
      setForm(res.data);
    };
    fetchForm();
  }, [formId]);

  const handleResponseChange = (index: number, value: string | string[]) => {
    const updatedResponses = [...responses];
    updatedResponses[index] = value;
    setResponses(updatedResponses);
  };

  const submitResponses = async () => {
    const answers: Answer[] =
      form?.questions.map((q, i) => ({
        question: q.prompt,
        response: responses[i] || "",
      })) || [];

    const data = { form_id: formId, answers: answers };

    await axios.post("http://localhost:8000/api/responses", data);
    alert("Responses submitted!");
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div className="participant-form">
      <h1 className="form-title">{form.title}</h1>
      <div className="questions-container">
        {form.questions.map((q, i) => (
          <div key={i} className="question-item">
            <label className="question-prompt">{q.prompt}</label>
            {q.type === "text" && (
              <input
                type="text"
                className="text-input"
                onChange={(e) => handleResponseChange(i, e.target.value)}
              />
            )}
            {q.type === "multiple-choice" && q.options && (
              <div className="options-container">
                {q.options.map((option, optionIndex) => (
                  <div key={optionIndex} className="option-item">
                    <label>
                      <input
                        type="radio"
                        className="radio-input"
                        name={`question-${i}`}
                        value={option}
                        onChange={(e) => handleResponseChange(i, e.target.value)}
                      />
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <button className="submit-btn" onClick={submitResponses}>
        Submit
      </button>
    </div>
  );
};

export default ParticipantForm;
