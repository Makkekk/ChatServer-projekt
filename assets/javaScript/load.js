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



// ---------------   editChats-------------------------------------
async function editChat(chatId) {
    const nytNavn = prompt("Indtast nyt navn på chatten:", "");
    if (!nytNavn || nytNavn.trim() === "") return;

    try {
        const res = await fetch(`/chats/${chatId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({name: nytNavn.trim() })
        });

        if (res.ok) {
            const li = document.getElementById(`chat-${chatId}`);
            const a = li.querySelector("a");
            a.textContent = nytNavn.trim();
            alert("Chat navn opdateret!");
        } else {
            const data = await res.json();
            alert("Fejl: " + (data.error || "Kunne ikke opdatere"));
        }
    } catch (err) {
        console.error("Fejl ved redigering:", err);
        alert("Netværksfejl");
    }
}

/*async function editChat(chatId) {
    const nytNavn = prompt("Indtast det nye navn på chatten");

    if(!nytNavn){
        return;
    }
    try {
        const res = await fetch (`/chats/${chatId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({navn: nytNavn})
        });
        if (res.ok){
            loadChats();
        } else {
            alert("Du har ikke rettigheder til at redigere denne chat, eller er der sket en fejl");
        }
    }catch(err){
            console.error("Fejl ved opdaterin", err);
            alert("Der opstod en netværksfejl.");
        }
    }*/

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

            // Create Span for info
            const span = document.createElement("span");
            span.textContent = `${user.username} (Niveau: ${user.niveau}) `;

            // Create Delete Button
            const btn = document.createElement("button");
            btn.type = "button";
            btn.textContent = "Slet";
            // Assign function reference directly
            btn.onclick = function () { deleteUser(user.id); };

            li.appendChild(span);
            li.appendChild(btn);
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

async function loadLoginForm() {

}
