import { db } from './firebase-config.js';
import { ref, push, onValue, set } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

// ==========================================
// 1. DYNAMIC RECAP CAROUSEL
// ==========================================
const recaps = [
    {
        date: "10/6/2026",
        session: 2,
        summary: "This is a placeholder for Session 2. Add your summary here!",
        quote: "You can't lose what you don't put in the middle.",
        quoteAuthor: "Mike McDermott",
        highlights: ["TBD", "TBD"],
        lowlights: ["TBD"],
        notes: [{ title: "Food", text: "TBD" }]
    },
    {
        date: "9/29/2026",
        session: 1,
        summary: "It was a cheerful night at Sully and everyone was in good spirits. Buffalo Chicken wraps were hot off the grill and ultras were flowing. Postseason baseball is here and so were a couple new faces. Some questions that were thrown out were will we ever see Mitch, Huske, or Carter. Will Blake ever play cards or want to eat with the boys?",
        quote: "The beautiful thing about poker is that everybody thinks they can play.",
        quoteAuthor: "Chris Moneymaker",
        highlights: [
            "THE FELLAS HAVING A GOOD TIME",
            "Buffalo Chicken Wraps",
            "Everyone helping Mr. Sully clean up – much appreciated"
        ],
        lowlights: [
            "IT Tickets",
            "N8 Complaining about the Thyes Mafia stealing his money",
            "Watt Irish goodbye"
        ],
        notes: [
            { title: "Food", text: "Buffalo Chicken Wraps – From Vince. Solid start to the year." },
            { title: "Big action", text: "Tanner donating to G Mully + Lots of Bombs at the end of the night." }
        ]
    }
];

let currentRecapIndex = 0;

const renderRecap = () => {
    const recap = recaps[currentRecapIndex];
    document.getElementById('recap-subtitle').textContent = `${recap.date} — Session ${recap.session}`;
    
    document.getElementById('recap-container').innerHTML = `
        <p class="leading-relaxed text-gray-300">${recap.summary}</p>
        
        <div class="bg-gray-950 p-4 rounded-xl border-l-4 border-sunset italic text-gray-400 font-serif">
            <span class="text-sunset text-2xl font-sans leading-none block mb-2">"</span>
            ${recap.quote} <br>
            <span class="text-sm font-sans font-bold text-gray-500 mt-2 block">— ${recap.quoteAuthor}</span>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div>
                <h3 class="text-neon font-bold uppercase tracking-wider text-sm mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
                    Highlights
                </h3>
                <ul class="space-y-2 text-sm text-gray-300">
                    ${recap.highlights.map(h => `<li class="flex items-start"><span class="text-sunset mr-2">•</span> ${h}</li>`).join('')}
                </ul>
            </div>
            <div>
                <h3 class="text-sunset font-bold uppercase tracking-wider text-sm mb-3 flex items-center">
                    <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    Lowlights
                </h3>
                <ul class="space-y-2 text-sm text-gray-300">
                    ${recap.lowlights.map(l => `<li class="flex items-start"><span class="text-sunset mr-2">•</span> ${l}</li>`).join('')}
                </ul>
            </div>
        </div>

        <div class="mt-4 bg-gray-950/50 p-4 rounded-xl border border-gray-800">
            <h3 class="text-white font-bold mb-2">Notes 📝</h3>
            ${recap.notes.map(n => `<p class="text-sm mb-1"><strong class="text-gray-400">${n.title}:</strong>${n.text}</p>`).join('')}
        </div>
    `;

    document.getElementById('prev-recap').disabled = currentRecapIndex === recaps.length - 1;
    document.getElementById('next-recap').disabled = currentRecapIndex === 0;
};

document.getElementById('prev-recap').addEventListener('click', () => {
    if (currentRecapIndex < recaps.length - 1) { currentRecapIndex++; renderRecap(); }
});

document.getElementById('next-recap').addEventListener('click', () => {
    if (currentRecapIndex > 0) { currentRecapIndex--; renderRecap(); }
});


