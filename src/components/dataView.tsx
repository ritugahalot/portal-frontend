import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

interface Answer {
  question: string; // The question prompt
  response: string | string[]; // The user's response
}

const DataView: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [responses, setResponses] = useState<Record<string, Answer[]>>({}); // Object mapping IDs to arrays of question-answer pairs

  useEffect(() => {
    const fetchResponses = async () => {
      const res = await axios.get(`http://localhost:8000/api/responses/${formId}`);
      setResponses(res.data); // Set the responses object
    };
    fetchResponses();
  }, [formId]);

  if (Object.keys(responses).length === 0) {
    return <p>Loading responses or no responses found...</p>;
  }

  return (
    <div>
      <h1>Responses</h1>
      {Object.entries(responses).map(([responseId, answers], i) => (
        <div key={responseId} style={{ border: "1px solid #ccc", margin: "1rem 0", padding: "1rem" }}>
          <h3>Response {i + 1}</h3>
          {/* <p><strong>ID:</strong> {responseId}</p> */}
          {answers.map((answer, j) => (
            <div key={j} style={{ marginBottom: "0.5rem" }}>
              <strong>Question:</strong> {answer.question}
              <br />
              <strong>Answer:</strong>{" "}
              {Array.isArray(answer.response)
                ? answer.response.join(", ") // Join multiple-choice responses
                : answer.response}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DataView;
