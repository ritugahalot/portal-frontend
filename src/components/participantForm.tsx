import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Question {
  type: string;
  prompt: string;
  options?: string[];
}

interface Form {
  title: string;
  questions: Question[];
}

interface Answer {
  question: string; // Stores the question prompt
  response: string | string[]; // Stores the user's response
}

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
    // Prepare the data to include both questions and responses
    const answers: Answer[] = form?.questions.map((q, i) => ({
      question: q.prompt,
      response: responses[i] || "",
    })) || [];

    const data = {form_id: formId, answers: answers};

    await axios.post("http://localhost:8000/api/responses", data);
    alert("Responses submitted!");
  };

  if (!form) return <p>Loading...</p>;

  return (
    <div>
      <h1>{form.title}</h1>
      {form.questions.map((q, i) => (
        <div key={i} style={{ marginBottom: "1rem" }}>
          <label>{q.prompt}</label>
          {q.type === "text" && (
            <input
              type="text"
              onChange={(e) => handleResponseChange(i, e.target.value)}
            />
          )}
          {q.type === "multiple-choice" && q.options && (
            <div>
              {q.options.map((option, optionIndex) => (
                <div key={optionIndex}>
                  <label>
                    <input
                      type="radio"
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
      <button onClick={submitResponses}>Submit</button>
    </div>
  );
};

export default ParticipantForm;
