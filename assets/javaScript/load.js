document.addEventListener("DOMContentLoaded", () => {
    loadChats();
    if (typeof userLevel !== 'undefined' && userLevel === 3) {
        loadUsers();
    }
    if (typeof currentChatId !== 'undefined') {
        loadMessages(currentChatId);
    }
    // Opdatere beskeder automatisk hvert 2. sekund
    setInterval(() => {
        loadMessages(currentChatId);
    }, 2000);
});

// --- LOAD CHATS (til listesiden) ---
async function loadChats() {
    const container = document.querySelector("#chatList");
    if (!container) return;

    try {
        const res = await fetch("/chats");
        if (!res.ok) throw new Error(`Error: ${res.status}`);

        const chats = await res.json();

        container.textContent = '';

        if (chats.length === 0) {
            const li = document.createElement("li");
            li.textContent = "Ingen chats fundet.";
            container.appendChild(li);
            return;
        } else {

            chats.forEach(chat => {
                const li = document.createElement("li")
                li.id = `chat-${chat.id}`;

                 
                const a = document.createElement("a")

                a.href = `/chats/${chat.id}`;
                a.textContent = chat.name 
                li.appendChild(a)

                if (currentUser && (userLevel === 3 || (userLevel === 2 && chat.owner === currentUser))) {
                    const deleteBtn = document.createElement("button")
                    deleteBtn.type = "button"
                    deleteBtn.textContent = "Slet"
                    deleteBtn.className = "btn-small btn-delete"

                    deleteBtn.onclick = function () {
                        deleteChat(chat.id);
                    };
                    const edit = document.createElement("button");
                    edit.type = "button"
                    edit.textContent = "Rediger"
                    edit.className = "btn-small btn-edit"

                    edit.onclick = function () {
                        editChat(chat.id)
                    }
                    li.appendChild(edit);
                    li.appendChild(deleteBtn);
                }

                container.appendChild(li)
            });
        }
    } catch (e) {
        console.error("Failed to load chats", e);
        const li = document.createElement("li");
        li.textContent = "Kunne ikke hente chats.";
        container.appendChild(li);
    }
}


// --- LOAD USERS (For Admin) ---
async function loadUsers() {
    const container = document.querySelector("#userList");
    if (!container) return;

    try {
        const res = await fetch("/users");
        if (res.status === 403) return;

        const users = await res.json();
        container.textContent = '';

        users.forEach(user => {
            const li = document.createElement("li");
            li.id = `user-row-${user.id}`;

            
            const leftGroup = document.createElement("div");
            leftGroup.className = "user-info-group"; 

            const nameSpan = document.createElement("span");
            nameSpan.textContent = user.username;
            nameSpan.style.fontWeight = "bold"; 
            nameSpan.style.marginRight = "10px";

            // Styled Level Dropdown
            const select = document.createElement("select");
            select.className = "level-select";

            [1, 2, 3].forEach(level => {
                const option = document.createElement("option");
                option.value = level;
                option.textContent = `Level ${level}`;
                if (user.level === level) option.selected = true;
                select.appendChild(option);
            });

            select.onchange = function() {
                updateUserLevel(user.id, this.value);
            };

            
            leftGroup.appendChild(nameSpan);
            leftGroup.appendChild(select);

            
            // Button group til at holde knapper sammen
            const buttonGroup = document.createElement("div");
            buttonGroup.className = "button-group";

            // Vis beskeder knap
            const viewMessagesBtn = document.createElement("button");
            viewMessagesBtn.type = "button";
            viewMessagesBtn.textContent = "Vis beskeder";
            viewMessagesBtn.className = "btn-small btn-view";
            viewMessagesBtn.onclick = function () { viewUserMessages(user.id, user.username); };

            // Slet knap
            const deleteBtn = document.createElement("button");
            deleteBtn.type = "button";
            deleteBtn.textContent = "Slet";
            deleteBtn.className = "btn-small btn-delete";
            deleteBtn.onclick = function () { deleteUser(user.id); };

            buttonGroup.appendChild(viewMessagesBtn);
            buttonGroup.appendChild(deleteBtn);

            // Add groups to the list item
            li.appendChild(leftGroup);
            li.appendChild(buttonGroup);

            container.appendChild(li);
        });
    } catch (e) {
        console.error("Failed to load users", e);
    }
}


