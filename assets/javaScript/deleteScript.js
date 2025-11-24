async function sletChat(chatId) {
    if (!confirm("Er du sikker?")) return;

    const res = await fetch("/chat/" + chatId, { method: "DELETE" });
    if (res.ok) {
        document.querySelector("#chat-" + chatId).remove();
        alert("Chat slettet");
    } else {
        const data = await res.json();
        alert("Fejl: " + (data.error || "Kunne ikke slette"));
    }
}