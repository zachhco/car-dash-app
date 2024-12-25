from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestRegressor
import numpy as np
import os
import logging

# Configure logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Initialize and train the model
def init_model():
    logger.info("Initializing model...")
    try:
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
        logger.info("Model initialized successfully")
        return model
    except Exception as e:
        logger.error(f"Error initializing model: {str(e)}")
        raise

# Initialize the model
try:
    model = init_model()
except Exception as e:
    logger.error(f"Failed to initialize model: {str(e)}")
    model = None

def preprocess_inputs(data):
    logger.debug(f"Preprocessing inputs: {data}")
    try:
        # Convert string values to numeric
        binary_mapping = {'Yes': 1, 'No': 0, 'Male': 1, 'Female': 0, 'Daylight': 1, 'Night': 0,
                         'Valid': 1, 'Invalid': 0}
        
        processed_data = []
        for key, value in data.items():
            if key in ['age', 'model_year', 'height', 'weight', 'speed_limit']:
                processed_data.append(float(value))
            else:
                processed_data.append(binary_mapping.get(value, value))
        
        logger.debug(f"Processed inputs: {processed_data}")
        return processed_data
    except Exception as e:
        logger.error(f"Error preprocessing inputs: {str(e)}")
        raise

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    logger.info("Received prediction request")
    try:
        if model is None:
            raise ValueError("Model not initialized")

        data = request.json
        logger.debug(f"Received data: {data}")
        
        inputs = preprocess_inputs(data)
        probability = model.predict([inputs])[0]
        probability_percentage = probability * 100
        
        result = {
            'probability': round(probability_percentage, 1),
            'prediction_category': 'Death' if probability >= 0.5 else 'No Death'
        }
        logger.info(f"Prediction result: {result}")
        return jsonify(result)
    except Exception as e:
        logger.error(f"Error making prediction: {str(e)}")
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    # Use environment variable for port with a default value
    port = int(os.environ.get('PORT', 8000))
    app.run(host='0.0.0.0', port=port, debug=True)
