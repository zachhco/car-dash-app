document.addEventListener('DOMContentLoaded', function() {
    const predictButton = document.getElementById('predict-button');
    const dashboardImage = document.getElementById('dashboard-image');
    const probabilityDisplay = document.getElementById('probability');

    predictButton.addEventListener('click', async function() {
        // Collect all input values
        const data = {
            alcohol_use: document.getElementById('alcohol_use').value,
            age: document.getElementById('age').value,
            sex: document.getElementById('sex').value,
            model_year: document.getElementById('model_year').value,
            height: document.getElementById('height').value,
            weight: document.getElementById('weight').value,
            speed_limit: document.getElementById('speed_limit').value,
            rush_hour: document.getElementById('rush_hour').value,
            light_condition: document.getElementById('light_condition').value,
            restraint_use: document.getElementById('restraint_use').value,
            drug_use: document.getElementById('drug_use').value,
            cold_weather: document.getElementById('cold_weather').value,
            speeding: document.getElementById('speeding').value,
            license_status: document.getElementById('license_status').value,
            airbag_deploy: document.getElementById('airbag_deploy').value,
            driver: document.getElementById('driver').value,
            front_seat: document.getElementById('front_seat').value,
            collision: document.getElementById('collision').value,
            ejection: document.getElementById('ejection').value,
            large_size: document.getElementById('large_size').value
        };

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
                // Update the dashboard image and probability
                dashboardImage.src = `/static/images/${result.prediction_category === 'Death' ? 'red.png' : 'green.png'}`;
                probabilityDisplay.textContent = `${result.probability}%`;
            } else {
                alert('Error making prediction: ' + result.error);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error making prediction. Please try again.');
        }
    });
});
