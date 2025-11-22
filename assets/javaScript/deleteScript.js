
async function sletChat(chatId) {
    //Spørg om lov først
    if (!confirm("Er du sikker på, at du vil slette denne chat?")) return;

    try {
        //Her bruger vi FETCH til at sende DELETE kommandoen - fordi form ikke kun har post og get
        const response = await fetch('/chat/' + chatId, { 
            method: 'DELETE' // Dette er vigtigt for din lærer og REST-kravet
        });
        if (response.ok) {
            // Find elementet på listen og fjern det med det samme
            const element = document.getElementById(`chat-${chatId}`);
            if (element) {
                element.remove(); 
            }
            alert("Chatten er slettet");
        } else {
            const data = await response.json();
            alert("Fejl: " + (data.error || "Kunne ikke slette"));
        }
    } catch (err) {
        console.error("Der skete en fejl:", err);
    }
}