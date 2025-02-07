import React, { useState } from "react";

const UserInputForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    age: "",
    gender: "male",
    weight: "",
    height: "",
    desiredWeight: "",
    timePeriod: "",
    activityLevel: "sedentary", // New field
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">User Information</h2>

      <label className="block mb-2">
        Age:
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </label>

      <label className="block mb-2">
        Gender:
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </label>

      <label className="block mb-2">
        Weight (kg):
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </label>

      <label className="block mb-2">
        Height (cm):
        <input
          type="number"
          name="height"
          value={formData.height}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </label>

      <label className="block mb-2">
        Desired Weight (kg):
        <input
          type="number"
          name="desiredWeight"
          value={formData.desiredWeight}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </label>

      <label className="block mb-2">
        Time Period (weeks):
        <input
          type="number"
          name="timePeriod"
          value={formData.timePeriod}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
          required
        />
      </label>

      <label className="block mb-2">
        Activity Level:
        <select
          name="activityLevel"
          value={formData.activityLevel}
          onChange={handleChange}
          className="w-full p-2 border rounded-md"
        >
          <option value="sedentary">Sedentary (little to no exercise)</option>
          <option value="lightly active">Lightly active (1-3 days/week)</option>
          <option value="moderately active">Moderately active (3-5 days/week)</option>
          <option value="very active">Very active (6-7 days/week)</option>
          <option value="super active">Super active (athlete)</option>
        </select>
      </label>

      <button type="submit" className="w-full mt-4 p-2 bg-blue-500 text-white rounded-md">
        Submit
      </button>
    </form>
  );
};

export default UserInputForm;