// --- UPDATE USER LEVEL (For Admin) ---
async function updateUserLevel(userId, newLevel) {
    try {
        const res = await fetch(`/users/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ level: parseInt(newLevel) })
        });
        if (res.ok) {
            alert("Bruger level opdateret!");
        } else {
            const data = await res.json();
            alert("Fejl: " + (data.error || "Kunne ikke opdatere level"));
            loadUsers();
        }
    } catch (err) {
        console.error("Fejl ved opdatering af level:", err);
        alert("Netværksfejl");
    }
}

// --- VIEW USER MESSAGES (For Admin) ---
async function viewUserMessages(userId, username) {
    try {
        const res = await fetch(`/users/${userId}/messages`);

        if (!res.ok) {
            if (res.status === 404) {
                alert(`${username} har ingen beskeder endnu.`);
                return;
            }
            throw new Error("Kunne ikke hente beskeder");
        }

        const messages = await res.json();

        // Byg besked-visning
        let messageText = `=== Beskeder fra ${username} (${messages.length} total) ===\n\n`;

        messages.forEach((msg, index) => {
            messageText += `${index + 1}. ${msg.text}\n`;
            messageText += `   Dato: ${msg.date}\n`;
            messageText += `   Chat ID: ${msg.chatId}\n\n`;
        });

        // Vis i alert
        alert(messageText);

    } catch (err) {
        console.error("Fejl ved hentning af bruger beskeder:", err);
        alert("Kunne ikke hente beskeder. Se konsollen for detaljer.");
    }
}

// --- LOAD MESSAGES (For specific Chat) ---
async function loadMessages(chatId) {
    if (!chatId) return;

    try {
        const res = await fetch(`/chats/${chatId}/messages`);
        if (!res.ok) throw new Error("Kunne ikke hente beskeder");
        const messages = await res.json();

        const container = document.querySelector("#messages");
        container.textContent = '';

        if (messages.length === 0) {
            const p = document.createElement("p");
            p.textContent = "Ingen beskeder endnu.";
            container.appendChild(p);
            return;
        }

        messages.forEach(msg => {
            const p = document.createElement("p");

            // Opret strong element for sender
            const strong = document.createElement("strong");
            strong.textContent = `${msg.sender}:`;
            p.appendChild(strong);

            // Tilføj mellemrum og besked tekst
            p.appendChild(document.createTextNode(` ${msg.text}`));

            // Tilføj linjeskift
            p.appendChild(document.createElement("br"));

            // Opret small element for dato
            const small = document.createElement("small");
            small.textContent = msg.date;
            p.appendChild(small);

            container.appendChild(p);
        });


    } catch (err) {
        console.error("Fejl ved indlæsning af beskeder:", err);
        document.querySelector("#messages").textContent = "Fejl: Kunne ikke indlæse beskeder.";
    }
}

async function editChat(chatId) {
    const newName = prompt("Indtast nyt navn på chatten:", "");
    if (!newName || newName.trim() === "") return;

    try {
        const res = await fetch(`/chats/${chatId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newName.trim() })
        });

        if (res.ok) {
            
            const li = document.getElementById(`chat-${chatId}`);
            const a = li.querySelector("a");
            a.textContent = newName.trim();
           
        } else {
            const data = await res.json();
            alert("Fejl: " + (data.error || "Kunne ikke opdatere"));
        }
    } catch (err) {
        console.error("Fejl ved redigering:", err);
        alert("Netværksfejl");
    }
}