async function createChat() {
const createForm = document.getElementById("createChatForm");
    
    if (createForm) {
        createForm.addEventListener("submit", async (event) => {

            const inputField = createForm.querySelector("input[name='chatName']");
            const chatName = inputField.value;
            event.preventDefault(); // Prevent default form submission

            try {
                // 1. Send RESTful POST request 
                const res = await fetch("/chats", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name: chatName }) 
                });

                if (res.ok) {
                    // 2. DOM Manipulation: Clear input and reload list 
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