import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../styles/DataView.css";
import { Answer } from "../interfaces/Answer";

const DataView: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [responses, setResponses] = useState<Record<string, Answer[]>>({});

  useEffect(() => {
    const fetchResponses = async () => {
      const res = await axios.get(`http://localhost:8000/api/responses/${formId}`);
      setResponses(res.data);
    };
    fetchResponses();
  }, [formId]);

  if (Object.keys(responses).length === 0) {
    return <p className="loading-message">Loading responses or no responses found...</p>;
  }

  return (
    <div className="data-view">
      <h1 className="responses-title">Responses</h1>
      {Object.entries(responses).map(([responseId, answers], i) => (
        <div key={responseId} className="response-card">
          <h3 className="response-header">Response {i + 1}</h3>
          {answers.map((answer, j) => (
            <div key={j} className="response-item">
              <p className="response-question">
                <strong>Question:</strong> {answer.question}
              </p>
              <p className="response-answer">
                <strong>Answer:</strong>{" "}
                {Array.isArray(answer.response)
                  ? answer.response.join(", ")
                  : answer.response}
              </p>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default DataView;
