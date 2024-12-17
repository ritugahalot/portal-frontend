import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Chart } from "react-google-charts";
import { Answer } from "../interfaces/Answer";

const DataView: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [responses, setResponses] = useState<Answer[][]>([]);
  const [insights, setInsights] = useState<{ question: string; responses: string[] }[]>([]);

  // Fetch responses from the backend
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/responses/${formId}`);
        const rawData: Answer[][] = res.data;
  
        setResponses(rawData);
  
        const questionMap: Record<string, string[]> = {};
  
        rawData.forEach((responseSet) => {
          responseSet.forEach(({ question, response }) => {
            if (!questionMap[question]) {
              questionMap[question] = [];
            }
            if (Array.isArray(response)) {
              questionMap[question].push(...response);
            } else {
              questionMap[question].push(response);
            }
          });
        });
  
        const formattedInsights = Object.entries(questionMap).map(([question, responses]) => ({
          question,
          responses,
        }));
  
        setInsights(formattedInsights);
      } catch (error) {
        console.error("Error fetching responses:", error);
      }
    };
  
    fetchResponses();
  }, [formId]);
  

  const generateChartData = (question: string, responses: string[]) => {
    const responseCounts = responses.reduce<Record<string, number>>((acc, response) => {
      acc[response] = (acc[response] || 0) + 1;
      return acc;
    }, {});

    return [["Response", "Count"], ...Object.entries(responseCounts)];
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Data View</h1>

      {/* Display Responses */}
      <section style={{ marginBottom: "2rem" }}>
        <h2>Responses</h2>
        {responses.map((responseSet, i) => (
          <div key={i} style={{ marginBottom: "1.5rem" }}>
            <h3>Response Set {i + 1}</h3>
            {responseSet.map((answer, j) => (
              <p key={j}>
                <strong>{answer.question}:</strong> {answer.response}
              </p>
            ))}
          </div>
        ))}
      </section>

      {/* Display Insights */}
      <section>
        <h2>Insights</h2>
        {insights.map((insight, index) => (
          <div key={index} style={{ marginBottom: "2rem" }}>
            <h3>{insight.question}</h3>
            <Chart
              chartType="PieChart"
              data={generateChartData(insight.question, insight.responses)}
              options={{
                title: insight.question,
                is3D: true,
              }}
              width={"100%"}
              height={"300px"}
            />
          </div>
        ))}
      </section>
    </div>
  );
};

export default DataView;
