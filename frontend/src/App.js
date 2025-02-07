import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import UserInputForm from "./components/UserInputForm";
import ResultsPage from "./components/ResultsPage";

const HomePage = () => {
  const navigate = useNavigate();

  const handleFormSubmit = async (data) => {
    console.log("User Input Data:", data);

    try {
      const response = await fetch("http://127.0.0.1:5000/predict-diet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      console.log("Server Response:", result);

      // Navigate to the results page and pass the prediction data
      navigate("/results", { state: { result } });
    } catch (error) {
      console.error("Error sending data to backend:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <UserInputForm onSubmit={handleFormSubmit} />
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/results" element={<ResultsPage />} />
      </Routes>
    </Router>
  );
};

export default App;
