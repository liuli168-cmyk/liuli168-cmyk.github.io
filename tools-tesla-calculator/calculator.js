// Tesla Covered Call Calculator
// Mock data generator

let riskChart = null;

function calculate() {
    const sharePrice = parseFloat(document.getElementById('sharePrice').value);
    const numShares = parseInt(document.getElementById('numShares').value);
    const targetIncome = parseFloat(document.getElementById('targetIncome').value);
    const expirationDays = parseInt(document.getElementById('expiration').value);

    // Update current price display
    document.getElementById('currentPriceDisplay').textContent = sharePrice.toFixed(2);
    const neededCapital = (5000 - numShares) * sharePrice;
    document.getElementById('neededCapital').textContent = neededCapital.toFixed(0);

    // Generate strike table data
    const deltas = [0.30, 0.20, 0.10];
    const tableBody = document.getElementById('strikeTable');
    tableBody.innerHTML = '';

    deltas.forEach(delta => {
        const strike = computeStrike(sharePrice, delta, expirationDays);
        const premium = computePremium(sharePrice, strike, expirationDays, delta);
        const totalIncome = premium * numShares;
        const annualized = (premium / sharePrice) * (365 / expirationDays) * 100;

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${delta}</td>
            <td>$${strike.toFixed(2)}</td>
            <td>$${premium.toFixed(2)}</td>
            <td>$${totalIncome.toFixed(0)}</td>
            <td>${annualized.toFixed(2)}%</td>
        `;
        tableBody.appendChild(row);
    });

    // Update risk chart
    updateRiskChart(sharePrice, expirationDays);
}

function computeStrike(price, delta, days) {
    // Simplified: strike = price * (1 + (1-delta)*0.1 * sqrt(days/30))
    const timeFactor = Math.sqrt(days / 30);
    const strike = price * (1 + (1 - delta) * 0.1 * timeFactor);
    return strike;
}

function computePremium(price, strike, days, delta) {
    // Black-Scholes approximation (mock)
    const time = days / 365;
    const volatility = 0.5; // Tesla approx volatility
    const d1 = (Math.log(price / strike) + (0.02 + volatility * volatility / 2) * time) / (volatility * Math.sqrt(time));
    // premium = price * N(d1) - strike * e^(-r*time) * N(d2) ... but mock:
    const premium = price * 0.02 * (1 - delta) * Math.sqrt(time) * 10;
    return Math.max(premium, 0.1);
}

function updateRiskChart(price, days) {
    const ctx = document.getElementById('riskChart').getContext('2d');
    if (riskChart) {
        riskChart.destroy();
    }

    // Generate data points
    const strikes = [];
    const premiums = [];
    const rewards = [];
    for (let i = 0.05; i <= 0.5; i += 0.05) {
        const strike = computeStrike(price, i, days);
        const premium = computePremium(price, strike, days, i);
        strikes.push(strike);
        premiums.push(premium);
        rewards.push((premium / price) * 100);
    }

    riskChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: strikes.map(s => s.toFixed(0)),
            datasets: [
                {
                    label: 'Premium per Share ($)',
                    data: premiums,
                    borderColor: 'rgb(54, 162, 235)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    yAxisID: 'y',
                },
                {
                    label: 'Reward (% of stock price)',
                    data: rewards,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    yAxisID: 'y1',
                }
            ]
        },
        options: {
            responsive: true,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Strike Price ($)'
                    }
                },
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Premium ($)'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Reward (%)'
                    },
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            }
        }
    });
}

function simulateRoll() {
    const newStrike = parseFloat(document.getElementById('rollStrike').value);
    const extraDays = parseInt(document.getElementById('rollDays').value);
    const sharePrice = parseFloat(document.getElementById('sharePrice').value);

    // Mock roll cost and credit
    const oldPremium = computePremium(sharePrice, 430, 30, 0.3); // example
    const newPremium = computePremium(sharePrice, newStrike, 30 + extraDays, 0.3);
    const netCredit = newPremium - oldPremium;

    const resultDiv = document.getElementById('rollResult');
    if (netCredit > 0) {
        resultDiv.innerHTML = `
            <div class="alert alert-success">
                <strong>Roll successful!</strong> You would receive a net credit of $${netCredit.toFixed(2)} per share.
                <br>Total credit for ${document.getElementById('numShares').value} shares: $${(netCredit * parseInt(document.getElementById('numShares').value)).toFixed(0)}.
                <br>New expiration: ${30 + extraDays} days total.
            </div>
        `;
    } else {
        resultDiv.innerHTML = `
            <div class="alert alert-warning">
                <strong>Roll results in a net debit of $${(-netCredit).toFixed(2)} per share.</strong>
                Consider adjusting strike or expiration.
            </div>
        `;
    }
}

// Initialize on page load
window.onload = function() {
    calculate();
};