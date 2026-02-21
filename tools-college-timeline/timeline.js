// College Timeline Starter

let milestones = [
    { id: 1, title: "⚡ SAT Registration — 23 DAYS LEFT (Register by Mar 15!)", date: "2026-03-15", category: "critical", completed: false },
    { id: 2, title: "First SAT Test", date: "2026-05-01", category: "upcoming", completed: false },
    { id: 3, title: "Start College Research", date: "2026-06-01", category: "completed", completed: true },
    { id: 4, title: "Summer Internship/Program", date: "2026-07-15", category: "upcoming", completed: false },
    { id: 5, title: "ACT Registration", date: "2026-08-01", category: "critical", completed: false },
    { id: 6, title: "ACT Test", date: "2026-09-15", category: "upcoming", completed: false },
    { id: 7, title: "College Visits (Fall)", date: "2026-10-15", category: "upcoming", completed: false },
    { id: 8, title: "Request Letters of Recommendation", date: "2027-01-15", category: "critical", completed: false },
    { id: 9, title: "Draft Personal Statement", date: "2027-03-01", category: "upcoming", completed: false },
    { id: 10, title: "SAT Subject Tests", date: "2027-05-01", category: "upcoming", completed: false },
    { id: 11, title: "College Application Deadlines", date: "2027-12-01", category: "critical", completed: false },
    { id: 12, title: "FAFSA Submission", date: "2028-01-15", category: "critical", completed: false },
];

function init() {
    renderTimeline();
    updateProgress();
    renderDeadlineTable();
}

function renderTimeline() {
    const container = document.getElementById('timeline');
    container.innerHTML = '';

    // Sort by date
    const sorted = [...milestones].sort((a, b) => new Date(a.date) - new Date(b.date));

    sorted.forEach((milestone, index) => {
        const item = document.createElement('div');
        item.className = `timeline-item ${index % 2 === 0 ? 'left' : 'right'}`;

        let categoryClass = '';
        if (milestone.completed) categoryClass = 'completed';
        else if (milestone.category === 'critical') categoryClass = 'critical';
        else categoryClass = 'upcoming';

        const dateStr = new Date(milestone.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

        item.innerHTML = `
            <div class="timeline-content ${categoryClass}">
                <h6>${milestone.title}</h6>
                <p class="milestone-date">${dateStr}</p>
                <p>Category: ${milestone.category} ${milestone.completed ? '✓' : ''}</p>
                <button class="btn btn-sm ${milestone.completed ? 'btn-secondary' : 'btn-success'}" onclick="toggleCompleted(${milestone.id})">
                    ${milestone.completed ? 'Mark Incomplete' : 'Mark Complete'}
                </button>
                <button class="btn btn-sm btn-outline-danger ms-2" onclick="deleteMilestone(${milestone.id})">Delete</button>
            </div>
        `;
        container.appendChild(item);
    });
}

function updateProgress() {
    const completed = milestones.filter(m => m.completed).length;
    const total = milestones.length;
    const percent = total > 0 ? (completed / total) * 100 : 0;

    document.getElementById('completedCount').textContent = completed;
    document.getElementById('totalCount').textContent = total;
    const bar = document.getElementById('milestoneProgressBar');
    bar.style.width = `${percent}%`;
    bar.setAttribute('aria-valuenow', percent);
    bar.textContent = `${percent.toFixed(0)}%`;

    // Find next critical deadline
    const now = new Date('2026-02-14'); // placeholder today
    const upcoming = milestones.filter(m => !m.completed && new Date(m.date) >= now);
    if (upcoming.length > 0) {
        const next = upcoming.sort((a,b) => new Date(a.date) - new Date(b.date))[0];
        document.getElementById('nextDeadline').textContent = `${next.title} (${new Date(next.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })})`;
    }
}

function renderDeadlineTable() {
    const table = document.getElementById('deadlineTable');
    table.innerHTML = '';

    const now = new Date('2026-02-14');
    const sorted = [...milestones].sort((a, b) => new Date(a.date) - new Date(b.date));

    sorted.forEach(milestone => {
        const date = new Date(milestone.date);
        const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
        const status = milestone.completed ? 'Completed' : diffDays < 0 ? 'Overdue' : diffDays < 30 ? 'Due soon' : 'Upcoming';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${milestone.title}</td>
            <td>${date.toLocaleDateString('en-US')}</td>
            <td>${diffDays >= 0 ? diffDays : 'Past'}</td>
            <td><span class="badge ${status === 'Completed' ? 'bg-success' : status === 'Due soon' ? 'bg-warning' : status === 'Overdue' ? 'bg-danger' : 'bg-info'}">${status}</span></td>
        `;
        table.appendChild(row);
    });
}

function toggleCompleted(id) {
    const milestone = milestones.find(m => m.id === id);
    if (milestone) {
        milestone.completed = !milestone.completed;
        renderTimeline();
        updateProgress();
        renderDeadlineTable();
    }
}

function deleteMilestone(id) {
    milestones = milestones.filter(m => m.id !== id);
    renderTimeline();
    updateProgress();
    renderDeadlineTable();
}

function addMilestone() {
    const title = document.getElementById('milestoneTitle').value.trim();
    const date = document.getElementById('milestoneDate').value;
    const category = document.getElementById('milestoneCategory').value;
    if (!title || !date) {
        alert('Please fill in title and date.');
        return;
    }
    const newId = milestones.length > 0 ? Math.max(...milestones.map(m => m.id)) + 1 : 1;
    milestones.push({
        id: newId,
        title,
        date,
        category,
        completed: category === 'completed'
    });
    renderTimeline();
    updateProgress();
    renderDeadlineTable();
    // Clear inputs
    document.getElementById('milestoneTitle').value = '';
    document.getElementById('milestoneDate').value = '2026-06-01';
    document.getElementById('milestoneCategory').value = 'upcoming';
}

function markAllUpcoming() {
    milestones.forEach(m => m.completed = true);
    renderTimeline();
    updateProgress();
    renderDeadlineTable();
}

// Initialize
window.onload = init;