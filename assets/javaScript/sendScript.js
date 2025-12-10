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

            const p = document.createElement("p");

            // Vi bruger textContet for at undgå at mulige code-injections
            const strong = document.createElement("strong");
            strong.textContent = `${message.sender}:`;
            p.appendChild(strong);

            // Tilføj mellemrum og besked tekst
            p.appendChild(document.createTextNode(` ${message.text}`));

            // Tilføj linjeskift
            p.appendChild(document.createElement("br"));

            // Opret small element for dato
            const small = document.createElement("small");
            small.textContent = message.date;
            p.appendChild(small);

            container.appendChild(p);

            // Scroll to bottom
            container.scrollTop = container.scrollHeight;

            textarea.value = '';
        }
    } catch (err) {
        alert("Fejl: Kunne ikke sende besked");
    }
}

