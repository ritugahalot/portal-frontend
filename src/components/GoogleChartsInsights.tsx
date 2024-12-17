import React from "react";
import { Chart } from "react-google-charts";

interface ResponseData {
  question: string;
  responses: string[];
}

interface DataViewProps {
  insights: ResponseData[];
}

const GoogleChartsInsights: React.FC<DataViewProps> = ({ insights }) => {
  const pieChartData = insights.map((item) => {
    const responseCounts = item.responses.reduce<Record<string, number>>(
      (acc, response) => {
        acc[response] = (acc[response] || 0) + 1;
        return acc;
      },
      {}
    );

    return {
      question: item.question,
      data: [["Response", "Count"], ...Object.entries(responseCounts)],
    };
  });

  return (
    <div>
      <h2>Survey Insights</h2>
      {pieChartData.map((chart, index) => (
        <div key={index} style={{ marginBottom: "2rem" }}>
          <h3>{chart.question}</h3>
          <Chart
            chartType="PieChart"
            data={chart.data}
            options={{
              title: chart.question,
              is3D: true,
            }}
            width={"100%"}
            height={"300px"}
          />
        </div>
      ))}
    </div>
  );
};

export default GoogleChartsInsights;
