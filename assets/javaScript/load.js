async function loadChats() {
    const res = await fetch("/chat");
    const chats = await res.json();

    const container = document.querySelector("#chatList");
    container.innerHTML = '';

    chats.forEach(chat => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="/chats/${chat.id}">${chat.name}</a>`;
        container.appendChild(li)
    })
}

async function loadusers(chatId) {
    const res = await fetch("/api/users")
    const users = await res.json();

    const container = document.querySelector("#userList")
    container.innerHTML = '';

    users.forEach(user => {
        const li = document.createElement("li")
        li.innerHTML = `<a href="/chats/${user.username}">${user.niveau}</a>`;
        container.appendChild(li);
    })
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
