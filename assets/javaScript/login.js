document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");

    // Vi tjekker om formen findes, før vi gør noget
    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            
            // 1. STOPPER formen i at genindlæse siden (vigtigt!)
            event.preventDefault(); 

            const username = loginForm.username.value;
            const password = loginForm.password.value;

            try {
                // 2. Sender data til serveren i baggrunden
                const res = await fetch("/loginForm", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: username, password: password }) 
                });

                // 3. Hvis serveren siger "OK" (status 200)
                if (res.ok) {
                    window.location.href = "/"; // Send brugeren til forsiden
                } else {
                    alert("Fejl: Forkert brugernavn eller adgangskode");
                }
            } catch (err) {
                console.error("Teknisk fejl:", err);
                alert("Der skete en teknisk fejl. Prøv igen senere.");
            }
        });
    }
});