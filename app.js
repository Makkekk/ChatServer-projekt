import express from 'express';
import session from 'express-session';
import fs from 'node:fs'

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

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
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
  id    : '1',
  dato : new Date()

}
//JSON-fil læses
const userlist = fs.readFileSync('users.json')
//JSON konveteres så javascript fatter hvad vi taler om
const jsonNewUser = JSON.parse(userlist)
//newUser tilføjes
jsonNewUser.push(newUser);

//listen omskrives tilbage til JSON
// indsæt 2 som parameter i tilfælde af at formatering ligner lort
fs.writeFileSync('users.json', JSON.stringify(jsonNewUser));


//virker sjovt nok ikke. VI går "offline efter tilføjelse af objekt... skal rettes
res.redirect('/');
})

// Opret ny chat
app.post('/create/chat', (req, res) => {
    const chatName = req.body.chatName;
    // Hardcoded bruger til test (senere fra session)
    const username = req.session.username || 'TestBruger';
    
    console.log(`Chat oprettet: ${chatName} af ${username}`);
    // Redirect til den nye chat (senere skal vi gemme den først)
    res.redirect('/createChat');
});

// Vis createChat siden (efter login)
app.get('/createChat', (req, res) => {
    // Hardcoded brugernavn til test (senere kommer det fra session)
    const username = 'TestBruger';
    res.render('includes/createChat', { username });
});

// Vis en chat (TEST VERSION - uden session-tjek)
app.get('/chat', (req, res) => {
    // Midlertidigt deaktiveret indtil vi har JSON-fil
    // if (!req.session.username) {
    //     return res.redirect('/');
    // }
    
    // Hardcoded testdata
    const username = 'TestBruger';
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

