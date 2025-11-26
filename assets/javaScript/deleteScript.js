async function createChat() {
    const createForm = document.getElementById("createChatForm");
    
    if (createForm) {
        createForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Stop siden i at reloade

            const inputField = createForm.querySelector("input[name='chatName']");
            const chatName = inputField.value;

            if (!chatName) return; 

            try {
                // 1. Send data til serveren
                const res = await fetch("/chats", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: chatName }) 
                });

                if (res.ok) {
                    // 2. Hent den nye chat (ID og navn) fra serverens svar
                    const newChat = await res.json();

                    // 3. MANUEL DOM MANIPULATION (I stedet for loadChats)
                    const chatList = document.getElementById("chatList");
                    
                    // Hvis listen var tom ("Ingen chats endnu"), tøm den først
                    if (chatList.innerHTML.includes("Ingen chats")) {
                        chatList.innerHTML = "";
                    }

                    // Opret nyt li element
                    const li = document.createElement("li");
                    // Sæt ID (så slet-funktionen virker senere)
                    li.id = `chat-${newChat.id}`; 
                    // Lav linket - Sørg for at URL matcher din view route (/room/ eller /chat/)
                    li.innerHTML = `<a href="/room/${newChat.id}">${newChat.name}</a>`;
                    
                    // Tilføj elementet til listen (bunden)
                    chatList.appendChild(li);

                    // Tøm input feltet
                    inputField.value = "";
                } else {
                    alert("Fejl: Kunne ikke oprette chat");
                }
            } catch (err) {
                console.error("Error creating chat:", err);
            }
        });
    }
}

document.addEventListener("DOMContentLoaded", createChat);