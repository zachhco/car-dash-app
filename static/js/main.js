class DeathPredictionDashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.init();
    }

    async init() {
        // Create the HTML structure
        this.container.innerHTML = `
            <div class="death-prediction-dashboard">
                <div class="dashboard">
                    <img id="dashboard-image" src="/static/images/green.png" alt="Dashboard">
                    <div id="probability" class="probability"></div>
                </div>
                <div>
                    <label for="alcohol_use">Alcohol Use:</label>
                    <input type="text" id="alcohol_use" name="alcohol_use"><br><br>
                    <label for="age">Age:</label>
                    <input type="text" id="age" name="age"><br><br>
                    <label for="sex">Sex:</label>
                    <input type="text" id="sex" name="sex"><br><br>
                    <label for="model_year">Model Year:</label>
                    <input type="text" id="model_year" name="model_year"><br><br>
                    <label for="height">Height:</label>
                    <input type="text" id="height" name="height"><br><br>
                    <label for="weight">Weight:</label>
                    <input type="text" id="weight" name="weight"><br><br>
                    <label for="speed_limit">Speed Limit:</label>
                    <input type="text" id="speed_limit" name="speed_limit"><br><br>
                    <label for="rush_hour">Rush Hour:</label>
                    <input type="text" id="rush_hour" name="rush_hour"><br><br>
                    <label for="light_condition">Light Condition:</label>
                    <input type="text" id="light_condition" name="light_condition"><br><br>
                    <label for="restraint_use">Restraint Use:</label>
                    <input type="text" id="restraint_use" name="restraint_use"><br><br>
                    <label for="drug_use">Drug Use:</label>
                    <input type="text" id="drug_use" name="drug_use"><br><br>
                    <label for="cold_weather">Cold Weather:</label>
                    <input type="text" id="cold_weather" name="cold_weather"><br><br>
                    <label for="speeding">Speeding:</label>
                    <input type="text" id="speeding" name="speeding"><br><br>
                    <label for="license_status">License Status:</label>
                    <input type="text" id="license_status" name="license_status"><br><br>
                    <label for="airbag_deploy">Airbag Deploy:</label>
                    <input type="text" id="airbag_deploy" name="airbag_deploy"><br><br>
                    <label for="driver">Driver:</label>
                    <input type="text" id="driver" name="driver"><br><br>
                    <label for="front_seat">Front Seat:</label>
                    <input type="text" id="front_seat" name="front_seat"><br><br>
                    <label for="collision">Collision:</label>
                    <input type="text" id="collision" name="collision"><br><br>
                    <label for="ejection">Ejection:</label>
                    <input type="text" id="ejection" name="ejection"><br><br>
                    <label for="large_size">Large Size:</label>
                    <input type="text" id="large_size" name="large_size"><br><br>
                </div>
                <button id="predict-button">Predict</button>
            </div>
        `;

        // Initialize event listeners
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const predictButton = this.container.querySelector('#predict-button');
        predictButton.addEventListener('click', async () => {
            const data = this.collectInputData();
            await this.makePrediction(data);
        });
    }

    collectInputData() {
        return {
            alcohol_use: this.container.querySelector('#alcohol_use').value,
            age: this.container.querySelector('#age').value,
            sex: this.container.querySelector('#sex').value,
            model_year: this.container.querySelector('#model_year').value,
            height: this.container.querySelector('#height').value,
            weight: this.container.querySelector('#weight').value,
            speed_limit: this.container.querySelector('#speed_limit').value,
            rush_hour: this.container.querySelector('#rush_hour').value,
            light_condition: this.container.querySelector('#light_condition').value,
            restraint_use: this.container.querySelector('#restraint_use').value,
            drug_use: this.container.querySelector('#drug_use').value,
            cold_weather: this.container.querySelector('#cold_weather').value,
            speeding: this.container.querySelector('#speeding').value,
            license_status: this.container.querySelector('#license_status').value,
            airbag_deploy: this.container.querySelector('#airbag_deploy').value,
            driver: this.container.querySelector('#driver').value,
            front_seat: this.container.querySelector('#front_seat').value,
            collision: this.container.querySelector('#collision').value,
            ejection: this.container.querySelector('#ejection').value,
            large_size: this.container.querySelector('#large_size').value
        };
    }

    async makePrediction(data) {
        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            const result = await response.json();

            if (response.ok) {
                this.updateDashboard(result);
            } else {
                alert('Error making prediction: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error making prediction. Please try again.');
        }
    }

    updateDashboard(result) {
        const dashboardImage = this.container.querySelector('#dashboard-image');
        const probabilityDisplay = this.container.querySelector('#probability');
        
        dashboardImage.src = `/static/images/${result.prediction_category === 'Death' ? 'red.png' : 'green.png'}`;
        probabilityDisplay.textContent = `${result.probability}%`;
    }
}

// Make it available globally
window.DeathPredictionDashboard = DeathPredictionDashboard;