// ==========================================
// 2. AUTOMATED FOOD ORDER
// ==========================================
const renderFoodOrder = () => {
    const baseOrder = ["N8", "Watt", "Owen", "Brooks", "Thyes", "Mau", "G Mully", "Vince"];
    const anchorDate = new Date("2026-10-06T00:00:00"); 
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const diffDays = Math.floor((today - anchorDate) / (1000 * 60 * 60 * 24));
    const weeksPassed = Math.max(0, Math.floor(diffDays / 7));
    const shiftAmount = weeksPassed % baseOrder.length;
    
    const currentOrder = [...baseOrder.slice(shiftAmount), ...baseOrder.slice(0, shiftAmount)];

    document.getElementById('food-order-list').innerHTML = `
        <li class="flex justify-between items-center p-3 hover:bg-gray-800/30">
            <span class="text-gray-400 font-mono uppercase text-xs">Next week</span>
            <span class="font-bold text-white bg-sunset/20 text-sunset px-2 py-0.5 rounded">${currentOrder[0]}</span>
        </li>
        <li class="flex justify-between items-center p-3 hover:bg-gray-800/30">
            <span class="text-gray-400 font-mono uppercase text-xs">On Deck</span>
            <span class="font-bold text-white">${currentOrder[1]}</span>
        </li>
        <li class="flex justify-between items-center p-3 hover:bg-gray-800/30 border-b-2 border-b-gray-700">
            <span class="text-gray-400 font-mono uppercase text-xs">In the HOLE</span>
            <span class="font-bold text-white">${currentOrder[2]}</span>
        </li>
        ${[3, 4, 5, 6, 7].map(i => `
        <li class="flex justify-between items-center p-3 hover:bg-gray-800/30">
            <span class="text-gray-500 font-mono w-6 text-center">${i + 1}</span>
            <span class="text-gray-300">${currentOrder[i]}</span>
        </li>`).join('')}
    `;
};


// ==========================================
// 3. M.I.A TRACKER (ABSENCE COUNTER)
// ==========================================
const renderMIATracker = () => {
    const miaList = document.getElementById('mia-list');
    
    // Update these numbers weekly alongside the recap manually
    const miaData = [
        { name: "Carter", weeks: 12, label: "Presumed Lost" },
        { name: "Huske", weeks: 8, label: "M.I.A." },
        { name: "Mitch", weeks: 4, label: "AWOL" },
        { name: "Blake", weeks: 2, label: "Cards: No | Food: Pending" }
    ];

    miaList.innerHTML = miaData.sort((a, b) => b.weeks - a.weeks).map(p => `
        <li class="flex justify-between items-center p-3 hover:bg-gray-800/30">
            <div>
                <span class="font-bold text-white block">${p.name}</span>
                <span class="text-[10px] uppercase tracking-wider text-sunset font-mono">${p.label}</span>
            </div>
            <div class="text-right">
                <span class="text-2xl font-bold ${p.weeks >= 5 ? 'text-sunset' : 'text-gray-400'}">${p.weeks}</span>
                <span class="text-xs text-gray-500 block">WEEKS</span>
            </div>
        </li>
    `).join('');
};


// ==========================================
// 4. LIVE RSVP TRACKER (FIREBASE)
// ==========================================
const initRSVP = () => {
    const rsvpList = document.getElementById('rsvp-list');
    const roster = ["AT", "Austin", "Blake", "Brooks", "Carter", "G Mully", "Grant", "Huske", "Mau", "Mitch", "N8", "Owen", "Sully", "Tanner", "Vince", "Watt"];
    
    // 1. Build Initial DOM (all set to '?')
    rsvpList.innerHTML = roster.map(player => `
        <li class="flex justify-between items-center p-3 hover:bg-gray-800/30">
            <span class="font-bold text-gray-300 w-1/3">${player}</span>
            <div class="flex space-x-1 w-2/3 justify-end">
                <button data-player="${player}" data-status="yes" class="rsvp-btn px-3 py-1 rounded text-xs font-bold border border-gray-700 text-gray-500 hover:border-neon hover:text-neon transition-colors">In</button>
                <button data-player="${player}" data-status="pending" class="rsvp-btn px-3 py-1 rounded text-xs font-bold border border-gray-700 text-gray-500 hover:border-gray-300 hover:text-gray-300 transition-colors">?</button>
                <button data-player="${player}" data-status="no" class="rsvp-btn px-3 py-1 rounded text-xs font-bold border border-gray-700 text-gray-500 hover:border-sunset hover:text-sunset transition-colors">Out</button>
            </div>
        </li>
    `).join('');

    // 2. Sync with Firebase
    const rsvpRef = ref(db, 'rsvp');
    
    onValue(rsvpRef, (snapshot) => {
        const data = snapshot.val() || {};
        
        roster.forEach(player => {
            const status = data[player] || 'pending';
            const btnQuery = rsvpList.querySelector(`button[data-player="${player}"]`);
            if (!btnQuery) return; // Skip if player not found in UI
            
            const row = btnQuery.closest('li');
            
            // Reset all buttons in row to default gray
            row.querySelectorAll('.rsvp-btn').forEach(btn => {
                btn.className = "rsvp-btn px-3 py-1 rounded text-xs font-bold border border-gray-700 text-gray-500 hover:opacity-80 transition-colors";
            });
            
            // Apply active color to the selected status
            const activeBtn = row.querySelector(`button[data-status="${status}"]`);
            if (status === 'yes') {
                activeBtn.className = "rsvp-btn px-3 py-1 rounded text-xs font-bold bg-neon/20 border border-neon text-neon";
            } else if (status === 'no') {
                activeBtn.className = "rsvp-btn px-3 py-1 rounded text-xs font-bold bg-sunset/20 border border-sunset text-sunset";
            } else {
                activeBtn.className = "rsvp-btn px-3 py-1 rounded text-xs font-bold bg-gray-700 border border-gray-500 text-white";
            }
        });
    });

    // 3. Write Clicks to Firebase
    rsvpList.addEventListener('click', (e) => {
        if (e.target.classList.contains('rsvp-btn')) {
            const player = e.target.dataset.player;
            const status = e.target.dataset.status;
            set(ref(db, `rsvp/${player}`), status);
        }
    });
};


