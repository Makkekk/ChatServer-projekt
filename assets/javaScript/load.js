async function loadChats() {
    const container = document.querySelector("#chatList");
    if (!container) return;

    try {
        console.log("Fetching chats...");
        const res = await fetch("/api/chats");
        
        if (!res.ok) {
            console.error("API Error (Chats):", res.status, res.statusText);
            container.innerHTML = `<li>Fejl ved hentning af chats: ${res.status} ${res.statusText}</li>`;
            return;
        }
        
        const chats = await res.json();
        console.log("Chats received:", chats);

        container.innerHTML = '';
        
        if (chats.length === 0) {
            container.innerHTML = '<li>Ingen chats fundet.</li>';
            return;
        }

        chats.forEach(chat => {
            const li = document.createElement("li");
            li.innerHTML = `<a href="/chat/${chat.id}">${chat.name}</a>`;
            container.appendChild(li)
        })
    } catch (e) {
        console.error("Failed to load chats", e);
        container.innerHTML = `<li>Netværksfejl: ${e.message}</li>`;
    }
}

async function loadusers() {
    const container = document.querySelector("#userList");
    if (!container) {
        console.log("User list container not found (probably not admin)");
        return;
    }

    try {
        console.log("Fetching users...");
        const res = await fetch("/api/users");
        
        if (!res.ok) {
             console.error("API Error (Users):", res.status, res.statusText);
             container.innerHTML = `<li>Kunne ikke hente brugere: ${res.status}</li>`;
             return;
        }

        const users = await res.json();
        console.log("Users received:", users);
        
        container.innerHTML = '';

        if (users.length === 0) {
            container.innerHTML = '<li>Ingen brugere fundet.</li>';
            return;
        }

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
        container.innerHTML = '<li>Fejl ved indlæsning af brugere.</li>';
    }
}


async function loadMessages(chatId) {
    if (!chatId) return;

    try {
    const res = await fetch(`/chat/messages/${chatId}`);
    
    const messages = await res.json();
    const container = document.querySelector("#messages")

    container.innerHTML = '';

    if (messages.length === 0) {
        container.innerHTML = '<p>Ingen beskeder endnu...</p>';
        return;
    }

    messages.forEach(message => {
        const p = document.createElement("p");

        p.innerHTML ='<strong>' + message.sender + ':</strong> ' + message.text + '<br><small>' + message.date + '</small>';
        
        container.appendChild(p);
    })
} catch (err) {
    console.error("Fejl ved indlæsning af beskeder:", err);
}
}


document.addEventListener("DOMContentLoaded", () => {
    loadChats();
    loadusers();
    loadMessages(chatId);
})
 