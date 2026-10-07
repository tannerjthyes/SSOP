import { db } from './firebase-config.js';
import { ref, push, onValue, set, off } from "https://www.gstatic.com/firebasejs/10.4.0/firebase-database.js";

// ==========================================
// 1. DYNAMIC RECAP CAROUSEL
// ==========================================
const recaps = [
    {
        date: "10/6/2026",
        session: 2,
        summary: "The house was packed as we set a record number of attendees. Mau and AT were grinding on the stove. The EX fldp’s were giving each other putting lessons while the current fldp’s were getting taught how to play poker. Tanner Thyes lost 60 in bombs as Brooks had the luck on his side",
        quote: "You don’t gamble to win. You gamble so you can gamble the next day.",
        quoteAuthor: "Bert Ambrose",
        highlights: [
            "THE FELLAS HAVING A GOOD TIME",
            "Minnie, Mitch, Carter, Huske showing up",
            "Watt non Irish goodbye",
            "MODELOS"
        ],
        lowlights: [
            "Hank eating an enchilada",
            "N8 Can’t count his chips right - 3 people audited",
            "Brewers",
            "Thyes boys net loser…."
        ],
        notes: [
            { title: "Food", text: "Echiladas + guac + rice – From N8. Thank you to mau for helping" },
            { title: "Big action", text: "Owen Big Winner + Lots of Bombs at the end of the night. Carter seemed to be in every pot!" },
            { title: "Quote of the night", text: "“Should I put all my polymarket winnings on the brewers” – Any guesses who????" },
            { title: "Beer rotation", text: "Thank you to Huske for bringing Brews" }
        ]
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
    const anchorDate = new Date("2026-09-29T00:00:00"); 
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
// 3. LIVE RSVP TRACKER
// ==========================================
const initRSVP = () => {
    const rsvpList = document.getElementById('rsvp-list');
    const weekSelect = document.getElementById('rsvp-week-select');
    
    const roster = [
        "Austin", "Blake", "Brooks", "Carter", "Elliot", "Grant", 
        "Mau", "Mitch", "N8", "Owen", "Tanner", "Vince", "Watt"
    ];

    const sessions = [
        { id: "session-2", label: "Session 2 (10/06)" },
        { id: "session-3", label: "Session 3 (10/13)" },
        { id: "session-1", label: "Session 1 (09/29)" }
    ];

    weekSelect.innerHTML = sessions.map(s => `
        <option value="${s.id}">${s.label}</option>
    `).join('');

    let currentWeekId = sessions[0].id;
    let currentWeekRef = null;

    const renderRosterDOM = () => {
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
    };

    const bindWeekListener = (weekId) => {
        if (currentWeekRef) off(currentWeekRef);
        
        renderRosterDOM();
        currentWeekRef = ref(db, `rsvp/${weekId}`);

        onValue(currentWeekRef, (snapshot) => {
            const data = snapshot.val() || {};
            
            roster.forEach(player => {
                const status = data[player] || 'pending';
                const btnQuery = rsvpList.querySelector(`button[data-player="${player}"]`);
                if (!btnQuery) return;
                
                const row = btnQuery.closest('li');
                row.querySelectorAll('.rsvp-btn').forEach(btn => {
                    btn.className = "rsvp-btn px-3 py-1 rounded text-xs font-bold border border-gray-700 text-gray-500 hover:opacity-80 transition-colors";
                });
                
                const activeBtn = row.querySelector(`button[data-status="${status}"]`);
                if (status === 'yes') activeBtn.className = "rsvp-btn px-3 py-1 rounded text-xs font-bold bg-neon/20 border border-neon text-neon";
                else if (status === 'no') activeBtn.className = "rsvp-btn px-3 py-1 rounded text-xs font-bold bg-sunset/20 border border-sunset text-sunset";
                else activeBtn.className = "rsvp-btn px-3 py-1 rounded text-xs font-bold bg-gray-700 border border-gray-500 text-white";
            });
        });
    };

    weekSelect.addEventListener('change', (e) => {
        currentWeekId = e.target.value;
        bindWeekListener(currentWeekId);
    });

    rsvpList.addEventListener('click', (e) => {
        if (e.target.classList.contains('rsvp-btn')) {
            set(ref(db, `rsvp/${currentWeekId}/${e.target.dataset.player}`), e.target.dataset.status);
        }
    });

    bindWeekListener(currentWeekId);
};


// ==========================================
// 4. ADVANCED CHARTING (BAR & TREND FILTER)
// ==========================================
const initChart = () => {
    let seasonChartInstance = null;
    let currentChartType = 'bar';
    const ctx = document.getElementById('seasonChart').getContext('2d');
    const filterSelect = document.getElementById('chart-player-filter');
    
    // Core Data
    const players = ['Austin', 'Vince', 'Nate', 'Brooks', 'Tanner', 'Grant', 'Owen', 'Carter', 'Elliot'];
    const currentScores = [36.25, -30.00, -10.50, 78.25, -92.50, 50.75, 20.00, -12.25, -40.00];

    // Populate dropdown with players
    players.forEach(player => {
        const opt = document.createElement('option');
        opt.value = player;
        opt.textContent = player;
        filterSelect.appendChild(opt);
    });

    // Computed Historical Progression [Start, Session 1, Session 2]
    const historyData = {
        'Austin': [0, 18.25, 36.25],
        'Vince': [0, -40.00, -30.00],
        'Nate': [0, -40.00, -10.50],
        'Brooks': [0, 64.50, 78.25],
        'Tanner': [0, -23.50, -92.50],
        'Grant': [0, 50.75, 50.75],
        'Owen': [0, -30.00, 20.00],
        'Carter': [0, 0.00, -12.25],
        'Elliot': [0, 0.00, -40.00]
    };
    
    const lineColors = ['#39ff14', '#00e5ff', '#ff00ff', '#ffea00', '#ff4e00', '#9d00ff', '#ff8c00', '#00ff7f', '#ff1493'];

    const renderChart = () => {
        if (seasonChartInstance) seasonChartInstance.destroy();

        if (currentChartType === 'bar') {
            filterSelect.classList.add('hidden'); // Hide filter in bar mode
            
            const bgColors = currentScores.map(s => s >= 0 ? 'rgba(57, 255, 20, 0.7)' : 'rgba(255, 78, 0, 0.7)');
            const bdColors = currentScores.map(s => s >= 0 ? 'rgba(57, 255, 20, 1)' : 'rgba(255, 78, 0, 1)');

            seasonChartInstance = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: players,
                    datasets: [{ label: 'Season Total ($)', data: currentScores, backgroundColor: bgColors, borderColor: bdColors, borderWidth: 1, borderRadius: 4 }]
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
        } else {
            filterSelect.classList.remove('hidden'); // Show filter in line mode
            const selectedPlayer = filterSelect.value;
            
            // Filter datasets based on selection
            const lineDatasets = players
                .map((player, index) => ({
                    label: player,
                    data: historyData[player],
                    borderColor: lineColors[index],
                    backgroundColor: lineColors[index],
                    borderWidth: 2,
                    tension: 0.1,
                    pointRadius: 4,
                }))
                .filter(dataset => selectedPlayer === 'all' || dataset.label === selectedPlayer);

            seasonChartInstance = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['Start', 'Session 1', 'Session 2'],
                    datasets: lineDatasets
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { 
                            display: true, 
                            position: 'right', 
                            labels: { color: '#9ca3af', boxWidth: 10, font: {size: 10, family: "'JetBrains Mono', monospace"} }
                        },
                        tooltip: { callbacks: { label: (ctx) => `${ctx.dataset.label}: ${ctx.raw < 0 ? `-$${Math.abs(ctx.raw).toFixed(2)}` : `$${ctx.raw.toFixed(2)}`}` } }
                    },
                    scales: {
                        y: { grid: { color: 'rgba(255, 255, 255, 0.1)' }, ticks: { color: '#9ca3af', font: { family: "'JetBrains Mono', monospace" } } },
                        x: { grid: { color: 'rgba(255, 255, 255, 0.05)' }, ticks: { color: '#9ca3af' } }
                    }
                }
            });
        }
    };

    renderChart();

    filterSelect.addEventListener('change', () => {
        if(currentChartType === 'line') renderChart();
    });

    document.getElementById('chart-toggle-bar').addEventListener('click', (e) => {
        if(currentChartType === 'bar') return;
        currentChartType = 'bar';
        
        e.target.classList.replace('text-gray-500', 'text-white');
        e.target.classList.add('bg-sunset');
        
        const lineBtn = document.getElementById('chart-toggle-line');
        lineBtn.classList.remove('bg-sunset', 'text-white');
        lineBtn.classList.add('text-gray-500');
        
        renderChart();
    });

    document.getElementById('chart-toggle-line').addEventListener('click', (e) => {
        if(currentChartType === 'line') return;
        currentChartType = 'line';
        
        e.target.classList.replace('text-gray-500', 'text-white');
        e.target.classList.add('bg-sunset');
        
        const barBtn = document.getElementById('chart-toggle-bar');
        barBtn.classList.remove('bg-sunset', 'text-white');
        barBtn.classList.add('text-gray-500');
        
        renderChart();
    });
};


