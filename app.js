import express from 'express';
import session from 'express-session';

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

app.get('/', (req, res) => {
  res.render('includes/landingPage');
});

app.get('/createAccount', (request, response)=>{
response.render('includes/createAccount')
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

