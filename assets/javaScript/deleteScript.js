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



async function sletBruger(id) {
    // 1. Sikkerheds-tjek
    if (!confirm("Er du sikker på, at du vil slette denne bruger?")) return;

    try {
        // 2. Send besked til serveren
        const response = await fetch(`/users/${id}`, { 
            method: "DELETE" 
        });

        // 3. Håndter svaret
        if (response.ok) {
            // Succes: Find elementet fra Trin 2 og fjern det
            const element = document.getElementById(`user-row-${id}`);
            if (element) {
                element.remove();
            }
            alert("Brugeren er slettet.");
        } else {
            // Fejl fra serveren
            const data = await response.json();
            alert("Fejl: " + data.error);
        }
    } catch (err) {
        console.error("Netværksfejl:", err);
        alert("Der skete en teknisk fejl.");
    }
}