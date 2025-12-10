document.addEventListener("DOMContentLoaded", () => {
    loadChats();
    if (typeof userNiveau !== 'undefined' && userNiveau === 3) {
        loadusers();
    }
    if (typeof currentChatId !== 'undefined') {
        loadMessages(currentChatId);
    }
    //Opdatere beskeder automatisk hvert 2. sekund
    setInterval(() => {
        loadMessages(currentChatId);
    }, 2000);
})

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

                // 
                const a = document.createElement("a")

                a.href = `/chats/${chat.id}`;
                a.textContent = chat.name 
                li.appendChild(a)

                if (currentUser && (userNiveau === 3 || (userNiveau === 2 && chat.ejer === currentUser))) {
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
async function loadusers() {
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

            // 2. Styled Niveau Dropdown
            const select = document.createElement("select");
            select.className = "level-select"; 
            
            [1, 2, 3].forEach(niveau => {
                const option = document.createElement("option");
                option.value = niveau;
                option.textContent = `Niveau ${niveau}`;
                if (user.niveau === niveau) option.selected = true;
                select.appendChild(option);
            });

            select.onchange = function() {
                updateUserNiveau(user.id, this.value);
            };

            
            leftGroup.appendChild(nameSpan);
            leftGroup.appendChild(select);

            
            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = "Slet";
            btn.className = "btn-small btn-delete";
            btn.onclick = function () { deleteUser(user.id); };

            // Add groups to the list item
            li.appendChild(leftGroup);
            li.appendChild(btn);
            
            container.appendChild(li);
        });
    } catch (e) {
        console.error("Failed to load users", e);
    }
}


// --- UPDATE USER NIVEAU (For Admin) ---
async function updateUserNiveau(userId, newNiveau) {
    try {
        const res = await fetch(`/users/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ niveau: parseInt(newNiveau) })
        });
        if (res.ok) {
            alert("Bruger niveau opdateret!");
        } else {
            const data = await res.json();
            alert("Fejl: " + (data.error || "Kunne ikke opdatere niveau"));
            loadusers();
        }
    } catch (err) {
        console.error("Fejl ved opdatering af niveau:", err);
        alert("Netværksfejl");
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
            container.innerHTML = "<p>Ingen beskeder endnu.</p>";
            return;
        }

        messages.forEach(msg => {
            const p = document.createElement("p");
            p.innerHTML = `<strong>${msg.sender}:</strong> ${msg.text}<br><small>${msg.date}</small>`;
            container.appendChild(p);
        });


    } catch (err) {
        console.error("Fejl ved indlæsning af beskeder:", err);
        document.querySelector("#messages").textContent = "Fejl: Kunne ikke indlæse beskeder.";
    }
}