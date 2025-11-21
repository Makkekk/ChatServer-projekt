import express from 'express';
import session from 'express-session';
import fs from 'node:fs'



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

const app = express();

app.set('view engine', 'pug');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: 'detHemmeligeSted',
  resave: false,
  saveUninitialized: true
}));

// Landing page route, her indsættes vores bruger check 'alreadyLoggedIN'
app.get('/', alreadyLoggedIn, (req, res) => {
  res.render('includes/landingPage');
});

app.get('/createAccount', (req, res)=>{
  res.render('includes/createAccount')
})

// Denne metode fanger post fra createAccount-form og opretter et objekt->henter JSON->Parser->Tilføjer objekt til fil->konverter tilbage til json
app.post('/opret-bruger', (req, res)=>{
  //Bruger oprettes
const  newUser = {
  username : req.body.brugernavn,
  password : req.body.adgangskode,
  id    : Date.now().toString(), //untik id 
  nivaeu: 1,
  dato : new Date()
}

//JSON-fil læses
const userlist = fs.readFileSync('users.json')
//JSON konveteres så javascript fatter hvad vi taler om
const jsonNewUser = JSON.parse(userlist)
//newUser tilføjes
jsonNewUser.push(newUser)

//listen omskrives tilbage til JSON
// indsæt 2 som parameter i tilfælde af at formatering ligner lort
fs.writeFileSync('users.json', JSON.stringify(jsonNewUser));


res.redirect('/')
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
    req.session.nivaeu = userFound.nivaeu

    console.log(`Bruger ${brugernavn} logget ind. med nivaeu. ${userFound.nivaeu}`);

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
      ejer: req.session.userId,
      oprettelsesDato: new Date(),
      messages: []
    }
    chats.push(newChat)
    fs.writeFileSync('chats.json', JSON.stringify(chats))

    // Redirect til den nye chat (senere skal vi gemme den først)
    res.redirect('/createChat');
});

// Vis createChat siden (efter login)
app.get('/createChat', (req, res) => {
    if (!req.session.username) {
        return res.redirect('/');
    }

    if (req.session.nivaeu === 3) {
      const allUsers = fs.readFileSync('users.json');
      users = allUsers.map(user => ({ username: user.username, id: user.id, nivaeu: user.nivaeu }));

    
      return res.render('includes/createChat', { username: req.session.username, nivaeu: req.session.nivaeu, chats: chats , users: users});
    }})


//slet chat (niveau 3)
app.delete('/api/chats/:id', (req, res) => {
  if (!req.session.username || req.session.nivaeu < 3) {
        return res.status(401).send('Ikke autoriseret');
    }

  const chatId = req.params.id;
  const data = fs.readFileSync('chats.json');
  let chats = JSON.parse(data);

  const newChatList = chatId.filter(chat => chat.id !== chatid);
  fs.writeFileSync('chats.json', JSON.stringify(newChatList));

  res.status(200).send('Chat slettet');
});

//rediger CAT 
app.put('/api/chats/:id', (req, res) => {
  if (!req.session.username || req.session.nivaeu < 2) {
        return res.status(401).send('Ikke autoriseret');
    }

    const chatId = req.params.id;
    const newName = req.body.name;
    let chats = JSON.parse(fs.readFileSync('chats.json'));

    const chatIndex = chats.findIndex(chat => chat.id === chatId);
    if (chatIndex === -1) {
        chats[chatIndex].name = newName
        fs.writeFileSync('chats.json', JSON.stringify(chats));
        return res.status(200).send('Chat opdateret');
    } else {
        return res.status(404).send('Chat ikke fundet');
    } 
});

// Vis en chat (TEST VERSION - uden session-tjek)
app.get('/chat', (req, res) => {
   if (!req.session.username) {
         return res.redirect('/');
     }
    
  const username = req.session.username || 'admin';

    // Hardcoded testdata
    const chatName = 'Min Test Chat';
    const messages = [
        { owner: 'Bruger1', text: 'Hej med dig!', date: '2025-11-19 10:00' },
        { owner: 'Bruger2', text: 'Hvordan går det?', date: '2025-11-19 10:05' },
        { owner: 'TestBruger', text: 'Godt tak! Dejligt at være her.', date: '2025-11-19 10:10' }
    ];

    res.render('includes/chat', { username, chatName, messages });
});

app.listen(8080, () => {
    console.log('Serveren kører på http://localhost:8080')
});