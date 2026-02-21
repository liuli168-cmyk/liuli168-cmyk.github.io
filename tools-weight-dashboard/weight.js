// Weight Progress Dashboard

let weightChart = null;
let weightData = [
    { date: '2026-02-01', weight: 162.0 },
    { date: '2026-02-05', weight: 161.2 },
    { date: '2026-02-10', weight: 160.8 },  // Official start
    { date: '2026-02-18', weight: 160.8 },  // Baseline (from memory log)
    { date: '2026-02-19', weight: 159.6 },  // -1.2 lbs
    { date: '2026-02-20', weight: 159.0 },  // -0.6 lbs (from memory log)
];
const startWeight = 160.8;
const goalWeight = 130.0;

function init() {
    updateProgress();
    renderLogTable();
    updateChart();
    calculateGoalDate();
}

function updateProgress() {
    const current = getCurrentWeight();
    const remaining = current - goalWeight;
    const totalLossNeeded = startWeight - goalWeight;
    const lossSoFar = startWeight - current;
    const percent = (lossSoFar / totalLossNeeded) * 100;

    document.getElementById('currentWeight').textContent = current.toFixed(1);
    document.getElementById('remainingWeight').textContent = remaining.toFixed(1);
    const progressBar = document.getElementById('weightProgressBar');
    progressBar.style.width = `${percent}%`;
    progressBar.setAttribute('aria-valuenow', percent);
    progressBar.textContent = `${percent.toFixed(1)}%`;
}

function getCurrentWeight() {
    if (weightData.length === 0) return startWeight;
    // return latest weight
    return weightData[weightData.length - 1].weight;
}

function renderLogTable() {
    const table = document.getElementById('logTable');
    table.innerHTML = '';
    weightData.forEach((entry, index) => {
        const prev = index > 0 ? weightData[index - 1].weight : startWeight;
        const change = prev - entry.weight;
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${entry.date}</td>
            <td>${entry.weight.toFixed(1)} lb</td>
            <td>${change > 0 ? '↓' : change < 0 ? '↑' : ''} ${Math.abs(change).toFixed(1)} lb</td>
            <td><button class="btn btn-sm btn-outline-danger" onclick="deleteEntry(${index})">Delete</button></td>
        `;
        table.appendChild(row);
    });
}

function updateChart() {
    const ctx = document.getElementById('weightChart').getContext('2d');
    if (weightChart) {
        weightChart.destroy();
    }

    const labels = weightData.map(d => d.date);
    const weights = weightData.map(d => d.weight);

    weightChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Weight (lb)',
                    data: weights,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    fill: true,
                    tension: 0.3
                },
                {
                    label: 'Goal (130 lb)',
                    data: Array(labels.length).fill(goalWeight),
                    borderColor: 'rgb(54, 162, 235)',
                    borderDash: [5, 5],
                    fill: false
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Date'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Weight (lb)'
                    },
                    reverse: true, // so downward trend looks like progress
                    min: 125,
                    max: 165
                }
            }
        }
    });
}

function logWeight() {
    const date = document.getElementById('logDate').value;
    const weight = parseFloat(document.getElementById('logWeight').value);
    if (!date || isNaN(weight)) {
        alert('Please enter valid date and weight.');
        return;
    }
    weightData.push({ date, weight });
    document.getElementById('logWeight').value = weight.toFixed(1);
    updateProgress();
    renderLogTable();
    updateChart();
    calculateGoalDate();
}

function deleteEntry(index) {
    weightData.splice(index, 1);
    renderLogTable();
    updateChart();
    updateProgress();
}

function calculateGoalDate() {
    const weeklyLoss = parseFloat(document.getElementById('weeklyLoss').value);
    const current = getCurrentWeight();
    const remaining = current - goalWeight;
    const weeksNeeded = remaining / weeklyLoss;
    const today = new Date('2026-02-14'); // placeholder
    const goalDate = new Date(today.getTime() + weeksNeeded * 7 * 24 * 60 * 60 * 1000);
    const formatted = goalDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    document.getElementById('goalDate').textContent = formatted;
}

function updateProjection() {
    calculateGoalDate();
}

// Initialize
window.onload = init;