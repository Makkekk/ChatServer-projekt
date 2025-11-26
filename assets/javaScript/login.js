async function loginUser() {
    const loginForm = document.getElementById("loginForm");

    if (loginForm) {
        loginForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Prevent default form submission

            const username = loginForm.username.value
            const password = loginForm.password.value

            try {
                const res = await fetch("/loginForm", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username: username, password: password }) 
                });
                if (res.ok) {
                    window.location.href = "/";
                } else {
                    alert("Fejl: Forkert brugernavn eller adgangskode");
                }
            } catch (err) {
                console.error("fejl", err);
            }
    })
}
}

document.addEventListener("DOMContentLoaded", loginUser);