// ==========================================
// 5. LEADERBOARD CHART
// ==========================================
const initChart = () => {
    const ctx = document.getElementById('seasonChart').getContext('2d');
    const players = ['Austin', 'Mitch', 'Vince', 'Nate', 'Brooks', 'Blake', 'Tanner', 'Grant', 'Owen'];
    const scores = [18.25, 0, -40, -40, 64.50, 0, -23.50, 50.75, -30];
    
    const bgColors = scores.map(s => s >= 0 ? 'rgba(57, 255, 20, 0.7)' : 'rgba(255, 78, 0, 0.7)');
    const bdColors = scores.map(s => s >= 0 ? 'rgba(57, 255, 20, 1)' : 'rgba(255, 78, 0, 1)');

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: players,
            datasets: [{ label: 'Season Total ($)', data: scores, backgroundColor: bgColors, borderColor: bdColors, borderWidth: 1, borderRadius: 4 }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: { callbacks: { label: (ctx) => ctx.raw < 0 ? `-$${Math.abs(ctx.raw).toFixed(2)}` : `$${ctx.raw.toFixed(2)}` } }
            },
            scales: {
                y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#9ca3af', font: { family: "'JetBrains Mono', monospace" } } },
                x: { grid: { display: false }, ticks: { color: '#9ca3af' } }
            }
        }
    });
};


// ==========================================
// 6. FIREBASE CHAT LOGIC
// ==========================================
const initChat = () => {
    const chatForm = document.getElementById('chat-form');
    const chatUsername = document.getElementById('chat-username');
    const chatMessage = document.getElementById('chat-message');
    const chatMessagesDiv = document.getElementById('chat-messages');
    
    const escapeHTML = str => { const div = document.createElement('div'); div.textContent = str; return div.innerHTML; };
    
    const savedName = localStorage.getItem('ssop_username');
    if (savedName) chatUsername.value = savedName;
    chatUsername.addEventListener('change', e => localStorage.setItem('ssop_username', e.target.value.trim()));

    const messagesRef = ref(db, 'messages');
    
    onValue(messagesRef, (snapshot) => {
        chatMessagesDiv.innerHTML = '';
        const msgs = [];
        snapshot.forEach(child => msgs.push(child.val()));

        if (msgs.length === 0) {
            chatMessagesDiv.innerHTML = '<div class="text-center text-gray-500 text-sm mt-4 italic">No trash talk yet. Send the first shot!</div>';
            return;
        }

        msgs.forEach(msg => {
            const isMe = chatUsername.value && msg.username && msg.username.toLowerCase() === chatUsername.value.toLowerCase();
            const msgDiv = document.createElement('div');
            msgDiv.className = `flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-3`;
            const bubbleClass = isMe ? 'bg-sunset/20 border border-sunset/30 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl' : 'bg-gray-800 border border-gray-700 text-gray-200 rounded-tl-xl rounded-tr-xl rounded-br-xl';
            const nameColor = isMe ? 'text-sunset' : 'text-neon';
            
            const timeStr = new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            
            msgDiv.innerHTML = `
                <div class="flex items-baseline space-x-2 mb-1 px-1">
                    <span class="text-xs font-bold ${nameColor}">${escapeHTML(msg.username || "Unknown")}</span>
                    <span class="text-[10px] text-gray-500">${timeStr}</span>
                </div>
                <div class="px-3 py-2 max-w-[85%] text-sm shadow-sm ${bubbleClass} break-words">
                    ${escapeHTML(msg.text)}
                </div>
            `;
            chatMessagesDiv.appendChild(msgDiv);
        });
        chatMessagesDiv.scrollTop = chatMessagesDiv.scrollHeight;
    });

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const username = chatUsername.value.trim();
        const text = chatMessage.value.trim();
        if (username && text) {
            push(messagesRef, { username, text, timestamp: Date.now() });
            chatMessage.value = '';
            chatMessage.focus();
        }
    });
};

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
    renderRecap();
    renderFoodOrder();
    renderMIATracker();
    initRSVP();
    initChart();
    initChat();
});
