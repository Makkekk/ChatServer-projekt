import express from 'express';
import session from 'express-session';
import fs from 'node:fs';


const app = express();

app.set('view engine', 'pug');
app.use('/assets', express.static('assets'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'detHemmeligeSted',
  resave: false,
  saveUninitialized: true
}));


// ---------- Funktioner ---------------


// Denne funktion tjekker brugeren allerde er logget ind
function alreadyLoggedIn(req, res, next){
  if (req.session.username){
    console.log(req.session.username + ' er logget in');
    return res.redirect('/createChat');
  }else{
    console.log('Ikke logget ind');
next();
  }
}


// Landing page route, her indsættes vores bruger check 'alreadyLoggedIN'
app.get('/', alreadyLoggedIn, (req, res) => {
  res.render('includes/landingPage');
});

app.get('/createAccount', (req, res)=>{
  res.render('includes/createAccount')
})

// Denne metode fanger post fra createAccount-form og opretter et objekt->henter JSON->Parser->Tilføjer objekt til fil->konverter tilbage til json
app.post('/opret-bruger', (req, res)=>{
  //Læs JSON-fil
const userlist = fs.readFileSync('users.json')
//JSON konveteres så javascript fatter hvad vi taler om
const jsonNewUser = JSON.parse(userlist)

const existingUser = jsonNewUser.find(user => user.username === req.body.brugernavn);
if (existingUser) {
  return res.send('Brugernavn er allerede taget.');
}
  //Bruger oprettes
const  newUser = {
  username : req.body.brugernavn,
  password : req.body.adgangskode,
  id    : Date.now().toString(), //unik id 
  niveau: 1,
  dato : new Date()
}
//newUser tilføjes
jsonNewUser.push(newUser);

//listen omskrives tilbage til JSON
// indsæt 2 som parameter i tilfælde af at formatering ligner lort
fs.writeFileSync('users.json', JSON.stringify(jsonNewUser));

res.redirect('/');
})

// Login route
app.post('/login', (req, res) => {
    const { brugernavn, adgangskode } = req.body;

    //læs fil hent data
    const file = fs.readFileSync('users.json')
    const users = JSON.parse(file)

    //find bruger
    const userFound = users.find(user => user.username === brugernavn && user.password === adgangskode)

    if (!userFound) {
        return res.send('Forkert brugernavn eller adgangskode');
    }

    // Gem brugernavn og id i session
    req.session.username = userFound.username
    req.session.userId = userFound.id
    req.session.niveau = userFound.niveau

    res.redirect('/createChat');
});


// Opret ny chat
app.post('/create/chat', (req, res) => {
  if (!req.session.username) {
        return res.redirect('/');
    }

    const data = fs.readFileSync('chats.json')
    const chats = JSON.parse(data)

    const newChat = {
      id: Date.now().toString(),
      name: req.body.chatName,
      ejer: req.session.username,
      oprettelsesDato: new Date(),
      messages: []
    }
    chats.push(newChat)
    fs.writeFileSync('chats.json', JSON.stringify(chats))


    res.redirect('/createChat');
});

// Vis chats (efter login)
app.get('/createChat', (req, res) => {
    if (!req.session.username) {
        return res.redirect('/');
    }

    // Hent alle chats fra filen
    const chats = fs.readFileSync('chats.json');
    const chatsParsed = JSON.parse(chats);

    // Start med at vise alle chats
    let chatsForUser = chatsParsed;

    // Hvis ikke admin (niveau 3), filtrer kun egne chats
    if (req.session.niveau !== 3) {
        chatsForUser = chatsParsed.filter(chat => chat.ejer === req.session.username);
    }

    // Liste af brugere, kun for admin
    let allUsers = [];
    if (req.session.niveau === 3) {
        const users = fs.readFileSync('users.json');
        allUsers = JSON.parse(users);
    }

    // Send data videre til Pug
    res.render('includes/createChat', { 
        username: req.session.username, 
        niveau: req.session.niveau, 
        chats: chatsForUser, 
        users: allUsers 
    });
});


