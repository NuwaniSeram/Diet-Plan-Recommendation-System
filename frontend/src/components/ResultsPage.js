import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  console.log("Results received:", result); // Debugging: Check what result contains

  if (!result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <p className="text-lg text-red-500">No results available. Please submit your data first.</p>
        <button
          className="mt-4 p-2 bg-blue-500 text-white rounded-md"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    );
  }

  const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const weeklyDiet = result.Predicted_Diet_Week || []; // Ensure it's at least an empty array

  if (weeklyDiet.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
        <p className="text-lg text-red-500">No diet recommendations available.</p>
        <button
          className="mt-4 p-2 bg-blue-500 text-white rounded-md"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="mt-6 p-4 bg-white rounded-lg shadow-md max-w-2xl">
        <h2 className="text-2xl font-semibold mb-4">Diet Plan Results</h2>
        <p><strong>BMI:</strong> {result.BMI}</p>
        <p><strong>BMR:</strong> {result.BMR}</p>
        <p><strong>Daily Maintenance Calories:</strong> {result.Daily_Calories_Maintenance}</p>
        <p><strong>Target Calories Per Day:</strong> {result.Daily_Calories_Target}</p>

        <h3 className="text-lg font-semibold mt-6 mb-2">Weekly Diet Plan:</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border border-gray-300 p-2">Day</th>
                <th className="border border-gray-300 p-2">Breakfast</th>
                <th className="border border-gray-300 p-2">Lunch</th>
                <th className="border border-gray-300 p-2">Dinner</th>
                <th className="border border-gray-300 p-2">Snack</th>
              </tr>
            </thead>
            <tbody>
              {weeklyDiet.map((dayDiet, index) => (
                <tr key={index} className="text-center">
                  <td className="border border-gray-300 p-2 font-semibold">{daysOfWeek[index] || `Day ${index + 1}`}</td>
                  <td className="border border-gray-300 p-2">{dayDiet?.Breakfast || "N/A"}</td>
                  <td className="border border-gray-300 p-2">{dayDiet?.Lunch || "N/A"}</td>
                  <td className="border border-gray-300 p-2">{dayDiet?.Dinner || "N/A"}</td>
                  <td className="border border-gray-300 p-2">{dayDiet?.Snack || "N/A"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <button
          className="mt-6 p-2 bg-blue-500 text-white rounded-md"
          onClick={() => navigate("/")}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default ResultsPage;
