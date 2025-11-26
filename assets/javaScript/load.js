// --- LOAD CHATS (For the ListeSide) ---
async function loadChats() {
    const container = document.querySelector("#chatList");
    if (!container) return; // Stop if we are not on the list page

    try {
        // PDF Requirement: GET /chats [cite: 22]
        const res = await fetch("/chats"); 
        
        if (!res.ok) throw new Error(`Error: ${res.status}`);
        
        const chats = await res.json();
        container.innerHTML = '';

        if (chats.length === 0) {
            container.innerHTML = '<li>Ingen chats fundet.</li>';
            return;
        }

        chats.forEach(chat => {
            const li = document.createElement("li");
            li.id = `chat-${chat.id}`; // Add ID for delete logic
            // Link goes to the HTML view route
            li.innerHTML = `<a href="/room/${chat.id}">${chat.name}</a>`;
            
            // Optional: Add delete button here dynamically if you want
            // (Requires checking user level in JS or hiding via CSS)
            container.appendChild(li);
        });
    } catch (e) {
        console.error("Failed to load chats", e);
        container.innerHTML = '<li>Kunne ikke hente chats.</li>';
    }
}

// --- LOAD USERS (For Admin) ---
async function loadusers() {
    const container = document.querySelector("#userList");
    if (!container) return; // Stop if not admin/no container

    try {
        // PDF Requirement: GET /users [cite: 30]
        const res = await fetch("/users");
        
        if (res.status === 403) return; // Ignore if not admin
        
        const users = await res.json();
        container.innerHTML = '';

        users.forEach(user => {
            const li = document.createElement("li");
            li.id = `user-row-${user.id}`;
            li.innerHTML = `
                <span>${user.username} (Niveau: ${user.niveau}) </span>
                <button type="button" onclick="sletBruger('${user.id}')">Slet</button>
            `;
            container.appendChild(li);
        });
    } catch (e) {
        console.error("Failed to load users", e);
    }
}

// --- LOAD MESSAGES (For specific Chat) ---
async function loadMessages(chatId) {
    if (!chatId) return;

    try {
        // PDF Requirement: GET /chats/:id/messages 
        const res = await fetch(`/chats/${chatId}/messages`);
        const messages = await res.json();
        
        const container = document.querySelector("#messages");
        container.innerHTML = '';

        if (messages.length === 0) {
            container.innerHTML = '<p>Ingen beskeder endnu.</p>';
            return;
        }

        messages.forEach(message => {
            const p = document.createElement("p");
            p.innerHTML = `<strong>${message.sender}:</strong> ${message.text}<br><small>${message.date}</small>`;
            container.appendChild(p);
        });
        
        // Scroll to bottom
        container.scrollTop = container.scrollHeight;

    } catch (err) {
        console.error("Fejl ved indlæsning af beskeder:", err);
    }
}

// --- MAIN EVENT LISTENER ---
document.addEventListener("DOMContentLoaded", () => {
    // 1. Load lists (if elements exist)
    loadChats();
    loadusers();

    // 2. Load messages (Only if currentChatId is defined in the PUG file)
    if (typeof currentChatId !== 'undefined') {
        loadMessages(currentChatId);
    }
});