async function loadChats() {
    const res = await fetch("/chat");
    const chats = await res.json();

    const container = document.querySelector("#chatList");
    container.innerHTML = '';

    chats.forEach(chat => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="/chats/${chat.id}">${chat.name}</a>`;
        container.appendChild(li)
    })

}
async function loadusers(chatId) {
    const res = await fetch("/api/users")
    const users = await res.json();

    const container = document.querySelector("#userList")
    container.innerHTML = '';

    users.forEach(user => {
        const li = document.createElement("li")
        li.innerHTML = `<a href="/chats/${user.username}">${user.niveau}</a>`;
        container.appendChild(li);
    })
}

document.addEventListener("DOMContentLoaded", () => {
    loadChats();
    loadusers();
})