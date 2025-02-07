from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import numpy as np
import pandas as pd
import random

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

# Load pre-trained ML model
with open("../ml_model.pkl", "rb") as model_file:
    model = pickle.load(model_file)

# Load LabelEncoders for target variables
with open("../label_encoders.pkl", "rb") as encoder_file:
    label_encoders = pickle.load(encoder_file)

# Function to calculate BMI
def calculate_bmi(weight, height_cm):
    height_m = height_cm / 100
    return round(weight / (height_m ** 2), 2)

# Function to calculate BMR
def calculate_bmr(weight, height, age, gender_male):
    if gender_male == 1:  # Male
        return round((10 * weight) + (6.25 * height) - (5 * age) + 5, 2)
    else:  # Female
        return round((10 * weight) + (6.25 * height) - (5 * age) - 161, 2)

# Function to calculate daily maintenance calories
def calculate_daily_calories_maintenance(bmr, activity_level):
    activity_multipliers = {
        "sedentary": 1.2,
        "lightly active": 1.375,
        "moderately active": 1.55,
        "very active": 1.725,
        "super active": 1.9,
    }
    activity_factor = activity_multipliers.get(activity_level.lower(), 1.2)  # Default to sedentary
    return round(bmr * activity_factor, 2)

# Function to calculate target daily calories
def calculate_daily_calories_target(daily_calories_maintenance, weight, desired_weight, time_period_weeks):
    weight_diff = weight - desired_weight
    total_calorie_change = weight_diff * 7700  # 1kg weight change ≈ 7700 kcal
    daily_caloric_adjustment = total_calorie_change / (time_period_weeks * 7)
    return round(daily_calories_maintenance - daily_caloric_adjustment, 2)

@app.route("/predict-diet", methods=["POST"])
def predict_diet():
    try:
        data = request.get_json()
        print("Received Data:", data)

        # Extract input features
        age = int(data["age"])
        gender = data["gender"].strip().lower()
        gender_male = 1 if gender == "male" else 0  # OneHotEncode Gender
        weight = float(data["weight"])
        height = float(data["height"])
        desired_weight = float(data["desiredWeight"])
        time_period_weeks = int(data["timePeriod"])
        activity_level = data.get("activityLevel", "sedentary").strip().lower()

        # Compute additional features
        bmi = calculate_bmi(weight, height)
        bmr = calculate_bmr(weight, height, age, gender_male)
        daily_calories_maintenance = calculate_daily_calories_maintenance(bmr, activity_level)
        daily_calories_target = calculate_daily_calories_target(daily_calories_maintenance, weight, desired_weight, time_period_weeks)

        # Prepare input for model
        input_features = np.array([[age, gender_male, height, weight, desired_weight, time_period_weeks, bmi, bmr, daily_calories_maintenance, daily_calories_target]])
        
        # Define feature names exactly as they were during training
        feature_names = ["Age", "Gender_Male", "Height_cm", "Weight_kg", "Desired_Weight_kg", "Time_Period_weeks",
                        "BMI", "BMR", "Daily_Calories_Maintenance", "Daily_Calories_Target"]

        # Convert to Pandas DataFrame with correct feature names
        input_df = pd.DataFrame(input_features, columns=feature_names)
        
        # Generate 7 different predictions
        predictions_list = []

        for _ in range(7):
            if hasattr(model, "predict_proba"):  # Check if model supports probability-based predictions
                probs = model.predict_proba(input_df)
                
                # Debugging print
                print("Probabilities Shape:", [np.array(prob).shape for prob in probs])  

                # Ensure each probability array is properly shaped
                try:
                    sampled_predictions = [np.random.choice(len(prob[0]), p=prob[0]) for prob in probs]
                except IndexError:
                    print("Warning: Incorrect probability shape, falling back to predict()")
                    sampled_predictions = model.predict(input_df)[0]  # Fallback to normal prediction
            else:
                sampled_predictions = model.predict(input_df)[0]  # Fallback if `predict_proba()` isn't available

            # Decode predictions using LabelEncoders
            decoded_predictions = {}
            target_columns = ["Breakfast", "Lunch", "Dinner", "Snack"]

            for i, col in enumerate(target_columns):
                decoded_predictions[col] = label_encoders[col].inverse_transform([sampled_predictions[i]])[0]

            predictions_list.append(decoded_predictions)




        response_data = {
            "BMI": bmi,
            "BMR": bmr,
            "Daily_Calories_Maintenance": daily_calories_maintenance,
            "Daily_Calories_Target": daily_calories_target,
            "Predicted_Diet_Week": predictions_list,  # List of 7 different predictions
            "Message": "Prediction successful!"
        }


        # # Decode predictions using LabelEncoders
        # decoded_predictions = {}
        # target_columns = ["Breakfast", "Lunch", "Dinner", "Snack"]

        # for i, col in enumerate(target_columns):
        #     decoded_predictions[col] = label_encoders[col].inverse_transform([predictions[0][i]])[0]

        # response_data = {
        #     "BMI": bmi,
        #     "BMR": bmr,
        #     "Daily_Calories_Maintenance": daily_calories_maintenance,
        #     "Daily_Calories_Target": daily_calories_target,
        #     "Predicted_Diet": decoded_predictions,
        #     "Message": "Prediction successful!"
        # }

        return jsonify(response_data), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