//enkeklt chatrum
app.get('/chat/:id', (req, res) => {
   if (!req.session.username) {
         return res.redirect('/');
     }

     const chatId = req.params.id;

  
     const chats = (fs.readFileSync('chats.json'));
     const chatsParsed = JSON.parse(chats);
     const currentChat = chatsParsed.find(chat => chat.id === chatId);  

     const chatMessages = fs.readFileSync('messages.json');
     const messagesParsed = JSON.parse(chatMessages);

     const chatMessagesFiltered = messagesParsed.filter(message => message.chatId === chatId);

     res.render('includes/chat', {
        username: req.session.username,
        chat: currentChat,
        chatName: currentChat.name,
        messages: chatMessagesFiltered // Vi sender kun de relevante beskeder videre
     });
});

//send besked
app.post('/chat/message', (req, res) => {
    if (!req.session.username) {
        return res.redirect('/');
    }
    const { chatId, messageText } = req.body;

    let chat= fs.readFileSync('messages.json')
    const parseChat = JSON.parse(chat)


    const newMessage = {
        messageId: Date.now().toString(),
        chatId: chatId,
        sender: req.session.username,
        text: messageText,
        date: new Date().toLocaleDateString()
    };

    parseChat.push(newMessage)  
    fs.writeFileSync('messages.json', JSON.stringify(parseChat));

    res.redirect(`/chat/${chatId}`);
})

//slet chat
app.delete('/chat/:id', (req, res) => {
    if (!req.session.username) {
        return res.status(401).send({ error: 'Ikke autoriseret' });
    }

    const chatId = req.params.id;
    const data = fs.readFileSync('chats.json');
    const chats = JSON.parse(data);

    const chatToDelete = chats.find(chat => chat.id === chatId);
    if (!chatToDelete) {
       return res.status(404).send({ error: 'Chat ikke fundet' });
    }

    const erAdmin = req.session.niveau === 3;
    const erEjer = req.session.niveau === 2 && chatToDelete.ejer === req.session.username;

   
    if (erAdmin || erEjer) {
       const newChats = chats.filter(chat => chat.id !== chatId);
        fs.writeFileSync('chats.json', JSON.stringify(newChats));

        const messagesData = fs.readFileSync('messages.json');
        const messages = JSON.parse(messagesData);
        const newMessages = messages.filter(message => message.chatId !== chatId);
        fs.writeFileSync('messages.json', JSON.stringify(newMessages));
    }
    res.status(200).send({ message: 'Chat slettet' });
});

app.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/');
});





// RESTFUL API ENDPOINTS (Krav fra opgaven) - Jeg ved ikke om vi skal bygge siden ud fra dette via dom

// /chats - Returnerer en liste af alle chats
app.get('/chats', (req, res) => {
    if (!fs.existsSync('chats.json')) return res.json([]);
    const chats = JSON.parse(fs.readFileSync('chats.json'));
    res.json(chats);
});

//chats/:id - Returnerer en specifik chat
app.get('/chats/:id', (req, res) => {
    const chatId = req.params.id;
    if (!fs.existsSync('chats.json')) return res.status(404).json({error: 'Ingen data'});
    
    const chats = JSON.parse(fs.readFileSync('chats.json'));
    const chat = chats.find(c => c.id === chatId);
    
    if (!chat) 
      return res.status(404).json({ error: 'Chat ikke fundet' });
    res.json(chat);
});

// /chats/:id/messages - Returnerer beskeder for en chat
app.get('/chats/:id/messages', (req, res) => {
    const chatId = req.params.id;
    if (!fs.existsSync('messages.json')) return res.json([]);
    
    const messages = JSON.parse(fs.readFileSync('messages.json'));
    const chatMessages = messages.filter(m => m.chatId === chatId);
    
    res.json(chatMessages);
});

// /users - Returnerer en liste af brugere
app.get('/users', (req, res) => {
    // Måske kun for admin?
    const users = JSON.parse(fs.readFileSync('users.json'));
    
    res.json(users);
})

app.get('/users/:id', (req, res) => {
    const userId = req.params.id;
    
    const users = JSON.parse(fs.readFileSync('users.json'));
    const user = users.find(u => u.id === userId);
    if (!user) return res.status(404).json({ error: 'Bruger ikke fundet' });
    res.json(user);
});

app.get('/users/:id/messages', (req, res) => {
    const userId = req.params.id;

    const messages = JSON.parse(fs.readFileSync('messages.json'));
    const userMessages = messages.filter(m => m.senderId === userId);
    res.json(userMessages);
});

app.listen(8080, () => {
    console.log('Serveren kører på http://localhost:8080')
});