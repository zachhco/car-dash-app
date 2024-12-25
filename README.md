# Death Prediction Dashboard

A web application that predicts the probability of death in a car accident based on various driving conditions and driver characteristics. The application uses a Random Forest model trained on US DOT data.

## Setup

1. Install the required dependencies:
```bash
pip install -r requirements.txt
```

2. Place your dataset file `data_GEN6.csv` in the root directory.

3. Place your dashboard images (`red.png` and `green.png`) in the `static/images` directory.

4. Run the application:
```bash
python app.py
```

5. Open your browser and navigate to `http://localhost:5000`

## Project Structure

```
deathapp/
├── app.py              # Flask application
├── requirements.txt    # Python dependencies
├── data_GEN6.csv      # Dataset file
├── README.md          # Documentation
├── static/
│   ├── css/
│   │   └── style.css  # Stylesheet
│   ├── js/
│   │   └── main.js    # Frontend JavaScript
│   └── images/        # Dashboard images
│       ├── red.png
│       └── green.png
└── templates/
    └── index.html     # Main HTML template
```

## Features

- Real-time prediction of death probability in car accidents
- Interactive web interface for input parameters
- Visual dashboard display with color-coded risk levels
- Responsive design for various screen sizes

## Model Details

The application uses a Random Forest Regressor with the following parameters:
- Number of estimators: 476
- Maximum depth: 50
- Minimum samples split: 2
- Minimum samples leaf: 1

## Deployment

To deploy this application:

1. Ensure all dependencies are installed
2. Configure your web server (e.g., Nginx, Apache)
3. Set up a WSGI server (e.g., Gunicorn)
4. Set `debug=False` in `app.py` for production
5. Configure environment variables for security

## Contributing

Feel free to submit issues and enhancement requests.
