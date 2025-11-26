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
                    window.location.reload();
                } else {
                    alert("Fejl: Kunne ikke oprette chat");
                }
            } catch (err) {
                console.error("Error creating chat:", err);
            }
        });
    }
}

// createAccount funktionen ser fin ud som den er (den reloader allerede ved at gå til "/")
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