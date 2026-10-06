import { db } from './firebase-config.js';
import { ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

// --- Leaderboard Chart ---
const initChart = () => {
    const ctx = document.getElementById('seasonChart').getContext('2d');
    
    const players = ['Austin', 'Mitch', 'Vince', 'Nate', 'Brooks', 'Blake', 'Tanner', 'Grant', 'Owen'];
    const scores = [18.25, 0, -40, -40, 64.50, 0, -23.50, 50.75, -30];
    
    const backgroundColors = scores.map(score => score >= 0 ? 'rgba(57, 255, 20, 0.7)' : 'rgba(255, 78, 0, 0.7)');
    const borderColors = scores.map(score => score >= 0 ? 'rgba(57, 255, 20, 1)' : 'rgba(255, 78, 0, 1)');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: players,
            datasets: [{
                label: 'Season Total ($)',
                data: scores,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1,
                borderRadius: 4,
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let value = context.raw;
                            return value < 0 ? `-$${Math.abs(value).toFixed(2)}` : `$${value.toFixed(2)}`;
                        }
                    }
                }
            },
            scales: {
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)',
                        zeroLineColor: 'rgba(255, 255, 255, 0.3)'
                    },
                    ticks: {
                        color: '#9ca3af',
                        font: { family: "'JetBrains Mono', monospace" },
                        callback: function(value) { return value; }
                    }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#9ca3af' }
                }
            }
        }
    });
};

document.addEventListener('DOMContentLoaded', initChart);

// --- Firebase Chat Logic ---
const chatForm = document.getElementById('chat-form');
const chatUsername = document.getElementById('chat-username');
const chatMessage = document.getElementById('chat-message');
const chatMessagesDiv = document.getElementById('chat-messages');

// Format timestamps
const formatTime = (ts) => {
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Prevent HTML injection
const escapeHTML = (str) => {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
};

// Save name to localStorage
const savedName = localStorage.getItem('ssop_username');
if (savedName) chatUsername.value = savedName;
chatUsername.addEventListener('change', (e) => {
    localStorage.setItem('ssop_username', e.target.value.trim());
});

// Sync messages from Realtime Database
const messagesRef = ref(db, 'messages');

onValue(messagesRef, (snapshot) => {
    chatMessagesDiv.innerHTML = '';
    const msgs = [];
    
    snapshot.forEach((childSnapshot) => {
        msgs.push(childSnapshot.val());
    });

    if (msgs.length === 0) {
        chatMessagesDiv.innerHTML = '<div class="text-center text-gray-500 text-sm mt-4 italic">No trash talk yet. Send the first shot!</div>';
        return;
    }

    msgs.forEach(msg => {
        const isMe = chatUsername.value && msg.username && msg.username.toLowerCase() === chatUsername.value.toLowerCase();
        const msgDiv = document.createElement('div');
        msgDiv.className = `flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-3`;
        
        const bubbleClass = isMe 
            ? 'bg-sunset/20 border border-sunset/30 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl' 
            : 'bg-gray-800 border border-gray-700 text-gray-200 rounded-tl-xl rounded-tr-xl rounded-br-xl';
        const nameColor = isMe ? 'text-sunset' : 'text-neon';
        const displayName = msg.username || "Unknown Player";

        msgDiv.innerHTML = `
            <div class="flex items-baseline space-x-2 mb-1 px-1">
                <span class="text-xs font-bold ${nameColor}">${escapeHTML(displayName)}</span>
                <span class="text-[10px] text-gray-500">${formatTime(msg.timestamp)}</span>
            </div>
            <div class="px-3 py-2 max-w-[85%] text-sm shadow-sm ${bubbleClass} break-words">
                ${escapeHTML(msg.text)}
            </div>
        `;
        chatMessagesDiv.appendChild(msgDiv);
    });
    
    chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
});

// Send new message
chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = chatUsername.value.trim();
    const text = chatMessage.value.trim();
    
    if (username && text) {
        push(messagesRef, {
            username: username,
            text: text,
            timestamp: Date.now()
        });
        chatMessage.value = '';
        chatMessage.focus();
    }
});
