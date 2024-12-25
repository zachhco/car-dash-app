from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import numpy as np
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize and train the model
def init_model():
    df = pd.read_csv('data_GEN6.csv')
    y = df['FATAL']
    X = df.drop(['FATAL', 'INJ_SEV', 'INJ_LEVEL'], axis=1)
    X_train, X_valid, y_train, y_valid = train_test_split(X, y, train_size=0.8, test_size=0.2, random_state=0)
    
    model = RandomForestRegressor(
        n_estimators=476,
        min_samples_split=2,
        bootstrap=True,
        max_depth=50,
        n_jobs=-1,
        min_samples_leaf=1,
        random_state=42
    )
    model.fit(X_train, y_train)
    return model

# Initialize the model
model = init_model()

def preprocess_inputs(data):
    # Convert string values to numeric
    binary_mapping = {'Yes': 1, 'No': 0, 'Male': 1, 'Female': 0, 'Daylight': 1, 'Night': 0,
                     'Valid': 1, 'Invalid': 0}
    
    processed_data = []
    for key, value in data.items():
        if key in ['age', 'model_year', 'height', 'weight', 'speed_limit']:
            processed_data.append(float(value))
        else:
            processed_data.append(binary_mapping.get(value, value))
    
    return processed_data

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json
        inputs = preprocess_inputs(data)
        probability = model.predict([inputs])[0]
        probability_percentage = probability * 100
        
        return jsonify({
            'probability': round(probability_percentage, 1),
            'prediction_category': 'Death' if probability >= 0.5 else 'No Death'
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    # Use environment variable for port with a default value
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
