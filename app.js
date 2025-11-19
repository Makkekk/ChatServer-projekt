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

app.get('/chat', (req, res) => {
  if (!req.session.username) {
    return res.redirect('/');
  }
  res.render('includes/chat', { username: req.session.username });
});


app.listen(8080, () => {
    console.log('Serveren kører på http://localhost:8080')
});

