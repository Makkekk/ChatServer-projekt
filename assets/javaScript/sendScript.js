async function sendMessage(chatId) {
    const textarea = document.querySelector("#messageText");
    const text = textarea.value;
    if (!text) return;

    const res = await fetch("/chat/message", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatId, messageText: text })
    });

    const message = await res.json();
    const container = document.querySelector("#messages");

    const p = document.createElement("p");
    p.innerHTML = `<strong>${message.sender}:</strong> ${message.text}<br><small>${message.date}</small>`;
    container.appendChild(p);

    textarea.value = '';
}

