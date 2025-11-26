async function deleteChat(chatId) {
    // Spørg brugeren om lov først (god skik)
    if (!confirm("Er du sikker på, at du vil slette denne chat?")) {
        return;
    }

    try {
        // Kald API'et med DELETE metoden
        const res = await fetch(`/chats/${chatId}`, {
            method: "DELETE"
        });

        if (res.ok) {
            // Fjern chatten fra DOM'en
            const element = document.getElementById(`chat-${chatId}`);
            if (element) {
                element.remove();
            }
            alert("Chatten er slettet.");
        } else {
            // Hvis man ikke har lov (f.eks. fejl 403)
            const data = await res.json();
            alert("Fejl: " + (data.error || "Kunne ikke slette chat"));
        }
    } catch (err) {
        console.error("Fejl ved sletning:", err);
        alert("Der opstod en teknisk fejl.");
    }
}

async function deleteUser(userId) {
    if (!confirm("Er du sikker på, at du vil slette denne bruger?")) {
        return;
    }

    try {
        const res = await fetch(`/users/${userId}`, {
            method: "DELETE"
        });
        if (res.ok) {
            const element = document.getElementById(`user-row-${userId}`);
            if (element) {
                element.remove();
            }
            alert("Brugeren er slettet.");
        } else {
            const data = await res.json();
            alert("Fejl: " + (data.error || "Kunne ikke slette bruger"));
        }
    } catch (err) {
        console.error("Fejl ved sletning:", err);
        alert("Der opstod en teknisk fejl.");
    }
}

document.addEventListener("DOMContentLoaded", deleteChat)

