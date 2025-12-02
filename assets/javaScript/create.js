
async function createChat() {
    const createForm = document.getElementById("createChatForm");

    if (createForm) {
        createForm.addEventListener("submit", async (event) => {
            // 1. STOPPER formen i at genindlæse siden
            event.preventDefault(); 

            // Hent værdien fra input-feltet
            const chatNameInput = createForm.querySelector('input[name="chatName"]');
            const chatName = chatNameInput.value;

            try {
                // 2. Send data til serveren (POST request)
                const res = await fetch("/chats", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: chatName }) 
                });

                
                if (res.ok) {
                    // Tøm input-feltet så det er klar til en ny chat
                    chatNameInput.value = "";

                    
                    if (typeof loadChats === 'function') {
                        loadChats(); 
                    } else {
                        // Hvis loadChats ikke virker, så genindlæs siden som fallback
                        window.location.reload(); 
                    }
                } else {
                    alert("Kunne ikke oprette chatten. Prøv igen.");
                }
            } catch (err) {
                console.error("Fejl ved oprettelse:", err);
            }
        })
    }
}


async function createAccount() {
    const createForm = document.getElementById("createAccountForm");

    if (createForm) {
        createForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const usernameField = createForm.querySelector("input[name='username']");
            const passwordField = createForm.querySelector("input[name='password']");
            const username = usernameField.value;
            const password = passwordField.value;

            try {
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