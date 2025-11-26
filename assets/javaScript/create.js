async function createChat() {
    const createForm = document.getElementById("createChatForm");
    
    if (createForm) {
        createForm.addEventListener("submit", async (event) => {
            event.preventDefault(); 

            const inputField = createForm.querySelector("input[name='chatName']");
            const chatName = inputField.value;

            try {
                const res = await fetch("/chats", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: chatName }) 
                });

                if (res.ok) {
                    // Hent den nye chat (objektet) som serveren sender tilbage
                    const newChat = await res.json();

                    // --- DOM MANIPULATION START ---
                    // Vi finder listen og tilføjer den nye chat manuelt
                    const container = document.querySelector("#chatList");
                    
                    // Fjern "Ingen chats fundet" hvis den er der
                    if (container.firstChild && container.firstChild.textContent === "Ingen chats fundet.") {
                        container.innerHTML = "";
                    }

                    const li = document.createElement("li");
                    li.id = `chat-${newChat.id}`; // Brug ID fra serveren

                    const a = document.createElement("a");
                    // VIGTIGT: Her sikrer vi, at linket matcher viewRoutes (/chat/ og ikke /room/ eller /chats/)
                    a.href = `/chat/${newChat.id}`; 
                    a.textContent = newChat.name;

                    li.appendChild(a);
                    container.appendChild(li);
                    // --- DOM MANIPULATION SLUT ---

                    inputField.value = ""; // Tøm feltet
                } else {
                    alert("Fejl: Kunne ikke oprette chat");
                }
            } catch (err) {
                console.error("Error creating chat:", err);
            }
        });
    }
}


async function createAccount() {
    const createForm = document.getElementById("createAccountForm");

    if (createForm) {
        createForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Prevent default form submission
            const usernameField = createForm.querySelector("input[name='username']");
            const passwordField = createForm.querySelector("input[name='password']");
            const username = usernameField.value;
            const password = passwordField.value;

            try {
                // Send RESTful POST request to create account
                const res = await fetch("/createAccount", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: username, password: password }) 
                });
                if (res.ok) {
                    alert("Bruger oprettet succesfuldt!");
                    window.location.href = "/";
                } else {
                    alert("Fejl: Kunne ikke oprette bruger");
                }
            } catch (err) {
                console.error("Error creating account:", err);
            }
        });
    }
}
document.addEventListener("DOMContentLoaded", createChat);
document.addEventListener("DOMContentLoaded", createAccount);