// ==========================================
// 5. BULLETPROOF & SORTED CHAT LOGIC
// ==========================================
const initChat = () => {
    const chatForm = document.getElementById('chat-form');
    const chatUsername = document.getElementById('chat-username');
    const chatMessage = document.getElementById('chat-message');
    const chatMessagesDiv = document.getElementById('chat-messages');
    const submitBtn = document.getElementById('chat-submit-btn');
    
    const escapeHTML = str => { const div = document.createElement('div'); div.textContent = str; return div.innerHTML; };
    
    const savedName = localStorage.getItem('ssop_username');
    if (savedName) chatUsername.value = savedName;
    chatUsername.addEventListener('change', e => localStorage.setItem('ssop_username', e.target.value.trim()));

    const messagesRef = ref(db, 'messages');
    
    onValue(messagesRef, (snapshot) => {
        chatMessagesDiv.innerHTML = '';
        const msgs = [];
        
        snapshot.forEach((child) => {
            const val = child.val();
            if (val && typeof val === 'object' && val.text) {
                msgs.push(val);
            }
        });

        // Explicitly sort messages by timestamp oldest -> newest
        msgs.sort((a, b) => (Number(a.timestamp) || 0) - (Number(b.timestamp) || 0));

        if (msgs.length === 0) {
            chatMessagesDiv.innerHTML = '<div class="text-center text-gray-500 text-sm mt-4 italic">No chat history yet. Send the first message!</div>';
            return;
        }

        msgs.forEach(msg => {
            const safeUsername = msg.username ? String(msg.username) : "Anonymous";
            const safeText = String(msg.text);
            
            const currentInputName = chatUsername.value ? chatUsername.value.trim() : "";
            const isMe = currentInputName !== "" && safeUsername.toLowerCase() === currentInputName.toLowerCase();
            
            const msgDiv = document.createElement('div');
            msgDiv.className = `flex flex-col ${isMe ? 'items-end' : 'items-start'} mb-3`;
            const bubbleClass = isMe ? 'bg-sunset/20 border border-sunset/30 text-white rounded-tl-xl rounded-tr-xl rounded-bl-xl' : 'bg-gray-800 border border-gray-700 text-gray-200 rounded-tl-xl rounded-tr-xl rounded-br-xl';
            const nameColor = isMe ? 'text-sunset' : 'text-neon';
            
            let timeStr = "";
            try {
                const ts = Number(msg.timestamp); 
                if (!isNaN(ts) && ts > 0) {
                    timeStr = new Date(ts).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                }
            } catch (e) {
                timeStr = ""; 
            }
            
            msgDiv.innerHTML = `
                <div class="flex items-baseline space-x-2 mb-1 px-1">
                    <span class="text-xs font-bold ${nameColor}">${escapeHTML(safeUsername)}</span>
                    <span class="text-[10px] text-gray-500">${timeStr}</span>
                </div>
                <div class="px-3 py-2 max-w-[85%] text-sm shadow-sm ${bubbleClass} break-words">
                    ${escapeHTML(safeText)}
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
            const originalText = submitBtn.innerText;
            submitBtn.innerText = '...';
            submitBtn.disabled = true;

            push(messagesRef, { username, text, timestamp: Date.now() })
                .then(() => {
                    chatMessage.value = '';
                    chatMessage.focus();
                })
                .catch((error) => {
                    alert("Message failed to send! \nError: " + error.message);
                })
                .finally(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.disabled = false;
                });
        }
    });
};

// Initialize components
document.addEventListener('DOMContentLoaded', () => {
    renderRecap();
    renderFoodOrder();
    initRSVP();
    initChart();
    initChat();
});
