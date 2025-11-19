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

app.get('/chat', (req, res) => {
  if (!req.session.username) {
    return res.redirect('/');
  }
  res.render('includes/chat', { username: req.session.username });
});


app.listen(8080, () => {
    console.log('Serveren kører på http://localhost:8080')
});

