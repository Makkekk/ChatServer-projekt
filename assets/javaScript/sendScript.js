async function sendMessage(chatId) {
    const textarea = document.querySelector("#messageText");
    const text = textarea.value;
    if (!text) return;

    try {
        // RESTful POST endpoint
        const res = await fetch("/chats/message", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatId, text }) // sending 'text' to match API routes
        });

        if (res.ok) {
            const message = await res.json();
            const container = document.querySelector("#messages");

            // Remove "loading" or "empty" text
            if (container.innerHTML.includes("<p>")) {
                 // Optional check to clear placeholder text
            }

            const p = document.createElement("p");
            p.innerHTML = `<strong>${message.sender}:</strong> ${message.text}<br><small>${message.date}</small>`;
            container.appendChild(p);
            
            // Scroll to bottom
            container.scrollTop = container.scrollHeight;

            textarea.value = '';
        }
    } catch (err) {
        alert("Fejl: Kunne ikke sende besked");
    }
}
document.addEventListener("DOMContentLoaded", sendMessage);

