import { db } from './firebase-config.js';
import { ref, push, onChildAdded } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

// --- Leaderboard Data & Logic ---
const ledgerData = [
    { name: "Austin", buyIn: 40, rebuy: 0, chips: 58.25, total: 18.25 },
    { name: "Mitch", buyIn: 0, rebuy: 0, chips: 0, total: 0 },
    { name: "Vince", buyIn: 40, rebuy: 0, chips: 0, total: -40.00 },
    { name: "Nate", buyIn: 40, rebuy: 0, chips: 0, total: -40.00 },
    { name: "Brooks", buyIn: 40, rebuy: 0, chips: 104.5, total: 64.50 },
    { name: "Blake", buyIn: 0, rebuy: 0, chips: 0, total: 0 },
    { name: "Tanner", buyIn: 40, rebuy: 0, chips: 16.5, total: -23.50 },
    { name: "Grant", buyIn: 40, rebuy: 0, chips: 90.75, total: 50.75 },
    { name: "Owen", buyIn: 40, rebuy: 60, chips: 70, total: -30.00 }
];

function renderTable() {
    const tbody = document.getElementById('ledger-body');
    ledgerData.forEach(player => {
        const tr = document.createElement('tr');
        const totalClass = player.total > 0 ? 'positive' : (player.total < 0 ? 'negative' : '');
        
        tr.innerHTML = `
            <td>${player.name}</td>
            <td>${player.buyIn || ''}</td>
            <td>${player.rebuy || ''}</td>
            <td>${player.chips || ''}</td>
            <td class="${totalClass}">$${player.total.toFixed(2)}</td>
        `;
        tbody.appendChild(tr);
    });
}

function renderChart() {
    const ctx = document.getElementById('seasonChart').getContext('2d');
    const labels = ledgerData.map(p => p.name);
    const data = ledgerData.map(p => p.total);

    // Apply color styling matching the CSS variables
    const bgColors = data.map(val => val >= 0 ? '#39ff14' : '#ff6b6b');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Season Total ($)',
                data: data,
                backgroundColor: bgColors,
                borderRadius: 4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    grid: { color: '#333' },
                    ticks: { color: '#a0a0a0' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#a0a0a0' }
                }
            },
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// --- Firebase Chat Logic ---
const messagesRef = ref(db, 'messages');
const chatForm = document.getElementById('chat-form');
const chatInput = document.getElementById('chat-input');
const chatMessages = document.getElementById('chat-messages');
const chatWindow = document.getElementById('chat-window');

// Listen for new messages
onChildAdded(messagesRef, (snapshot) => {
    const data = snapshot.val();
    const li = document.createElement('li');
    // Using a generic "Player" prefix for now. You can add a name input field later!
    li.textContent = `Player: ${data.text}`;
    chatMessages.appendChild(li);
    chatWindow.scrollTop = chatWindow.scrollHeight;
});

// Send new message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (text) {
        push(messagesRef, {
            text: text,
            timestamp: Date.now()
        });
        chatInput.value = '';
    }
});

// Initialize
renderTable();
renderChart();
